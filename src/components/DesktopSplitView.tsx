import React, { useState } from 'react';
import { LeaseContract } from '../types';
import { StandardLeasePaper } from './StandardLeasePaper';
import { 
  Building, 
  Coins, 
  Calendar, 
  ShieldCheck, 
  UserCheck, 
  FileSignature, 
  Send, 
  Check, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  Calculator,
  Sparkles,
  Smartphone
} from 'lucide-react';

interface DesktopSplitViewProps {
  contract: LeaseContract;
  onUpdateContract: (updated: LeaseContract) => void;
  onOpenSatisfactionModal: () => void;
  onOpenLessorSimulator: () => void;
  onOpenAi?: () => void;
}

export const DesktopSplitView: React.FC<DesktopSplitViewProps> = ({
  contract,
  onUpdateContract,
  onOpenSatisfactionModal,
  onOpenLessorSimulator,
  onOpenAi,
}) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 8;

  // 5% 계산 관련
  const maxLegalDeposit = Math.floor(contract.currentDeposit * 1.05);
  const currentDiff = contract.newDeposit - contract.currentDeposit;
  const currentDiffRate = contract.currentDeposit > 0 ? (currentDiff / contract.currentDeposit) * 100 : 0;
  const isOverLegalLimit = contract.newDeposit > maxLegalDeposit;

  // 5% 상한선 원클릭 적용
  const applyLegalLimit = () => {
    onUpdateContract({
      ...contract,
      newDeposit: maxLegalDeposit,
    });
  };

  // 보증금 동결 적용
  const applyFreezeDeposit = () => {
    onUpdateContract({
      ...contract,
      newDeposit: contract.currentDeposit,
    });
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 py-6">
      {/* 2열 스플릿 레이아웃: 좌측 8단계 Q&A + 우측 국토교통부 표준양식 실시간 미러링 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 좌측: 8단계 대화형 카드 선택 Q&A 패널 (5열) */}
        <div className="lg:col-span-5 bg-[#0e1628] rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-5 text-slate-100">
          {/* 상단 스텝 프로그레스 헤더 */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span className="text-blue-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                STEP {step} / {totalSteps}
              </span>
              <span>{Math.round((step / totalSteps) * 100)}% 완료</span>
            </div>

            {/* 프로그레스 바 */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* 스텝별 동적 컨텐츠 */}
          <div className="min-h-[460px] flex flex-col justify-between">
            {/* STEP 1: 목적물 기본 정보 */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">1단계: 임대차 주택 소재지</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    재계약할 집의 주소와 상세 정보를 확인해주세요
                  </h3>
                  <p className="text-xs text-slate-400">
                    기존 계약서 상의 도로명 주소 및 동·호수입니다.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">기본 도로명 주소</label>
                    <input 
                      type="text" 
                      value={contract.propertyAddress}
                      onChange={(e) => onUpdateContract({ ...contract, propertyAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                      placeholder="예: 서울특별시 마포구 독막로 123"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">동·호수 및 상세 면적</label>
                    <input 
                      type="text" 
                      value={contract.propertyDetail}
                      onChange={(e) => onUpdateContract({ ...contract, propertyDetail: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 text-xs"
                      placeholder="예: 래미안마포리버웰 104동 1202호 (전용 84.92㎡)"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      건물 유형 (주거·상업·창고·공장 전체 지원)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(['apartment', 'villa', 'officetel', 'house', 'warehouse', 'factory'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => onUpdateContract({ ...contract, buildingType: type })}
                          className={`p-2.5 rounded-xl border text-center font-medium transition-all ${
                            contract.buildingType === type
                              ? 'bg-blue-600/30 border-blue-500 text-white shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {type === 'apartment' && '🏢 아파트(공동주택)'}
                          {type === 'villa' && '🏡 다세대·빌라'}
                          {type === 'officetel' && '🏢 오피스텔'}
                          {type === 'house' && '🏠 단독·다가구'}
                          {type === 'warehouse' && '📦 창고 (물류·보관)'}
                          {type === 'factory' && '🏭 공장 (제조·산업)'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: 계약 형태 선택 */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">2단계: 계약 유형 및 갱신 방식</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    어떤 형태의 재계약인가요?
                  </h3>
                  <p className="text-xs text-slate-400">
                    전세 유지, 월세 전환, 반전세 중 선택하세요.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { id: 'jeonse', title: '주택 전세 (보증금만)', desc: '보증금만으로 계약을 유지하거나 증액/감액합니다.' },
                    { id: 'monthly', title: '보증부 월세 (월세형)', desc: '보증금과 매월 차임(월세)을 지불합니다.' },
                    { id: 'semi_jeonse', title: '반전세 (소액 월세)', desc: '높은 보증금과 소액의 관리성 월세 조건입니다.' }
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onUpdateContract({ ...contract, contractType: item.id as any })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        contract.contractType === item.id
                          ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{item.title}</span>
                        {contract.contractType === item.id && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: 보증금 및 5% 상한 계산기 */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">3단계: 보증금 및 차임 조정</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    합의할 갱신 보증금을 입력해주세요
                  </h3>
                  <p className="text-xs text-slate-400">
                    주택임대차보호법 제7조에 따른 법정 상한 5%를 자동 검산합니다.
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">기존 보증금</label>
                    <div className="px-3.5 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 font-bold">
                      ￦{contract.currentDeposit.toLocaleString()} 원 ({contract.currentDeposit / 100000000}억 원)
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-200 font-medium">새 갱신 보증금</label>
                      <span className="text-blue-400 font-medium text-[11px]">
                        5% 법정 상한: ￦{maxLegalDeposit.toLocaleString()} 원
                      </span>
                    </div>

                    <input 
                      type="number" 
                      step={1000000}
                      value={contract.newDeposit}
                      onChange={(e) => onUpdateContract({ ...contract, newDeposit: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 font-bold text-sm"
                    />
                  </div>

                  {/* 퀵 프리셋 버튼 */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={applyLegalLimit}
                      className="flex-1 py-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 rounded-lg text-blue-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>+5.0% 상한 자동 적용</span>
                    </button>

                    <button
                      type="button"
                      onClick={applyFreezeDeposit}
                      className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                    >
                      <span>보증금 동결 (0%)</span>
                    </button>
                  </div>

                  {/* 5% 초과 경고 or 준수 안내 배너 */}
                  {isOverLegalLimit ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <strong className="block text-rose-200">법정 상한 5% 초과 감지!</strong>
                        현재 입력하신 금액은 기존 대비 +{currentDiffRate.toFixed(1)}%로 5%를 초과하였습니다. 
                        임차인은 5%를 초과한 금액에 대해 무효를 주장하고 반환을 청구할 권리가 있습니다.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <strong className="block text-emerald-200">법정 5% 상한 준수 완료 (+{currentDiffRate.toFixed(1)}%)</strong>
                        인상액: +￦{(currentDiff).toLocaleString()} 원. 법령 기준에 완벽히 부합합니다.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: 계약 기간 및 갱신청구권 행사 */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">4단계: 계약 기간 및 갱신요구권</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    계약 기간과 갱신청구권 사용 여부
                  </h3>
                  <p className="text-xs text-slate-400">
                    주택임대차보호법상 계약갱신요구권은 1회에 한하여 행사 가능합니다.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  {/* 갱신청구권 사용 토글 카드 */}
                  <div 
                    onClick={() => onUpdateContract({ ...contract, renewalRightUsed: !contract.renewalRightUsed })}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      contract.renewalRightUsed 
                        ? 'bg-amber-500/20 border-amber-500/60 text-white' 
                        : 'bg-slate-900/60 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm">계약갱신요구권 이번에 행사</span>
                      </div>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        contract.renewalRightUsed ? 'bg-amber-500 text-slate-950 font-bold' : 'border border-slate-600'
                      }`}>
                        {contract.renewalRightUsed && '✓'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                      * 행사 시 법적으로 2년의 거주 기간이 보장되며, 임차인은 계약 기간 중 언제든 해지 통고가 가능합니다(3개월 후 효력 발생).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 mb-1">갱신 시작일</label>
                      <input 
                        type="date"
                        value={contract.startDate}
                        onChange={(e) => onUpdateContract({ ...contract, startDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">갱신 만료일</label>
                      <input 
                        type="date"
                        value={contract.endDate}
                        onChange={(e) => onUpdateContract({ ...contract, endDate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: 안심 특약 3종 */}
            {step === 5 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">5단계: 안심 특약 3종</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    보증금 보호를 위한 필수 안전 특약
                  </h3>
                  <p className="text-xs text-slate-400">
                    전세사기 방지 및 보증보험 가입을 보장하는 특약입니다.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1 text-xs">
                  <div 
                    onClick={() => onUpdateContract({
                      ...contract,
                      safeClauses: { ...contract.safeClauses, insuranceSupport: !contract.safeClauses.insuranceSupport }
                    })}
                    className="p-3 rounded-xl border border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5"
                  >
                    <input 
                      type="checkbox" 
                      checked={contract.safeClauses.insuranceSupport}
                      readOnly
                      className="mt-0.5 accent-blue-600 rounded"
                    />
                    <div>
                      <strong className="block text-slate-200">① 전세보증금 반환보증 가입 협조</strong>
                      <span className="text-[11px] text-slate-400">임대인은 임차인의 HUG/SGI/HF 보증보험 가입에 적극 협조한다.</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => onUpdateContract({
                      ...contract,
                      safeClauses: { ...contract.safeClauses, mortgageRestriction: !contract.safeClauses.mortgageRestriction }
                    })}
                    className="p-3 rounded-xl border border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5"
                  >
                    <input 
                      type="checkbox" 
                      checked={contract.safeClauses.mortgageRestriction}
                      readOnly
                      className="mt-0.5 accent-blue-600 rounded"
                    />
                    <div>
                      <strong className="block text-slate-200">② 선순위 근저당 설정 금지</strong>
                      <span className="text-[11px] text-slate-400">갱신 효력발생일 익일까지 새로운 담보권을 설정하지 아니한다.</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => onUpdateContract({
                      ...contract,
                      safeClauses: { ...contract.safeClauses, rightDefectCancel: !contract.safeClauses.rightDefectCancel }
                    })}
                    className="p-3 rounded-xl border border-slate-700 bg-slate-900/60 cursor-pointer flex items-start gap-2.5"
                  >
                    <input 
                      type="checkbox" 
                      checked={contract.safeClauses.rightDefectCancel}
                      readOnly
                      className="mt-0.5 accent-blue-600 rounded"
                    />
                    <div>
                      <strong className="block text-slate-200">③ 권리변동 시 즉시 계약해제</strong>
                      <span className="text-[11px] text-slate-400">목적물에 중대한 권리 하자 발생 시 즉시 해제 및 보증금 반환.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: 당사자 정보 */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">6단계: 계약 당사자 정보</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    임차인 및 임대인 연락처 확인
                  </h3>
                  <p className="text-xs text-slate-400">
                    카카오톡 알림톡으로 전자서명 링크가 발송될 번호입니다.
                  </p>
                </div>

                <div className="space-y-3 pt-1 text-xs">
                  {/* 임차인 */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-blue-400 font-bold text-[11px]">임차인 (작성자)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={contract.tenant.name}
                        onChange={(e) => onUpdateContract({
                          ...contract,
                          tenant: { ...contract.tenant, name: e.target.value }
                        })}
                        placeholder="임차인 성명"
                        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white"
                      />
                      <input 
                        type="text" 
                        value={contract.tenant.phone}
                        onChange={(e) => onUpdateContract({
                          ...contract,
                          tenant: { ...contract.tenant, phone: e.target.value }
                        })}
                        placeholder="임차인 휴대폰 번호"
                        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>

                  {/* 임대인 */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <span className="text-amber-400 font-bold text-[11px]">임대인 (집주인)</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={contract.lessor.name}
                        onChange={(e) => onUpdateContract({
                          ...contract,
                          lessor: { ...contract.lessor, name: e.target.value }
                        })}
                        placeholder="임대인 성명"
                        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white"
                      />
                      <input 
                        type="text" 
                        value={contract.lessor.phone}
                        onChange={(e) => onUpdateContract({
                          ...contract,
                          lessor: { ...contract.lessor, phone: e.target.value }
                        })}
                        placeholder="임대인 카카오톡 수신 번호"
                        className="px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: 전자서명 수단 */}
            {step === 7 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-blue-400 font-semibold">7단계: 전자서명 수단 및 일정</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    공인 전자서명 인증 방식
                  </h3>
                  <p className="text-xs text-slate-400">
                    모두싸인(ModuSign) 연동 카카오 알림톡 본인인증 서명입니다.
                  </p>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-4 rounded-xl border border-blue-500 bg-blue-950/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">모두싸인 공인 전자서명</span>
                      <span className="text-[10px] bg-blue-500 text-white font-bold px-2 py-0.5 rounded">
                        법적 효력 완비
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      카카오페이인증, PASS 본인인증을 거쳐 서명하며, 서명 완료 시 시점확인필증(TSA)과 함께 
                      위변조 방지 감사추적 보고서가 자동 발급됩니다.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <span className="text-slate-400">서명 기한 설정</span>
                    <span className="font-semibold text-slate-200">초대장 발송 후 7일 이내</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: 작성 완료 및 초대 전송 */}
            {step === 8 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-emerald-400 font-semibold">8단계: 최종 합의서 생성 완료</span>
                  <h3 className="text-lg md:text-xl font-bold text-white">
                    표준임대차 재계약 합의서 완성!
                  </h3>
                  <p className="text-xs text-slate-400">
                    이제 임대인에게 카카오톡 알림톡으로 정중한 초대를 전송할 수 있습니다.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>모든 조건 및 법률 검증이 완료되었습니다</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    임대인이 카카오톡에서 합의서를 확인하고 서명하면 즉시 계약 체결이 완료되며, 
                    대법원 등기부 변동 추적 서비스가 자동 활성화됩니다.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {onOpenAi && (
                    <button
                      type="button"
                      onClick={onOpenAi}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>전체 계약 조건 AI 음성 브리핑 요약 듣기</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onOpenLessorSimulator}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>임대인 수신 카톡 알림톡 및 서명 체험</span>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenSatisfactionModal}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    ★ 서비스 만족도 평가 남기기
                  </button>
                </div>
              </div>
            )}

            {/* 하단 이전 / 다음 이동 버튼 바 */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep((prev) => Math.max(1, prev - 1))}
                disabled={step === 1}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>이전</span>
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => Math.min(totalSteps, prev + 1))}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <span>다음 단계로</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenLessorSimulator}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>임대인 알림톡 전송 완료</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 우측: 국토교통부 표준임대차계약서 실시간 미러링 렌더러 (7열) */}
        <div className="lg:col-span-7">
          <StandardLeasePaper contract={contract} />
        </div>
      </div>
    </div>
  );
};
