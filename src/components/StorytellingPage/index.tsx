import { useEffect, useMemo } from 'react';
import { useScenario } from '@/hooks/useScenario';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import type { StoryPanel } from '@/types/storytelling';
import { ScrollProgressIndicator } from './ScrollProgressIndicator';
import { PanelContainer } from './PanelContainer';
import { IntroPanel, DemoPanel, SummaryPanel } from './panels';

interface StorytellingPageProps {
  agentStyle: 'minimal' | 'formal' | 'hacker';
}

export function StorytellingPage({ agentStyle }: StorytellingPageProps) {
  const { currentScenario } = useScenario();

  // Create story panels based on current scenario
  const storyPanels: StoryPanel[] = useMemo(() => {
    if (!currentScenario) {
      return [];
    }

    const panels: StoryPanel[] = [];

    // Intro panel
    panels.push({
      id: 'intro',
      type: 'intro',
      title: currentScenario.title,
      description: currentScenario.description,
      component: IntroPanel,
      scrollRange: [0, 0.15],
    });

    // Full A2A Demo Panel - shows all 3 pillars like DemoView
    panels.push({
      id: 'full-demo',
      type: 'demo',
      title: 'Agent-to-Agent Communication Demo',
      description:
        'Experience the complete A2A interaction across all participants',
      component: DemoPanel,
      scrollRange: [0.15, 0.85],
      steps: currentScenario.steps,
      extraProps: { demoType: 'full' },
    });

    // Summary panel
    panels.push({
      id: 'summary',
      type: 'summary',
      title: 'Demo Complete',
      description: 'The A2A demonstration has been completed successfully!',
      component: SummaryPanel,
      scrollRange: [0.85, 1],
    });

    return panels;
  }, [currentScenario]);

  const {
    currentPanel,
    currentPanelProgress,
    previewStepIndex,
    previewTotalSteps,
    setBindScrollToProgress,
    scrollProgress,
  } = useScrollProgress(storyPanels);

  // Enable scroll-progress binding when component mounts
  useEffect(() => {
    setBindScrollToProgress(true);
    return () => setBindScrollToProgress(false);
  }, [setBindScrollToProgress]);

  // No need for complex height calculations with the new sequential approach

  // Demo panel type mapping no longer needed; demoType is provided via panel.extraProps

  // Debug logging is disabled in production; enable if needed

  if (storyPanels.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Storytelling Mode
          </h1>
          <p className="text-xl text-muted-foreground">
            No scenario selected. Please select a scenario to begin.
          </p>
          <p className="text-sm text-muted-foreground">
            Current scenario: {currentScenario?.title || 'None'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="storytelling-container">
      {/* Scroll progress indicator */}
      <ScrollProgressIndicator
        panels={storyPanels}
        currentPanelId={currentPanel?.id}
        previewStepIndex={previewStepIndex}
        previewTotalSteps={previewTotalSteps}
        scrollProgress={scrollProgress}
      />

      {/* Real demo panels with proper components */}
      {storyPanels.map((panel) => {
        const isActive = currentPanel?.id === panel.id;
        const progress = isActive ? currentPanelProgress : 0;

        return (
          <div
            key={panel.id}
            className="w-full"
            style={{
              minHeight: '100vh',
              opacity: isActive ? 1 : 0.6,
              // Remove transition when in demo panel to reduce visual noise
              transition:
                currentPanel?.type === 'demo'
                  ? 'none'
                  : 'opacity 0.3s ease-in-out',
            }}
          >
            <PanelContainer
              panel={panel}
              isActive={isActive}
              progress={progress}
              agentStyle={agentStyle}
              style={{
                minHeight: '100vh',
                width: '100%',
              }}
            />
          </div>
        );
      })}

      {/* Debug info removed in production */}

      {/* Scroll hint for first-time users */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-black/80 text-white px-4 py-2 rounded-full text-sm flex items-center space-x-2">
          <span>Scroll to explore the story</span>
          <div className="w-4 h-6 border-2 border-white rounded-full relative">
            <div className="w-1 h-1 bg-white rounded-full absolute top-1 left-1/2 transform -translate-x-1/2 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
