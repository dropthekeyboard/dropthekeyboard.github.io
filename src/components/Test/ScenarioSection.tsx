import React from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DemoView } from '../DemoView';
import { ScenarioContextProvider } from '@/contexts/scenario';
import { ScenarioLoader } from '../ControlHeader/ScenarioLoader';
import { ScrollControls } from '../ControlHeader/ScrollControls';
import { useSectionPinning } from '@/contexts/pinning';

interface ScenarioSectionProps {
  sectionIndex: number;
  scenarioId: string;
  title: string;
  agentStyle?: 'minimal' | 'formal' | 'hacker' | 'reasoning';
}

export const ScenarioSection = React.forwardRef<HTMLDivElement, ScenarioSectionProps>(
  ({ sectionIndex, scenarioId, title }, ref) => {
    const { state } = useSectionPinning(sectionIndex);

    return (
      <section
        ref={ref}
        className="h-screen overflow-hidden flex items-center justify-center bg-background w-full"
        aria-label={title}
      >
        <div className="w-full max-w-7xl px-4">
          <div className="w-full">
            <ScenarioContextProvider>
              <div className="mb-4">
                <h2 className="text-2xl font-bold mb-2 text-foreground">{title}</h2>
                <ScenarioLoader
                  initialScenarioId={scenarioId}
                  onScenarioLoaded={(id) => {
                    console.log(`Scenario ${id} loaded - ${title}`);
                    // 시나리오 로드로 DOM 높이가 바뀌었을 수 있으므로 재계산
                    requestAnimationFrame(() => ScrollTrigger.refresh());
                  }}
                  onScenarioError={(error) =>
                    console.error(`Scenario load error for ${title}: ${error}`)
                  }
                />
              </div>
              <ScrollControls
                enabled={true}
                threshold={30}
                pinnedState={state}
                autoScrollThreshold={50}
              />
              <DemoView />
            </ScenarioContextProvider>
          </div>
        </div>
      </section>
    );
  }
);

ScenarioSection.displayName = 'ScenarioSection';