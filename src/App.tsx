import { useState } from 'react';
import './App.css';
import { ControlHeader } from './components/ControlHeader';
import { DemoView } from './components/DemoView';
import { GSAPPinningDemo } from './components/Test';
import { ScenarioContextProvider } from './contexts/scenario';
import { ReasoningVariantProvider } from './contexts/reasoningVariant';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<'demo' | 'storytelling'>('demo');

  // Debug logging removed for production cleanliness

  return (
    <div className={`app ${theme}`}>
      <ScenarioContextProvider>
        <ReasoningVariantProvider>
          <ControlHeader
            onThemeToggle={toggleTheme}
            onViewModeChange={setViewMode}
            currentViewMode={viewMode}
          />
          <main className="flex-1">
            {viewMode === 'demo' ? (
              <DemoView />
            ) : (
              // <StorytellingPage agentStyle={agentStyle} />
              <GSAPPinningDemo />
            )}
          </main>
        </ReasoningVariantProvider>
      </ScenarioContextProvider>
    </div>
  );
}

export default App;
