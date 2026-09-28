import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "endless-galaxy-427511-h0",
  appId: "1:220641058434:web:45fb3ddd204b4827451e9b",
  apiKey: "AIzaSyCv7sG53r1WAMadQNIeTmiEvVNN9-oHkGU",
  authDomain: "endless-galaxy-427511-h0.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-ux-13f0a300-8317-4db9-acac-999b01b3859f",
  storageBucket: "endless-galaxy-427511-h0.firebasestorage.app",
  messagingSenderId: "220641058434"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

export interface SatisfactionSurveyData {
  id?: string;
  rating: number;
  role: 'tenant' | 'lessor';
  flowStep: number;
  feedbackTags: string[];
  comment: string;
  contractId: string;
  submittedAt: string;
}

export interface ContractData {
  id: string;
  propertyAddress: string;
  propertyDetail: string;
  contractType: 'jeonse' | 'monthly' | 'semi_jeonse';
  currentDeposit: number;
  newDeposit: number;
  currentMonthlyRent: number;
  newMonthlyRent: number;
  renewalRightUsed: boolean;
  contractPeriodYears: number;
  startDate: string;
  endDate: string;
  safeClauses: string[];
  tenantName: string;
  tenantPhone: string;
  lessorName: string;
  lessorPhone: string;
  status: 'draft' | 'pending_signature' | 'signed_completed' | 'cancelled';
  signatureProvider: 'modusign' | 'pass_cert';
  createdAt: string;
  updatedAt: string;
}

// 만족도 조사 저장 (Firestore + LocalStorage 동기화)
export async function saveSatisfactionSurvey(data: SatisfactionSurveyData): Promise<string> {
  const surveyId = `survey_${Date.now()}`;
  try {
    const docRef = doc(db, 'satisfaction_surveys', surveyId);
    await setDoc(docRef, {
      ...data,
      id: surveyId,
      createdAtServer: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore survey save error, fallback to local storage', err);
  }
  
  // 로컬 백업
  try {
    const existing = JSON.parse(localStorage.getItem('zipcock_surveys') || '[]');
    existing.unshift({ ...data, id: surveyId });
    localStorage.setItem('zipcock_surveys', JSON.stringify(existing));
  } catch (e) {
    console.error(e);
  }

  return surveyId;
}

// 계약서 저장
export async function saveContract(contract: ContractData): Promise<string> {
  try {
    const docRef = doc(db, 'contracts', contract.id);
    await setDoc(docRef, {
      ...contract,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore contract save error, fallback to local storage', err);
  }

  try {
    const existing: ContractData[] = JSON.parse(localStorage.getItem('zipcock_contracts') || '[]');
    const index = existing.findIndex(c => c.id === contract.id);
    if (index >= 0) {
      existing[index] = contract;
    } else {
      existing.unshift(contract);
    }
    localStorage.setItem('zipcock_contracts', JSON.stringify(existing));
  } catch (e) {
    console.error(e);
  }

  return contract.id;
}
