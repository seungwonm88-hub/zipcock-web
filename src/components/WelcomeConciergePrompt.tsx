import React, { useState, useEffect } from 'react';
import { Bot, Headphones, Sparkles, X, ArrowRight, Play, Check } from 'lucide-react';
import { AdaptiveOverlay } from './AdaptiveOverlay';
import { AiVoiceAvatar } from './AiVoiceAvatar';

interface WelcomeConciergePromptProps {
  isOpen: boolean;
  onAcceptVoiceBriefing: () => void; // "네", "들을게요", 버튼 클릭 시 -> AI 음성 브리핑 자동 시작
  onDeclineRegularFlow: () => void;  // "아니오", 닫기, 일반 진행 시 -> 모달 닫고 워크스페이스 이용
}

export const WelcomeConciergePrompt: React.FC<WelcomeConciergePromptProps> = ({
  isOpen,
  onAcceptVoiceBriefing,
  onDeclineRegularFlow,
}) => {
  const [quickInput, setQuickInput] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(10);

  // 카운트다운 타이머 (10초 동안 무응답 시 일반 진행으로 부드럽게 전환)
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDeclineRegularFlow();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, onDeclineRegularFlow]);

  // 단답형 텍스트 응답 분석
  const handleQuickSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = quickInput.trim().toLowerCase();

    // 긍정 단답형 ("네", "응", "ㅇㅇ", "예", "좋아", "듣기", "브리핑", "yes", "y", "1")
    const positiveKeywords = ['네', '예', '응', 'ㅇ', 'ㅇㅇ', '좋아', '좋아요', '듣기', '브리핑', '들려줘', 'yes', 'y', '1', 'ok', '오케이'];
    
    // 부정 단답형 ("아니", "아니오", "ㄴ", "ㄴㄴ", "그냥", "패스", "no", "n", "2")
    const negativeKeywords = ['아니', '아니오', '아뇨', 'ㄴ', 'ㄴㄴ', '그냥', '패스', '닫기', 'no', 'n', '2', '스킵'];

    if (positiveKeywords.some(kw => clean === kw || clean.startsWith(kw))) {
      onAcceptVoiceBriefing();
    } else if (negativeKeywords.some(kw => clean === kw || clean.startsWith(kw))) {
      onDeclineRegularFlow();
    } else if (clean.length > 0) {
      // 기타 텍스트 입력 시 긍정으로 판단하여 AI 브리핑으로 연결
      onAcceptVoiceBriefing();
    }
  };

  return (
    <AdaptiveOverlay
      isOpen={isOpen}
      onClose={onDeclineRegularFlow}
      presentationMode="auto"
      maxWidthClass="max-w-md"
      heightClass="h-auto"
      mobileHeightClass="max-h-[85vh]"
      icon={
        <AiVoiceAvatar
          isPlaying={true}
          importance="calm"
          size="sm"
        />
      }
      title={
        <div className="flex items-center gap-1.5 font-bold text-sm text-white">
          <span>집콕 AI 비서</span>
          <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono">
            처음 방문 환영
          </span>
        </div>
      }
      subtitle="AI 재계약 컨시어지 & 20초 음성 요약 안내"
      headerRight={
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
          {countdown}초 후 일반 진행
        </span>
      }
    >
      <div className="space-y-4 text-slate-100">
        {/* 중앙 AI 음성 제안 배너 */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-950/60 to-slate-900 border border-blue-800/50 space-y-3">
          <div className="flex items-start gap-3">
            <AiVoiceAvatar
              isPlaying={true}
              importance="important"
              size="md"
              className="mt-0.5"
            />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">
                "재계약 조건과 법정 5% 상한을 음성으로 먼저 들려드릴까요?"
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                바쁜 일상 속에서도 20초 만에 갱신 보증금, 계약갱신청구권, 필수 안심 특약을 명확하게 브리핑해 드립니다.
              </p>
            </div>
          </div>
        </div>

        {/* 원클릭 선택 버튼 (단답형 빠른 선택) */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onAcceptVoiceBriefing}
            className="py-3 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>네, 음성으로 들을게요</span>
          </button>

          <button
            onClick={onDeclineRegularFlow}
            className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>아니오, 그냥 볼래요</span>
          </button>
        </div>

        {/* 단답형 직접 타이핑 입력 폼 ("네" / "아니오" 등) */}
        <form onSubmit={handleQuickSubmit} className="pt-2 border-t border-slate-800/80 space-y-1.5">
          <label className="text-[11px] text-slate-400 block">
            직접 단답형으로 대답해 주셔도 됩니다 (예: "네" / "아니오")
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="단답형 입력: 네 / 아니오..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold text-xs border border-slate-700 transition-colors cursor-pointer shrink-0"
            >
              확인
            </button>
          </div>
        </form>

        {/* 안내 팁 */}
        <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
          <span>* 대답이 없으시면 {countdown}초 뒤 자동으로 일반 화면이 시작됩니다.</span>
        </div>
      </div>
    </AdaptiveOverlay>
  );
};
