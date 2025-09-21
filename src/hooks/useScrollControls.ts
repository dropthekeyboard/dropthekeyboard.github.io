import { useEffect, useRef } from 'react';

interface UseScrollControlsOptions {
  enabled?: boolean;
  threshold?: number;
  isPinned?: boolean;
  onProgressNext: () => void;
  onRevertToPrev: () => void;
}

/**
 * Custom hook for handling scroll-based controls with both wheel and touch support
 * Supports desktop (wheel) and mobile (touch) scrolling with duplicate event prevention
 */
export function useScrollControls({
  enabled = true,
  threshold = 30,
  isPinned = false,
  onProgressNext,
  onRevertToPrev,
}: UseScrollControlsOptions) {
  const accumulatedScroll = useRef(0);
  const touchStartY = useRef<number | null>(null);
  const isProcessingGesture = useRef(false);

  useEffect(() => {
    if (!enabled || !isPinned) return;

    const handleWheel = (event: WheelEvent) => {
      const deltaY = event.deltaY;

      // Validate deltaY to prevent NaN
      if (isNaN(deltaY)) {
        console.warn('useScrollControls: Received NaN deltaY, skipping');
        return;
      }

      // Skip if currently processing touch gesture to prevent duplication
      if (isProcessingGesture.current) return;

      // Accumulate scroll distance
      accumulatedScroll.current += deltaY;

      // Only trigger if we've scrolled enough
      if (Math.abs(accumulatedScroll.current) >= threshold) {
        if (accumulatedScroll.current > 0) {
          // Scrolling down - progress next
          console.log('useScrollControls: Scrolling down, calling progressNext');
          onProgressNext();
        } else {
          // Scrolling up - revert to previous
          console.log('useScrollControls: Scrolling up, calling revertToPrev');
          onRevertToPrev();
        }

        // Reset accumulated scroll
        accumulatedScroll.current = 0;
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (isProcessingGesture.current) return;
      touchStartY.current = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!touchStartY.current || isProcessingGesture.current) return;

      const currentY = event.touches[0].clientY;
      const deltaY = touchStartY.current - currentY; // Positive = scroll down

      // Accumulate touch scroll distance
      accumulatedScroll.current += deltaY;

      // Update touch start position for continuous tracking
      touchStartY.current = currentY;

      // Only trigger if we've scrolled enough
      if (Math.abs(accumulatedScroll.current) >= threshold) {
        isProcessingGesture.current = true; // Prevent wheel events during touch

        if (accumulatedScroll.current > 0) {
          // Touch scrolling down - progress next
          console.log('useScrollControls: Touch scrolling down, calling progressNext');
          onProgressNext();
        } else {
          // Touch scrolling up - revert to previous
          console.log('useScrollControls: Touch scrolling up, calling revertToPrev');
          onRevertToPrev();
        }

        // Reset accumulated scroll
        accumulatedScroll.current = 0;
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
      // Reset gesture flag after a short delay to allow wheel events again
      setTimeout(() => {
        isProcessingGesture.current = false;
      }, 100);
    };

    // Add event listeners with passive: false for iOS compatibility
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, isPinned, onProgressNext, onRevertToPrev]);

  // Return accumulated scroll for potential debugging or external use
  return {
    accumulatedScroll: accumulatedScroll.current,
  };
}