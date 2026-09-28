import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { findZipcockAnswer, zipcockKnowledgeBase } from './src/knowledge/zipcockFaq.js';
import { findKoreanRealEstateKnowledge, koreanRealEstateDomains } from './src/knowledge/koreanRealEstateFaq.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Gemini API 초기화
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// AI 법률/계약 컨시어지 API
app.post('/api/ai-chat', async (req, res) => {
  try {
    const { message, contractContext } = req.body;
    if (!message) {
      return res.status(400).json({ error: '메시지를 입력해주세요.' });
    }

    if (!aiClient) {
      // API Key가 미설정된 경우 스마트 규칙 기반 안전 응답 제공
      return res.json({
        reply: getFallbackRuleResponse(message),
        source: 'rule_engine'
      });
    }

    const knowledgeContext = zipcockKnowledgeBase.map(k => `[집콕재계약-${k.categoryLabel}] Q: ${k.question}\nA: ${k.shortAnswer}\n세부: ${k.detailedAnswer}`).join('\n\n');
    const realEstateContext = koreanRealEstateDomains.map(d => `[한국부동산-${d.name}] (${d.summary})\n핵심포인트:\n- ${d.keyPoints.join('\n- ')}`).join('\n\n');

    const systemPrompt = `당신은 대한민국 최고 수준의 공인 부동산 법률·자산 분석 AI 컨시어지 '집콕 AI 비서'입니다.
본 비서는 **'집콕재계약'의 모든 서비스**(비대면 8단계 전자서명, 복비 0원 절감, 5% 상한제, 계약갱신요구권, 안심 특약 3종, 창고/공장 표준양식, 임대인 수익 분석)뿐만 아니라, **대한민국 부동산 전반에 걸친 모든 질문과 솔루션**(전세사기 예방, 등기부등본 권리분석, HUG 126% 룰, 주택·상가 임대차보호법 분쟁, 임차권등기명령, 실거주 갱신거절 손해배상, 아파트 매매 실거래가 분석, 생애최초·신혼부부 청약, 취득세·양도소득세·종부세 세무 상식, 공인중개사 법정 복비 요율표 및 주택임대차 신고제)에 대해 깊이 있고 신뢰할 수 있는 전문 답변을 실시간 제공합니다.

답변 원칙:
1. **전국민 부동산 토탈 케어**: 집콕재계약 관련 질문은 물론, 매매, 전월세, 상가/창고/공장, 세무, 청약, 권리분석 등 대한민국 부동산에 관한 모든 질문에 친절하고 정확하게 답합니다.
2. **법적 근거 명시**: 주택임대차보호법, 상가건물임대차보호법, 민법, 전자서명법, 지방세법, 소득세법 등 정확한 법령 조항과 최신 판례/정부 가이드라인(공시가 126% 룰 등)을 알기 쉽게 풀어서 설명합니다.
3. **실무 행동 수칙 제시**: 단순 이론에 그치지 않고, 주민센터 방문, 인터넷등기소 열람, 내용증명 발송, 특약 문구 삽입 등 사용자가 지금 당장 실행할 수 있는 명확한 액션 플랜을 제시합니다.
4. **가독성 최적화**: 경어체(~해요, ~합니다)를 사용하고, 중요 수치나 법 조항은 볼드(**) 처리 및 번호/불릿으로 깔끔하게 정리합니다.

[지식베이스: 집콕재계약]
${knowledgeContext}

[지식베이스: 대한민국 부동산 종합 도메인]
${realEstateContext}`;

    const promptText = `
[현재 계약 컨텍스트]
${contractContext ? JSON.stringify(contractContext, null, 2) : '컨텍스트 없음'}

[사용자 질문]
${message}
`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + promptText }] }
      ]
    });

    return res.json({
      reply: response.text || '죄송합니다. 답변을 생성하지 못했습니다.',
      source: 'gemini_ai'
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return res.json({
      reply: getFallbackRuleResponse(req.body.message || ''),
      source: 'rule_engine_fallback'
    });
  }
});

