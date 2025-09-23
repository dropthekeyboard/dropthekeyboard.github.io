import { useState } from 'react';
import './App.css';
import { ControlHeader } from './components/ControlHeader';
import { DemoView } from './components/DemoView';
import { AgentDisplayVariantProvider } from './contexts/agentDisplayVariant';
import { ScenarioContextProvider } from './contexts/scenario';
import { useTheme } from './hooks/useTheme';
import { GSAPSlidesPage } from './components/Slide';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
              <GSAPSlidesPage />
              // <GSAPPinningDemo />
            )}
          </main>
        </AgentDisplayVariantProvider>
      </ScenarioContextProvider>
    </div>
  );
}

export default App;
