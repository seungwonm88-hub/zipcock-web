import React, { useState } from 'react';
import { Palette, Type, Layout, ShieldCheck, Check, Sparkles, Smartphone, Monitor, Layers, ArrowDown } from 'lucide-react';
import { AdaptiveOverlay } from './AdaptiveOverlay';

export const DesignSystemView: React.FC = () => {
  const [demoSheetOpen, setDemoSheetOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 text-slate-100 space-y-8">
      {/* 타이틀 */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Palette className="w-3.5 h-3.5" />
          <span>집콕재계약 UI/UX 디자인 시스템 & 컴포넌트 아키텍처</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          신뢰를 설계하는 프롭테크 디자인 언어
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          어렵고 딱딱한 부동산 법률 문서를 인지 부담 없는 대화형 카드 선택 구조(Conversational Q&A UI)와 모바일/PC 분리 적응형 오버레이로 구축했습니다.
        </p>
      </div>

      {/* 모바일 바텀시트 vs PC 모달 분리 컴포넌트 설계 쇼케이스 */}
      <div className="bg-[#0e1628] rounded-2xl border border-blue-500/30 p-6 space-y-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                모바일용 시트(Bottom Sheet) & PC용 모달(Modal) 분리 설계
                <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                  AdaptiveOverlay
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                디바이스 폼팩터 및 인터랙션 모델(Touch vs Mouse)에 최적화된 이중 렌더링 아키텍처
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDemoModalOpen(true)}
              className="px-3 py-1.5 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>PC 모달 체험</span>
            </button>
            <button
              onClick={() => setDemoSheetOpen(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>모바일 시트 체험</span>
            </button>
          </div>
        </div>

        {/* 아키텍처 비교 표 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5 text-sm">
                <Smartphone className="w-4 h-4" />
                모바일용 바텀 시트 (Bottom Sheet)
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-1.5 py-0.5 rounded">
                Touch First
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">·</span>
                <span><strong>엄지손가락 인체공학적 조작:</strong> 화면 하단 85~90vh 높이로 배치하여 한 손 조작성 극대화</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">·</span>
                <span><strong>제스처 드래그 닫기:</strong> 상단 핸들바 터치 후 아래로 스와이프하면 부드럽게 닫힘 지원</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">·</span>
                <span><strong>부드러운 슬라이드업:</strong> 스프링 큐빅 베지어(.animate-slideUp) 전환 애니메이션 적용</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-400">·</span>
                <span><strong>iOS/안드로이드 Safe Area:</strong> 최하단 터치바 겹침 방지 (pb-safe 토큰 내장)</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 text-sm">
                <Monitor className="w-4 h-4" />
                PC용 중앙 모달 (Center Modal)
              </span>
              <span className="text-[10px] bg-blue-500/10 text-blue-300 border border-blue-500/20 px-1.5 py-0.5 rounded">
                Keyboard & Pointer
              </span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">·</span>
                <span><strong>화면 중앙 집중 구조:</strong> 1920x1080 와이드 뷰에서 시선 분산 방지 및 중앙 집중 다이얼로그</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">·</span>
                <span><strong>단축키 및 포커스:</strong> ESC 키 누름 시 즉시 닫기 및 백드롭 오버레이 클릭 해제</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">·</span>
                <span><strong>스케일 줌 애니메이션:</strong> 0.95배율에서 1배율로 확장되는 쾌적한 데스크톱 트랜지션</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-400">·</span>
                <span><strong>넓은 정보 수용도:</strong> max-w-lg(512px) 및 고정 스크롤 영역으로 법률 스크립트 가독성 증대</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 컬러 시스템 */}
      <div className="bg-[#0e1628] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-400" />
          컬러 팔레트 및 시맨틱 토큰
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-[#0e1628] border border-slate-700 flex items-end p-2 text-[10px] font-mono text-slate-400">
              #0E1628
            </div>
            <div className="font-bold text-slate-200">Deep Slate (Background)</div>
            <p className="text-[11px] text-slate-500">안정감과 신뢰를 주는 딥 네이비 배경</p>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-blue-600 flex items-end p-2 text-[10px] font-mono text-white">
              #2563EB (Primary)
            </div>
            <div className="font-bold text-blue-400">Trust Blue (Primary)</div>
            <p className="text-[11px] text-slate-500">법적 효력과 공인 인증의 상징</p>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-emerald-600 flex items-end p-2 text-[10px] font-mono text-white">
              #059669 (Safe)
            </div>
            <div className="font-bold text-emerald-400">Safe Emerald</div>
            <p className="text-[11px] text-slate-500">5% 상한 준수 및 등기 안전 상태</p>
          </div>

          <div className="space-y-2">
            <div className="h-16 rounded-xl bg-amber-500 flex items-end p-2 text-[10px] font-mono text-slate-950 font-bold">
              #F59E0B (Notice)
            </div>
            <div className="font-bold text-amber-400">Notice Amber</div>
            <p className="text-[11px] text-slate-500">계약갱신요구권 행사 및 알림 강조</p>
          </div>
        </div>
      </div>

      {/* 일상어 라이팅 가이드 */}
      <div className="bg-[#0e1628] rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Type className="w-4 h-4 text-emerald-400" />
          일상어 라이팅 가이드 (부동산 법률어 ➔ 친절한 일상어 변환)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3">기존 어려운 법률 용어</th>
                <th className="py-2.5 px-3 text-blue-400 font-bold">집콕재계약 일상어 UI 라이팅</th>
                <th className="py-2.5 px-3">사용자 인지 효과</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="py-3 px-3 font-medium text-slate-400">차임증감청구권 행사 기준</td>
                <td className="py-3 px-3 font-bold text-emerald-400">법정 5% 상한 자동 계산</td>
                <td className="py-3 px-3 text-slate-400">계산 착오 및 분쟁 원천 방지</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-slate-400">주택임대차보호법 제6조의3 계약갱신요구권</td>
                <td className="py-3 px-3 font-bold text-amber-400">계약갱신청구권 이번에 행사 (2년 보장)</td>
                <td className="py-3 px-3 text-slate-400">권리 행사 여부를 명확히 박제</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-slate-400">제한물권 설정 금지 특약</td>
                <td className="py-3 px-3 font-bold text-blue-400">선순위 근저당 설정 금지 (보증금 보호)</td>
                <td className="py-3 px-3 text-slate-400">대출 발생 시 위험을 직관적 인지</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-medium text-slate-400">부동산 직거래 합의서 교부</td>
                <td className="py-3 px-3 font-bold text-white">카카오톡 3분 알림톡 전자서명</td>
                <td className="py-3 px-3 text-slate-400">대면 부담 제로, 빠른 수락 유도</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 데모용 바텀시트 오버레이 */}
      <AdaptiveOverlay
        isOpen={demoSheetOpen}
        onClose={() => setDemoSheetOpen(false)}
        presentationMode="sheet"
        title="모바일 바텀 시트 (Bottom Sheet) 컴포넌트"
        subtitle="상단 핸들바를 아래로 쓸어내려 닫을 수 있습니다"
        icon={<Smartphone className="w-5 h-5 text-amber-400" />}
        footer={
          <button
            onClick={() => setDemoSheetOpen(false)}
            className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
          >
            확인 및 시트 닫기
          </button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">모바일 최적화 바텀 시트 특징</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              모바일 기기에서는 엄지손가락 반경에 핵심 액션과 헤더가 가깝게 배치되는 바텀 시트가 모달 대비 터치 피로도를 70% 이상 경감시킵니다.
            </p>
          </div>
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">스와이프 다운 제스처</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              시트 상단 드래그 바를 터치하여 아래로 내리면 제스처를 감지하여 자연스럽게 퇴장합니다.
            </p>
          </div>
        </div>
      </AdaptiveOverlay>

      {/* 데모용 모달 오버레이 */}
      <AdaptiveOverlay
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        presentationMode="modal"
        title="PC용 데스크톱 모달 (Center Modal) 컴포넌트"
        subtitle="키보드 ESC 키 또는 우측 X 버튼으로 닫을 수 있습니다"
        icon={<Monitor className="w-5 h-5 text-blue-400" />}
        footer={
          <button
            onClick={() => setDemoModalOpen(false)}
            className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
          >
            확인 및 모달 닫기
          </button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">PC 와이드 화면 중앙 모달 특징</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              1920x1080 이상의 데스크톱 해상도에서는 화면 중앙에 컴팩트하게 포커스를 주는 다이얼로그 형태로 렌더링되어 사용자의 시선 이탈을 방지합니다.
            </p>
          </div>
        </div>
      </AdaptiveOverlay>
    </div>
  );
};
