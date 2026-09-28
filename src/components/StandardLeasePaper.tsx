import React from 'react';
import { LeaseContract } from '../types';
import { ShieldCheck, Printer, CheckCircle, Stamp } from 'lucide-react';

interface StandardLeasePaperProps {
  contract: LeaseContract;
  onPrint?: () => void;
}

// 숫자를 한글 금액으로 변환하는 헬퍼 함수
function numberToKoreanAmount(amount: number): string {
  if (!amount || amount === 0) return '영 원';
  const units = ['', '만', '억', '조'];
  let result = '';
  let temp = amount;
  let unitIdx = 0;

  while (temp > 0) {
    const chunk = temp % 10000;
    if (chunk > 0) {
      result = `${chunk.toLocaleString()}${units[unitIdx]} ` + result;
    }
    temp = Math.floor(temp / 10000);
    unitIdx++;
  }
  return result.trim() + ' 원정';
}

// 건물 유형 한글 명칭 헬퍼 함수
function getBuildingTypeName(type: string): string {
  switch (type) {
    case 'warehouse':
      return '일반창고/물류창고 (보관시설)';
    case 'factory':
      return '일반공장/제조시설 (산업시설)';
    case 'apartment':
      return '아파트(공동주택)';
    case 'villa':
      return '다세대·연립주택(빌라)';
    case 'officetel':
      return '오피스텔(업무/주거)';
    case 'house':
      return '단독·다가구주택';
    case 'commercial':
      return '근린생활시설(상가)';
    default:
      return '건축물대장 등재 일반건축물';
  }
}

