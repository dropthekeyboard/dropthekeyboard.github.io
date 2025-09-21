import { useState, useEffect, useCallback } from 'react';
import { usePinning } from '@/contexts/pinning';
import type { ProgressNode, UseTestScrollProgressReturn } from '@/types/test';

export function useTestScrollProgress(
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>,
  sectionsLength: number
): UseTestScrollProgressReturn {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { states } = usePinning();

  // IntersectionObserver for current active section tracking
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRefs.current.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio
        let maxRatio = 0;
        let activeIndex = 0;

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            const index = sectionRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) {
              maxRatio = entry.intersectionRatio;
              activeIndex = index;
            }
          }
        });

        if (maxRatio > 0.1) { // Only update if there's meaningful intersection
          setCurrentSectionIndex(activeIndex);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0],
        rootMargin: '-10% 0px -10% 0px' // Adjust trigger area
      }
    );

    // Observe all section refs
    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [sectionRefs, sectionsLength]);

  // Calculate overall scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = documentHeight > 0 ? scrollTop / documentHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update progress nodes with current state
  const updateProgressNodes = useCallback(
    (nodes: ProgressNode[]): ProgressNode[] => {
      return nodes.map((node, index) => {
        // Use pinning state if available, otherwise fall back to intersection-based tracking
        const sectionState = states[index];
        const isActive = sectionState?.isPinned || index === currentSectionIndex;

        return {
          ...node,
          isActive,
          isCompleted: index < currentSectionIndex,
        };
      });
    },
    [currentSectionIndex, states]
  );

  return {
    currentSectionIndex,
    scrollProgress,
    updateProgressNodes,
  };
}