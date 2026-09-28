import React, { useState } from 'react';
import { LeaseContract } from '../types';
import { ContractDashboard } from './ContractDashboard';
import { KakaoSimulator } from './KakaoSimulator';
import { 
  Monitor, 
  Smartphone, 
  Columns, 
  Layers, 
  Maximize2, 
  RefreshCw, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  Eye,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface DualDashboardPreviewProps {
  contract: LeaseContract;
  onUpdateContract: (updated: LeaseContract) => void;
  onOpenContractPaper: () => void;
  onOpenAi: () => void;
}

export const DualDashboardPreview: React.FC<DualDashboardPreviewProps> = ({
  contract,
  onUpdateContract,
  onOpenContractPaper,
  onOpenAi,
}) => {
  // 모바일 화면 확대/축소 스케일 및 프리셋
  const [mobileScale, setMobileScale] = useState<number>(0.92); // 0.85 ~ 1.0
  const [viewSplitRatio, setViewSplitRatio] = useState<'50-50' | '60-40' | '40-60'>('60-40');
  const [activeSyncTab, setActiveSyncTab] = useState<'all' | 'sync_stats'>('all');

  // 계약 상태 즉시 토글 시뮬레이션
  const toggleLessorSignState = () => {
    const nextSigned = !contract.lessor.signed;
    onUpdateContract({
      ...contract,
      lessor: {
        ...contract.lessor,
        signed: nextSigned,
        signedAt: nextSigned ? new Date().toISOString().replace('T', ' ').slice(0, 19) + ' (KST)' : undefined,
      },
      status: nextSigned ? 'signed_completed' : 'pending_signature',
    });
  };

  return (
    <div className="w-full max-w-[1720px] mx-auto px-3 py-4 text-slate-100 space-y-4">
      {/* 듀얼 프리뷰 개발 컨트롤 바 */}
      <div className="bg-[#0e1628] border border-blue-500/30 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 font-black text-lg">
            <Columns className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-white text-base tracking-tight">
                대시보드 모바일 & 윈도우 듀얼 개발 뷰 (Dual Preview)
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                실시간 양방향 동기화
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              좌측 데스크톱 윈도우 대시보드와 우측 420px 모바일 실시간 뷰를 나란히 비교하며 개발을 진행합니다.
            </p>
          </div>
        </div>

        {/* 퀵 컨트롤 도구 */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 분할 비율 버튼 */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewSplitRatio('60-40')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewSplitRatio === '60-40' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              PC 60 : 모바일 40
            </button>
            <button
              onClick={() => setViewSplitRatio('50-50')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewSplitRatio === '50-50' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              50 : 50 균등
            </button>
            <button
              onClick={() => setViewSplitRatio('40-60')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                viewSplitRatio === '40-60' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              PC 40 : 모바일 60
            </button>
          </div>

          {/* 건물 유형 원클릭 프리셋 전환 (창고/공장/아파트/빌라) */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs">
            <span className="text-slate-400 px-2 text-[11px] font-medium hidden sm:inline">유형:</span>
            {(['warehouse', 'factory', 'apartment', 'commercial'] as const).map((bType) => (
              <button
                key={bType}
                onClick={() => {
                  let defaultAddress = contract.propertyAddress;
                  let defaultDetail = contract.propertyDetail;
                  if (bType === 'warehouse') {
                    defaultAddress = '경기도 이천시 호법면 중부대로 789';
                    defaultDetail = '이천 로지스틱스 물류센터 C동 (창고 2,450㎡)';
                  } else if (bType === 'factory') {
                    defaultAddress = '인천광역시 남동구 남동서로 345';
                    defaultDetail = '남동국가산업단지 제2제조공장 (공장 1,820㎡)';
                  } else if (bType === 'apartment') {
                    defaultAddress = '서울특별시 마포구 독막로 123';
                    defaultDetail = '래미안마포리버웰 104동 1202호 (전용 84.92㎡)';
                  } else if (bType === 'commercial') {
                    defaultAddress = '서울특별시 강남구 테헤란로 152';
                    defaultDetail = '강남스퀘어타워 1층 102호 (상가 115.4㎡)';
                  }
                  onUpdateContract({
                    ...contract,
                    buildingType: bType,
                    propertyAddress: defaultAddress,
                    propertyDetail: defaultDetail,
                  });
                }}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  contract.buildingType === bType
                    ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {bType === 'warehouse' && '📦 창고'}
                {bType === 'factory' && '🏭 공장'}
                {bType === 'apartment' && '🏢 아파트'}
                {bType === 'commercial' && '🏪 상가'}
              </button>
            ))}
          </div>

          {/* 모바일 화면 배율 조절 */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-300">
            <span className="text-[11px] text-slate-400">모바일 배율:</span>
            <button
              onClick={() => setMobileScale((s) => Math.max(0.75, Number((s - 0.05).toFixed(2))))}
              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-200"
            >
              -
            </button>
            <span className="font-mono font-bold text-amber-400 min-w-[36px] text-center">
              {Math.round(mobileScale * 100)}%
            </span>
            <button
              onClick={() => setMobileScale((s) => Math.min(1.0, Number((s + 0.05).toFixed(2))))}
              className="w-5 h-5 rounded bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-slate-200"
            >
              +
            </button>
          </div>

          {/* 서명 상태 원클릭 토글 (실시간 양방향 변화 테스트용) */}
          <button
            onClick={toggleLessorSignState}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              contract.lessor.signed
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{contract.lessor.signed ? '서명 대기 상태로 되돌리기' : '임대인 서명 즉시 완료 처리'}</span>
          </button>

          <button
            onClick={onOpenAi}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI 비서</span>
          </button>
        </div>
      </div>

      {/* 듀얼 프리뷰 2열 나란히 배치 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ========================================================
            좌측: PC 윈도우 와이드 대시보드 뷰
           ======================================================== */}
        <div
          className={`${
            viewSplitRatio === '60-40'
              ? 'lg:col-span-7'
              : viewSplitRatio === '50-50'
              ? 'lg:col-span-6'
              : 'lg:col-span-5'
          } bg-[#0a101f] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col`}
        >
          {/* PC 윈도우 스타일 창 프레임 상단 바 */}
          <div className="bg-[#0e1628] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              </div>
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-white tracking-tight">
                  데스크톱 윈도우 관리 대시보드 (1920x1080 Viewport)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Firestore 실시간 연결됨</span>
            </div>
          </div>

          {/* PC 대시보드 내부 컨텐츠 스크롤 영역 */}
          <div className="p-3 md:p-5 overflow-y-auto max-h-[820px] no-scrollbar">
            <ContractDashboard
              contract={contract}
              onOpenContract={onOpenContractPaper}
              onOpenSimulator={() => {}}
            />
          </div>
        </div>

        {/* ========================================================
            우측: 모바일 스마트폰 420px 윈도우 뷰
           ======================================================== */}
        <div
          className={`${
            viewSplitRatio === '60-40'
              ? 'lg:col-span-5'
              : viewSplitRatio === '50-50'
              ? 'lg:col-span-6'
              : 'lg:col-span-7'
          } bg-[#0a101f] rounded-3xl border border-slate-800 shadow-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden`}
        >
          {/* 모바일 윈도우 상단 상태 바 */}
          <div className="w-full pb-3 mb-2 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white">
                모바일 실시간 뷰 (카카오톡 알림톡 웹뷰 420px)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                실제 모바일 배율 {Math.round(mobileScale * 100)}%
              </span>
            </div>
          </div>

          {/* 스케일 트랜스폼 컨테이너 */}
          <div
            style={{
              transform: `scale(${mobileScale})`,
              transformOrigin: 'top center',
            }}
            className="transition-transform duration-200"
          >
            <KakaoSimulator
              contract={contract}
              onSignComplete={(signed) => {
                onUpdateContract({
                  ...contract,
                  lessor: {
                    ...contract.lessor,
                    signed,
                    signedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' (KST)',
                  },
                  status: signed ? 'signed_completed' : 'pending_signature',
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
