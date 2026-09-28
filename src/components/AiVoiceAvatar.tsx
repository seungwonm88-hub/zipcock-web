/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Bot, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';

export type ImportanceLevel = 'calm' | 'important' | 'critical';

export interface AiVoiceAvatarProps {
  isPlaying: boolean;
  isPaused?: boolean;
  importance?: ImportanceLevel;
  currentClauseName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AiVoiceAvatar: React.FC<AiVoiceAvatarProps> = ({
  isPlaying,
  isPaused = false,
  importance = 'calm',
  currentClauseName,
  size = 'md',
  className = '',
}) => {
  // 크기별 스타일 매핑
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-2xl text-sm',
    lg: 'w-12 h-12 rounded-2xl text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // 중요도별 아우라 및 배경 색상
  const getImportanceStyles = () => {
    if (!isPlaying) {
      return {
        bg: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white',
        haloBorder: 'border-blue-500/20',
        haloGlow: 'bg-blue-500/10',
        animationClass: '',
        badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
        label: '대기 중',
      };
    }

    if (isPaused) {
      return {
        bg: 'bg-gradient-to-tr from-amber-600 to-slate-700 text-white opacity-85',
        haloBorder: 'border-amber-500/30',
        haloGlow: 'bg-amber-500/10',
        animationClass: '',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        label: '일시정지',
      };
    }

    switch (importance) {
      case 'critical': // 보증금 5% 상한 준수, 선순위 근저당 설정 금지, 권리 하자 즉시 해제 등 법적 최우선 항목
        return {
          bg: 'bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-xl shadow-amber-500/40',
          haloBorder: 'border-amber-400/60',
          haloGlow: 'bg-amber-500/25',
          animationClass: 'animate-ai-breath-critical',
          badgeBg: 'bg-amber-500 text-slate-950 font-black border-amber-400',
          label: '핵심 법정 조항 브리핑',
        };
      case 'important': // 계약갱신요구권 행사, 보증보험 협조 특약
        return {
          bg: 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30',
          haloBorder: 'border-emerald-400/50',
          haloGlow: 'bg-emerald-500/20',
          animationClass: 'animate-ai-breath-important',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
          label: '안심 특약 권리 브리핑',
        };
      case 'calm': // 기본 계약 소재지 및 당사자 개요 안내
      default:
        return {
          bg: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-blue-500/30',
          haloBorder: 'border-blue-400/40',
          haloGlow: 'bg-blue-500/15',
          animationClass: 'animate-ai-breath-calm',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          label: '계약 개요 낭독',
        };
    }
  };

  const style = getImportanceStyles();

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* 1. 가장 외곽 부드러운 다중 발광 링 (호흡 시 파동 확장) */}
      {isPlaying && !isPaused && (
        <>
          <div
            className={`absolute -inset-2.5 rounded-3xl ${style.haloGlow} border ${style.haloBorder} animate-pulse-halo pointer-events-none transition-all duration-700 blur-[2px]`}
          />
          <div
            className={`absolute -inset-1 rounded-2xl ${style.haloBorder} border animate-ping pointer-events-none opacity-20 duration-1000`}
          />
        </>
      )}

      {/* 2. 중앙 아바타 본체 (호흡 애니메이션 클래스 적용) */}
      <div
        className={`${sizeClasses[size]} ${style.bg} ${style.animationClass} flex items-center justify-center relative z-10 transition-all duration-500 select-none shadow-md`}
      >
        <Bot className={`${iconSizes[size]} transition-transform duration-300 ${isPlaying && !isPaused ? 'scale-110' : ''}`} />

        {/* 재생 중일 때 우측 상단 반짝임 파티클 인디케이터 */}
        {isPlaying && !isPaused && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                importance === 'critical'
                  ? 'bg-amber-400'
                  : importance === 'important'
                  ? 'bg-emerald-400'
                  : 'bg-cyan-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 border-2 border-slate-950 ${
                importance === 'critical'
                  ? 'bg-amber-400'
                  : importance === 'important'
                  ? 'bg-emerald-400'
                  : 'bg-cyan-400'
              }`}
            />
          </span>
        )}
      </div>
    </div>
  );
};
