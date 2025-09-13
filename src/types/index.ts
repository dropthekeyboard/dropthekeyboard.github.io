
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

export interface AnimationConfig {
  type: "typing" | "appear" | "call_ring" | "thinking";
  easing?: string;
}

export interface Scenario {
  id: string;
  title: string;
  phase: "A2H" | "LiteAgent" | "A2A";
  steps: ScenarioStep[];
}

export interface ScenarioStep {
  id: string;
  type: "message" | "call" | "sms" | "system_action";
  actor: "user" | "ai_agent" | "service_provider";
  section: "left" | "center" | "right";
  content: string;
  timing: {
    delay: number;
    duration: number;
  };
  animation?: AnimationConfig;
}

export interface PhoneState {
  messages: Message[];
  isTyping: boolean;
  currentInputText: string;
  callState: "idle" | "ringing" | "connected" | "ended";
  signalStrength: number;
  batteryLevel: number;
}

export interface AgentState {
  isThinking: boolean;
  currentProcess: string;
  progressPercent: number;
  connectionLeft: boolean;
  connectionRight: boolean;
}
