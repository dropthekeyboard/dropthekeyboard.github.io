import { useState } from 'react';
import './App.css';
import { ControlHeader } from './components/ControlHeader';
import { DemoView } from './components/DemoView';
import { GSAPPinningDemo } from './components/Test';
import { ScenarioContextProvider } from './contexts/scenario';
import { AgentDisplayVariantProvider } from './contexts/agentDisplayVariant';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [viewMode, setViewMode] = useState<'demo' | 'storytelling'>('demo');

  // Debug logging removed for production cleanliness

  return (
    <div className={`app ${theme} scrollbar-hide`}>
      <ScenarioContextProvider>
        <AgentDisplayVariantProvider>
          <ControlHeader
            onThemeToggle={toggleTheme}
            onViewModeChange={setViewMode}
            currentViewMode={viewMode}
          />
          <main className="flex-grow overflow-hidden scrollbar-hide">
            {viewMode === 'demo' ? (
              <DemoView />
            ) : (
              // <StorytellingPage agentStyle={agentStyle} />
              <GSAPPinningDemo />
            )}
          </main>
        </AgentDisplayVariantProvider>
      </ScenarioContextProvider>
    </div>
  );
}

export default App;
