import React, { useState } from 'react';
import { LeaseContract, RegistryEvent } from '../types';
import { sampleRegistryEvents } from '../initialData';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileCheck2, 
  History, 
  Lock, 
  RefreshCw,
  TrendingDown,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface RiskManagementViewProps {
  contract: LeaseContract;
}

export const RiskManagementView: React.FC<RiskManagementViewProps> = ({ contract }) => {
  const [events, setEvents] = useState<RegistryEvent[]>(sampleRegistryEvents);
  const [simulatedPropertyPrice, setSimulatedPropertyPrice] = useState<number>(350000000); // 시세 3억 5천
  const [simulatedMortgage, setSimulatedMortgage] = useState<number>(0); // 선순위 근저당 0원

  // 부채비율 = (선순위 근저당 + 전세보증금) / 매매시세 * 100
  const totalDebt = simulatedMortgage + contract.newDeposit;
  const debtRatio = simulatedPropertyPrice > 0 ? (totalDebt / simulatedPropertyPrice) * 100 : 0;

  // 위험등급 판정 (70% 미만: 안전, 70~80%: 주의, 80% 이상: 깡통전세 위험)
  let riskLevel: 'safe' | 'warning' | 'danger' = 'safe';
  if (debtRatio >= 80) riskLevel = 'danger';
  else if (debtRatio >= 70) riskLevel = 'warning';

  // 등기부등본 실시간 조회 모의 실행
  const handleCheckRegistry = () => {
    const newEvent: RegistryEvent = {
      id: `reg-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      type: 'safe_verified',
      section: 'B_mortgage',
      title: '대법원 인터넷등기소 실시간 자동 재열람',
      description: '을구 권리변동 없음 확인. 당사자간 신규 근저당 또는 가압류 미발생 정상.',
      severity: 'safe',
    };
    setEvents([newEvent, ...events]);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-slate-100 space-y-8">
      {/* 타이틀 헤더 */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>B트랙 위험관리 & 대법원 등기 모니터링 시스템</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          깡통전세 위험도 분석 및 등기부등본 실시간 추적
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          국토교통부 실거래가 및 대법원 인터넷등기소 API를 연계하여 재계약 목적물의 권리 변동을 24시간 실시간 감시합니다.
        </p>
      </div>

      {/* 2열 분석 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. 깡통전세 부채비율 계산 진단기 (5열) */}
        <div className="lg:col-span-5 bg-[#0e1628] rounded-2xl border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-400" />
              보증금 안전진단 (부채비율 검사)
            </h3>
            <span className="text-[11px] text-slate-400">KB시세/실거래가 연동</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">예상 매매 시세</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step={10000000}
                  value={simulatedPropertyPrice}
                  onChange={(e) => setSimulatedPropertyPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
                <span className="text-slate-400 whitespace-nowrap">원</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">선순위 근저당권 (담보대출)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  step={5000000}
                  value={simulatedMortgage}
                  onChange={(e) => setSimulatedMortgage(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                />
                <span className="text-slate-400 whitespace-nowrap">원</span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">재계약 갱신 보증금</label>
              <div className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-blue-400 font-bold">
                ￦{contract.newDeposit.toLocaleString()} 원
              </div>
            </div>
          </div>

          {/* 진단 결과 카드 */}
          <div className={`p-4 rounded-xl border ${
            riskLevel === 'safe' 
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : riskLevel === 'warning'
              ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs">안전 부채비율 진단</span>
              <span className="text-base font-black">
                {debtRatio.toFixed(1)}%
              </span>
            </div>

            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden my-2">
              <div 
                className={`h-full transition-all duration-300 ${
                  riskLevel === 'safe' ? 'bg-emerald-500' : riskLevel === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, debtRatio)}%` }}
              ></div>
            </div>

            <p className="text-[11px] leading-relaxed mt-2">
              {riskLevel === 'safe' && '✔ 매우 안전: 부채비율 70% 미만으로 HUG 전세보증금 반환보증 가입이 수월하며 깡통전세 위험이 낮습니다.'}
              {riskLevel === 'warning' && '⚠️ 주의 요망: 부채비율이 70%를 상회하므로 보증보험 가입 요건을 필히 사전 확인하세요.'}
              {riskLevel === 'danger' && '🚨 고위험(깡통전세 위험): 매매가 대비 보증금+채권 합계가 80%를 넘어 경매 시 보증금 손실 위험이 있습니다.'}
            </p>
          </div>
        </div>

        {/* 2. 대법원 등기부등본 변동 모니터링 타임라인 (7열) */}
        <div className="lg:col-span-7 bg-[#0e1628] rounded-2xl border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400" />
                대법원 등기부등본 (갑구/을구) 변동 이력
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {contract.propertyAddress} {contract.propertyDetail}
              </p>
            </div>

            <button
              onClick={handleCheckRegistry}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>실시간 재조회</span>
            </button>
          </div>

          {/* 타임라인 이벤트 목록 */}
          <div className="space-y-3">
            {events.map((evt, idx) => (
              <div 
                key={evt.id} 
                className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    {evt.severity === 'safe' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    )}
                    {evt.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{evt.date}</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pl-5">
                  {evt.description}
                </p>

                <div className="pl-5 pt-1 flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded">
                    구분: {evt.section === 'A_ownership' ? '갑구 (소유권)' : '을구 (근저당/제한물권)'}
                  </span>
                  <span>대법원 등기기록 대조 일치</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 전자서명법 준거 감사 추적 (Audit Trail) 증명 카드 */}
      <div className="bg-[#0e1628] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white text-sm md:text-base">
              전자문서법 & 전자서명법 법률 감사추적 증명 (Audit Trail)
            </h3>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
            SHA-256 불변 검증됨
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">공인 전자서명 트랜잭션</span>
            <div className="font-mono text-slate-200 font-bold truncate">
              {contract.signatureTransactionId}
            </div>
            <span className="text-[10px] text-emerald-400">모두싸인 실시간 연계</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">문서 해시 (SHA-256)</span>
            <div className="font-mono text-slate-200 font-bold truncate">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
            <span className="text-[10px] text-slate-400">위변조 원천 방지 블록 생성</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] block">시점확인필증 (TSA)</span>
            <div className="font-mono text-slate-200 font-bold truncate">
              KICA-TSA-20260928-88192
            </div>
            <span className="text-[10px] text-blue-400">한국정보인증 공인 타임스탬프</span>
          </div>
        </div>
      </div>
    </div>
  );
};
