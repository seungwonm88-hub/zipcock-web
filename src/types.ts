export type TabType = 
  | 'dual_dashboard'
  | 'intro'
  | 'desktop_split'
  | 'design_system'
  | 'risk_management'
  | 'responsive_ux'
  | 'dashboard'
  | 'ai_concierge'
  | 'landing'
  | 'pwa';

export type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export type BuildingType = 
  | 'apartment'    // 아파트(공동주택)
  | 'villa'        // 다세대·연립(빌라)
  | 'officetel'    // 오피스텔
  | 'house'        // 단독·다가구
  | 'warehouse'    // 창고 (물류·보관창고)
  | 'factory'      // 공장 (제조·산업시설)
  | 'commercial';  // 상가·근린생활시설

export interface LeaseContract {
  id: string;
  propertyAddress: string;
  propertyDetail: string;
  buildingType: BuildingType;
  contractType: 'jeonse' | 'monthly' | 'semi_jeonse';
  
  // 금액 정보
  currentDeposit: number; // 원 단위 (예: 250,000,000)
  newDeposit: number;     // 원 단위 (예: 262,500,000)
  currentMonthlyRent: number;
  newMonthlyRent: number;
  
  // 계약 기간 & 갱신청구권
  contractPeriodYears: number; // 기본 2년
  startDate: string; // YYYY-MM-DD
  endDate: string;
  renewalRightUsed: boolean; // 계약갱신요구권 행사 여부
  
  // 안전 특약 3종 및 추가 특약
  safeClauses: {
    insuranceSupport: boolean;   // 보증보험 가입 적극 협조
    mortgageRestriction: boolean;// 잔금일까지 선순위 근저당권 설정 금지
    rightDefectCancel: boolean;  // 권리관계 중대 하자 시 즉시 해제 및 원상회복
    loanExtensionSupport: boolean;// 전세대출 연장 서류 협조
  };
  customClauses: string[];
  
  // 당사자 정보
  tenant: {
    name: string;
    phone: string;
    idNumberMasked: string;
    signed: boolean;
    signedAt?: string;
  };
  lessor: {
    name: string;
    phone: string;
    idNumberMasked: string;
    signed: boolean;
    signedAt?: string;
  };
  
  // 서명 및 상태
  status: 'draft' | 'pending_signature' | 'signed_completed' | 'cancelled';
  signatureTransactionId: string;
  tsaCertified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegistryEvent {
  id: string;
  date: string;
  type: 'mortgage_created' | 'mortgage_cancelled' | 'seizure' | 'ownership_transferred' | 'safe_verified';
  section: 'A_ownership' | 'B_mortgage';
  title: string;
  description: string;
  severity: 'safe' | 'warning' | 'danger';
  creditor?: string;
  amount?: number;
}
