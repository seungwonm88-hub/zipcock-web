import { LeaseContract, RegistryEvent } from './types';

export const initialContract: LeaseContract = {
  id: 'contract_id_001',
  propertyAddress: '서울특별시 마포구 독막로 123',
  propertyDetail: '래미안마포리버웰 104동 1202호 (전용 84.92㎡)',
  buildingType: 'apartment',
  contractType: 'jeonse',
  currentDeposit: 250000000,
  newDeposit: 262500000, // +5.0% 인상
  currentMonthlyRent: 0,
  newMonthlyRent: 0,
  contractPeriodYears: 2,
  startDate: '2026-11-15',
  endDate: '2028-11-14',
  renewalRightUsed: true,
  safeClauses: {
    insuranceSupport: true,
    mortgageRestriction: true,
    rightDefectCancel: true,
    loanExtensionSupport: true,
  },
  customClauses: [
    '임대인은 임차인의 기존 전세대출 만기 연장에 적극 협조하기로 한다.',
    '본 계약은 비대면 공인 전자서명(모두싸인)을 통해 체결되었으며, 전자문서법에 따라 종이 계약서와 동일한 법적 효력을 갖는다.'
  ],
  tenant: {
    name: '김영희',
    phone: '010-9876-5432',
    idNumberMasked: '920514-2******',
    signed: true,
    signedAt: '2026-09-28 14:20:11 (KST)',
  },
  lessor: {
    name: '박철수',
    phone: '010-1234-5678',
    idNumberMasked: '680820-1******',
    signed: false,
    signedAt: undefined,
  },
  status: 'pending_signature',
  signatureTransactionId: 'MODU-SIGN-2026-992813',
  tsaCertified: true,
  createdAt: '2026-09-28T05:30:00.000Z',
  updatedAt: '2026-09-28T06:10:00.000Z',
};

export const sampleRegistryEvents: RegistryEvent[] = [
  {
    id: 'reg-01',
    date: '2026-09-28 09:00',
    type: 'safe_verified',
    section: 'B_mortgage',
    title: '대법원 등기소 실시간 검증 완료 (변동 없음)',
    description: '을구 근저당권 및 기타 제한물권 신규 설정 없음. 기존 선순위 근저당 0원 상태 유지 확인.',
    severity: 'safe',
  },
  {
    id: 'reg-02',
    date: '2026-08-15 14:10',
    type: 'mortgage_cancelled',
    section: 'B_mortgage',
    title: '근저당권 말소 등기 완료',
    description: '채권최고액 1억 2,000만 원 (국민은행) 근저당권 설정 등기 전부 말소 접수 확인.',
    severity: 'safe',
  },
  {
    id: 'reg-03',
    date: '2024-11-15 10:00',
    type: 'ownership_transferred',
    section: 'A_ownership',
    title: '기존 임대차 계약 체결 및 입주 시점',
    description: '소유권자 박철수 명의 단독 소유권 확인, 최초 확정일자 부여 완료.',
    severity: 'safe',
  }
];
