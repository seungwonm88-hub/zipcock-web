import React, { useEffect, useState, useRef } from 'react';
import { X, Minus } from 'lucide-react';

export type AdaptiveModalPresentationMode = 'auto' | 'sheet' | 'modal';

export interface AdaptiveOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  headerBanner?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /**
   * 'auto': 모바일 뷰포트(sm 미만 or 640px 미만)에서는 바텀 시트, 데스크톱에서는 중앙 모달.
   * 'sheet': 강제로 바텀 시트로 렌더링.
   * 'modal': 강제로 데스크톱 모달로 렌더링.
   */
  presentationMode?: AdaptiveModalPresentationMode;
  maxWidthClass?: string; // 예: 'max-w-lg', 'max-w-md', 'max-w-2xl'
  heightClass?: string; // 예: 'h-[640px]' (데스크톱 모달용)
  mobileHeightClass?: string; // 예: 'max-h-[88vh]', 'h-[85vh]'
  showHandleBar?: boolean;
}

/**
 * 모바일용 바텀 시트(Bottom Sheet)와 PC용 모달(Modal) 창을 분리 처리하는 적응형 오버레이 컴포넌트
 */
export const AdaptiveOverlay: React.FC<AdaptiveOverlayProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  headerRight,
  headerBanner,
  children,
  footer,
  presentationMode = 'auto',
  maxWidthClass = 'max-w-lg',
  heightClass = 'h-[640px]',
  mobileHeightClass = 'max-h-[90vh]',
  showHandleBar = true,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 640;
  });

  // 터치 스와이프 드래그 제스처 (바텀시트 닫기)
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [currentTranslateY, setCurrentTranslateY] = useState<number>(0);
  const sheetContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ESC 키 닫기 & 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 바디 스크롤 락
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // 드래그 제스처 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartY === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - dragStartY;
    if (deltaY > 0) {
      setCurrentTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (currentTranslateY > 120) {
      onClose();
    }
    setDragStartY(null);
    setCurrentTranslateY(0);
  };

  if (!isOpen) return null;

  const effectiveIsSheet =
    presentationMode === 'sheet' || (presentationMode === 'auto' && isMobile);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-sm transition-opacity duration-300">
      {/* 배경 백드롭 클릭 시 닫기 */}
      <div 
        className="fixed inset-0 -z-10" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* ========================================================
          1. 모바일 바텀 시트 (Bottom Sheet) 렌더링
         ======================================================== */}
      {effectiveIsSheet ? (
        <div
          ref={sheetContentRef}
          style={{
            transform: currentTranslateY > 0 ? `translateY(${currentTranslateY}px)` : undefined,
            transition: dragStartY === null ? 'transform 0.2s ease-out' : 'none',
          }}
          className={`w-full bg-[#0e1628] rounded-t-[28px] border-t border-slate-700/80 shadow-2xl flex flex-col ${mobileHeightClass} overflow-hidden text-slate-100 animate-slideUp`}
        >
          {/* 바텀시트 제스처 드래그 핸들 바 */}
          {showHandleBar && (
            <div 
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="w-full pt-3 pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing bg-[#090f1d] touch-none select-none"
            >
              <div className="w-12 h-1.5 rounded-full bg-slate-600/80 mb-1" />
              <div className="text-[10px] text-slate-500 font-medium">아래로 스와이프하여 닫기</div>
            </div>
          )}

          {/* 시트 상단 헤더 */}
          <div className="bg-[#090f1d] px-5 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {icon}
              <div className="truncate">
                {typeof title === 'string' ? (
                  <h3 className="font-bold text-sm text-white truncate">{title}</h3>
                ) : (
                  title
                )}
                {subtitle && (
                  <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {headerRight}
              <button
                onClick={onClose}
                aria-label="닫기"
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 상단 옵션 배너 (음성 브리핑 플레이어 등) */}
          {headerBanner}

          {/* 시트 본문 (스크롤) */}
          <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
            {children}
          </div>

          {/* 시트 하단 고정 영역 (입력창 또는 액션 버튼) */}
          {footer && (
            <div className="shrink-0 bg-[#090f1d] border-t border-slate-800 p-3 pb-safe">
              {footer}
            </div>
          )}
        </div>
      ) : (
        /* ========================================================
            2. 데스크톱 모달 (Center Modal) 렌더링
           ======================================================== */
        <div
          className={`w-full ${maxWidthClass} bg-[#0e1628] rounded-2xl border border-slate-700/80 shadow-2xl flex flex-col ${heightClass} overflow-hidden text-slate-100 animate-scaleIn`}
        >
          {/* 모달 상단 헤더 */}
          <div className="bg-[#090f1d] px-5 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {icon}
              <div className="truncate">
                {typeof title === 'string' ? (
                  <h3 className="font-bold text-sm text-white truncate">{title}</h3>
                ) : (
                  title
                )}
                {subtitle && (
                  <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {headerRight}
              <button
                onClick={onClose}
                aria-label="닫기"
                className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 상단 옵션 배너 */}
          {headerBanner}

          {/* 모달 본문 (스크롤) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {children}
          </div>

          {/* 모달 하단 고정 푸터 */}
          {footer && (
            <div className="shrink-0 bg-[#090f1d] border-t border-slate-800 p-3">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
