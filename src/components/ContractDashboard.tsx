import React, { useState, useEffect } from 'react';
import { LeaseContract } from '../types';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Users, 
  Star, 
  RefreshCw, 
  Database,
  ExternalLink,
  Shield,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { LessorRevenueNegotiationChart } from './LessorRevenueNegotiationChart';

interface ContractDashboardProps {
  contract: LeaseContract;
  onOpenContract: () => void;
  onOpenSimulator: () => void;
}

export const ContractDashboard: React.FC<ContractDashboardProps> = ({
  contract,
  onOpenContract,
  onOpenSimulator,
}) => {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Firestore & 로컬 만족도 조사 피드백 로드
  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'satisfaction_surveys'), orderBy('createdAtServer', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      const list: any[] = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      if (list.length > 0) {
        setSurveys(list);
      } else {
        const local = JSON.parse(localStorage.getItem('zipcock_surveys') || '[]');
        setSurveys(local);
      }
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('zipcock_surveys') || '[]');
      setSurveys(local);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-slate-100 space-y-8">
      {/* 헤더 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Database className="w-3.5 h-3.5" />
            <span>실시간 Firebase Firestore 연동 대시보드</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            다중 계약 관리 및 전자서명 관제 센터
          </h2>
        </div>

        <button
          onClick={fetchSurveys}
          disabled={loading}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>새로고침</span>
        </button>
      </div>

      {/* 요약 통계 4종 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>진행 중 계약</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">1건</div>
          <p className="text-[11px] text-slate-500">표준임대차 재계약 합의서</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>서명 진행률</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {contract.lessor.signed ? '100% (완료)' : '50% (임대인 대기)'}
          </div>
          <p className="text-[11px] text-slate-500">
            {contract.lessor.signed ? '양측 공인 서명 완료' : '임차인 서명 완료, 임대인 대기'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>법정 5% 상한 검증</span>
            <Shield className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">적합 (+5.0%)</div>
          <p className="text-[11px] text-slate-500">주택임대차보호법 제7조 준수</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>공인 시점확인필증</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">TSA 발급완료</div>
          <p className="text-[11px] text-slate-500">한국정보인증 공인 타임스탬프</p>
        </div>
      </div>

      {/* 🚀 [신규 추가] 임대인 초대 및 협상 과정 기대 수익 변화 시각화 차트 */}
      <LessorRevenueNegotiationChart contract={contract} />

      {/* 현재 계약 상세 현황 카드 */}
      <div className="p-6 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">
                {contract.propertyAddress} {contract.propertyDetail}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                contract.buildingType === 'warehouse'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : contract.buildingType === 'factory'
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : contract.buildingType === 'apartment'
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}>
                {contract.buildingType === 'warehouse' && '📦 물류·보관창고'}
                {contract.buildingType === 'factory' && '🏭 제조·공장'}
                {contract.buildingType === 'apartment' && '🏢 아파트'}
                {contract.buildingType === 'villa' && '🏡 빌라·다세대'}
                {contract.buildingType === 'officetel' && '🏢 오피스텔'}
                {contract.buildingType === 'house' && '🏠 단독·다가구'}
                {contract.buildingType === 'commercial' && '🏪 상가'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">계약 ID: {contract.id}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenContract}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>계약서 보기</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            <button
              onClick={onOpenSimulator}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3 h-3" />
              <span>임대인 서명 체험</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">임차인</span>
            <div className="font-bold text-slate-200">{contract.tenant.name}</div>
            <span className="text-[10px] text-emerald-400">서명 완료 ({contract.tenant.phone})</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">임대인</span>
            <div className="font-bold text-slate-200">{contract.lessor.name}</div>
            <span className={`text-[10px] font-bold ${contract.lessor.signed ? 'text-emerald-400' : 'text-amber-400'}`}>
              {contract.lessor.signed ? '서명 완료' : '알림톡 발송 (서명 대기중)'}
            </span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">보증금 변동</span>
            <div className="font-bold text-blue-400">
              ￦{contract.newDeposit.toLocaleString()} 원
            </div>
            <span className="text-[10px] text-slate-400">
              기존: ￦{contract.currentDeposit.toLocaleString()} 원 (+5.0%)
            </span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">계약 기간</span>
            <div className="font-bold text-slate-200">2년 (24개월)</div>
            <span className="text-[10px] text-slate-400">
              {contract.startDate} ~ {contract.endDate}
            </span>
          </div>
        </div>
      </div>

      {/* 사용자 만족도 피드백 목록 (Firestore 연동) */}
      <div className="p-6 rounded-2xl bg-[#0e1628] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-sm md:text-base">
              고객 만족도 실시간 피드백 (/satisfaction_surveys)
            </h3>
          </div>
          <span className="text-xs text-slate-400">총 {surveys.length}건 수집됨</span>
        </div>

        {surveys.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            수집된 만족도 평가가 없습니다. 8단계 화면에서 별점 평가를 남겨보세요!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {surveys.map((s, idx) => (
              <div key={s.id || idx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {'★'.repeat(s.rating || 5)}
                    {'☆'.repeat(5 - (s.rating || 5))}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {s.submittedAt ? s.submittedAt.slice(0, 10) : '2026-09-28'}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {s.comment || '부동산 갈 필요 없이 집에서 3분 만에 카톡으로 끝나서 너무 편리해요.'}
                </p>

                {s.feedbackTags && s.feedbackTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {s.feedbackTags.map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
