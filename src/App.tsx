/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, DeviceMode, LeaseContract } from './types';
import { initialContract } from './initialData';
import { saveContract } from './firebase';
import { Header } from './components/Header';
import { DualDashboardPreview } from './components/DualDashboardPreview';
import { IntroWorkspace } from './components/IntroWorkspace';
import { DesktopSplitView } from './components/DesktopSplitView';
import { KakaoSimulator } from './components/KakaoSimulator';
import { RiskManagementView } from './components/RiskManagementView';
import { ContractDashboard } from './components/ContractDashboard';
import { DesignSystemView } from './components/DesignSystemView';
import { MainLandingView } from './components/MainLandingView';
import { PwaInstallView } from './components/PwaInstallView';
import { AiConciergeModal } from './components/AiConciergeModal';
import { SatisfactionModal } from './components/SatisfactionModal';
import { WelcomeConciergePrompt } from './components/WelcomeConciergePrompt';
import { Bot, MessageSquare } from 'lucide-react';

export default function App() {
  // 기본 첫 화면을 "대시보드 모바일 & 윈도우 듀얼 개발 뷰"로 지정하여 한 화면에서 두 가지를 보며 개발 가능
  const [currentTab, setCurrentTab] = useState<TabType>('dual_dashboard');
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [contract, setContract] = useState<LeaseContract>(() => {
    try {
      const saved = localStorage.getItem('zipcock_current_contract');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialContract;
  });

  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [autoPlayVoiceOnAiOpen, setAutoPlayVoiceOnAiOpen] = useState<boolean>(false);
  const [isSatisfactionOpen, setIsSatisfactionOpen] = useState<boolean>(false);

  // 웹 처음 진입 여부 체크: AI 재계약 컨시어지 & 음성 브리핑 사전 질문 프롬프트
  const [showWelcomePrompt, setShowWelcomePrompt] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('zipcock_welcomed') !== 'true';
    } catch {
      return false;
    }
  });

  // 계약서 변경 시 자동 저장
  const handleUpdateContract = (updated: LeaseContract) => {
    setContract(updated);
    try {
      localStorage.setItem('zipcock_current_contract', JSON.stringify(updated));
      saveContract({
        id: updated.id,
        propertyAddress: updated.propertyAddress,
        propertyDetail: updated.propertyDetail,
        contractType: updated.contractType,
        currentDeposit: updated.currentDeposit,
        newDeposit: updated.newDeposit,
        currentMonthlyRent: updated.currentMonthlyRent,
        newMonthlyRent: updated.newMonthlyRent,
        renewalRightUsed: updated.renewalRightUsed,
        contractPeriodYears: updated.contractPeriodYears,
        startDate: updated.startDate,
        endDate: updated.endDate,
        safeClauses: Object.keys(updated.safeClauses).filter(k => (updated.safeClauses as any)[k]),
        tenantName: updated.tenant.name,
        tenantPhone: updated.tenant.phone,
        lessorName: updated.lessor.name,
        lessorPhone: updated.lessor.phone,
        status: updated.status,
        signatureProvider: 'modusign',
        createdAt: updated.createdAt,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // 임대인 전자서명 완료 콜백
  const handleLessorSignComplete = (signed: boolean) => {
    const updated: LeaseContract = {
      ...contract,
      lessor: {
        ...contract.lessor,
        signed,
        signedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' (KST)',
      },
      status: signed ? 'signed_completed' : 'pending_signature',
    };
    handleUpdateContract(updated);
  };

  // 샘플 데이터 복원
  const handleResetData = () => {
    if (window.confirm('기본 샘플 계약 데이터로 복원하시겠습니까?')) {
      setContract(initialContract);
      localStorage.setItem('zipcock_current_contract', JSON.stringify(initialContract));
    }
  };

  // 1. 처음 진입 시 사용자가 "네" 또는 단답형 수락한 경우 -> AI 음성 브리핑 자동 재생 시작
  const handleAcceptVoiceBriefing = () => {
    try {
      sessionStorage.setItem('zipcock_welcomed', 'true');
    } catch {}
    setShowWelcomePrompt(false);
    setAutoPlayVoiceOnAiOpen(true);
    setIsAiOpen(true);
  };

  // 2. 대답이 없거나 "아니오"/일반 진행을 원한 경우 -> 프롬프트 닫고 일반 워크스페이스 진행
  const handleDeclineRegularFlow = () => {
    try {
      sessionStorage.setItem('zipcock_welcomed', 'true');
    } catch {}
    setShowWelcomePrompt(false);
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 글로벌 상단 헤더 */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        deviceMode={deviceMode}
        onDeviceModeChange={setDeviceMode}
        onResetData={handleResetData}
        onOpenAi={() => {
          setAutoPlayVoiceOnAiOpen(false);
          setIsAiOpen(true);
        }}
      />

      {/* 메인 뷰 컨테이너 */}
      <main className="flex-1 flex flex-col items-center w-full transition-all">
        <div
          className={`w-full transition-all duration-300 ${
            currentTab === 'dual_dashboard'
              ? 'max-w-[1720px] p-1'
              : deviceMode === 'tablet'
              ? 'max-w-[820px] shadow-2xl my-4 rounded-3xl border border-slate-800 bg-[#0d1424] overflow-hidden'
              : deviceMode === 'mobile'
              ? 'max-w-[420px] shadow-2xl my-4'
              : 'max-w-full'
          }`}
        >
          {/* ⚡ 대시보드 모바일 & 윈도우 듀얼 개발 뷰 (요청 사항: 두 가지만 동시에 보면서 개발 진행) */}
          {currentTab === 'dual_dashboard' && (
            <DualDashboardPreview
              contract={contract}
              onUpdateContract={handleUpdateContract}
              onOpenContractPaper={() => setCurrentTab('desktop_split')}
              onOpenAi={() => {
                setAutoPlayVoiceOnAiOpen(false);
                setIsAiOpen(true);
              }}
            />
          )}

          {/* 1. 📌 인트로 워크스페이스 */}
          {currentTab === 'intro' && (
            <IntroWorkspace
              contract={contract}
              onNavigateTab={setCurrentTab}
              onStartTenantFlow={() => setCurrentTab('desktop_split')}
              onStartLessorFlow={() => setCurrentTab('responsive_ux')}
              deviceMode={deviceMode}
              onDeviceModeChange={setDeviceMode}
              onOpenAi={() => {
                setAutoPlayVoiceOnAiOpen(true);
                setIsAiOpen(true);
              }}
            />
          )}

          {/* 2. 🖥️ 데스크톱 PC 웹 뷰 (8단계 Q&A + 표준양식 종이) */}
          {currentTab === 'desktop_split' && (
            <DesktopSplitView
              contract={contract}
              onUpdateContract={handleUpdateContract}
              onOpenSatisfactionModal={() => setIsSatisfactionOpen(true)}
              onOpenLessorSimulator={() => setCurrentTab('responsive_ux')}
              onOpenAi={() => {
                setAutoPlayVoiceOnAiOpen(true);
                setIsAiOpen(true);
              }}
            />
          )}

          {/* 3. 🎨 디자인 시스템 */}
          {currentTab === 'design_system' && <DesignSystemView />}

          {/* 4. ⚖️ B트랙 위험관리 & 등기 모니터링 */}
          {currentTab === 'risk_management' && (
            <RiskManagementView contract={contract} />
          )}

          {/* 5. 📱 반응형 크로스 플랫폼 UX (카톡 420px 웹뷰 & 임대인 서명 체험) */}
          {currentTab === 'responsive_ux' && (
            <KakaoSimulator
              contract={contract}
              onSignComplete={handleLessorSignComplete}
            />
          )}

          {/* 6. 🔥 계약 대시보드 (PC 전용) */}
          {currentTab === 'dashboard' && (
            <ContractDashboard
              contract={contract}
              onOpenContract={() => setCurrentTab('desktop_split')}
              onOpenSimulator={() => setCurrentTab('responsive_ux')}
            />
          )}

          {/* 7. 🤖 집콕 AI 비서 (독립 탭으로 열릴 때) */}
          {currentTab === 'ai_concierge' && (
            <div className="w-full max-w-4xl mx-auto py-10 px-4">
              <AiConciergeModal
                contract={contract}
                isOpen={true}
                onClose={() => setCurrentTab('dual_dashboard')}
                autoPlayVoiceBriefing={false}
              />
            </div>
          )}

          {/* 8. 🪄 메인 랜딩페이지 */}
          {currentTab === 'landing' && (
            <MainLandingView
              onStartTenant={() => setCurrentTab('desktop_split')}
              onStartLessor={() => setCurrentTab('responsive_ux')}
            />
          )}

          {/* 9. 📲 앱 설치 */}
          {currentTab === 'pwa' && <PwaInstallView />}
        </div>
      </main>

      {/* 우측 하단 플로팅 '집콕 AI 비서' 버튼 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setAutoPlayVoiceOnAiOpen(false);
            setIsAiOpen(true);
          }}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-2xl shadow-blue-500/40 border border-blue-400/40 hover:scale-105 transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-blue-500/80 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span>집콕 AI 비서</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>
      </div>

      {/* 웹 처음 진입 시 질문 프롬프트 */}
      <WelcomeConciergePrompt
        isOpen={showWelcomePrompt}
        onAcceptVoiceBriefing={handleAcceptVoiceBriefing}
        onDeclineRegularFlow={handleDeclineRegularFlow}
      />

      {/* AI 컨시어지 팝업 모달 */}
      <AiConciergeModal
        contract={contract}
        isOpen={isAiOpen}
        onClose={() => {
          setIsAiOpen(false);
          setAutoPlayVoiceOnAiOpen(false);
        }}
        autoPlayVoiceBriefing={autoPlayVoiceOnAiOpen}
      />

      {/* 만족도 설문 조사 모달 */}
      <SatisfactionModal
        isOpen={isSatisfactionOpen}
        onClose={() => setIsSatisfactionOpen(false)}
        contractId={contract.id}
      />
    </div>
  );
}