// AI 전체 계약 조건 음성 브리핑 요약 텍스트 & TTS 오디오 API
app.post('/api/ai-voice-briefing', async (req, res) => {
  try {
    const { contract } = req.body;
    if (!contract) {
      return res.status(400).json({ error: '계약 정보가 누락되었습니다.' });
    }

    const diff = contract.newDeposit - contract.currentDeposit;
    const diffRate = contract.currentDeposit > 0 ? ((diff / contract.currentDeposit) * 100).toFixed(1) : '0';
    const isOverLimit = contract.newDeposit > Math.floor(contract.currentDeposit * 1.05);

    const typeName = contract.buildingType === 'warehouse' ? '물류창고' : contract.buildingType === 'factory' ? '공장시설' : '주택';

    // 1. 기본 친절한 음성 스크립트 작성
    let briefingScript = `안녕하세요, 집콕 AI 비서의 안심 재계약 음성 브리핑입니다. ` +
      `이번 재계약 대상 ${typeName} 소재지는 ${contract.propertyAddress} ${contract.propertyDetail}입니다. ` +
      `보증금은 기존 ${Math.floor(contract.currentDeposit / 100000000)}억 ${(contract.currentDeposit % 100000000) / 10000}만 원에서, ` +
      `${diff >= 0 ? diff / 10000 + '만 원 인상된' : Math.abs(diff) / 10000 + '만 원 감액된'} ` +
      `최종 ${Math.floor(contract.newDeposit / 100000000)}억 ${Math.floor((contract.newDeposit % 100000000) / 10000)}만 원으로 합의되었습니다. ` +
      `인상률은 ${diffRate}%로 ${isOverLimit ? '법정 상한 5%를 초과하였으므로 재조정이 필요합니다.' : '법정 상한 5%를 충족하여 안전합니다.'} ` +
      `계약갱신요구권은 ${contract.renewalRightUsed ? '이번에 공식 행사되어 2년간 사용이 법적으로 보장됩니다.' : '이번에 미사용 합의 갱신으로 체결됩니다.'} ` +
      `선순위 근저당 설정 금지 및 하자 시 즉시 해제 등 필수 안심 특약이 포함되어 있으니 안심하고 카카오톡 공인 전자서명을 진행해 주세요.`;

    // Gemini API가 사용 가능하면 더 자연스럽고 풍부한 브리핑 스크립트 생성 시도
    if (aiClient) {
      try {
        const scriptPrompt = `당신은 부동산(주택·상가·창고·공장) 재계약 전문 안내 아나운서입니다. 아래 임대차 계약 정보를 듣는 사람에게 편안하고 정확하게 20초 내외로 음성 브리핑할 스크립트를 작성해주세요.
구어체 존댓말로 작성하고, 특수문자나 마크다운 기호 없이 순수 한글 음성 낭독문으로 출력하세요.
계약 정보:
- 건물 유형: ${contract.buildingType} (${typeName})
- 소재지: ${contract.propertyAddress} ${contract.propertyDetail}
- 기존 보증금: ${contract.currentDeposit.toLocaleString()}원 -> 신규 보증금: ${contract.newDeposit.toLocaleString()}원 (변동률 ${diffRate}%)
- 5% 상한 준수 여부: ${isOverLimit ? '5% 초과 주의' : '5% 상한 준수 안전'}
- 갱신청구권: ${contract.renewalRightUsed ? '행사함(2년 거주 보장)' : '미행사'}
- 안전 특약: 보증보험 협조, 선순위 근저당 설정 금지, 권리변동 해제
- 서명: 모두싸인 공인 전자서명`;

        const scriptRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: scriptPrompt,
        });
        if (scriptRes.text) {
          briefingScript = scriptRes.text.trim();
        }
      } catch (scriptErr) {
        console.warn('Gemini script generation fallback to template:', scriptErr);
      }
    }

    // 2. TTS 음성 합성 시도 (gemini-3.8-flash-lite-tts)
    let audioData: string | null = null;
    if (aiClient) {
      try {
        const ttsResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash-lite-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: briefingScript,
                  speechMetadata: {
                    style: 'Warm, trustworthy, professional Korean voice assistant',
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });

        const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          audioData = base64Audio;
        }
      } catch (ttsErr) {
        console.warn('Gemini TTS generation error (browser SpeechSynthesis fallback will be used):', ttsErr);
      }
    }

    return res.json({
      script: briefingScript,
      audioBase64: audioData,
      voiceEngine: audioData ? 'gemini_tts' : 'web_speech_api',
    });
  } catch (error: any) {
    console.error('Voice briefing error:', error);
    return res.status(500).json({ error: '음성 브리핑 생성 실패' });
  }
});

