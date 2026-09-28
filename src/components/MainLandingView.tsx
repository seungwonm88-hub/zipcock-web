import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Smartphone, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Coins,
  Lock
} from 'lucide-react';

interface MainLandingViewProps {
  onStartTenant: () => void;
  onStartLessor: () => void;
}

export const MainLandingView: React.FC<MainLandingViewProps> = ({
  onStartTenant,
  onStartLessor,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10 text-slate-100 space-y-16">
      {/* 1. 히어로 섹션 */}
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <span>대면 없는 안심 전월세 재계약 솔루션</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
          부동산 갈 필요 없이,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
            카톡으로 3분 만에 끝내는
          </span> 재계약
        </h1>

        <p className="text-slate-300 text-sm md:text-base leading-relaxed">
          국토교통부 표준양식에 맞춘 합의서 작성부터 모두싸인 공인 전자서명,
          대법원 등기부등본 변동 모니터링까지 전월세 재계약의 모든 과정을 집에서 해결하세요.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <button
            onClick={onStartTenant}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm md:text-base flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
          >
            <span>임차인 조건 작성하기</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onStartLessor}
            className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm md:text-base flex items-center gap-2 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>임대인 수신 체험</span>
          </button>
        </div>
      </div>

      {/* 2. 3대 핵심 가치 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Coins className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">중개보수·대필료 0원</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            단순 재계약에도 요구되던 공인중개사 대필료(10~30만 원)가 들지 않습니다.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">법적 효력 완비 (TSA)</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            전자문서법 및 전자서명법에 따라 공인 시점확인필증과 서명 감사 로그가 발급됩니다.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">대법원 등기부 변동 알림</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            계약 갱신 후에도 집주인의 근저당권 설정 등 위험 권리 변동을 24시간 실시간 감시합니다.
          </p>
        </div>
      </div>

      {/* 3. 3단계 진행 절차 */}
      <div className="bg-[#0e1628] rounded-2xl border border-slate-800 p-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Simple 3-Step</span>
          <h3 className="text-xl md:text-2xl font-bold text-white">어떻게 진행되나요?</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-black flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <strong className="block text-white text-sm">대화형 조건 입력</strong>
            <p className="text-slate-400">
              세입자가 보증금 변동액과 안심 특약을 1분 만에 카드 형태로 입력합니다.
            </p>
          </div>

          <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <strong className="block text-white text-sm">카카오톡 알림톡 초대</strong>
            <p className="text-slate-400">
              집주인은 별도 앱 설치 없이 카카오톡 알림톡 링크로 바로 합의서를 확인합니다.
            </p>
          </div>

          <div className="text-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <strong className="block text-white text-sm">공인 전자서명 & 교부</strong>
            <p className="text-slate-400">
              본인인증 후 전자서명하면 법적 효력을 갖는 표준계약서가 양측에 정식 발급됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
