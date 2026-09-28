import React, { useState, useEffect, useRef } from 'react';
import { LeaseContract } from '../types';
import { Bot, Send, Sparkles, RefreshCw, Play, Pause, Square, Headphones, Smartphone, Monitor, ShieldCheck, AlertCircle } from 'lucide-react';
import { PcmPlayer } from '../utils/audioPlayer';
import { AdaptiveOverlay, AdaptiveModalPresentationMode } from './AdaptiveOverlay';
import { AiVoiceAvatar, ImportanceLevel } from './AiVoiceAvatar';
import { zipcockKnowledgeBase, findZipcockAnswer } from '../knowledge/zipcockFaq';
import { koreanRealEstateDomains, findKoreanRealEstateKnowledge } from '../knowledge/koreanRealEstateFaq';

interface AiConciergeModalProps {
  contract: LeaseContract;
  isOpen: boolean;
  onClose: () => void;
  defaultPresentationMode?: AdaptiveModalPresentationMode;
  autoPlayVoiceBriefing?: boolean;
}

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const AiConciergeModal: React.FC<AiConciergeModalProps> = ({
  contract,
  isOpen,
  onClose,
  defaultPresentationMode = 'auto',
  autoPlayVoiceBriefing = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `안녕하세요! **집콕재계약**과 **대한민국 부동산 전반(전세사기 예방, 등기부 권리분석, HUG 126% 룰, 매매/청약/세무 상식)**을 완벽 케어하는 **집콕 AI 비서**입니다 🏠🇰🇷\n\n📌 **제공 가능한 핵심 솔루션**:\n- 📝 **집콕 비대면 재계약**: 복비 0원 절감, 5% 상한제 자동 계산, 계약갱신요구권 행사, 카톡 공인 전자서명\n- 🛡️ **전세사기 방지 & 권리분석**: 선순위 근저당 위험도 판별, HUG 전세보증보험 가입 요건(공시가 126% 룰), 안심 특약\n- ⚖️ **임대차 법률 분쟁**: 임대인 실거주 갱신거절 손해배상 청구, 임차권등기명령, 묵시적 갱신 및 중도해지권\n- 📦 **창고·공장·상가**: 상가임대차보호법 10년 갱신권, 환산보증금 기준, 권리금 회수 보호, 공장 전기/인허가 특약\n- 💰 **자산 거래 & 세무**: 매매 실거래가 분석, 생애최초 청약 가점, 취득세·양도소득세 비과세 요건, 법정 중개보수 요율표\n\n아래 주제별 칩을 누르시거나 궁금한 부동산 질문을 자유롭게 입력해 주세요!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // 모드 전환 토글 (테스트 및 사용자 선호도용: 'auto' | 'sheet' | 'modal')
  const [presentationMode, setPresentationMode] = useState<AdaptiveModalPresentationMode>(defaultPresentationMode);

  // 음성 브리핑 재생 상태
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [briefingText, setBriefingText] = useState<string>('');

  // 실시간 음성 브리핑 낭독 조항 중요도 ('calm' | 'important' | 'critical')
  const [currentImportance, setCurrentImportance] = useState<ImportanceLevel>('calm');
  const [currentClauseLabel, setCurrentClauseLabel] = useState<string>('계약 개요 낭독');

  const playerRef = useRef<PcmPlayer | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isWebSpeechRef = useRef<boolean>(false);
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopVoiceBriefing();
    };
  }, []);

  // autoPlayVoiceBriefing이 true로 열린 경우 자동으로 음성 브리핑 시작
  useEffect(() => {
    if (isOpen && autoPlayVoiceBriefing) {
      const timer = setTimeout(() => {
        handleToggleVoiceBriefing();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoPlayVoiceBriefing]);

  // 음성 재생 중 텍스트 내용 기반 중요도 판별 헬퍼
  const detectImportanceFromText = (text: string): { level: ImportanceLevel; label: string } => {
    const lower = text.toLowerCase();
    // 1. 법정 5% 상한, 근저당권 설정 금지, 권리 하자 해제 -> CRITICAL (골드/오렌지 호흡 파동)
    if (
      lower.includes('5%') ||
      lower.includes('상한') ||
      lower.includes('초과') ||
      lower.includes('근저당') ||
      lower.includes('위험') ||
      lower.includes('해제') ||
      lower.includes('원상회복')
    ) {
      return { level: 'critical', label: '법정 5% 상한 & 선순위 근저당 특약 점검' };
    }
    // 2. 계약갱신청구권, 보증보험 협조, 대출 연장 -> IMPORTANT (에메랄드/청록 호흡 파동)
    if (
      lower.includes('갱신') ||
      lower.includes('청구권') ||
      lower.includes('보증보험') ||
      lower.includes('전세대출') ||
      lower.includes('연장') ||
      lower.includes('특약')
    ) {
      return { level: 'important', label: '계약갱신요구권 & 안심 보증보험 특약' };
    }
    // 3. 소재지, 보증금 액수, 일정 등 기본 개요 -> CALM (블루/퍼플 안정 호흡 파동)
    return { level: 'calm', label: '목적물 소재지 및 계약 금액 안내' };
  };

  // 브리핑 진행 단계별 시뮬레이션 타이머 (Gemini TTS PCM 재생 시 타이머 기반 단계 이동)
  const startImportanceStepSequence = () => {
    if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);

    let step = 0;
    // 0~6초: 기본 개요 (Calm)
    setCurrentImportance('calm');
    setCurrentClauseLabel('목적물 소재지 및 계약 금액 안내');

    playbackTimerRef.current = setInterval(() => {
      step += 1;
      if (step === 6) {
        // 6초경: 5% 상한 및 보증금 인상률 검증 (Critical - 강렬한 골드 호흡)
        setCurrentImportance('critical');
        setCurrentClauseLabel('법정 5% 상한 준수 및 금액 변동 검증');
      } else if (step === 12) {
        // 12초경: 계약갱신요구권 및 안심 특약 3종 (Important - 청록 에메랄드 호흡)
        setCurrentImportance('important');
        setCurrentClauseLabel('계약갱신요구권 행사 & 안심 특약 3종 안내');
      } else if (step === 19) {
        // 19초경: 서명 안내 및 마무리 (Calm)
        setCurrentImportance('calm');
        setCurrentClauseLabel('카카오톡 비대면 공인 서명 안내');
      }
    }, 1000);
  };

  const clearImportanceTimer = () => {
    if (playbackTimerRef.current) {
      clearInterval(playbackTimerRef.current);
      playbackTimerRef.current = null;
    }
    setCurrentImportance('calm');
    setCurrentClauseLabel('대기 중');
  };

  const stopVoiceBriefing = () => {
    clearImportanceTimer();
    if (playerRef.current) {
      playerRef.current.stop();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAudioStatus('idle');
  };

  const handleToggleVoiceBriefing = async () => {
    // 1. 현재 재생 중인 경우 -> 일시정지
    if (audioStatus === 'playing') {
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current);
      }
      if (isWebSpeechRef.current && window.speechSynthesis) {
        window.speechSynthesis.pause();
      } else if (playerRef.current) {
        playerRef.current.pause();
      }
      setAudioStatus('paused');
      return;
    }

    // 2. 현재 일시정지 중인 경우 -> 다시 재생
    if (audioStatus === 'paused') {
      startImportanceStepSequence();
      if (isWebSpeechRef.current && window.speechSynthesis) {
        window.speechSynthesis.resume();
      } else if (playerRef.current) {
        playerRef.current.resume(() => {
          clearImportanceTimer();
          setAudioStatus('idle');
        });
      }
      setAudioStatus('playing');
      return;
    }

    // 3. 처음 시작하는 경우 -> 서버에서 스크립트 및 TTS 오디오 요청
    setAudioStatus('loading');
    try {
      const res = await fetch('/api/ai-voice-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contract }),
      });
      const data = await res.json();

      if (data.script) {
        setBriefingText(data.script);
      }

      startImportanceStepSequence();

      if (data.audioBase64) {
        // Gemini TTS PCM 재생
        isWebSpeechRef.current = false;
        if (!playerRef.current) {
          playerRef.current = new PcmPlayer();
        }
        playerRef.current.init(data.audioBase64, 24000);
        playerRef.current.play(() => {
          clearImportanceTimer();
          setAudioStatus('idle');
        });
        setAudioStatus('playing');
      } else if ('speechSynthesis' in window) {
        // 브라우저 Web Speech API 한국어 TTS Fallback
        isWebSpeechRef.current = true;
        window.speechSynthesis.cancel();
        const textToSpeak = data.script || '계약 조건 음성 요약입니다.';
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.05;
        utterance.pitch = 1.0;

        // 음성 단어 경계 이벤트로 실시간 중요도 애니메이션 반응
        utterance.onboundary = (e) => {
          if (e.charIndex !== undefined) {
            const currentSubText = textToSpeak.substring(e.charIndex, e.charIndex + 30);
            const detected = detectImportanceFromText(currentSubText);
            setCurrentImportance(detected.level);
            setCurrentClauseLabel(detected.label);
          }
        };

        utterance.onend = () => {
          clearImportanceTimer();
          setAudioStatus('idle');
        };
        utterance.onerror = () => {
          clearImportanceTimer();
          setAudioStatus('idle');
        };

        speechUtteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
        setAudioStatus('playing');
      } else {
        clearImportanceTimer();
        alert('음성 재생을 지원하지 않는 브라우저입니다.');
        setAudioStatus('idle');
      }
    } catch (err) {
      console.error('Audio briefing error:', err);
      clearImportanceTimer();
      setAudioStatus('idle');
    }
  };

  const categories = [
    { id: 'all', label: '🔥 전체 추천' },
    { id: 'zipcock', label: '🏠 집콕재계약 & 복비 0원' },
    { id: 'jeonse_safety', label: '🛡️ 전세사기 & HUG 126%' },
    { id: 'dispute', label: '⚖️ 갱신거절 & 임차권등기' },
    { id: 'commercial', label: '🏭 상가·창고·공장' },
    { id: 'tax_sale', label: '💰 매매·청약·취득세' },
  ];

  const categoryQuestions: Record<string, string[]> = {
    all: [
      '집콕재계약은 어떤 서비스인가요?',
      '보증금 5% 상한은 어떻게 계산하나요?',
      '등기부등본 을구 근저당권 안전 여부와 HUG 126% 룰은?',
      '임대인이 실거주한다고 갱신을 거절했는데 가짜인지 어떻게 확인하나요?',
      '임대인이 보증금을 돌려주지 않을 때 임차권등기명령 신청 방법은?',
      '창고/공장 임대차 재계약 시 주의할 법적 특약은?',
      '공인 전자서명 계약서도 대출 연장이나 확정일자가 되나요?',
      '부동산 중개보수(복비) 법정 요율과 비과세 요건은?'
    ],
    zipcock: [
      '집콕재계약은 어떤 서비스인가요?',
      '일반 공인중개사 부동산에서 재계약하는 것과 무엇이 다른가요?',
      '부동산 복비나 대필료와 비교하면 얼마나 절감되나요?',
      '집콕재계약의 안심 특약 3종은 무엇인가요?',
      '공인 전자서명 계약서도 대출 연장이나 확정일자가 되나요?',
      '임대인이 스마트폰을 잘 못 다루는데 카톡으로 서명하기 쉽나요?'
    ],
    jeonse_safety: [
      '등기부등본 을구에 근저당이 있는데 안전한지 어떻게 계산하나요?',
      'HUG 전세보증금 반환보증 가입 조건(공시가 126% 룰)은 무엇인가요?',
      '신탁회사 명의로 된 부동산 계약 시 주의점과 신탁원부 확인법은?',
      '대항력과 우선변제권의 차이 및 효력 발생 시점은?',
      '잔금일 선순위 근저당 설정 금지 특약이 왜 중요한가요?'
    ],
    dispute: [
      '보증금 5% 상한은 어떻게 계산하나요?',
      '계약갱신요구권을 쓰면 중간에 해지하고 이사갈 수 있나요?',
      '임대인이 실거주한다고 갱신을 거절했는데 가짜인지 어떻게 확인하나요?',
      '임대인이 보증금을 돌려주지 않을 때 임차권등기명령 신청 방법은?',
      '묵시적 갱신과 계약갱신요구권의 법적 차이점은 무엇인가요?'
    ],
    commercial: [
      '창고/공장 임대차 재계약 시 주의할 법적 특약은?',
      '상가 환산보증금 계산법과 서울 기준(9억) 초과 시 적용되는 법 조항은?',
      '임대인이 상가 권리금 회수를 방해할 때 손해배상 청구 방법은?',
      '공장 임대차 시 전기 용량 및 환경 인허가 조건은 어떻게 처리하나요?',
      '창고 화재보험 및 임차인 원상복구 분쟁 예방 작성 요령은?'
    ],
    tax_sale: [
      '1세대 1주택 양도소득세 비과세 요건과 12억 초과분 계산법은?',
      '주택 매매 시 취득세율 및 생애최초 주택구입 취득세 감면 조건은?',
      '아파트 청약 가점제 점수 계산법과 무주택 기간 산정 기준은?',
      '신혼부부·신생아 특례 디딤돌/버팀목 대출 자격 및 금리 혜택은?',
      '부동산 중개보수(복비) 법정 요율 계산법과 부가세 별도 여부는?'
    ]
  };

  const currentQuestions = categoryQuestions[activeCategory] || categoryQuestions.all;

  const handleSendMessage = async (textToSend?: string) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: queryText };
    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contract,
          history: messages,
          message: queryText,
        }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
      } else {
        const localAnswer = findZipcockAnswer(queryText) || findKoreanRealEstateKnowledge(queryText);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: localAnswer || '죄송합니다. 일시적인 연결 오류가 발생했습니다. 잠시 후 다시 질문해 주세요.',
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      const localAnswer = findZipcockAnswer(queryText) || findKoreanRealEstateKnowledge(queryText);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: localAnswer || '응답을 생성하는 중 문제가 발생했습니다. 주택임대차보호법 5% 상한 및 계약갱신청구권 기본 원칙을 참고해 주세요.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    stopVoiceBriefing();
    onClose();
  };

  // 모드 변경 토글 버튼
  const headerRightAction = (
    <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 mr-1 hidden sm:flex">
      <button
        onClick={() => setPresentationMode('modal')}
        title="데스크톱 모달 창으로 보기"
        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
          presentationMode === 'modal' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Monitor className="w-3 h-3 inline mr-1" />
        모달
      </button>
      <button
        onClick={() => setPresentationMode('sheet')}
        title="모바일 바텀 시트로 보기"
        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
          presentationMode === 'sheet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
        }`}
      >
        <Smartphone className="w-3 h-3 inline mr-1" />
        시트
      </button>
    </div>
  );

  return (
    <AdaptiveOverlay
      isOpen={isOpen}
      onClose={handleClose}
      presentationMode={presentationMode}
      maxWidthClass="max-w-lg"
      heightClass="h-[640px]"
      mobileHeightClass="max-h-[88vh]"
      icon={
        <AiVoiceAvatar
          isPlaying={audioStatus === 'playing'}
          isPaused={audioStatus === 'paused'}
          importance={currentImportance}
          currentClauseName={currentClauseLabel}
          size="sm"
        />
      }
      title={
        <div className="flex items-center gap-1.5 font-bold text-sm text-white">
          <span>집콕 AI 비서</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium border transition-colors ${
            audioStatus === 'playing'
              ? currentImportance === 'critical'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : currentImportance === 'important'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {audioStatus === 'playing' ? currentClauseLabel : 'Gemini AI + 음성 브리핑'}
          </span>
        </div>
      }
      subtitle="주택·부동산 임대차보호법 및 안심 재계약 컨시어지"
      headerRight={headerRightAction}
      headerBanner={
        <div className={`border-b px-4 py-2.5 flex items-center justify-between shrink-0 transition-colors duration-500 ${
          audioStatus === 'playing'
            ? currentImportance === 'critical'
              ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-orange-950/80 border-amber-500/40'
              : currentImportance === 'important'
              ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-emerald-500/40'
              : 'bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-blue-900/40'
            : 'bg-[#090f1d] border-slate-800/80'
        }`}>
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            {/* 호흡 애니메이션 아바타 (배너 전용 중간 크기) */}
            <AiVoiceAvatar
              isPlaying={audioStatus === 'playing'}
              isPaused={audioStatus === 'paused'}
              importance={currentImportance}
              currentClauseName={currentClauseLabel}
              size="md"
            />

            <div className="truncate">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>전체 계약 조건 AI 음성 브리핑</span>
                {audioStatus === 'playing' && (
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded transition-colors ${
                    currentImportance === 'critical'
                      ? 'bg-amber-400 text-slate-950 animate-pulse'
                      : currentImportance === 'important'
                      ? 'bg-emerald-400 text-slate-950 animate-pulse'
                      : 'bg-blue-400 text-slate-950 animate-pulse'
                  }`}>
                    {currentImportance === 'critical' ? '⚡ 핵심 조항 낭독중' : currentImportance === 'important' ? '🛡️ 안심 특약 낭독중' : '🔊 재생중'}
                  </span>
                )}
                {audioStatus === 'paused' && (
                  <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1 rounded">
                    일시정지
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                {audioStatus === 'idle'
                  ? '보증금·5% 상한·갱신청구권·안심특약 음성 요약'
                  : currentClauseLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleToggleVoiceBriefing}
              disabled={audioStatus === 'loading'}
              title={audioStatus === 'playing' ? '일시정지' : '음성 브리핑 재생'}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                audioStatus === 'playing'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
              }`}
            >
              {audioStatus === 'loading' ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span className="hidden sm:inline">생성중</span>
                </>
              ) : audioStatus === 'playing' ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{audioStatus === 'paused' ? '이어듣기' : '음성 재생'}</span>
                </>
              )}
            </button>

            {audioStatus !== 'idle' && (
              <button
                onClick={stopVoiceBriefing}
                title="정지"
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer border border-slate-700"
              >
                <Square className="w-3.5 h-3.5 fill-current text-slate-400" />
              </button>
            )}
          </div>
        </div>
      }
      footer={
        <div className="space-y-2">
          {/* 주제별 카테고리 탭 칩 */}
          <div className="overflow-x-auto no-scrollbar flex items-center gap-1 pb-0.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap transition-all font-semibold shrink-0 cursor-pointer ${
                  activeCategory === c.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* 추천 빠른 질문 프리셋 */}
          <div className="overflow-x-auto no-scrollbar flex items-center gap-1.5 pb-1">
            {currentQuestions.map((q, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSendMessage(q)}
                className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700 hover:border-slate-500 transition-all cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 질문 입력 인풋 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="집콕재계약 서비스, 복비 차이, 5% 상한, 대출 연장, 창고/공장 등 무엇이든 질문하세요..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white transition-colors cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      }
    >
      {/* 채팅 메시지 본문 */}
      <div className="space-y-3 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start items-start gap-2.5'}`}
          >
            {m.role === 'assistant' && (
              <AiVoiceAvatar
                isPlaying={audioStatus === 'playing'}
                isPaused={audioStatus === 'paused'}
                importance={currentImportance}
                size="sm"
                className="mt-0.5 shrink-0"
              />
            )}
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-start gap-2.5">
            <AiVoiceAvatar
              isPlaying={true}
              importance="important"
              size="sm"
              className="mt-0.5 shrink-0"
            />
            <div className="bg-slate-900 border border-slate-800 text-slate-400 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
              <span>답변을 생성하고 있습니다...</span>
            </div>
          </div>
        )}
      </div>
    </AdaptiveOverlay>
  );
};
