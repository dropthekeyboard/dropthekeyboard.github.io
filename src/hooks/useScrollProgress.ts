import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import type { StoryPanel, UseScrollProgressReturn } from '@/types/storytelling';
import { useScenario } from './useScenario';

/**
 * Hook for managing scroll-based progress through story panels
 * This is a read-only preview system that doesn't mutate ScenarioContext progress
 *
 * @param panels Array of story panels to track progress through
 * @returns Scroll progress state and controls
 */
export function useScrollProgress(
  panels: StoryPanel[]
): UseScrollProgressReturn {
  // Initialize scrollProgress with current scroll position instead of 0
  const getInitialScrollProgress = useCallback(() => {
    // Ensure DOM is ready before calculating
    if (typeof window === 'undefined' || !document.documentElement) return 0;

    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    // If scrollHeight is 0 or very small, it might not be ready yet
    if (scrollHeight < 100) return 0;

    return Math.min(scrollTop / scrollHeight, 1);
  }, []);

  const [scrollProgress, setScrollProgress] = useState(
    getInitialScrollProgress
  );
  const [bindScrollToProgress, setBindScrollToProgress] = useState(false);
  const { progressNext, reset, currentScenario } = useScenario();
  const lastStepIndexRef = useRef(-1);
  const isInDemoPanelRef = useRef(false);

  /**
   * Find the current panel based on scroll progress
   */
  const currentPanel = useMemo(() => {
    if (panels.length === 0) return null;

    // Simple calculation: which panel should be active based on scroll
    const panelIndex = Math.floor(scrollProgress * panels.length);
    const clampedIndex = Math.min(Math.max(panelIndex, 0), panels.length - 1);

    return panels[clampedIndex] || panels[0];
  }, [scrollProgress, panels]);

  /**
   * Calculate progress within the current panel (0-1)
   */
  const currentPanelProgress = useMemo(() => {
    if (!currentPanel || panels.length === 0) return 0;

    // Calculate which fraction of the current panel we're in
    const panelIndex = panels.indexOf(currentPanel);
    const panelStartProgress = panelIndex / panels.length;
    const panelEndProgress = (panelIndex + 1) / panels.length;
    const panelRange = panelEndProgress - panelStartProgress;

    if (panelRange === 0) return 0;

    const progressInPanel = (scrollProgress - panelStartProgress) / panelRange;
    return Math.min(Math.max(progressInPanel, 0), 1);
  }, [scrollProgress, currentPanel, panels]);

  /**
   * Calculate preview step information for demo panels
   */
  const previewTotalSteps = useMemo(() => {
    return currentPanel?.type === 'demo' && currentPanel.steps
      ? currentPanel.steps.length
      : 0;
  }, [currentPanel]);

  const previewStepIndex = useMemo(() => {
    if (previewTotalSteps === 0) return 0;
    return Math.min(
      Math.max(Math.floor(currentPanelProgress * previewTotalSteps), 0),
      previewTotalSteps - 1
    );
  }, [currentPanelProgress, previewTotalSteps]);

  /**
   * Reset scenario when entering demo panel
   */
  useEffect(() => {
    if (!bindScrollToProgress || !currentPanel) return;

    const isDemoPanel = currentPanel.type === 'demo';

    // Reset scenario when first entering demo panel
    if (isDemoPanel && !isInDemoPanelRef.current) {
      console.log('Entering demo panel - resetting scenario');
      reset(currentScenario);
      lastStepIndexRef.current = -1;
      isInDemoPanelRef.current = true;
    } else if (!isDemoPanel && isInDemoPanelRef.current) {
      isInDemoPanelRef.current = false;
    }
  }, [currentPanel, bindScrollToProgress, reset, currentScenario]);

  /**
   * Handle scroll-based step progression in demo panel
   */
  useEffect(() => {
    if (!bindScrollToProgress || !currentPanel || currentPanel.type !== 'demo')
      return;

    // Use panel-specific progress for more granular control
    const targetStepIndex = Math.floor(
      currentPanelProgress * (currentPanel.steps?.length || 0)
    );

    if (targetStepIndex !== lastStepIndexRef.current && targetStepIndex >= 0) {
      if (targetStepIndex > lastStepIndexRef.current) {
        // Progressive forward
        const stepsToAdvance = targetStepIndex - lastStepIndexRef.current;
        for (let i = 0; i < stepsToAdvance; i++) {
          progressNext();
        }
      } else if (targetStepIndex < lastStepIndexRef.current) {
        // Backward scroll - reset and replay to target
        reset(currentScenario);
        for (let i = 0; i <= targetStepIndex; i++) {
          progressNext();
        }
      }
      lastStepIndexRef.current = targetStepIndex;
    }
  }, [
    currentPanelProgress,
    currentPanel,
    bindScrollToProgress,
    progressNext,
    reset,
    currentScenario,
  ]);

  /**
   * Throttled scroll event handler using requestAnimationFrame
   */
  const handleScroll = useCallback(() => {
    // Always update scroll progress - demo panels will handle their own step progression
    const scrollTop = window.scrollY;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;

    setScrollProgress(ratio);
  }, []);

  /**
   * Set up scroll event listener with performance optimizations
   */
  useEffect(() => {
    if (!bindScrollToProgress) return;

    let ticking = false;

    const throttledHandler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
    };

    // Use passive listener for better performance
    window.addEventListener('scroll', throttledHandler, { passive: true });

    // Initial calculation with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', throttledHandler);
    };
  }, [bindScrollToProgress, handleScroll]);

  return {
    scrollProgress,
    currentPanel,
    currentPanelProgress,
    previewStepIndex,
    previewTotalSteps,
    bindScrollToProgress,
    setBindScrollToProgress,
  };
}
