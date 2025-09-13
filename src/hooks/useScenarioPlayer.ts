import { useEffect, useCallback, useRef } from "react";
import { useScenarioStore } from "@/stores/scenarioStore";
import type { Scenario, ScenarioStep, Message } from "@/types";

export function useScenarioPlayer() {
  const {
    currentScenario,
    currentStep,
    isPlaying,
    leftSectionState,
    rightSectionState,

    loadScenario,
    playScenario,
    pauseScenario,
    updateLeftSection,
    updateCenterSection,
    updateRightSection,
  } = useScenarioStore();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stepStartTimeRef = useRef<number>(0);

  // Clear timeout on cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Execute scenario step
  const executeStep = useCallback(
    async (step: ScenarioStep) => {
      const { section, actor, content, type } = step;

      // Update center section for any AI agent activity
      if (actor === "ai_agent") {
        updateCenterSection({
          isThinking: true,
          currentProcess: content,
          connectionLeft: section === "left" || type === "system_action",
          connectionRight: section === "right" || type === "system_action",
        });
      }

      // Execute step based on section and type
      switch (section) {
        case "left":
          await executeLeftSectionStep(step);
          break;
        case "center":
          await executeCenterSectionStep(step);
          break;
        case "right":
          await executeRightSectionStep(step);
          break;
      }
    },
    [updateLeftSection, updateCenterSection, updateRightSection],
  );

  // Execute left section step (User phone)
  const executeLeftSectionStep = useCallback(
    async (step: ScenarioStep) => {
      const { type, content, actor, animation } = step;

      switch (type) {
        case "message":
          // Show typing indicator first if it's from user
          if (actor === "user" && animation?.type === "typing") {
            updateLeftSection({ isTyping: true });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            updateLeftSection({ isTyping: false });
          }

          // Add message
          const newMessage: Message = {
            id: step.id,
            content,
            sender: actor === "user" ? "user" : "agent",
            timestamp: Date.now(),
          };

          updateLeftSection({
            messages: [...leftSectionState.messages, newMessage],
          });
          break;

        case "call":
          updateLeftSection({
            callState: "ringing",
          });
          // Simulate call duration
          setTimeout(() => {
            updateLeftSection({ callState: "connected" });
          }, 2000);
          setTimeout(() => {
            updateLeftSection({ callState: "ended" });
          }, 5000);
          break;

        case "sms":
          // Similar to message but with different styling
          const smsMessage: Message = {
            id: step.id,
            content,
            sender: actor === "user" ? "user" : "agent",
            timestamp: Date.now(),
          };
          updateLeftSection({
            messages: [...leftSectionState.messages, smsMessage],
          });
          break;
      }
    },
    [leftSectionState.messages, updateLeftSection],
  );

  // Execute center section step (AI Agent)
  const executeCenterSectionStep = useCallback(
    async (step: ScenarioStep) => {
      const { type, content, animation } = step;

      switch (type) {
        case "system_action":
          updateCenterSection({
            isThinking: true,
            currentProcess: content,
            progressPercent: 0,
            connectionLeft: true,
            connectionRight: true,
          });

          // Simulate processing progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            updateCenterSection({ progressPercent: progress });
          }

          // Complete processing
          updateCenterSection({
            isThinking: false,
            progressPercent: 100,
          });
          break;

        default:
          updateCenterSection({
            currentProcess: content,
            isThinking: animation?.type === "thinking",
          });
          break;
      }
    },
    [updateCenterSection],
  );

  // Execute right section step (Service Provider phone)
  const executeRightSectionStep = useCallback(
    async (step: ScenarioStep) => {
      const { type, content, actor, animation } = step;

      switch (type) {
        case "message":
          // Show typing indicator for service provider
          if (actor === "service_provider" && animation?.type === "typing") {
            updateRightSection({ isTyping: true });
            await new Promise((resolve) => setTimeout(resolve, 1500));
            updateRightSection({ isTyping: false });
          }

          // Add message
          const newMessage: Message = {
            id: step.id,
            content,
            sender: actor === "service_provider" ? "agent" : "user",
            timestamp: Date.now(),
          };

          updateRightSection({
            messages: [...rightSectionState.messages, newMessage],
          });
          break;

        case "call":
          updateRightSection({
            callState: "ringing",
          });
          setTimeout(() => {
            updateRightSection({ callState: "connected" });
          }, 2000);
          setTimeout(() => {
            updateRightSection({ callState: "ended" });
          }, 5000);
          break;

        case "sms":
          const smsMessage: Message = {
            id: step.id,
            content,
            sender: actor === "service_provider" ? "agent" : "user",
            timestamp: Date.now(),
          };
          updateRightSection({
            messages: [...rightSectionState.messages, smsMessage],
          });
          break;
      }
    },
    [rightSectionState.messages, updateRightSection],
  );

  // Main scenario player effect
  useEffect(() => {
    if (!isPlaying || !currentScenario) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const step = currentScenario.steps[currentStep];
    if (!step) {
      pauseScenario();
      // Reset center section state when scenario completes
      updateCenterSection({
        isThinking: false,
        currentProcess: "",
        progressPercent: 0,
        connectionLeft: false,
        connectionRight: false,
      });
      return;
    }

    stepStartTimeRef.current = Date.now();

    const executeStepWithDelay = async () => {
      // Wait for the step delay
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, step.timing.delay * 1000);
      });

      // Execute the step
      await executeStep(step);

      // Wait for the step duration
      await new Promise((resolve) => {
        timeoutRef.current = setTimeout(resolve, step.timing.duration * 1000);
      });

      // Move to next step
      if (currentStep < currentScenario.steps.length - 1) {
        useScenarioStore.setState({ currentStep: currentStep + 1 });
      } else {
        pauseScenario();
      }
    };

    executeStepWithDelay().catch(console.error);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    isPlaying,
    currentStep,
    currentScenario,
    executeStep,
    pauseScenario,
    updateCenterSection,
  ]);

  // Public methods
  const play = useCallback(() => {
    if (!currentScenario) return;
    playScenario();
  }, [currentScenario, playScenario]);

  const pause = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    pauseScenario();
  }, [pauseScenario]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!currentScenario) return;

    // Reset all states
    useScenarioStore.setState({
      currentStep: 0,
      isPlaying: false,
      leftSectionState: {
        messages: [],
        isTyping: false,
        currentInputText: "",
        callState: "idle",
        signalStrength: 4,
        batteryLevel: 100,
      },
      centerSectionState: {
        isThinking: false,
        currentProcess: "",
        progressPercent: 0,
        connectionLeft: false,
        connectionRight: false,
      },
      rightSectionState: {
        messages: [],
        isTyping: false,
        currentInputText: "",
        callState: "idle",
        signalStrength: 4,
        batteryLevel: 100,
      },
    });
  }, [currentScenario]);

  const jumpToStep = useCallback(
    (step: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (
        !currentScenario ||
        step < 0 ||
        step >= currentScenario.steps.length
      ) {
        return;
      }

      useScenarioStore.setState({ currentStep: step });
    },
    [currentScenario],
  );

  const loadAndPlay = useCallback(
    (scenario: Scenario) => {
      reset();
      loadScenario(scenario);
      setTimeout(() => play(), 100); // Small delay to ensure state is updated
    },
    [reset, loadScenario, play],
  );

  // Calculate progress
  const progress = currentScenario
    ? ((currentStep + 1) / currentScenario.steps.length) * 100
    : 0;

  // Get current step info
  const currentStepInfo = currentScenario?.steps[currentStep] || null;

  // Get step timing info
  const getStepElapsedTime = useCallback(() => {
    if (!stepStartTimeRef.current) return 0;
    return Date.now() - stepStartTimeRef.current;
  }, []);

  return {
    // State
    currentStep,
    currentStepInfo,
    isPlaying,
    progress,
    totalSteps: currentScenario?.steps.length || 0,

    // Actions
    play,
    pause,
    reset,
    jumpToStep,
    loadAndPlay,

    // Utilities
    getStepElapsedTime,
    canPlay: Boolean(currentScenario),
    canPause: isPlaying,
    canReset: Boolean(currentScenario),
    isComplete: currentScenario
      ? currentStep >= currentScenario.steps.length - 1
      : false,
  };
}
