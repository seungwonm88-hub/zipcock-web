import React from 'react';
import { LeaseContract, TabType, DeviceMode } from '../types';
import { 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Lock, 
  Sparkles, 
  Smartphone, 
  Monitor, 
  Tablet, 
  MessageSquare, 
  ChevronRight,
  Send,
  Building,
  Scale,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface IntroWorkspaceProps {
  contract: LeaseContract;
  onNavigateTab: (tab: TabType) => void;
  onStartTenantFlow: () => void;
  onStartLessorFlow: () => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onOpenAi: () => void;
}

export const IntroWorkspace: React.FC<IntroWorkspaceProps> = ({
  contract,
  onNavigateTab,
  onStartTenantFlow,
  onStartLessorFlow,
  deviceMode,
  onDeviceModeChange,
  onOpenAi,
}) => {
  const depositDiff = contract.newDeposit - contract.currentDeposit;
  const depositDiffRate = ((depositDiff / contract.currentDeposit) * 100).toFixed(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white">
      {/* 브라우저 쇼케이스 프레임 (스크린샷 정확 구현) */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1527] shadow-2xl overflow-hidden transition-all">
        {/* 상단 윈도우 바 */}
        <div className="bg-[#090f1e] px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-xs text-slate-300 font-medium tracking-tight">
              집콕재계약 · 주택임대차 안심 재계약 플랫폼
            </span>
          </div>

          {/* 디바이스 프리뷰 토글 */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 mr-1 text-[11px] hidden md:inline">디바이스 프리뷰:</span>
            <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-700/80">
              <button
                onClick={() => onDeviceModeChange('desktop')}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>데스크톱 PC (와이드)</span>
              </button>

              <button
                onClick={() => onDeviceModeChange('tablet')}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all ${
                  deviceMode === 'tablet'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                <span>태블릿 (820px)</span>
              </button>

              <button
                onClick={() => onDeviceModeChange('mobile')}
                className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition-all ${
                  deviceMode === 'mobile'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>카톡 알림톡 웹뷰 (420px)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 메인 히어로 2열 그리드 */}
        <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#0d1527] via-[#0b1222] to-[#070b16]">
          {/* 좌측: 타이틀, 소개, CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <span>국토교통부 표준임대차계약서 준수</span>
              <span>·</span>
              <span>전자문서법 법적 효력 완비</span>
              <span>·</span>
              <span className="text-emerald-400">중개수수료 0원</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-[42px] font-black tracking-tight leading-[1.25] text-white">
              복잡하고 불안했던 전월세 재계약, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                집에서 3분 만에
              </span> 끝납니다
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl font-normal">
              부동산 방문이나 불편한 대면 조율 없이, 카카오톡 알림톡으로 합의 조건을 확인하고 
              공인 전자서명(모두싸인)으로 계약을 체결하세요. 법정 상한 5% 자동 검증부터 등기부등본 변동 추적까지 안전하게 책임집니다.
            </p>

            {/* 메인 액션 버튼 */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartTenantFlow}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm md:text-base flex items-center gap-2.5 shadow-lg shadow-blue-600/30 transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <span>임차인 대화형 조건 입력 시작</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onStartLessorFlow}
                className="px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm md:text-base flex items-center gap-2 transition-all cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>임대인 3분 수신 플로우</span>
              </button>
            </div>

            {/* 빠른 링크 (스크린샷 정확 구현 + 음성 브리핑 연계) */}
            <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-400 border-t border-slate-800/80">
              <button
                onClick={() => onNavigateTab('desktop_split')}
                className="hover:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>PC 대화면 분할 뷰</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="text-amber-400">🔥</span>
                <span>다중 임차 대시보드 (Firestore)</span>
              </button>
              <span className="text-slate-700">•</span>
              <button
                onClick={onOpenAi}
                className="hover:text-sky-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>AI 재계약 컨시어지 & 음성 브리핑</span>
              </button>
            </div>

            {/* 하단 체크리스트 3종 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>법정 중개보수 0원</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>시점확인필증(TSA) 법적 효력 완비</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>카카오 알림톡 정중한 초대</span>
              </div>
            </div>
          </div>

          {/* 우측: 실시간 계약 합의서 요약 카드 (스크린샷 완벽 재현) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md relative overflow-hidden space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* 헤더 */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">표준임대차 재계약 합의서</h3>
                    <p className="text-[11px] text-slate-400">모두싸인 실시간 전자서명 연동</p>
                  </div>
                </div>

                <span className="text-[11px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  비대면 체결 가능
                </span>
              </div>

              {/* 계약 조건 항목 리스트 */}
              <div className="space-y-2.5 text-xs">
                {/* 0. 건물 유형 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400">부동산 목적물</span>
                  <span className="font-bold text-blue-300">
                    {contract.buildingType === 'warehouse' && '📦 물류·보관창고'}
                    {contract.buildingType === 'factory' && '🏭 제조·공장시설'}
                    {contract.buildingType === 'apartment' && '🏢 아파트(공동주택)'}
                    {contract.buildingType === 'villa' && '🏡 다세대·빌라'}
                    {contract.buildingType === 'officetel' && '🏢 오피스텔'}
                    {contract.buildingType === 'house' && '🏠 단독·다가구'}
                    {contract.buildingType === 'commercial' && '🏪 상가'}
                  </span>
                </div>

                {/* 1. 계약 형태 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400">계약 형태</span>
                  <span className="font-semibold text-slate-200">
                    {contract.contractType === 'jeonse' ? '보증금 계약 (전세)' : '보증부 월세'}
                  </span>
                </div>

                {/* 2. 보증금 변동 */}
                <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">보증금 변동</span>
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{(contract.currentDeposit / 100000000).toFixed(1)}억 {(contract.currentDeposit % 100000000) / 10000}만</span>
                      <span className="text-slate-500">➔</span>
                      <span className="text-blue-400">
                        {(contract.newDeposit / 100000000).toFixed(1)}억 {((contract.newDeposit % 100000000) / 10000).toLocaleString()}만 원
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-400 font-medium">
                      +{(depositDiff / 10000).toLocaleString()}만 원 (+{depositDiffRate}% 법정 상한 준수)
                    </span>
                  </div>
                </div>

                {/* 3. 갱신청구권 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400">갱신청구권</span>
                  <span className="font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {contract.renewalRightUsed ? '이번에 사용 (2년 보장)' : '미사용 (합의 갱신)'}
                  </span>
                </div>

                {/* 4. 안전 특약 3종 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800">
                  <span className="text-slate-400">안전 특약 3종</span>
                  <span className="font-medium text-slate-200">
                    보증보험 협조 · 선순위 근저당 금지
                  </span>
                </div>

                {/* 5. 대법원 등기부 변동 알림 */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/50 text-blue-300">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-blue-400" />
                    <span>대법원 등기부 변동 알림 포함</span>
                  </div>
                  <span className="text-[10px] bg-blue-500/30 text-blue-200 font-bold px-1.5 py-0.5 rounded">
                    무료 제공
                  </span>
                </div>
              </div>

              {/* 바로가기 버튼 */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={onOpenAi}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>전체 계약 조건 AI 음성 브리핑 듣기</span>
                </button>

                <button
                  onClick={() => onNavigateTab('desktop_split')}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>합의서 전체 국토교통부 표준양식 열람</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
