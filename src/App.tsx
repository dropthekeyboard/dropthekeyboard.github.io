import './App.css';
import { ControlHeader } from './components/ControlHeader';
import { DemoView } from './components/DemoView';
import { ScenarioContextProvider } from './contexts/scenario';
import { useTheme } from './hooks/useTheme';
import { useState } from 'react';

function App() {
  const { theme, toggleTheme } = useTheme();
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [agentStyle, setAgentStyle] = useState<'minimal' | 'formal' | 'hacker'>('hacker');

  // Debug: 현재 설정값들 로깅
  console.log('Current settings:', { playbackSpeed, agentStyle });

  return (
    <div className={`app ${theme}`}>
      <ScenarioContextProvider>
        <ControlHeader
          onThemeToggle={toggleTheme}
          onPlaybackSpeedChange={setPlaybackSpeed}
          onAgentStyleChange={setAgentStyle}
        />
        <DemoView agentStyle={agentStyle} />
      </ScenarioContextProvider>
    </div>
  );
}

export default App;
