import { useContext, useMemo } from 'react';
import { GSAPScrollContext, type GSAPScrollState } from '@/contexts/gsapScroll';

/**
 * Hook to access GSAP ScrollTrigger state from SlideGSAPSection context
 * Must be used within a SlideGSAPSection component
 */
export function useGSAPScroll() {
  const context = useContext(GSAPScrollContext);

  if (!context) {
    throw new Error('useGSAPScroll must be used within SlideGSAPSection');
  }

  // 편의 계산값들
  const scrollAmount = useMemo(
    () => Math.round(context.progress * 100),
    [context.progress]
  );

  const isScrollingDown = context.direction > 0;
  const isScrollingUp = context.direction < 0;
  const isStationary = context.direction === 0;

  const scrollSpeed = useMemo(
    () => Math.abs(context.velocity),
    [context.velocity]
  );

  const isRapidScroll = scrollSpeed > 1;
  const isSlowScroll = scrollSpeed < 0.3;

  // 스크롤 방향 문자열
  const scrollDirection = useMemo(() => {
    if (context.direction > 0) return 'down';
    if (context.direction < 0) return 'up';
    return 'stationary';
  }, [context.direction]);

  // 애니메이션 속도 분류
  const animationSpeed = useMemo(() => {
    if (scrollSpeed > 2) return 'fast';
    if (scrollSpeed > 0.5) return 'normal';
    return 'slow';
  }, [scrollSpeed]);

  // 진행도 관련 편의 값들
  const isAtStart = context.progress <= 0.01;
  const isAtEnd = context.progress >= 0.99;
  const isInMiddle = context.progress > 0.01 && context.progress < 0.99;

  return {
    // 원본 GSAP 상태
    ...context,

    // 계산된 편의 값들
    scrollAmount,        // 0-100 백분율
    isScrollingDown,
    isScrollingUp,
    isStationary,
    scrollSpeed,
    isRapidScroll,
    isSlowScroll,
    scrollDirection,     // 'up' | 'down' | 'stationary'
    animationSpeed,      // 'slow' | 'normal' | 'fast'

    // 진행도 관련
    progressPercentage: scrollAmount,
    isAtStart,
    isAtEnd,
    isInMiddle,
  };
}

/**
 * Hook variant that returns null if not within SlideGSAPSection context
 * Useful for optional GSAP integration
 */
export function useOptionalGSAPScroll() {
  const context = useContext(GSAPScrollContext);

  // Always call hooks before any early returns
  const scrollAmount = useMemo(
    () => context ? Math.round(context.progress * 100) : 0,
    [context]
  );

  const scrollSpeed = useMemo(
    () => context ? Math.abs(context.velocity) : 0,
    [context]
  );

  const scrollDirection = useMemo(() => {
    if (!context) return 'stationary';
    if (context.direction > 0) return 'down';
    if (context.direction < 0) return 'up';
    return 'stationary';
  }, [context]);

  const animationSpeed = useMemo(() => {
    if (!context) return 'slow';
    if (scrollSpeed > 2) return 'fast';
    if (scrollSpeed > 0.5) return 'normal';
    return 'slow';
  }, [scrollSpeed, context]);

  if (!context) {
    return null;
  }

  const isScrollingDown = context.direction > 0;
  const isScrollingUp = context.direction < 0;
  const isStationary = context.direction === 0;
  const isRapidScroll = scrollSpeed > 1;
  const isSlowScroll = scrollSpeed < 0.3;

  // 진행도 관련 편의 값들
  const isAtStart = context.progress <= 0.01;
  const isAtEnd = context.progress >= 0.99;
  const isInMiddle = context.progress > 0.01 && context.progress < 0.99;

  return {
    // 원본 GSAP 상태
    ...context,

    // 계산된 편의 값들
    scrollAmount,        // 0-100 백분율
    isScrollingDown,
    isScrollingUp,
    isStationary,
    scrollSpeed,
    isRapidScroll,
    isSlowScroll,
    scrollDirection,     // 'up' | 'down' | 'stationary'
    animationSpeed,      // 'slow' | 'normal' | 'fast'

    // 진행도 관련
    progressPercentage: scrollAmount,
    isAtStart,
    isAtEnd,
    isInMiddle,
  };
}

/**
 * Type definitions for GSAP scroll data
 */
export interface ScrollProgressData {
  progress: number;      // 0-1
  percentage: number;    // 0-100
  direction: 'up' | 'down' | 'stationary';
  velocity: number;
  isRapid: boolean;
}

export interface SectionDisplayState {
  isPinned: boolean;
  scrollProgress: number;
  visualState: 'entering' | 'active' | 'leaving' | 'inactive';
  animationSpeed: 'slow' | 'normal' | 'fast';
}

/**
 * Utility function to create scroll progress data from GSAP state
 */
export function createScrollProgressData(state: GSAPScrollState): ScrollProgressData {
  return {
    progress: state.progress,
    percentage: Math.round(state.progress * 100),
    direction: state.direction > 0 ? 'down' : state.direction < 0 ? 'up' : 'stationary',
    velocity: state.velocity,
    isRapid: Math.abs(state.velocity) > 1,
  };
}

/**
 * Utility function to create section display state from GSAP state
 */
export function createSectionDisplayState(state: GSAPScrollState): SectionDisplayState {
  const visualState = (() => {
    if (!state.isActive) return 'inactive';
    if (state.isEntering) return 'entering';
    if (state.isLeaving) return 'leaving';
    return 'active';
  })();

  const animationSpeed = (() => {
    const speed = Math.abs(state.velocity);
    if (speed > 2) return 'fast';
    if (speed > 0.5) return 'normal';
    return 'slow';
  })();

  return {
    isPinned: state.isPinned,
    scrollProgress: state.progress,
    visualState,
    animationSpeed,
  };
}