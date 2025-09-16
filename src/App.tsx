import { useState } from 'react';
import './App.css';
import { ControlHeader } from './components/ControlHeader';
import { DemoView } from './components/DemoView';
import { ScrollyTelling } from './components/Test';
import { ScenarioContextProvider } from './contexts/scenario';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [agentStyle, setAgentStyle] = useState<'minimal' | 'formal' | 'hacker'>(
    'hacker'
  );
  const [viewMode, setViewMode] = useState<'demo' | 'storytelling'>('demo');

  // Debug logging removed for production cleanliness

  return (
    <div className={`app ${theme}`}>
      <ScenarioContextProvider>
        <ControlHeader
          onThemeToggle={toggleTheme}
          onAgentStyleChange={setAgentStyle}
          onViewModeChange={setViewMode}
          currentViewMode={viewMode}
        />
        <main className="">
          {viewMode === 'demo' ? (
            <DemoView agentStyle={agentStyle} />
          ) : (
            // <StorytellingPage agentStyle={agentStyle} />
            <ScrollyTelling />
          )}
        </main>
      </ScenarioContextProvider>
    </div>
  );
}

export default App;
