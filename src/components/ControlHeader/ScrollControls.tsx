import { useEffect, useRef, useCallback } from 'react';
import { useScenario } from '@/hooks/useScenario';
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
  
  const accumulatedScroll = useRef(0);
  const isInitialized = useRef(false);
  const progressRef = useRef(0);


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

  // Scroll event handler
  useEffect(() => {
    if (!enabled || !isPinned) return;

    const handleScroll = (event: WheelEvent) => {
      const deltaY = event.deltaY;

      // Validate deltaY to prevent NaN
      if (isNaN(deltaY)) {
        console.warn('ScrollControls: Received NaN deltaY, skipping');
        return;
      }


      // Accumulate scroll distance
      accumulatedScroll.current += deltaY;

      // Safely update progress (prevent NaN accumulation)
      const progressIncrement = deltaY / 50;
      if (!isNaN(progressIncrement)) {
        progressRef.current += progressIncrement;
      }

      // Only trigger if we've scrolled enough
      if (Math.abs(accumulatedScroll.current) >= threshold) {
        if (accumulatedScroll.current > 0) {
          // Scrolling down - progress next
          console.log('ScrollControls: Scrolling down, calling progressNext');
          progressNext();
        } else {
          // Scrolling up - revert to previous
          console.log('ScrollControls: Scrolling up, calling revertToPrev');
          revertToPrev();
        }

        // Reset accumulated scroll
        accumulatedScroll.current = 0;
      }
    };

    // Add scroll event listener
    window.addEventListener('wheel', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [enabled, isPinned, threshold, progressNext, revertToPrev]);

  // Default headless behavior - no UI, just functionality
  return null;
}