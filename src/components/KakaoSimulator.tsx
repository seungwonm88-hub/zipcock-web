import React, { useState } from 'react';
import { LeaseContract } from '../types';
import { 
  Smartphone, 
  CheckCircle, 
  ShieldCheck, 
  Send, 
  FileText, 
  PenTool, 
  Lock, 
  ChevronRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface KakaoSimulatorProps {
  contract: LeaseContract;
  onSignComplete: (signedByLessor: boolean) => void;
  onClose?: () => void;
}

export const KakaoSimulator: React.FC<KakaoSimulatorProps> = ({
  contract,
  onSignComplete,
  onClose,
}) => {
  const [viewState, setViewState] = useState<'kakaotalk_chat' | 'webview_confirm' | 'webview_sign' | 'complete'>('kakaotalk_chat');
  const [signatureDrawn, setSignatureDrawn] = useState<boolean>(false);

  const handleSign = () => {
    onSignComplete(true);
    setViewState('complete');
  };

  return (
    <div className="w-full flex justify-center py-6 px-4">
      {/* 420px 스마트폰 프레임 시뮬레이터 */}
      <div className="w-full max-w-[420px] bg-[#1a1d24] rounded-[36px] p-3 shadow-2xl border-4 border-slate-700 relative overflow-hidden">
        {/* 스마트폰 상단 스피커 & 노치 */}
        <div className="w-32 h-4 bg-slate-800 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-slate-900 mr-2"></div>
          <div className="w-10 h-1 rounded-full bg-slate-900"></div>
        </div>

        {/* 스마트폰 화면 컨텐츠 영역 (420px 웹뷰) */}
        <div className="w-full h-[700px] bg-[#b2c7d9] rounded-[26px] overflow-y-auto overflow-x-hidden flex flex-col font-sans select-none relative">
          
          {/* 1. 카카오톡 채팅방 뷰 */}
          {viewState === 'kakaotalk_chat' && (
            <div className="flex-1 flex flex-col">
              {/* 카톡 헤더 */}
              <div className="bg-[#a0b4c5] px-4 py-3 flex items-center justify-between text-slate-800 text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>집콕재계약 알림톡</span>
                </div>
                <span className="text-[10px] bg-slate-700/20 px-1.5 py-0.5 rounded">공식 인증</span>
              </div>

              {/* 채팅 내용 영역 */}
              <div className="flex-1 p-3 space-y-3">
                <div className="text-center my-2">
                  <span className="text-[10px] bg-black/15 text-white px-2 py-0.5 rounded-full">
                    2026년 9월 28일 월요일
                  </span>
                </div>

                {/* 알림톡 카드 말풍선 */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-slate-900 text-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-extrabold text-[#381e1f] flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded bg-[#fee500] text-[#381e1f] font-black flex items-center justify-center text-[10px]">
                        집
                      </span>
                      [집콕재계약] 재계약 합의서 도착
                    </span>
                    <span className="text-[10px] text-slate-400">오후 2:30</span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-700">
                    <strong>{contract.lessor.name}</strong> 임대인님, 안녕하십니까.<br />
                    임차인 <strong>{contract.tenant.name}</strong>님이 국토교통부 표준임대차계약서 기준 <strong>재계약 합의서</strong>를 작성하여 전자서명을 요청하였습니다.
                  </p>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">목적물:</span>
                      <span className="font-semibold text-right text-slate-800 truncate max-w-[180px]">
                        {contract.propertyAddress}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">갱신 보증금:</span>
                      <span className="font-bold text-blue-700">
                        ￦{contract.newDeposit.toLocaleString()} 원 (+5% 상한 준수)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">계약 기간:</span>
                      <span className="font-medium text-slate-800">
                        {contract.startDate} ~ {contract.endDate} (2년)
                      </span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 leading-tight">
                    * 공인 전자서명 완료 시 대법원 등기부 변동 알림이 무료 지원됩니다.
                  </div>

                  {/* 웹뷰 오픈 CTA 버튼 */}
                  <button
                    onClick={() => setViewState('webview_confirm')}
                    className="w-full py-2.5 bg-[#fee500] hover:bg-[#ebd300] text-[#381e1f] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>합의서 조건 확인 및 서명하기</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. 카카오 인앱 웹뷰: 조건 확인 */}
          {viewState === 'webview_confirm' && (
            <div className="flex-1 bg-white text-slate-900 flex flex-col">
              {/* 인앱 웹뷰 상단 바 */}
              <div className="bg-[#111e38] text-white px-4 py-3 flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  임대인 비대면 합의서 확인
                </span>
                <button 
                  onClick={() => setViewState('kakaotalk_chat')}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 웹뷰 본문 */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-sm mb-1">
                    표준임대차 재계약 조건 요약
                  </h4>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    국토교통부 표준양식과 주택임대차보호법 5% 상한을 준수한 정식 합의서입니다.
                  </p>
                </div>

                {/* 임대인 기대 수익 및 비용 절감 안내 뱃지 */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 text-[11px] space-y-1">
                  <div className="flex items-center justify-between font-bold text-emerald-900">
                    <span>💡 임대인님을 위한 집콕 직거래 혜택</span>
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">비용 절감</span>
                  </div>
                  <p className="text-slate-600 text-[10px] leading-relaxed">
                    공인 비대면 합의서로 체결 시 <strong>중개수수료 0원</strong>과 <strong>공실 리스크 0일</strong>이 보장되어, 신규 세입자 교체 대비 <strong>약 {Math.round(contract.newDeposit * 0.004 / 10000).toLocaleString()}만 원 상당의 비용이 절감</strong>됩니다.
                  </p>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50 text-[11px]">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">목적물 구분:</span>
                    <span className="font-bold text-blue-800">
                      {contract.buildingType === 'warehouse' && '📦 물류·보관창고'}
                      {contract.buildingType === 'factory' && '🏭 제조·공장시설'}
                      {contract.buildingType === 'apartment' && '🏢 아파트'}
                      {contract.buildingType === 'villa' && '🏡 빌라·다세대'}
                      {contract.buildingType === 'officetel' && '🏢 오피스텔'}
                      {contract.buildingType === 'house' && '🏠 단독주택'}
                      {contract.buildingType === 'commercial' && '🏪 상가'}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">소재지:</span>
                    <span className="font-semibold text-slate-800 text-right">{contract.propertyAddress} {contract.propertyDetail}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">기존 보증금:</span>
                    <span className="font-medium">￦{contract.currentDeposit.toLocaleString()} 원</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">새 보증금:</span>
                    <span className="font-bold text-blue-700">￦{contract.newDeposit.toLocaleString()} 원 (+5.0%)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="text-slate-500">임대차 기간:</span>
                    <span className="font-medium">{contract.startDate} ~ {contract.endDate}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">안전 특약:</span>
                    <span className="font-semibold text-emerald-700">보증보험 협조 · 선순위 근저당 금지</span>
                  </div>
                </div>

                {/* 임차인 서명 상태 */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] flex items-center justify-between">
                  <div>
                    <span className="font-bold block">임차인 {contract.tenant.name}</span>
                    <span className="text-[10px] text-emerald-700">전자서명 완료 ({contract.tenant.signedAt || '2026-09-28'})</span>
                  </div>
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>

                {/* 하단 동의 및 다음 버튼 */}
                <button
                  onClick={() => setViewState('webview_sign')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
                >
                  동의하고 전자서명 진행하기 (1분 소요)
                </button>
              </div>
            </div>
          )}

          {/* 3. 카카오 인앱 웹뷰: 공인 전자서명 패드 */}
          {viewState === 'webview_sign' && (
            <div className="flex-1 bg-white text-slate-900 flex flex-col">
              <div className="bg-[#111e38] text-white px-4 py-3 flex items-center justify-between text-xs">
                <span className="font-bold">모두싸인 공인 전자서명</span>
                <span className="text-[10px] text-blue-300">TSA 시점확인필증</span>
              </div>

              <div className="flex-1 p-4 space-y-4 text-xs">
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">임대인 {contract.lessor.name} 님 서명 날인</h4>
                  <p className="text-[11px] text-slate-500">
                    아래 서명란에 직접 서명하거나 정자 도장을 선택하세요.
                  </p>
                </div>

                {/* 전자서명 패드 시뮬레이터 */}
                <div 
                  onClick={() => setSignatureDrawn(true)}
                  className={`w-full h-36 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    signatureDrawn 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  }`}
                >
                  {signatureDrawn ? (
                    <div className="text-center">
                      <div className="text-2xl font-serif text-blue-800 font-bold italic tracking-widest">
                        {contract.lessor.name} (서명 필)
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 block">터치하여 다시 서명</span>
                    </div>
                  ) : (
                    <div className="text-center text-slate-400 space-y-1">
                      <PenTool className="w-6 h-6 mx-auto text-slate-400" />
                      <span className="text-xs">여기를 터치하여 전자서명 완료</span>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-600 leading-relaxed">
                  본 서명은 전자문서 및 전자거래 기본법 제4조 및 전자서명법 제3조에 따라 종이 계약서의 자필 서명과 동일한 법적 효력을 갖습니다.
                </div>

                <button
                  disabled={!signatureDrawn}
                  onClick={handleSign}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md disabled:cursor-not-allowed"
                >
                  서명 완료 및 합의서 발급
                </button>
              </div>
            </div>
          )}

          {/* 4. 최종 완료 뷰 */}
          {viewState === 'complete' && (
            <div className="flex-1 bg-white text-slate-900 p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-950">재계약 합의서 체결 완료!</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  임대인과 임차인 양측 서명이 모두 완료되었습니다.<br />
                  법적 효력을 갖는 정식 교부 문서가 양측 카카오톡으로 발송되었습니다.
                </p>
              </div>

              <div className="w-full bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-[11px] space-y-1">
                <div><strong>계약 ID:</strong> {contract.id}</div>
                <div><strong>공인 TSA 필증:</strong> 발급 완료 (시점확인필)</div>
                <div><strong>대법원 등기 알림:</strong> 모니터링 활성화됨</div>
              </div>

              <button
                onClick={() => setViewState('kakaotalk_chat')}
                className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-xs font-semibold"
              >
                카카오톡으로 돌아가기
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
