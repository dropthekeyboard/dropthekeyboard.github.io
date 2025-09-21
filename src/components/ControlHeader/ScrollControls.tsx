import { useEffect, useRef } from 'react';
import { useScenario } from '@/hooks/useScenario';
import { useScrollControls } from '@/hooks/useScrollControls';
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
   * Pinning state from parent component
   */
  pinnedState?: SectionPinningState;
  /**
   * Threshold for detecting auto-scroll patterns (in pixels)
   */
  autoScrollThreshold?: number;
}

/**
 * Headless scroll-based controls that trigger scenario progress based on scroll direction.
 * Automatically calls progressNext on scroll down and revertToPrev on scroll up.
 * Calls reset when component mounts.
 */
export function ScrollControls({
  enabled = true,
  threshold = 30,
  pinnedState,
}: ScrollControlsProps) {
  const { progressNext, revertToPrev, reset, currentScenario } = useScenario();
  
  // pinnedState가 전달되면 사용하고, 없으면 기본값 사용
  const { isPinned, isEntering, isLeaving } = pinnedState || { 
    isPinned: false, 
    isEntering: false, 
    isLeaving: false 
  };
  
  const isInitialized = useRef(false);

  // Use the custom scroll controls hook
  useScrollControls({
    enabled,
    threshold,
    isPinned,
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

  // Log pinning state changes
  useEffect(() => {
    if (isEntering) {
      console.log('ScrollControls: Pinning started - enabling scroll controls');
    }
    if (isLeaving) {
      console.log('ScrollControls: Pinning ended - disabling scroll controls');
    }
  }, [isEntering, isLeaving]);

  // Default headless behavior - no UI, just functionality
  return null;

  // Default headless behavior - no UI, just functionality
  return null;
}