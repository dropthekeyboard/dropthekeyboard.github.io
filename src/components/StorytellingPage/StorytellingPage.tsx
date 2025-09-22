import React, { useRef, useState, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

// Section pinning state interface
export interface SectionPinningState {
  isActive: boolean;
  isPinned: boolean;
  isEntering: boolean;
  isLeaving: boolean;
}

// Section component props
interface SectionProps {
  children: (state: SectionPinningState) => React.ReactNode;
  pinned?: boolean;
  pinEnd?: string;
  className?: string;
  onStateChange?: (state: SectionPinningState) => void;
  sectionId?: string;
}

// Individual Section component
const Section: React.FC<SectionProps> = ({
  children,
  pinned = false,
  pinEnd = '+=100%',
  className,
  onStateChange,
  sectionId
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [pinningState, setPinningState] = useState<SectionPinningState>({
    isActive: false,
    isPinned: false,
    isEntering: false,
    isLeaving: false
  });

  // Helper function to resolve pinEnd values
  const resolvePinEnd = useCallback((pinEndValue: string): string => {
    if (typeof window === 'undefined') return '+=2000';

    const raw = pinEndValue.trim();

    // Support formats like '+500vh', '+=500vh', '+500vh'
    const vhMatch = raw.match(/^\+\+?=?\s*(\d+(?:\.\d+)?)vh$|^\+\s*(\d+(?:\.\d+)?)vh$/i);
    if (vhMatch) {
      const vh = parseFloat(vhMatch[1] || vhMatch[2]);
      const px = (window.innerHeight * vh) / 100;
      return `+=${px}`;
    }

    // Support formats like '+=3000', '+3000'
    const pxMatch = raw.match(/^\+=\s*(\d+(?:\.\d+)?)$/) || raw.match(/^\+(\d+(?:\.\d+)?)$/);
    if (pxMatch) {
      return `+=${parseFloat(pxMatch[1])}`;
    }

    return raw; // Return as-is if no pattern matches
  }, []);

  useGSAP(() => {
    if (!container.current) return;

    const scrollerEl = document.getElementById('root') || undefined;
    const resolvedPinEnd = resolvePinEnd(pinEnd);

    const trigger = ScrollTrigger.create({
      trigger: container.current,
      start: 'top top',
      end: pinned ? resolvedPinEnd : 'bottom top',
      pin: pinned,
      pinSpacing: pinned,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      scroller: scrollerEl,
      markers: process.env.NODE_ENV === 'development' && !!sectionId,
      id: sectionId ? `section-${sectionId}` : undefined,
      onToggle: (self) => {
        const newState: SectionPinningState = {
          isActive: self.isActive,
          isPinned: pinned && self.isActive,
          isEntering: self.isActive && self.direction === 1,
          isLeaving: !self.isActive && self.direction === -1,
        };

        setPinningState(newState);
        onStateChange?.(newState);

        if (process.env.NODE_ENV === 'development' && sectionId) {
          console.log(`Section ${sectionId}:`, newState);
        }
      },
      onUpdate: (self) => {
        // Optional: Provide progress updates for fine-grained control
        if (pinned && self.isActive) {
          const progress = self.progress;
          // Could emit progress events here if needed
          if (process.env.NODE_ENV === 'development' && sectionId) {
            console.log(`Section ${sectionId} progress:`, progress);
          }
        }
      }
    });

    // Cleanup function - useGSAP handles this automatically, but being explicit
    return () => {
      trigger.kill();
    };
  }, {
    scope: container,
    dependencies: [pinned, pinEnd, sectionId],
    revertOnUpdate: true // Ensures clean state on dependency changes
  });

  return (
    <div ref={container} className={cn('w-full', className)}>
      {children(pinningState)}
    </div>
  );
};

// Main StorytellingPage props
interface StorytellingPageProps {
  sections: {
    content: (state: SectionPinningState) => React.ReactNode;
    pinned?: boolean;
    pinEnd?: string;
    className?: string;
    id?: string;
  }[];
  onSectionStateChange?: (sectionIndex: number, state: SectionPinningState) => void;
  className?: string;
}

// Main StorytellingPage component
export const StorytellingPage: React.FC<StorytellingPageProps> = ({
  sections,
  onSectionStateChange,
  className
}) => {
  // Track all section states for global coordination if needed
  const [sectionStates, setSectionStates] = useState<SectionPinningState[]>(() =>
    sections.map(() => ({
      isActive: false,
      isPinned: false,
      isEntering: false,
      isLeaving: false
    }))
  );

  // Handle individual section state changes
  const handleSectionStateChange = useCallback((index: number, state: SectionPinningState) => {
    setSectionStates(prev => {
      const newStates = [...prev];
      newStates[index] = state;
      return newStates;
    });

    onSectionStateChange?.(index, state);
  }, [onSectionStateChange]);

  // Memoize sections to prevent unnecessary re-renders
  const memoizedSections = useMemo(() => sections, [sections]);

  // Refresh ScrollTrigger when sections change
  useGSAP(() => {
    ScrollTrigger.refresh();
  }, { dependencies: [memoizedSections.length] });

  return (
    <div className={cn('w-full', className)}>
      {memoizedSections.map((section, index) => (
        <Section
          key={section.id || index}
          pinned={section.pinned}
          pinEnd={section.pinEnd}
          className={section.className}
          sectionId={section.id || `section-${index}`}
          onStateChange={(state) => handleSectionStateChange(index, state)}
        >
          {section.content}
        </Section>
      ))}
    </div>
  );
};

// Export the Section component for direct use if needed
export { Section };

// Helper hook for easier integration with existing patterns
export const useStorytellingSection = (sectionIndex: number, sections: StorytellingPageProps['sections']) => {
  const [currentState, setCurrentState] = useState<SectionPinningState>({
    isActive: false,
    isPinned: false,
    isEntering: false,
    isLeaving: false
  });

  const handleStateChange = useCallback((index: number, state: SectionPinningState) => {
    if (index === sectionIndex) {
      setCurrentState(state);
    }
  }, [sectionIndex]);

  return {
    state: currentState,
    onSectionStateChange: handleStateChange
  };
};
