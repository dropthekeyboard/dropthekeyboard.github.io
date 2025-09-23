import { useEffect, useRef, useMemo } from 'react';
import { useScenario } from '@/hooks/useScenario';
import { useScrollControls } from '@/hooks/useScrollControls';
import { useOptionalGSAPScroll } from '@/hooks/useGSAPScroll';
import type { SectionPinningState } from '@/contexts/pinning';

interface ScrollControlsProps {
  /**
   * Whether to enable scroll-based controls
   */
  enabled?: boolean;
  /**
   * Scroll threshold for triggering actions (in pixels)
   */
  threshold?: number;
  /**
   * Pinning state from parent component (fallback if not in GSAP context)
   */
  pinnedState?: SectionPinningState;
  /**
   * Whether to use enhanced GSAP scroll data when available
   */
  useGSAPData?: boolean;
}

/**
 * Enhanced headless scroll-based controls that can use GSAP ScrollTrigger data when available.
 * Automatically calls progressNext on scroll down and revertToPrev on scroll up.
 * Calls reset when component mounts.
 */
export function ScrollControls({
  enabled = true,
  threshold = 30,
  pinnedState,
  useGSAPData = true,
}: ScrollControlsProps) {
  const { progressNext, revertToPrev, reset, currentScenario } = useScenario();

  // Always call the hook, but use the data conditionally
  const gsapScrollData = useOptionalGSAPScroll();
  const shouldUseGsapData = useGSAPData && gsapScrollData;

  // Determine which data source to use
  const scrollData = useMemo(() => {
    if (shouldUseGsapData) {
      // Use enhanced GSAP data
      return {
        isPinned: gsapScrollData?.isPinned || false,
        isEntering: gsapScrollData?.isEntering || false,
        isLeaving: gsapScrollData?.isLeaving || false,
        scrollSpeed: gsapScrollData?.scrollSpeed || 0,
        scrollProgress: gsapScrollData?.scrollAmount || 0,
        isScrollingDown: gsapScrollData?.isScrollingDown || false,
        source: 'gsap' as const,
      };
    } else if (pinnedState) {
      // Fallback to traditional pinned state
      return {
        isPinned: pinnedState.isPinned,
        isEntering: pinnedState.isEntering,
        isLeaving: pinnedState.isLeaving,
        scrollSpeed: 0,
        scrollProgress: 0,
        isScrollingDown: false,
        source: 'pinning' as const,
      };
    } else {
      // Default state
      return {
        isPinned: false,
        isEntering: false,
        isLeaving: false,
        scrollSpeed: 0,
        scrollProgress: 0,
        isScrollingDown: false,
        source: 'default' as const,
      };
    }
  }, [shouldUseGsapData, gsapScrollData, pinnedState]);

  // Dynamic threshold based on scroll speed (if GSAP data available)
  const dynamicThreshold = useMemo(() => {
    if (scrollData.source === 'gsap' && scrollData.scrollSpeed > 1) {
      // Faster scroll = more sensitive threshold
      return threshold * 0.5;
    }
    return threshold;
  }, [threshold, scrollData.scrollSpeed, scrollData.source]);

  const isInitialized = useRef(false);

  // Use the custom scroll controls hook with dynamic threshold
  useScrollControls({
    enabled: enabled && scrollData.isPinned,
    threshold: dynamicThreshold,
    isPinned: scrollData.isPinned,
    onProgressNext: progressNext,
    onRevertToPrev: revertToPrev,
  });

  // Reset on mount
  useEffect(() => {
    if (!isInitialized.current) {
      reset(currentScenario);
      isInitialized.current = true;
    }
  }, [reset, currentScenario]);

  // Enhanced logging with scroll data source
  useEffect(() => {
    if (scrollData.isEntering) {
      console.log(`ScrollControls: Pinning started (${scrollData.source}) - enabling scroll controls`);
      if (scrollData.source === 'gsap') {
        console.log(`  Progress: ${scrollData.scrollProgress}%, Speed: ${scrollData.scrollSpeed.toFixed(2)}`);
      }
    }
    if (scrollData.isLeaving) {
      console.log(`ScrollControls: Pinning ended (${scrollData.source}) - disabling scroll controls`);
    }
  }, [scrollData.isEntering, scrollData.isLeaving, scrollData.source, scrollData.scrollProgress, scrollData.scrollSpeed]);

  // Log threshold changes
  useEffect(() => {
    if (scrollData.source === 'gsap' && dynamicThreshold !== threshold) {
      console.log(`ScrollControls: Dynamic threshold adjusted to ${dynamicThreshold}px (speed: ${scrollData.scrollSpeed.toFixed(2)})`);
    }
  }, [dynamicThreshold, threshold, scrollData.source, scrollData.scrollSpeed]);

  return null;
}
