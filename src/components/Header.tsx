import React from 'react';
import { TabType, DeviceMode } from '../types';
import { Monitor, Tablet, Smartphone, Sparkles, RefreshCw, ShieldAlert, Bot, Columns } from 'lucide-react';

interface HeaderProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  deviceMode: DeviceMode;
  onDeviceModeChange: (mode: DeviceMode) => void;
  onResetData: () => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  deviceMode,
  onDeviceModeChange,
  onResetData,
  onOpenAi,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0d1424] border-b border-slate-800 text-white select-none">
      {/* 1단 메인 내비게이션 바 */}
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* 브랜드 로고 */}
        <div 
          onClick={() => onTabChange('dual_dashboard')} 
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-black border border-slate-700 flex items-center justify-center font-bold text-white shadow-lg text-lg group-hover:scale-105 transition-transform">
            집
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-[15px] tracking-tight text-white flex items-center gap-1.5">
              집콕재계약
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-medium">
                안심 공인서명
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">PC & 반응형 UX 시스템</div>
          </div>
        </div>

        {/* 탭 목록 (가로 스크롤) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mx-4">
          {/* 핵심: 대시보드 모바일 & 윈도우 듀얼 개발 뷰 (가장 눈에 띄게 배치) */}
          <button
            onClick={() => onTabChange('dual_dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'dual_dashboard'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-amber-500 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-400/50'
                : 'bg-blue-950/50 text-blue-300 border border-blue-600/40 hover:bg-blue-900/60 hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-amber-300" />
            <span>⚡ 대시보드 듀얼 뷰 (모바일+PC)</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1 rounded uppercase tracking-wider">
              Preview
            </span>
          </button>

          <button
            onClick={() => onTabChange('intro')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'intro'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            📌 인트로 워크스페이스
          </button>

          <button
            onClick={() => onTabChange('desktop_split')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'desktop_split'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            🖥️ 데스크톱 PC 웹 뷰
          </button>

          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'dashboard'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            🔥 계약 대시보드 (PC 전용)
          </button>

          <button
            onClick={() => onTabChange('responsive_ux')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'responsive_ux'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            📱 모바일 카톡 알림톡
          </button>

          <button
            onClick={() => onTabChange('design_system')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'design_system'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            🎨 디자인 시스템
          </button>

          <button
            onClick={() => onTabChange('risk_management')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'risk_management'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            ⚖️ B트랙 위험관리
          </button>

          {/* 집콕 AI 비서 버튼 */}
          <button
            onClick={onOpenAi}
            className="px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
          >
            <Bot className="w-3.5 h-3.5 text-blue-200" />
            집콕 AI 비서
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </button>

          <button
            onClick={() => onTabChange('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'landing'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            🪄 메인 랜딩
          </button>

          <button
            onClick={() => onTabChange('pwa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentTab === 'pwa'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            📲 앱 설치
          </button>
        </div>

        {/* 우측 도구: 디바이스 토글 및 새로고침 */}
        <div className="flex items-center gap-1.5 shrink-0 pl-2 border-l border-slate-800">
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => onDeviceModeChange('desktop')}
              title="데스크톱 뷰 (와이드)"
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeviceModeChange('tablet')}
              title="태블릿 뷰 (820px)"
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeviceModeChange('mobile')}
              title="모바일 카톡 웹뷰 (420px)"
              className={`p-1.5 rounded text-xs transition-colors ${
                deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onResetData}
            title="초기 샘플 데이터 복원"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2단 서브 헤더 정보 바 */}
      <div className="bg-[#090f1d] px-4 py-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="text-amber-400 font-bold flex items-center gap-1">
            ⚡ 대시보드 모바일 & 윈도우 실시간 듀얼 프리뷰 개발 모드 활성화
          </span>
          <span className="text-slate-600">·</span>
          <span>데스크톱 윈도우 대시보드</span>
          <span className="text-slate-600">·</span>
          <span className="text-blue-400">모바일 알림톡 웹뷰 (420px)</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400">양방향 즉시 동기화</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 shrink-0 text-slate-400">
          <span>Firestore /contracts & /satisfaction_surveys 실시간 수신</span>
          <span className="text-slate-600">·</span>
          <span className="text-blue-400 font-semibold">동시 프리뷰 렌더러</span>
        </div>
      </div>
    </header>
  );
};
