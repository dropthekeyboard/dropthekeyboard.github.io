import { useEffect, useRef } from 'react';
import { useScenario } from '@/hooks/useScenario';
import { usePinning } from '@/hooks/usePinning';

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
   * Custom render function for the controls UI
   */
  children?: (props: {
    onPrev: () => void;
    onNext: () => void;
    onReset: () => void;
  }) => React.ReactNode;
}

/**
 * Headless scroll-based controls that trigger scenario progress based on scroll direction.
 * Automatically calls progressNext on scroll down and revertToPrev on scroll up.
 * Calls reset when component mounts.
 */
export function ScrollControls({
  enabled = true,
  threshold = 30,
  children
}: ScrollControlsProps) {
  const { progressNext, revertToPrev, reset, currentScenario } = useScenario();
  const { isPinned, isEntering, isLeaving } = usePinning();
  const accumulatedScroll = useRef(0);
  const isInitialized = useRef(false);

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

      // Accumulate scroll distance
      accumulatedScroll.current += Math.abs(deltaY);

      // Only trigger if we've scrolled enough
      if (accumulatedScroll.current >= threshold) {
        if (deltaY > 0) {
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

  const handleReset = () => {
    reset(currentScenario);
    accumulatedScroll.current = 0;
  };

  const handleManualNext = () => {
    progressNext();
  };

  const handleManualPrev = () => {
    revertToPrev();
  };

  // If children is provided, use it as render prop
  if (children) {
    return (
      <>
        {children({
          onPrev: handleManualPrev,
          onNext: handleManualNext,
          onReset: handleReset,
        })}
      </>
    );
  }

  // Default headless behavior - no UI, just functionality
  return null;
}