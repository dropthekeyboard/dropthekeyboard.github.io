import { createContext } from 'react';

/**
 * GSAP ScrollTrigger state interface
 */
export interface GSAPScrollState {
  // GSAP ScrollTrigger 원본 데이터
  progress: number;        // self.progress (0-1)
  direction: number;       // self.direction (1: forward, -1: backward, 0: stationary)
  velocity: number;        // self.velocity (스크롤 속도)
  isActive: boolean;       // self.isActive (ScrollTrigger 활성 상태)
  start: number;          // self.start (시작 위치)
  end: number;            // self.end (종료 위치)

  // GSAP Pinning 상태
  isPinned: boolean;       // pin 활성 상태
  isEntering: boolean;     // 진입 상태
  isLeaving: boolean;      // 떠나는 상태

  // 계산된 편의 값들
  percentage: number;      // progress * 100 (0-100%)
  isScrollingDown: boolean; // direction > 0
  isScrollingUp: boolean;   // direction < 0
  isRapidScroll: boolean;   // Math.abs(velocity) > 1

  // 메타데이터
  lastUpdate: number;      // 마지막 업데이트 타임스탬프
}

/**
 * GSAP ScrollTrigger Context
 * SlideGSAPSection에서 제공하는 실시간 GSAP 상태
 */
export const GSAPScrollContext = createContext<GSAPScrollState | null>(null);