function getFallbackRuleResponse(query: string): string {
  // 1. 집콕재계약 전용 지식베이스 우선 검색
  const matchedAnswer = findZipcockAnswer(query);
  if (matchedAnswer) {
    return matchedAnswer;
  }

  // 2. 대한민국 부동산 종합 도메인(전세사기, 권리분석, HUG 126%, 상가, 청약/세제 등) 검색
  const matchedEstateAnswer = findKoreanRealEstateKnowledge(query);
  if (matchedEstateAnswer) {
    return matchedEstateAnswer;
  }

  if (query.includes('창고') || query.includes('공장')) {
    return '창고 및 공장 임대차 재계약 시 핵심 체크포인트입니다:\n1. [화재 및 영업배상책임보험] 목적물 특성상 화재보험 및 임차인 원상복구 범위 명시 필수\n2. [동력·전력 및 오폐수 설비 승계] 인입 전력 용량 및 환경 인허가 조건 점검\n3. [상가건물임대차보호법 준용 여부] 사업자등록 대상 건물은 환산보증금 기준에 따라 10년 갱신요구권 및 5% 상한 준용\n집콕재계약에서는 창고/공장 전용 표준양식과 선순위 근저당 금지 특약을 완벽 지원합니다!';
  }
  if (query.includes('5%') || query.includes('상한') || query.includes('인상')) {
    return '주택임대차보호법 제7조에 따르면, 임대료 증액은 기존 보증금 및 월세의 5%를 초과할 수 없습니다. 또한 지자체 조례에 따라 별도 상한이 정해진 경우 그에 따릅니다. 집콕재계약에서는 5% 상한을 자동 계산하여 초과 시 즉시 경고해 드려요!';
  }
  if (query.includes('갱신청구권') || query.includes('계약갱신') || query.includes('청구권')) {
    return '계약갱신요구권은 임대차 기간이 끝나기 6개월 전부터 2개월 전까지 임차인이 1회에 한하여 행사할 수 있습니다(주택임대차보호법 제6조의3). 행사 시 2년의 거주 기간이 보장되며, 갱신 후 임차인은 언제든 해지 통고가 가능하고 3개월 뒤 효력이 발생합니다.';
  }
  if (query.includes('특약') || query.includes('보증보험') || query.includes('근저당')) {
    return '안심 재계약을 위한 필수 특약 3종을 추천합니다:\n1. [보증보험 협조] 임대인은 임차인의 전세보증금 반환보증 가입에 적극 협조한다.\n2. [근저당 금지] 잔금일(효력발생일) 익일까지 선순위 담보권 설정을 금지한다.\n3. [권리변동 해제] 목적물의 권리관계에 중대한 하자 발생 시 계약을 해제하고 원상복구한다.';
  }
  if (query.includes('전자서명') || query.includes('효력') || query.includes('모두싸인')) {
    return '전자문서 및 전자거래 기본법 제4조 및 전자서명법 제3조에 따라 공인 전자서명은 종이 계약서 서명·날인과 동일한 법적 효력을 갖습니다. TSA(시점확인필증)와 서명 감사 추적 보고서(Audit Trail)가 발급되어 위변조가 원천 차단됩니다.';
  }
  return '집콕재계약에 대해 무엇이든 물어보세요!\n- 집콕재계약 서비스 소개 및 기존 부동산 복비 차이\n- 법정 상한 5% 계산법 및 계약갱신요구권\n- 은행 전세대출 연장 및 확정일자 부여 여부\n- 전세사기 예방 안심 특약 3종 및 창고/공장 재계약 주의점\n- 임대인 기대 수익 및 공실 방어 효과까지 모두 상세히 안내해 드립니다.';
}

// Dev 모드와 Production 모드 분기
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
