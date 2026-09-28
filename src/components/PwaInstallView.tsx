import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle, Monitor, Shield, Zap } from 'lucide-react';

export const PwaInstallView: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('이미 설치되어 있거나 브라우저 메뉴의 [홈 화면에 추가] 또는 [앱 설치]를 통해 바로 설치하실 수 있습니다.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 text-slate-100 space-y-8">
      <div className="space-y-2 text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <Smartphone className="w-3.5 h-3.5" />
          <span>Progressive Web App (PWA)</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          집콕재계약 모바일 & 데스크톱 앱 설치
        </h2>
        <p className="text-slate-400 text-xs md:text-sm">
          앱스토어 방문 없이 홈 화면에 바로 설치하여 네이티브 앱처럼 빠르고 안전하게 이용하세요.
        </p>
      </div>

      <div className="bg-[#0e1628] rounded-2xl border border-slate-800 p-8 space-y-6 shadow-xl text-center">
        <div className="w-20 h-20 rounded-2xl bg-black border border-slate-700 flex items-center justify-center font-bold text-white shadow-2xl text-3xl mx-auto">
          집
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">집콕재계약 바로 설치</h3>
          <p className="text-xs text-slate-400">
            오프라인 모드 지원 · 초고속 로딩 · 계약서 PDF 즉시 보관
          </p>
        </div>

        <button
          onClick={handleInstallClick}
          className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2 mx-auto cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>홈 화면에 앱 설치하기</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-left pt-6 border-t border-slate-800">
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <strong className="block text-white">1초 실행</strong>
            <span className="text-slate-400">브라우저 주소창 없이 앱처럼 독립 실행</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <Shield className="w-4 h-4 text-emerald-400" />
            <strong className="block text-white">보안 스토리지</strong>
            <span className="text-slate-400">작성 중인 계약서 암호화 로컬 캐싱</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
            <Monitor className="w-4 h-4 text-blue-400" />
            <strong className="block text-white">크로스 플랫폼</strong>
            <span className="text-slate-400">Windows, Mac, iOS, Android 완벽 호환</span>
          </div>
        </div>
      </div>
    </div>
  );
};