export const StandardLeasePaper: React.FC<StandardLeasePaperProps> = ({ contract, onPrint }) => {
  const isIndustrialOrCommercial = contract.buildingType === 'warehouse' || contract.buildingType === 'factory' || contract.buildingType === 'commercial';

  return (
    <div className="bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 p-6 md:p-8 font-serif leading-normal select-text print:p-0 print:border-none print:shadow-none">
      {/* 상단 컨트롤 바 */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 font-sans print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-medium">
            국토교통부 표준양식
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {isIndustrialOrCommercial 
              ? '부동산(상가·공장·창고) 임대차 표준계약서' 
              : '주택임대차 표준계약서 (재계약·합의서)'}
          </span>
        </div>

        <button
          onClick={onPrint || (() => window.print())}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>계약서 인쇄 / PDF</span>
        </button>
      </div>

      {/* 계약서 문서 본문 헤더 */}
      <div className="text-center space-y-1 mb-6">
        <h2 className="text-xl md:text-2xl font-black tracking-widest text-slate-950 font-sans">
          {contract.buildingType === 'warehouse'
            ? '물 류 · 창 고 임 대 차 표 준 계 약 서'
            : contract.buildingType === 'factory'
            ? '공 장 · 산 업 시 설 임 대 차 표 준 계 약 서'
            : '주 택 임 대 차 표 준 계 약 서'}
        </h2>
        <p className="text-xs text-slate-500 font-sans">
          {isIndustrialOrCommercial
            ? '(민법 제618조 및 상가건물임대차보호법 준용 재계약 합의)'
            : '(주택임대차보호법 제6조, 제6조의3 및 제7조에 따른 갱신계약 합의)'}
        </p>
      </div>

      {/* 서문 */}
      <p className="text-xs leading-relaxed mb-4 text-justify font-sans">
        임대인과 임차인은 아래 표시 부동산(목적물)에 대하여 기존 임대차 계약을 갱신 체결함에 있어 상호 합의에 따라 다음과 같이 계약을 체결한다.
      </p>

      {/* [1. 부동산의 표시] */}
      <div className="mb-5 border border-slate-400 text-xs">
        <div className="bg-slate-100 px-3 py-1.5 font-bold border-b border-slate-400 font-sans flex items-center justify-between">
          <span>1. 부동산의 표시</span>
          <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            용도/유형: {getBuildingTypeName(contract.buildingType)}
          </span>
        </div>
        <div className="p-3 space-y-1.5 font-sans">
          <div className="flex">
            <span className="w-24 text-slate-600 font-medium shrink-0">소 재 지:</span>
            <span className="font-semibold text-slate-900">{contract.propertyAddress}</span>
          </div>
          <div className="flex">
            <span className="w-24 text-slate-600 font-medium shrink-0">상세호수 및 면적:</span>
            <span className="font-semibold text-slate-900">{contract.propertyDetail}</span>
          </div>
        </div>
      </div>

      {/* [2. 계약내용 (보증금 및 차임)] */}
      <div className="mb-5 border border-slate-400 text-xs font-sans">
        <div className="bg-slate-100 px-3 py-1.5 font-bold border-b border-slate-400 flex items-center justify-between">
          <span>2. 계약내용 (보증금 및 차임 조건)</span>
          <span className="text-[11px] text-blue-700 font-bold">
            {contract.renewalRightUsed ? '[계약갱신요구권 행사 계약]' : '[합의 갱신 계약]'}
          </span>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between bg-blue-50/60 p-2 rounded border border-blue-200">
            <span className="font-bold text-slate-800">갱신 보증금 총액:</span>
            <div className="text-right">
              <span className="text-sm font-black text-blue-900">
                {numberToKoreanAmount(contract.newDeposit)}
              </span>
              <span className="text-xs text-slate-600 ml-1">
                (￦{contract.newDeposit.toLocaleString()})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700">
            <div>
              <span className="text-slate-500">기존 보증금:</span>{' '}
              <span className="font-medium">￦{contract.currentDeposit.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500">증액(변동) 금액:</span>{' '}
              <span className="font-bold text-emerald-700">
                +￦{(contract.newDeposit - contract.currentDeposit).toLocaleString()} (
                {(((contract.newDeposit - contract.currentDeposit) / contract.currentDeposit) * 100).toFixed(1)}% 상한 준수)
              </span>
            </div>
          </div>

          {contract.newMonthlyRent > 0 && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="font-medium text-slate-700">월 차 임 (월세):</span>
              <span className="font-bold text-slate-900">
                매월 ￦{contract.newMonthlyRent.toLocaleString()} 원 (선불/후불)
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1 border-t border-slate-200">
            <span className="font-medium text-slate-700">임대차 기간:</span>
            <span className="font-bold text-slate-900">
              {contract.startDate} ~ {contract.endDate} ({contract.contractPeriodYears}년 간)
            </span>
          </div>
        </div>
      </div>

      {/* [3. 주요 법정 조항 요약] */}
      <div className="mb-5 space-y-2 text-[11px] text-slate-700 text-justify leading-relaxed">
        <p>
          <strong>제2조 (계약갱신요구권의 행사):</strong> 임차인은 본 갱신계약에 있어 주택임대차보호법 제6조의3에 따른 계약갱신요구권을 행사하였음을 상호 확인한다.
        </p>
        <p>
          <strong>제3조 (임차인의 계약 해지권):</strong> 계약갱신요구권을 행사하여 갱신된 경우, 임차인은 언제든지 임대인에게 계약해지를 통지할 수 있으며 임대인이 통지를 받은 날부터 3개월이 지나면 효력이 발생한다.
        </p>
      </div>

      {/* [4. 안전 특약사항 3종] */}
      <div className="mb-6 border border-slate-400 text-xs font-sans">
        <div className="bg-slate-100 px-3 py-1.5 font-bold border-b border-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>안전 특약사항 (상호 합의)</span>
        </div>
        <div className="p-3 space-y-2">
          {contract.safeClauses.insuranceSupport && (
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold shrink-0">①</span>
              <p className="text-[11px] text-slate-800 leading-snug">
                <strong>[보증보험 가입 협조]</strong> 임대인은 임차인의 HUG/SGI/HF 전세보증금 반환보증 가입에 적극 협조한다.
              </p>
            </div>
          )}

          {contract.safeClauses.mortgageRestriction && (
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold shrink-0">②</span>
              <p className="text-[11px] text-slate-800 leading-snug">
                <strong>[선순위 근저당 설정 금지]</strong> 임대인은 계약 갱신 효력발생일(잔금일) 익일까지 해당 목적물에 새로운 선순위 근저당권 및 제한물권을 설정하지 아니한다.
              </p>
            </div>
          )}

          {contract.safeClauses.rightDefectCancel && (
            <div className="flex items-start gap-1.5">
              <span className="text-emerald-600 font-bold shrink-0">③</span>
              <p className="text-[11px] text-slate-800 leading-snug">
                <strong>[권리변동 시 계약해제]</strong> 잔금일 이전 목적물에 가압류, 압류 등 권리변동 하자가 발생할 경우 임차인은 계약을 즉시 해제할 수 있으며 기지급된 보증금은 즉시 반환한다.
              </p>
            </div>
          )}

          {contract.customClauses.map((clause, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-blue-600 font-bold shrink-0">④-{idx + 1}</span>
              <p className="text-[11px] text-slate-800 leading-snug">{clause}</p>
            </div>
          ))}
        </div>
      </div>

      {/* [5. 당사자 서명 날인란] */}
      <div className="border border-slate-400 text-xs font-sans">
        <div className="bg-slate-100 px-3 py-1.5 font-bold border-b border-slate-400">
          계약 당사자 인적사항 및 전자서명(모두싸인 공인)
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-400">
          {/* 임대인 */}
          <div className="p-3 space-y-1.5 relative">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">임대인 (집주인)</span>
              {contract.lessor.signed ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  서명 완료
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                  서명 대기중
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-700">성 명: {contract.lessor.name}</div>
            <div className="text-[11px] text-slate-700">주민등록번호: {contract.lessor.idNumberMasked}</div>
            <div className="text-[11px] text-slate-700">전화번호: {contract.lessor.phone}</div>
            
            {/* 도장 또는 서명 이미지 시뮬레이션 */}
            <div className="mt-2 h-14 border border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50">
              {contract.lessor.signed ? (
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <div className="w-9 h-9 rounded-full border-2 border-rose-600 flex items-center justify-center text-[10px] leading-tight text-center">
                    {contract.lessor.name}<br />인
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {contract.lessor.signedAt || '공인 전자서명 필'}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-sans">
                  카카오 알림톡 링크를 통해 서명 예정
                </span>
              )}
            </div>
          </div>

          {/* 임차인 */}
          <div className="p-3 space-y-1.5 relative">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-900">임차인 (세입자)</span>
              {contract.tenant.signed ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  서명 완료
                </span>
              ) : (
                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                  미서명
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-700">성 명: {contract.tenant.name}</div>
            <div className="text-[11px] text-slate-700">주민등록번호: {contract.tenant.idNumberMasked}</div>
            <div className="text-[11px] text-slate-700">전화번호: {contract.tenant.phone}</div>

            <div className="mt-2 h-14 border border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50">
              {contract.tenant.signed ? (
                <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                  <div className="w-9 h-9 rounded-full border-2 border-blue-700 flex items-center justify-center text-[10px] leading-tight text-center">
                    {contract.tenant.name}<br />인
                  </div>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {contract.tenant.signedAt || '본인확인 전자서명 필'}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-slate-400 font-sans">
                  임차인 서명 대기중
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 전자서명 진본성 및 TSA 발급 정보 바닥글 */}
      <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">
            TSA 시점확인필증: KICA-TSA-20260928-88192
          </span>
          <span>·</span>
          <span>트랜잭션 ID: {contract.signatureTransactionId}</span>
        </div>
        <div className="text-emerald-700 font-bold">
          전자문서 및 전자거래 기본법 제4조 제1항 준거 문서
        </div>
      </div>
    </div>
  );
};
