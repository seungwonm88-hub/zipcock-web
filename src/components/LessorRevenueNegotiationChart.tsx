import React, { useState } from 'react';
import { LeaseContract } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  ArrowUpRight, 
  Calculator,
  UserCheck,
  Building2,
  Percent,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface LessorRevenueNegotiationChartProps {
  contract: LeaseContract;
  onNegotiateDepositChange?: (newDeposit: number) => void;
}

export const LessorRevenueNegotiationChart: React.FC<LessorRevenueNegotiationChartProps> = ({
  contract,
  onNegotiateDepositChange,
}) => {
  // 기준 금리 또는 정기예금/국채 운용 수익률 (임대인의 보증금 운용 기회비용: 기본 3.5%)
  const [interestRate, setInterestRate] = useState<number>(3.5);
  // 공실 발생 시 예상 공실 개월수 (신규 임차인 탐색 시 통상 1~2개월 공실)
  const [vacancyMonths, setVacancyMonths] = useState<number>(1.5);
  // 신규 계약 시 복비(중개수수료 요율) % (임대차 통상 0.4% ~ 0.5% or 상가/창고/공장 0.8% ~ 0.9%)
  const defaultBrokerFeeRate = (contract.buildingType === 'warehouse' || contract.buildingType === 'factory' || contract.buildingType === 'commercial') ? 0.8 : 0.4;
  const [brokerFeeRate, setBrokerFeeRate] = useState<number>(defaultBrokerFeeRate);

  // 시뮬레이션용 협상 보증금 (5% 상한 내외)
  const legalMaxDeposit = Math.floor(contract.currentDeposit * 1.05);
  const depositDiff = contract.newDeposit - contract.currentDeposit;
  const depositIncreaseRate = contract.currentDeposit > 0 ? ((depositDiff / contract.currentDeposit) * 100) : 0;

  // 1. [기존 계약 유지] (동결 시)
  // - 2년 예금 이자 수익: currentDeposit * (interestRate/100) * 2
  // - 복비 0원, 공실 손실 0원
  const frozenDepositInterest2Y = Math.round(contract.currentDeposit * (interestRate / 100) * 2);
  const frozenNetRevenue2Y = frozenDepositInterest2Y;

  // 2. [집콕 안심 재계약 체결] (현재 협상안 - 5% 인상)
  // - 2년 예금 이자 수익: newDeposit * (interestRate/100) * 2
  // - 중개수수료 0원 (집콕 전자서명 플랫폼 이용으로 직거래 비용 절감)
  // - 공실 손실 0원 (기존 임차인 유지로 공실 리스크 제로)
  // - 보증금 증액 유동성 확보액: depositDiff
  const renewedDepositInterest2Y = Math.round(contract.newDeposit * (interestRate / 100) * 2);
  const renewedPlatformSavings = Math.round(contract.newDeposit * (brokerFeeRate / 100)); // 중개수수료 절감액
  const renewedNetProfit2Y = (renewedDepositInterest2Y - frozenDepositInterest2Y) + renewedPlatformSavings;

  // 3. [신규 임차인으로 변경 시] (계약 결렬 후 새로운 세입자 유치)
  // - 신규 보증금: 시세 기준 (동일하게 5% 인상 가정)
  // - 공실 손실: 1.5개월간 보증금 이자 및 관리비 손실
  // - 중개수수료 지출: newDeposit * brokerFeeRate%
  // - 시설 청소/도배/원상복구 보수비 (주택: ~80만 원, 공장/창고: ~250만 원)
  const repairCost = (contract.buildingType === 'warehouse' || contract.buildingType === 'factory') ? 2500000 : 800000;
  const vacancyLoss = Math.round((contract.newDeposit * (interestRate / 100) / 12) * vacancyMonths);
  const newTenantBrokerFee = Math.round(contract.newDeposit * (brokerFeeRate / 100));
  const newTenantNetRevenue2Y = renewedDepositInterest2Y - vacancyLoss - newTenantBrokerFee - repairCost;

  // 비교 차트용 최대값 정규화 (백분율 바 그래프 계산)
  const maxComparisonValue = Math.max(renewedNetProfit2Y, newTenantNetRevenue2Y, frozenNetRevenue2Y, 1);

  // 시나리오 데이터셋
  const scenarios = [
    {
      title: '집콕 안심 재계약 (추천안)',
      badge: '수익 & 안전 최적화',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      totalBenefit2Y: renewedNetProfit2Y,
      depositAmount: contract.newDeposit,
      brokerFee: 0,
      vacancyRisk: '0일 (공실 없음)',
      barColor: 'from-emerald-500 to-teal-400',
      barPercent: 100,
      highlight: true,
      description: '중개수수료 0원 + 공실 0일 + 5% 상한 준수로 분쟁 없는 안정적 자산 운용',
    },
    {
      title: '신규 임차인 재탐색 (계약 해지)',
      badge: '고비용 & 공실 위험',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      totalBenefit2Y: newTenantNetRevenue2Y - frozenDepositInterest2Y,
      depositAmount: contract.newDeposit,
      brokerFee: newTenantBrokerFee,
      vacancyRisk: `${vacancyMonths}개월 공실 발생`,
      barColor: 'from-rose-500 to-amber-500',
      barPercent: Math.max(15, Math.min(95, Math.round(((newTenantNetRevenue2Y - frozenDepositInterest2Y) / Math.max(renewedNetProfit2Y, 1)) * 100))),
      highlight: false,
      description: `중개복비(약 ${(newTenantBrokerFee / 10000).toLocaleString()}만원) + 공실손실(${(vacancyLoss / 10000).toFixed(0)}만원) 지출 발생`,
    },
    {
      title: '기존 조건 단순 동결',
      badge: '물가상승 대비 수익 감소',
      badgeColor: 'bg-slate-700 text-slate-300 border-slate-600',
      totalBenefit2Y: 0,
      depositAmount: contract.currentDeposit,
      brokerFee: 0,
      vacancyRisk: '0일 (공실 없음)',
      barColor: 'from-slate-600 to-slate-500',
      barPercent: 20,
      highlight: false,
      description: '보증금 증액 없이 2년 연장 (기회비용 손실 발생)',
    },
  ];

  return (
    <div className="bg-[#0e1628] rounded-2xl border border-blue-500/30 p-5 md:p-6 space-y-6 shadow-2xl relative overflow-hidden">
      {/* 장식용 배경 광원 */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      {/* 차트 상단 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-white text-base md:text-lg tracking-tight">
                임대인 기대 수익 & 협상 시뮬레이션 차트
              </h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
                2년 실질 순이익 분석
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              임차인 초대 및 재계약 협상 시, 임대인이 실제로 누릴 수 있는 금융 기회비용과 비용 절감 가치를 입증합니다.
            </p>
          </div>
        </div>

        {/* 핵심 혜택 요약 칩 */}
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-slate-300">신규 세입자 교체 대비 임대인 순이익:</span>
          <span className="font-black text-emerald-400 font-mono text-sm">
            +{Math.max(0, Math.round((renewedNetProfit2Y - (newTenantNetRevenue2Y - frozenDepositInterest2Y)) / 10000)).toLocaleString()}만 원 우위
          </span>
        </div>
      </div>

      {/* 시나리오별 시각화 바 차트 (Bar Graph) */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-300">2년간 임대인 순수익 창출액 (보증금 운용 + 비용 절감)</span>
          <span className="text-[11px] text-slate-500 font-mono">단위: 원 (KRW)</span>
        </div>

        <div className="space-y-3">
          {scenarios.map((sc, idx) => (
            <div 
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                sc.highlight 
                  ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e1628] border-emerald-500/40 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/20' 
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{sc.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">2년 누적 실질 혜택:</span>
                  <span className={`text-base font-black font-mono ${sc.highlight ? 'text-emerald-400' : 'text-slate-200'}`}>
                    {sc.totalBenefit2Y > 0 ? `+￦${(sc.totalBenefit2Y).toLocaleString()}` : `￦${(sc.totalBenefit2Y).toLocaleString()}`}원
                  </span>
                </div>
              </div>

              {/* 시각화 프로그레스 게이지 바 */}
              <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5 mb-2.5">
                <div 
                  style={{ width: `${Math.max(8, sc.barPercent)}%` }}
                  className={`h-full rounded-full bg-gradient-to-r ${sc.barColor} transition-all duration-500`}
                />
              </div>

              {/* 세부 수치 브레이크다운 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-slate-800/60 text-slate-300">
                <div>
                  <span className="text-slate-500 block">보증금 협상액</span>
                  <span className="font-bold text-white font-mono">￦{(sc.depositAmount / 100000000).toFixed(2)}억</span>
                </div>
                <div>
                  <span className="text-slate-500 block">공실 발생 리스크</span>
                  <span className={`font-semibold ${sc.highlight ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {sc.vacancyRisk}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">중개복비 지출</span>
                  <span className={`font-mono font-bold ${sc.brokerFee === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sc.brokerFee === 0 ? '0원 (무료)' : `-￦${(sc.brokerFee / 10000).toLocaleString()}만원`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">핵심 강점</span>
                  <span className="text-slate-400 truncate">{sc.description}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 인터랙티브 협상 파라미터 조절 시뮬레이터 (금리 / 공실 / 수수료) */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 space-y-3 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white">
              실시간 재계약 협상 변수 튜닝 (Interactive Simulation)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">슬라이더를 움직여 임대인 수익 변화를 바로 확인하세요</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* 1. 보증금 운용 금리 */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>보증금 예치/운용 금리</span>
              <span className="font-bold text-blue-400 font-mono">{interestRate.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min={2.0} 
              max={6.0} 
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">한국은행 기준금리 및 정기예금 복리 적용</p>
          </div>

          {/* 2. 신규 임차인 교체 시 예상 공실 */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>신규 세입자 탐색 시 공실 기간</span>
              <span className="font-bold text-amber-400 font-mono">{vacancyMonths.toFixed(1)}개월</span>
            </div>
            <input 
              type="range" 
              min={0.5} 
              max={4.0} 
              step={0.5}
              value={vacancyMonths}
              onChange={(e) => setVacancyMonths(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">부동산 침체기 평균 공실 손실액 산출</p>
          </div>

          {/* 3. 오프라인 중개수수료율 */}
          <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-slate-400">
              <span>오프라인 부동산 중개수수료율</span>
              <span className="font-bold text-emerald-400 font-mono">{brokerFeeRate.toFixed(1)}%</span>
            </div>
            <input 
              type="range" 
              min={0.3} 
              max={0.9} 
              step={0.1}
              value={brokerFeeRate}
              onChange={(e) => setBrokerFeeRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500">
              {contract.buildingType === 'warehouse' || contract.buildingType === 'factory' ? '산업시설 법정 상한 요율 0.9%' : '주택 법정 상한 요율 0.4%'}
            </p>
          </div>
        </div>

        {/* 협상 설득 가이드 코멘트 */}
        <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl flex items-start gap-2.5 text-xs text-blue-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">임대인 설득 핵심 포인트: </strong>
            임대인은 세입자를 새로 구하는 것보다 기존 세입자와 집콕재계약을 맺을 때, 
            중개수수료 <strong>{((contract.newDeposit * (brokerFeeRate / 100)) / 10000).toLocaleString()}만 원</strong>과 
            공실 손실 <strong>{((vacancyLoss) / 10000).toFixed(0)}만 원</strong> 등 총 
            <span className="text-emerald-400 font-bold ml-1">
              약 {(((contract.newDeposit * (brokerFeeRate / 100)) + vacancyLoss) / 10000).toFixed(0)}만 원 상당의 기회 손실을 즉시 방어
            </span>
            할 수 있어 가장 유리합니다.
          </div>
        </div>
      </div>
    </div>
  );
};
