import {
  createContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import scenariosData from '@/data/scenarios.json';
import { createId } from '@paralleldrive/cuid2';
import { isRelevantAction } from '@/lib/utils';

/**
 * Message types supported in communication
 */
type MessageType = 'voice' | 'text' | 'dtmf';

/**
 * Sender types for messages
 */
export type SenderType = 'agent' | 'customer' | 'server';

/**
 * Phone states for human entities
 */
export type PhoneState = 'idle' | 'message' | 'call' | 'ring';

/**
 * Base interface for deliverable communication items
 */
interface Deliverable {
  id?: string;
  /** Sender identifier */
  from: string;
  /** Recipient identifier */
  to: string;
  timestamp: number;
}

/**
 * Call session data structure
 */
export interface CallSession {
  id: string;
  /** Name of the caller */
  callerName: string;
  /** Type of the caller (agent, customer, or server) */
  callerType: SenderType;
  /** Call start timestamp */
  startTime: number;
  /** Call end timestamp (null if ongoing) */
  endTime: number | null;
  /** Call participants */
  participants: string[];
  /** Whether the call was accepted */
  isAccepted: boolean;
}

/**
 * Message data structure
 */
export interface Message extends Deliverable {
  /** Message content */
  content: string;
  /** Type of message (text or voice) */
  type: MessageType;
  /** Type of sender (agent, customer, or server) */
  senderType: SenderType;
  /** Optional reason for the message */
  reason?: string;
  /** Associated call session (for voice messages during calls) */
  callSession?: CallSession;
}

/**
 * Input structure for sendMessage action
 */
interface SendMessageInput {
  /** Message to be sent */
  message: Message;
}

/**
 * Call data structure
 */
interface Call extends Deliverable {
  /** Optional reason for the call */
  reason?: string;
  /** Type of sender (agent, customer, or server) */
  senderType?: SenderType;
}

/**
 * Input structure for call-related actions
 */
interface CallInput {
  /** Call information */
  call: Call;
}

/**
 * API call data structure
 */
interface APICall extends Deliverable {
  /** External service name (e.g., "amazon", "catchtable") */
  service: string;
  /** Request details or query */
  request: string;
  /** Type of sender (agent, customer, or server) */
  senderType?: SenderType;
}

/**
 * Input structure for apiCall action
 */
interface APICallInput {
  /** API call information */
  apiCall: APICall;
}

/**
 * API response data structure
 */
interface APIResponse extends Deliverable {
  /** External service name that provided the response */
  service: string;
  /** Response data from the service */
  response: string;
  /** Type of sender (agent, customer, or server) */
  senderType?: SenderType;
}

/**
 * Input structure for apiResponse action
 */
interface APIResponseInput {
  /** API response information */
  apiResponse: APIResponse;
}

/**
 * Communication actions for scenario control
 */
export interface CommunicationAction {
  /**
   * Send a message (text or voice)
   * @param input - Message input containing sender, recipient, content, and type
   * @example
   * // Regular message
   * sendMessage({ message: { from: "user", to: "ai_agent", content: "Book a table", type: "text" } })
   *
   * // SMS response
   * sendMessage({ message: { from: "restaurant", to: "ai_agent", content: "3 8pm", type: "text" } })
   */
  sendMessage: (input: SendMessageInput) => void;

  /**
   * Initiate a phone call (attempt to call, regardless of connection status)
   * @param input - Call input containing caller and recipient
   * @example
   * // AI agent calling restaurant
   * makeCall({ call: { from: "ai_agent", to: "restaurant" } })
   */
  makeCall: (input: CallInput) => void;

  /**
   * Accept phone call (recipient answers the call)
   * @param input - Call input with same from/to as makeCall for consistency
   * @example
   * // After makeCall, when recipient answers
   * acceptCall({ call: { from: "ai_agent", to: "restaurant" } })
   */
  acceptCall: (input: CallInput) => void;

  /**
   * Finish phone call (includes connection failure, rejection, or normal termination)
   * @param input - Call input with same from/to direction
   * @example
   * // Normal call termination
   * finishCall({ call: { from: "ai_agent", to: "restaurant" } })
   */
  finishCall: (input: CallInput) => void;

  /**
   * Make API call to external service
   * @param input - API call input containing service name and request details
   * @example
   * // Search for wine recommendations on Amazon
   * apiCall({ apiCall: { service: "amazon", request: "wine recommendations" } })
   */
  apiCall: (input: APICallInput) => void;

  /**
   * Handle API response from external service
   * @param input - API response input containing service name and response data
   * @example
   * // Amazon search results
   * apiResponse({ apiResponse: { service: "amazon", response: "Red Wine Set 29,000 KRW" } })
   */
  apiResponse: (input: APIResponseInput) => void;
}

/**
 * Helper function to determine sender type based on scenario entities
 */
function getSenderType(scenario: Scenario, senderName: string): SenderType {
  // Check if sender is an AI agent
  if (scenario.agents.some((agent) => agent.name === senderName)) {
    return 'agent';
  }

  // Check if sender is the customer
  if (scenario.customer.name === senderName) {
    return 'customer';
  }

  // Check if sender is a server
  if (scenario.servers.some((server) => server.name === senderName)) {
    return 'server';
  }

  // Default fallback (should not happen in well-formed scenarios)
  console.warn(`Unknown sender type for: ${senderName}`);
  return 'server';
}

function deliverMessage(scenario: Scenario, message: Message): Scenario {
  const newScenario = { ...scenario };
  if (
    message.to === scenario?.customer.name ||
    message.from === scenario?.customer.name
  ) {
    newScenario.customer = {
      ...scenario.customer,
      messageBox: {
        ...scenario.customer.messageBox,
        [message.from]: [
          ...(scenario.customer.messageBox[message.from] || []),
          message,
        ],
      },
    };
  }
  // Update server if they are the recipient
  const serverIndex = scenario.servers.findIndex(
    (s) => s.name === message.to || s.name === message.from
  );
  if (serverIndex !== -1) {
    const server = scenario.servers[serverIndex];
    // Only update messageBox for human servers
    if (server.type === 'human') {
      newScenario.servers = [...scenario.servers];
      newScenario.servers[serverIndex] = {
        ...server,
        messageBox: {
          ...server.messageBox,
          [message.from]: [...(server.messageBox[message.from] || []), message],
        },
      };
    }
  }
  return newScenario;
}

/**
 * Helper function to update the state of a specific entity (customer or server)
 */
function updateEntityState(
  scenario: Scenario,
  entityName: string,
  newState: PhoneState
): Scenario {
  const newScenario = { ...scenario };
  if (entityName === scenario.customer.name) {
    newScenario.customer = { ...scenario.customer, state: newState };
  } else {
    const serverIndex = scenario.servers.findIndex(
      (s) => s.name === entityName
    );
    if (serverIndex !== -1) {
      const server = scenario.servers[serverIndex];
      // Only update state for human servers
      if (server.type === 'human') {
        newScenario.servers = [...scenario.servers];
        newScenario.servers[serverIndex] = {
          ...server,
          state: newState,
        };
      }
    }
  }
  return newScenario;
}

export interface StateControlAction {
  reset: () => void;
}

/**
 * Common Action Flow Patterns
 *
 * @example
 * // 1. Successful phone reservation:
 * makeCall({ from: "ai_agent", to: "restaurant" })
 * → acceptCall({ from: "ai_agent", to: "restaurant" })
 * → finishCall({ from: "ai_agent", to: "restaurant" })
 * → sendMessage({ from: "ai_agent", to: "user", content: "Reservation confirmed" })
 *
 * @example
 * // 2. No answer + SMS fallback:
 * makeCall({ from: "ai_agent", to: "restaurant" })
 * → finishCall({ from: "ai_agent", to: "restaurant" })  // Immediate termination (no answer)
 * → sendMessage({ from: "ai_agent", to: "restaurant", content: "SMS: Available? 1:Yes 2:No" })
 * → sendMessage({ from: "restaurant", to: "ai_agent", content: "1" })
 *
 * @example
 * // 3. Conditional emergency call:
 * sendMessage({ from: "elderly", to: "ai_agent", content: "2" })  // Feeling sick
 * → makeCall({ from: "ai_agent", to: "guardian" })  // Call guardian
 * → acceptCall({ from: "ai_agent", to: "guardian" })
 * → finishCall({ from: "ai_agent", to: "guardian" })
 *
 * @example
 * // 4. API-based product recommendation:
 * apiCall({ service: "amazon", request: "wine for dinner" })
 * → apiResponse({ service: "amazon", response: "Red Wine Set 29,000 KRW" })
 * → sendMessage({ from: "ai_agent", to: "user", content: "Wine recommendation: Red Wine Set 29,000 KRW" })
 *
 * @example
 * // 5. External service integration booking:
 * apiCall({ service: "catchtable", request: "check availability 7PM" })
 * → apiResponse({ service: "catchtable", response: "7PM full, 8PM available" })
 * → sendMessage({ from: "ai_agent", to: "user", content: "7PM full, 8PM available. Change time?" })
 * → sendMessage({ from: "user", to: "ai_agent", content: "Yes, change to 8PM" })
 * → apiCall({ service: "catchtable", request: "book 8PM table for 2" })
 * → apiResponse({ service: "catchtable", response: "booking confirmed" })
 */

/**
 * Base entity interface for all participants
 */
export interface Entity {
  /** Entity type - human or AI */
  type: 'human' | 'ai';
  /** Unique identifier name */
  name: string;
}

/**
 * Human participant state and data
 */
export interface HumanState extends Entity {
  type: 'human';
  /** Current phone state */
  state: PhoneState;
  /** Message history organized by sender */
  messageBox: Record<string, Message[]>;
}

/**
 * Send message step for AI agent
 */
interface AgenticSendMessageStep {
  type: 'send-message';
  action: Message;
}

/**
 * Make call step for AI agent
 */
interface AgenticMakeCallStep {
  type: 'make-call';
  action: Call;
}

/**
 * Finish call step for AI agent
 */
interface AgenticFinishCallStep {
  type: 'finish-call';
  action: Call;
}

/**
 * Accept call step for AI agent
 */
interface AgenticAcceptCallStep {
  type: 'accept-call';
  action: Call;
}

/**
 * API call step for AI agent
 */
interface AgenticAPICallStep {
  type: 'api-call';
  action: APICall;
}

/**
 * API response step for AI agent
 */
interface AgenticAPIResponseStep {
  type: 'api-response';
  action: APIResponse;
}

/**
 * Union type for all possible AI agent steps
 */
export type AgenticStep =
  | AgenticFinishCallStep
  | AgenticAcceptCallStep
  | AgenticMakeCallStep
  | AgenticSendMessageStep
  | AgenticAPICallStep
  | AgenticAPIResponseStep;

/**
 * AI agent participant state and behavior
 */
export interface AIAgentState extends Entity {
  type: 'ai';
  /** Sequence of steps/actions performed by this agent */
  steps: AgenticStep[];
}

export type ServerState = AIAgentState | HumanState;

/**
 * Complete scenario containing all participants and their interactions
 */
export interface Scenario {
  id: string;
  title: string;
  description: string;
  /** AI agents in the scenario */
  agents: AIAgentState[];

  customer: HumanState;

  servers: ServerState[];
  /** Global sequence of all steps in chronological order */
  steps: AgenticStep[];
  /** Active call sessions */
  callSessions: CallSession[];
}

/**
 * Context value type provided by ScenarioContextProvider
 */
export interface ScenarioContextType {
  /** Current scenario state */
  state: Scenario;
  active: {
    agent?: AIAgentState;
    server?: ServerState;
  };
  reset: (scenario?: Scenario) => void;
  /** Available actions for scenario control */
  action: CommunicationAction;

  /** List of all available scenarios */
  scenarios: Scenario[];
  /** Currently selected scenario */
  currentScenario: Scenario;
  /** Current progress through scenario steps */
  progress: number;
  /** Set current scenario by index */
  setCurrent: (index: number) => void;
  /** Advance to next step */
  progressNext: () => void;
  /** Reset progress to 0 */
}

/**
 * React context for scenario state management
 */
const ScenarioContext = createContext<ScenarioContextType | null>(null);

/**
 * Props for ScenarioContextProvider
 */
interface ScenarioContextProviderProps {
  /** Child components that will have access to the context */
  children: ReactNode;
}

/**
 * Context provider component for managing scenario state and actions
 * @param props - Component props
 * @returns JSX element providing scenario context to children
 */
function ScenarioContextProvider({ children }: ScenarioContextProviderProps) {
  /**
   * Helper function to get the 'from' field from any AgenticStep
   */

  /**
   * Global sequence of all steps that have occurred in the scenario
   */
  const [scenario, setScenario] = useState<Scenario | null>(null);

  /**
   * New state variables for scenario management
   */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(-1);
  const currentScenarioRef = useRef<Scenario | null>(null);

  /**
   * List of all available scenarios
   */
  const scenarios: Scenario[] = useMemo(() => {
    return Object.values(scenariosData).map((scenario) => ({
      ...scenario,
      callSessions: [],
    })) as unknown as Scenario[];
  }, []);

  /**
   * Current selected scenario
   */
  const currentScenario: Scenario = useMemo(
    () => scenarios[currentIndex] || scenarios[0],
    [currentIndex, scenarios]
  );

  const [lastAgent, setLastAgent] = useState<AIAgentState | null>(null);

  useEffect(() => {
    if (!scenario) {
      setLastAgent(null);
      return;
    }

    const { steps } = scenario;
    const lastStep = steps[steps.length - 1];

    if (lastStep) {
      const agentWhom = scenario.agents.find((a) =>
        isRelevantAction(lastStep, a)
      );
      setLastAgent(agentWhom || null);
    } else {
      // If no steps yet, return first agent as default
      setLastAgent(scenario.agents.length > 0 ? scenario.agents[0] : null);
    }
  }, [scenario]);

  const [lastServer, setLastServer] = useState<ServerState | null>(null);

  useEffect(() => {
    if (!scenario) {
      setLastServer(null);
      return;
    }

    const { steps } = scenario;
    const lastStep = steps[steps.length - 1];

    console.log('lastServer debug:', { lastStep, servers: scenario.servers });

    if (lastStep) {
      const relevantServer = scenario.servers.find((s) =>
        isRelevantAction(lastStep, s)
      );
      console.log('relevantServer found:', relevantServer);
      if (relevantServer) {
        setLastServer(relevantServer);
        return;
      }
    }

    // If no last step or no matching server, use first server as default
    if (scenario.servers.length > 0) {
      console.log('setting default server:', scenario.servers[0]);
      setLastServer(scenario.servers[0]);
    } else {
      setLastServer(null);
    }
  }, [scenario]);

  /**
   * Current scenario metadata
   */
  // Removed redundant currentScenarioInfo state

  /**
   * Set current scenario by index
   */
  const setCurrent = useCallback(
    (index: number) => {
      if (index >= 0 && index < scenarios.length) {
        setCurrentIndex(index);
        // Do not auto-execute the first step on scenario change
        setProgress(-1);
      }
    },
    [scenarios.length]
  );

  /**
   * Advance to next step
   */
  const progressNext = useCallback(() => {
    setProgress((prev) => prev + 1);
  }, []);

  /**
   * Handle sending a message between participants
   * Updates message boxes for human recipients
   */
  const handleSendMessage = useCallback(({ message }: SendMessageInput) => {
    // Update scenario state and handle message sending
    setScenario((prev) => {
      if (!prev) return prev;

      // Determine sender type based on scenario entities
      const senderType = getSenderType(prev, message.from);

      // Find active call session for voice messages
      let callSession: CallSession | undefined;
      if (message.type === 'voice') {
        // Find the most recent active call session that includes both participants
        const activeCallSession = (prev.callSessions || []).find(
          (session) =>
            session.participants.includes(message.from) &&
            session.participants.includes(message.to || '') &&
            session.endTime === null // Only active calls
        );
        callSession = activeCallSession;
      }

      const messageWithSenderType: Message = {
        ...message,
        senderType,
        ...(callSession && { callSession }),
      };

      const step: AgenticSendMessageStep = {
        type: 'send-message',
        action: messageWithSenderType,
      };

      const updatedScenario: Scenario = {
        ...prev,
        steps: [...prev.steps, step],
      };
      // Update customer if they are the recipient
      let scenarioWithMessage = deliverMessage(
        updatedScenario,
        messageWithSenderType
      );

      // Update states based on message type: voice/dtmf -> 'call', text -> 'message'
      const targetState: PhoneState =
        message.type === 'voice' || message.type === 'dtmf'
          ? 'call'
          : 'message';
      scenarioWithMessage = updateEntityState(
        scenarioWithMessage,
        message.from,
        targetState
      );
      if (message.to) {
        scenarioWithMessage = updateEntityState(
          scenarioWithMessage,
          message.to,
          targetState
        );
      }

      return scenarioWithMessage;
    });
  }, []);

  /**
   * Handle initiating a phone call
   * Updates recipient's state to "ring" if they are human
   */
  const handleMakeCall = useCallback(
    ({ call }: CallInput) => {
      // Determine sender type based on scenario entities
      const senderType = getSenderType(currentScenario, call.from);

      // Create call with senderType
      const callWithSenderType: Call = {
        ...call,
        senderType,
      };

      const step: AgenticMakeCallStep = {
        type: 'make-call',
        action: callWithSenderType,
      };

      // Update scenario state directly
      setScenario((prev) => {
        if (!prev) return prev;

        // Create new call session
        const newCallSession: CallSession = {
          id: createId(),
          callerName: call.from,
          callerType: senderType,
          startTime: Date.now(),
          endTime: null,
          participants: [call.from, call.to],
          isAccepted: false,
        };

        const updatedScenario: Scenario = {
          ...prev,
          steps: [...prev.steps, step],
          callSessions: [...(prev.callSessions || []), newCallSession],
        };
        return updateEntityState(
          updateEntityState(updatedScenario, call.to, 'ring'),
          call.from,
          'ring'
        );
      });
    },
    [currentScenario]
  );

  /**
   * Handle accepting a phone call
   * Sets both caller and recipient state to "call" if they are human
   */
  const handleAcceptCall = useCallback(
    ({ call }: CallInput) => {
      // For accept-call, the sender is actually the recipient of the original call
      // So we need to determine sender type based on the 'to' field (who is accepting)
      const senderType = getSenderType(currentScenario, call.to);

      // Create call with senderType
      const callWithSenderType: Call = {
        ...call,
        senderType,
      };

      const step: AgenticAcceptCallStep = {
        type: 'accept-call',
        action: callWithSenderType,
      };

      // Update scenario state directly
      setScenario((prev) => {
        if (!prev) return prev;

        // Find and update the call session
        const updatedCallSessions = prev.callSessions.map((session) => {
          // Check if this session matches the call (participants match)
          const hasParticipants =
            session.participants.includes(call.from) &&
            session.participants.includes(call.to);
          if (hasParticipants && !session.isAccepted) {
            return {
              ...session,
              isAccepted: true,
            };
          }
          return session;
        });

        const updatedScenario: Scenario = {
          ...prev,
          steps: [...prev.steps, step],
          callSessions: updatedCallSessions,
        };
        let finalScenario = updateEntityState(
          updatedScenario,
          call.from,
          'call'
        );
        finalScenario = updateEntityState(
          updateEntityState(finalScenario, call.to, 'call'),
          call.from,
          'call'
        );
        return finalScenario;
      });
    },
    [currentScenario]
  );

  /**
   * Handle finishing a phone call
   * Resets both caller and recipient state to "message" if they are human
   */
  const handleFinishCall = useCallback(
    ({ call }: CallInput) => {
      // Determine sender type based on who is finishing the call
      const senderType = getSenderType(currentScenario, call.from);

      // Create call with senderType
      const callWithSenderType: Call = {
        ...call,
        senderType,
      };

      const step: AgenticFinishCallStep = {
        type: 'finish-call',
        action: callWithSenderType,
      };

      // Update scenario state directly
      setScenario((prev) => {
        if (!prev) return prev;

        // Find and update the call session
        const updatedCallSessions = (prev.callSessions || []).map((session) => {
          // Check if this session matches the call (participants match and is active)
          const hasParticipants =
            session.participants.includes(call.from) &&
            session.participants.includes(call.to);
          if (hasParticipants && session.endTime === null) {
            return {
              ...session,
              endTime: Date.now(),
            };
          }
          return session;
        });

        const updatedScenario: Scenario = {
          ...prev,
          steps: [...prev.steps, step],
          callSessions: updatedCallSessions,
        };
        return updateEntityState(
          updateEntityState(updatedScenario, call.from, 'idle'),
          call.to,
          'idle'
        );
      });
    },
    [currentScenario]
  );

  /**
   * Handle API call to external service
   * Records the API call step in global steps
   */
  const handleAPICall = useCallback(
    ({ apiCall }: APICallInput) => {
      // Determine sender type based on scenario entities
      const senderType = getSenderType(currentScenario, apiCall.from);

      // Create API call with senderType
      const apiCallWithSenderType: APICall = {
        ...apiCall,
        senderType,
      };

      const step: AgenticAPICallStep = {
        type: 'api-call',
        action: apiCallWithSenderType,
      };

      setScenario((prev) => {
        if (!prev) {
          return prev;
        }
        const updatedScenario: Scenario = {
          ...prev,
          steps: [...prev.steps, step],
        };
        return updatedScenario;
      });
    },
    [currentScenario]
  );

  /**
   * Handle API response from external service
   * Records the API response step in global steps
   */
  const handleAPIResponse = useCallback(
    ({ apiResponse }: APIResponseInput) => {
      // For API response, the sender is typically the external service,
      // but we determine type based on the recipient (who receives the response)
      const senderType = getSenderType(currentScenario, apiResponse.to);

      // Create API response with senderType
      const apiResponseWithSenderType: APIResponse = {
        ...apiResponse,
        senderType,
      };

      const step: AgenticAPIResponseStep = {
        type: 'api-response',
        action: apiResponseWithSenderType,
      };

      setScenario((prev) => {
        if (!prev) {
          return prev;
        }
        const updatedScenario: Scenario = {
          ...prev,
          steps: [...prev.steps, step],
        };
        return updatedScenario;
      });
    },
    [currentScenario]
  );

  /**
   * Execute a step based on its type
   */
  const handleStep = useCallback(
    (stepToExecute: AgenticStep) => {
      const id = createId();
      console.log('handleStep !!!', { stepToExecute });
      const timestamp = Date.now();
      switch (stepToExecute.type) {
        case 'send-message':
          handleSendMessage({
            message: { ...stepToExecute.action, id, timestamp },
          });
          break;
        case 'make-call':
          handleMakeCall({ call: { ...stepToExecute.action, id, timestamp } });
          break;
        case 'accept-call':
          handleAcceptCall({
            call: { ...stepToExecute.action, id, timestamp },
          });
          break;
        case 'finish-call':
          handleFinishCall({
            call: { ...stepToExecute.action, id, timestamp },
          });
          break;
        case 'api-call':
          handleAPICall({
            apiCall: { ...stepToExecute.action, id, timestamp },
          });
          break;
        case 'api-response':
          handleAPIResponse({
            apiResponse: { ...stepToExecute.action, id, timestamp },
          });
          break;
        default:
          console.warn('Unknown step type:', stepToExecute);
      }
    },
    [
      handleSendMessage,
      handleMakeCall,
      handleAcceptCall,
      handleFinishCall,
      handleAPICall,
      handleAPIResponse,
    ]
  );

  /**
   * Auto-execute step when progress changes
   */
  useEffect(() => {
    if (
      currentScenario &&
      progress >= 0 &&
      progress < currentScenario.steps.length
    ) {
      const stepToExecute = currentScenario.steps[progress];
      if (stepToExecute) {
        handleStep(stepToExecute);
      }
    }
  }, [progress, currentScenario, handleStep]);

  /**
   * Reset scenario and progress when scenario changes
   */
  useEffect(() => {
    if (
      currentScenario &&
      currentScenarioRef.current?.id !== currentScenario.id
    ) {
      currentScenarioRef.current = currentScenario;
      console.log('init : ', { currentScenario });
      // Build a fresh scenario with cleared steps/messages
      const freshScenario: Scenario = {
        ...currentScenario,
        agents: currentScenario.agents.map((agent) => ({
          ...agent,
          steps: [],
        })),
        customer: {
          ...currentScenario.customer,
          messageBox: {},
          state: 'idle',
        },
        servers: currentScenario.servers.map((server) => ({
          ...server,
          messageBox: {},
          state: server.type === 'human' ? 'idle' : 'message',
        })),
        steps: [],
        callSessions: [],
      };
      setScenario(freshScenario);
      setProgress(-1); // avoid auto-exec on load
    }
  }, [currentScenario]);

  /**
   * Reset the scenario state to initial state or load a new scenario
   * @param newScenario - Optional new scenario to load. If not provided, resets to empty state
   */
  const resetScenario = useCallback((newScenario?: Scenario) => {
    console.log('reset ', { newScenario });
    if (newScenario) {
      // Set the complete scenario with fresh state
      const freshScenario: Scenario = {
        ...newScenario,
        // Reset AI agents with empty steps
        agents: newScenario.agents.map((agent) => ({
          ...agent,
          steps: [],
        })),
        // Reset customer with empty message box
        customer: {
          ...newScenario.customer,
          messageBox: {},
          state: 'idle',
        },
        // Reset servers with empty message boxes
        servers: newScenario.servers.map((server) => ({
          ...server,
          messageBox: {},
          state: server.type === 'human' ? 'idle' : 'message',
        })),
        steps: [],
        callSessions: [],
      };

      setScenario(freshScenario);
      // Move to before-first-step to prevent auto-exec
      setProgress(-1);
    } else {
      // Complete reset - clear all scenario info
      setScenario((prev) => {
        if (!prev) {
          return prev;
        }
        const updateScenario: Scenario = {
          ...prev,
          customer: { ...prev.customer, messageBox: {}, state: 'idle' },
          agents: [...prev.agents.map((a) => ({ ...a, steps: [] }))],
          servers: [
            ...prev.servers.map((s) =>
              s.type === 'human'
                ? ({
                    ...s,
                    messageBox: {},
                    state: 'idle',
                  } satisfies HumanState)
                : s.type === 'ai'
                  ? ({
                      ...s,
                      steps: [],
                    } satisfies AIAgentState)
                  : s
            ),
          ],
          steps: [],
          callSessions: [],
        };
        return updateScenario;
      });
      setProgress(-1);
    }
  }, []);

  /**
   * Memoized context value containing current scenario state and available actions
   */
  const contextValue: ScenarioContextType = useMemo(() => {
    if (!scenario) {
      // Return empty scenario when no scenario is loaded
      return {
        state: currentScenario,
        active: {
          agent: lastAgent || undefined,
          server: lastServer || undefined,
        },
        reset: resetScenario,
        action: {
          sendMessage: handleSendMessage,
          makeCall: handleMakeCall,
          acceptCall: handleAcceptCall,
          finishCall: handleFinishCall,
          apiCall: handleAPICall,
          apiResponse: handleAPIResponse,
        },
        scenarios,
        currentScenario,
        progress,
        setCurrent,
        progressNext,
      };
    }

    return {
      state: scenario,
      active: {
        agent: lastAgent || undefined,
        server: lastServer || undefined,
      },
      reset: resetScenario,
      action: {
        sendMessage: handleSendMessage,
        makeCall: handleMakeCall,
        acceptCall: handleAcceptCall,
        finishCall: handleFinishCall,
        apiCall: handleAPICall,
        apiResponse: handleAPIResponse,
      },
      scenarios,
      currentScenario,
      progress,
      setCurrent,
      progressNext,
    };
  }, [
    scenario,
    lastAgent,
    lastServer,
    handleSendMessage,
    handleMakeCall,
    handleAcceptCall,
    handleFinishCall,
    handleAPICall,
    handleAPIResponse,
    resetScenario,
    scenarios,
    currentScenario,
    progress,
    setCurrent,
    progressNext,
  ]);

  return (
    <ScenarioContext.Provider value={contextValue}>
      {children}
    </ScenarioContext.Provider>
  );
}

/**
 * Exports for scenario context management
 */
export { ScenarioContext, ScenarioContextProvider };
