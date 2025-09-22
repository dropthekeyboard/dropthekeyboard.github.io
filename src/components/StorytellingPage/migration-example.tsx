import React from 'react';
import { StorytellingPage, type SectionPinningState } from './StorytellingPage';
import { DemoView } from '@/components/DemoView';
import { ScrollControls } from '@/components/ControlHeader/ScrollControls';
import { ScenarioContextProvider } from '@/contexts/scenario';
import { PinningProvider } from '@/contexts/pinning';

// Import existing slide components
import { Slide001 } from '@/components/Slide/Slide001';
import { Slide002 } from '@/components/Slide/Slide002';
import { Slide003 } from '@/components/Slide/Slide003';
// ... import other slides as needed

// Example: Migration from GSAPPinningDemo to StorytellingPage
export function MigratedStorytellingDemo() {
  // Define sections using the new structure
  const sections = [
    // Slide sections (unpinned)
    {
      id: 'slide-001',
      content: (state: SectionPinningState) => <Slide001 />,
      pinned: false,
      className: 'min-h-screen flex items-center justify-center',
    },
    {
      id: 'slide-002',
      content: (state: SectionPinningState) => <Slide002 />,
      pinned: false,
      className: 'min-h-screen flex items-center justify-center',
    },
    {
      id: 'slide-003',
      content: (state: SectionPinningState) => <Slide003 />,
      pinned: true,
      pinEnd: '+=200vh',
      className: 'h-screen flex items-center justify-center',
    },

    // Scenario demo section (pinned)
    {
      id: 'scenario-demo',
      content: (state: SectionPinningState) => (
        <ScenarioContextProvider>
          {/* Pass the pinning state directly to ScrollControls */}
          <ScrollControls
            enabled={state.isActive}
            pinnedState={{
              isPinned: state.isPinned,
              isEntering: state.isEntering,
              isLeaving: state.isLeaving,
            }}
          />
          <DemoView />
        </ScenarioContextProvider>
      ),
      pinned: true,
      pinEnd: '+=500vh',
      className: 'h-screen flex items-center justify-center',
    },

    // More slides...
    {
      id: 'slide-final',
      content: (state: SectionPinningState) => (
        <div className="text-center">
          <h1 className="text-4xl font-bold">Thank You!</h1>
          <p className="text-xl mt-4">A2A의 미래가 시작됩니다</p>
        </div>
      ),
      pinned: false,
      className: 'min-h-screen flex items-center justify-center',
    },
  ];

  // Handle global section state changes (optional)
  const handleSectionStateChange = (sectionIndex: number, state: SectionPinningState) => {
    // Optional: Update global state, analytics, or other side effects
    console.log(`Section ${sectionIndex} state changed:`, state);

    // Example: Could trigger analytics events
    if (state.isEntering) {
      // trackSectionEnter(sections[sectionIndex].id);
    }
  };

  return (
    <PinningProvider>
      <StorytellingPage
        sections={sections}
        onSectionStateChange={handleSectionStateChange}
        className="w-full"
      />
    </PinningProvider>
  );
}

// Alternative: More granular control with individual Section components
export function AdvancedStorytellingDemo() {
  return (
    <PinningProvider>
      <div className="w-full">
        {/* Direct use of Section components for fine-grained control */}
        <Section
          pinned={false}
          className="min-h-screen flex items-center justify-center"
          sectionId="intro"
        >
          {(state) => (
            <div className={`transition-opacity duration-500 ${state.isActive ? 'opacity-100' : 'opacity-75'}`}>
              <Slide001 />
            </div>
          )}
        </Section>

        <Section
          pinned={true}
          pinEnd="+=300vh"
          className="h-screen"
          sectionId="interactive-demo"
          onStateChange={(state) => {
            // Custom logic for this specific section
            if (state.isEntering) {
              console.log('Interactive demo section entered');
            }
          }}
        >
          {(state) => (
            <ScenarioContextProvider>
              <ScrollControls
                enabled={state.isActive}
                pinnedState={{
                  isPinned: state.isPinned,
                  isEntering: state.isEntering,
                  isLeaving: state.isLeaving,
                }}
              />
              <div className="flex items-center justify-center h-full">
                <DemoView />
              </div>
            </ScenarioContextProvider>
          )}
        </Section>

        {/* More sections... */}
      </div>
    </PinningProvider>
  );
}

// Utility: Convert existing slide configuration to new format
export function convertLegacySlidesToSections(slideComponents: any[]) {
  return slideComponents.map((slide, index) => ({
    id: `slide-${index}`,
    content: (state: SectionPinningState) => {
      const Component = slide.Component;
      return <Component />;
    },
    pinned: slide.pinned || false,
    pinEnd: slide.pinEnd || (slide.pinned ? '+=200vh' : undefined),
    className: 'min-h-screen flex items-center justify-center',
  }));
}

// Example usage in App.tsx replacement
export function AppWithNewStorytellingPage() {
  return (
    <div className="app scrollbar-hide">
      <main className="flex-grow overflow-hidden scrollbar-hide">
        <MigratedStorytellingDemo />
      </main>
    </div>
  );
}
