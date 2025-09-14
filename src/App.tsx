import "./App.css";
import { ControlHeader } from "./components/ControlHeader";
import { DemoView } from "./components/DemoView";
import { ScenarioContextProvider } from "./contexts/scenario";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <ScenarioContextProvider>
        <ControlHeader onThemeToggle={toggleTheme} />
        <DemoView />
      </ScenarioContextProvider>
    </div>
  );
}

export default App;
