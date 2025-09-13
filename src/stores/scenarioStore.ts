import { create } from "zustand";
import type { Scenario, PhoneState, AgentState } from "@/types";

interface ScenarioStore {
  currentScenario: Scenario | null;
  isPlaying: boolean;
  isRecording: boolean;
  currentStep: number;

  // 3-section state management
  leftSectionState: PhoneState;
  centerSectionState: AgentState;
  rightSectionState: PhoneState;

  loadScenario: (scenario: Scenario) => void;
  playScenario: () => void;
  pauseScenario: () => void;
  startRecording: () => void;
  stopRecording: () => void;

  // Section-specific state updates
  updateLeftSection: (state: Partial<PhoneState>) => void;
  updateCenterSection: (state: Partial<AgentState>) => void;
  updateRightSection: (state: Partial<PhoneState>) => void;
}

const initialPhoneState: PhoneState = {
  messages: [],
  isTyping: false,
  currentInputText: "",
  callState: "idle",
  signalStrength: 4,
  batteryLevel: 100,
};

const initialAgentState: AgentState = {
  isThinking: false,
  currentProcess: "",
  progressPercent: 0,
  connectionLeft: false,
  connectionRight: false,
};

export const useScenarioStore = create<ScenarioStore>((set) => ({
  currentScenario: null,
  isPlaying: false,
  isRecording: false,
  currentStep: 0,
  leftSectionState: initialPhoneState,
  centerSectionState: initialAgentState,
  rightSectionState: initialPhoneState,
  loadScenario: (scenario) => set({ currentScenario: scenario, currentStep: 0 }),
  playScenario: () => set({ isPlaying: true }),
  pauseScenario: () => set({ isPlaying: false }),
  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
  updateLeftSection: (state) =>
    set((prevState) => ({
      leftSectionState: { ...prevState.leftSectionState, ...state },
    })),
  updateCenterSection: (state) =>
    set((prevState) => ({
      centerSectionState: { ...prevState.centerSectionState, ...state },
    })),
  updateRightSection: (state) =>
    set((prevState) => ({
      rightSectionState: { ...prevState.rightSectionState, ...state },
    })),
}));
