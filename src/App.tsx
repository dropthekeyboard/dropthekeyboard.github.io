import { useEffect } from "react";
import { DemoView } from "./components/DemoView";
import { ControlHeader } from "./components/ControlHeader";
import { useTheme } from "./hooks/useTheme";
import { useScenarioStore } from "./stores/scenarioStore";
import phase1Scenarios from "./data/scenarios/phase1_scenarios.json";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();
  const { loadScenario, currentScenario } = useScenarioStore();

  // Load a demo scenario on startup
  useEffect(() => {
    if (!currentScenario && phase1Scenarios.length > 0) {
      loadScenario(phase1Scenarios[0] as any);
    }
  }, [currentScenario, loadScenario]);

  return (
    <div className={`app ${theme}`}>
      <ControlHeader onThemeToggle={toggleTheme} />
      <DemoView />
    </div>
  );
}

export default App;
