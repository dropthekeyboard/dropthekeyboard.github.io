import { type AgenticStep, type Scenario } from "@/contexts/scenario";
import { useScenario } from "./useScenario";
import { createId } from "@paralleldrive/cuid2";
import scenariosData from "@/data/scenarios.json";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseScenarioControlReturnType {
  current: Scenario;
  scenario: Scenario;
  scenarios: Scenario[];
  progress: number;
  setCurrent: (index: number) => void;
  reset: () => void;
  progressNext: () => void;
}

export function useScenarioControl(): UseScenarioControlReturnType {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(-1);
  const currentScenarioRef = useRef<Scenario|null>(null);


  // Convert scenarios object to array - now scenarios.json already has the correct structure
  const scenarios: Scenario[] = useMemo(() => {
    return Object.values(scenariosData) as unknown as Scenario[];
  }, []);

  const currentScenario: Scenario = useMemo(
    () => scenarios[currentIndex] || scenarios[0],
    [currentIndex, scenarios]
  );

  const {
    state: currentState,
    reset,
    action: {
      sendMessage,
      makeCall,
      acceptCall,
      finishCall,
      apiCall,
      apiResponse,
    },
  } = useScenario();

  // Reset scenario when scenario changes
  useEffect(() => {
    if (currentScenario && currentScenarioRef.current?.id !== currentScenario.id) {
      console.log("progress called!!");
      currentScenarioRef.current = currentScenario;
      reset(currentScenario);
      setProgress(0); // Reset progress when changing scenarios
    }
  }, [currentScenario, currentState.id, reset]);

  // Execute a step based on its type
  const handleStep = useCallback(
    (stepToExecute: AgenticStep) => {
      console.log("handle step !!", {stepToExecute});
      const id = createId();
      const timestamp = new Date().getMilliseconds();
      switch (stepToExecute.type) {
        case "send-message":
          sendMessage({ message: { ...stepToExecute.action, id, timestamp } });
          break;
        case "make-call":
          makeCall({ call: { ...stepToExecute.action, id, timestamp } });
          break;
        case "accept-call":
          acceptCall({ call: { ...stepToExecute.action, id, timestamp } });
          break;
        case "finish-call":
          finishCall({ call: { ...stepToExecute.action, id, timestamp } });
          break;
        case "api-call":
          apiCall({ apiCall: { ...stepToExecute.action, id, timestamp } });
          break;
        case "api-response":
          apiResponse({
            apiResponse: { ...stepToExecute.action, id, timestamp },
          });
          break;
        default:
          console.warn("Unknown step type:", stepToExecute);
      }
    },
    [sendMessage, makeCall, acceptCall, finishCall, apiCall, apiResponse]
  );

  // Auto-execute step when progress changes
  useEffect(() => {
    if (currentScenario && progress < currentScenario.steps.length) {
      console.log("progress updated : ",{currentScenario, progress});
      const stepToExecute = currentScenario.steps[progress];
      if(stepToExecute) {
        handleStep(stepToExecute);
      }
    }
  }, [progress, currentScenario, handleStep]);

  const handleProgressNext = useCallback(() => {
    setProgress((prev) => prev + 1);
  }, []);

  const handleSetCurrent = useCallback(
    (index: number) => {
      if (index >= 0 && index < scenarios.length) {
        setCurrentIndex(index);
      }
    },
    [scenarios.length]
  );

  const handleReset = useCallback(() => {
    reset(); // Reset the scenario state to clear executed steps
    setProgress(0);
  }, [reset]);

  return useMemo(
    () => ({
      scenarios,
      scenario: currentScenario,
      current: currentState,
      progress,
      setCurrent: handleSetCurrent,
      progressNext: handleProgressNext,
      reset: handleReset,
    }),
    [
      scenarios,
      currentScenario,
      currentState,
      progress,
      handleSetCurrent,
      handleProgressNext,
      handleReset,
    ]
  );
}
