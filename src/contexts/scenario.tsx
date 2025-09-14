import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";

/**
 * Message types supported in communication
 */
type MessageType = "voice" | "text";

/**
 * Phone states for human entities
 */
export type PhoneState = "message" | "call" | "ring";

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
 * Message data structure
 */
export interface Message extends Deliverable {
    /** Message content */
    content: string;
    /** Type of message (text or voice) */
    type: MessageType;
    /** Optional reason for the message */
    reason?: string;
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
    type: "human" | "ai";
    /** Unique identifier name */
    name: string;
}

/**
 * Human participant state and data
 */
export interface HumanState extends Entity {
    type: "human";
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
export type AgenticStep = AgenticFinishCallStep
                   | AgenticAcceptCallStep
                   | AgenticMakeCallStep
                   | AgenticSendMessageStep
                   | AgenticAPICallStep
                   | AgenticAPIResponseStep

/**
 * AI agent participant state and behavior
 */
export interface AIAgentState extends Entity {
    type: "ai";
    /** Sequence of steps/actions performed by this agent */
    steps: AgenticStep[];
}

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

    servers: HumanState[];
    /** Global sequence of all steps in chronological order */
    steps: AgenticStep[];
}

/**
 * Context value type provided by ScenarioContextProvider
 */
export interface ScenarioContextType {
    /** Current scenario state */
    state: Scenario;
    active: {
        agent?: AIAgentState;
        server?: HumanState;
    }
    reset: (scenario?: Scenario) => void;
    /** Available actions for scenario control */
    action: CommunicationAction;
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
     * Helper function to get the 'to' field from any AgenticStep
     */
    const getActionTo = useCallback((step: AgenticStep): string => {
        return step.action.to;
    }, []);

    /**
     * Global sequence of all steps that have occurred in the scenario
     */
    const [scenario, setScenario] = useState<Scenario|null>(null);
    
    const lastAgent = useMemo(() => {
        if(!scenario) {
            return;
        }
        const { steps } = scenario;
        const lastStep = steps[steps.length - 1];
        if(lastStep && scenario) {
            const whom = getActionTo(lastStep);
            const agentWhom = scenario.agents.find(a => a.name === whom);
            return agentWhom;
        }
        return null;
    }, [scenario, getActionTo]);

    const lastServer = useMemo(() => {
        if(!scenario) {
            return;
        }
        const { steps } = scenario;
        const lastStep = steps[steps.length - 1];
        if(lastStep && scenario) {
            const whom = getActionTo(lastStep);
            const serverWhom = scenario.servers.find(s => s.name === whom);
            return serverWhom;
        }
        return null;
    }, [scenario, getActionTo]);
    

    /**
     * Current scenario metadata
     */
    const [currentScenarioInfo, setCurrentScenarioInfo] = useState<{
        id: string;
        title: string;
        description: string;
    }>({
        id: "",
        title: "",
        description: ""
    });

    /**
     * Handle sending a message between participants
     * Updates message boxes for human recipients
     */
    const handleSendMessage = useCallback(({ message }: SendMessageInput) => {
        const step: AgenticSendMessageStep = {
            type: 'send-message',
            action: message
        };

        // Update scenario state directly
        setScenario(prev => {
            if (!prev) return prev;
            
            const updatedScenario: Scenario = { ...prev, steps: [...prev.steps, step] };
            
            // Update customer if they are the recipient
            if (message.to === 'customer') {
                updatedScenario.customer = {
                    ...prev.customer,
                    messageBox: {
                        ...prev.customer.messageBox,
                        [message.from]: [
                            ...(prev.customer.messageBox[message.from] || []),
                            message
                        ]
                    }
                };
            }
            
            // Update server if they are the recipient
            const serverIndex = prev.servers.findIndex(s => s.name === message.to);
            if (serverIndex !== -1) {
                updatedScenario.servers = [...prev.servers];
                updatedScenario.servers[serverIndex] = {
                    ...prev.servers[serverIndex],
                    messageBox: {
                        ...prev.servers[serverIndex].messageBox,
                        [message.from]: [
                            ...(prev.servers[serverIndex].messageBox[message.from] || []),
                            message
                        ]
                    }
                };
            }
            
            return updatedScenario;
        });
    }, []);

    /**
     * Handle initiating a phone call
     * Updates recipient's state to "ring" if they are human
     */
    const handleMakeCall = useCallback(({ call }: CallInput) => {
        const step: AgenticMakeCallStep = {
            type: 'make-call',
            action: call
        };
        
        
        // Update scenario state directly
        setScenario(prev => {
            if (!prev) return prev;
            
            const updatedScenario: Scenario = { ...prev, steps: [...prev.steps, step] };
            
            // Update customer if they are the recipient
            if (call.to === 'customer') {
                updatedScenario.customer = {
                    ...prev.customer,
                    state: "ring"
                };
            }
            
            // Update server if they are the recipient
            const serverIndex = prev.servers.findIndex(s => s.name === call.to);
            if (serverIndex !== -1) {
                updatedScenario.servers = [...prev.servers];
                updatedScenario.servers[serverIndex] = {
                    ...prev.servers[serverIndex],
                    state: "ring"
                };
            }
            
            return updatedScenario;
        });
    }, []);

    /**
     * Handle accepting a phone call
     * Sets both caller and recipient state to "call" if they are human
     */
    const handleAcceptCall = useCallback(({ call }: CallInput) => {
        const step: AgenticAcceptCallStep = {
            type: 'accept-call',
            action: call
        };
        
        
        // Update scenario state directly
        setScenario(prev => {
            if (!prev) return prev;

            const updatedScenario: Scenario = { ...prev, steps: [...prev.steps, step] };
            
            // Update customer state
            if (call.from === 'customer') {
                updatedScenario.customer = {
                    ...prev.customer,
                    state: "call"
                };
            }
            if (call.to === 'customer') {
                updatedScenario.customer = {
                    ...prev.customer,
                    state: "call"
                };
            }
            
            // Update servers state
            const callerServerIndex = prev.servers.findIndex(s => s.name === call.from);
            const recipientServerIndex = prev.servers.findIndex(s => s.name === call.to);
            
            if (callerServerIndex !== -1 || recipientServerIndex !== -1) {
                updatedScenario.servers = [...prev.servers];
                
                if (callerServerIndex !== -1) {
                    updatedScenario.servers[callerServerIndex] = {
                        ...prev.servers[callerServerIndex],
                        state: "call"
                    };
                }
                
                if (recipientServerIndex !== -1) {
                    updatedScenario.servers[recipientServerIndex] = {
                        ...prev.servers[recipientServerIndex],
                        state: "call"
                    };
                }
            }
            
            return updatedScenario;
        });
    }, []);

    /**
     * Handle finishing a phone call
     * Resets both caller and recipient state to "message" if they are human
     */
    const handleFinishCall = useCallback(({ call }: CallInput) => {
        const step: AgenticFinishCallStep = {
            type: 'finish-call',
            action: call
        };
        
        // Update scenario state directly
        setScenario(prev => {
            if (!prev) return prev;
            
            const updatedScenario: Scenario = { ...prev, steps: [...prev.steps, step] };
            
            // Update customer state
            if (call.from === 'customer') {
                updatedScenario.customer = {
                    ...prev.customer,
                    state: "message"
                };
            }
            if (call.to === 'customer') {
                updatedScenario.customer = {
                    ...prev.customer,
                    state: "message"
                };
            }
            
            // Update servers state
            const callerServerIndex = prev.servers.findIndex(s => s.name === call.from);
            const recipientServerIndex = prev.servers.findIndex(s => s.name === call.to);
            
            if (callerServerIndex !== -1 || recipientServerIndex !== -1) {
                updatedScenario.servers = [...prev.servers];
                
                if (callerServerIndex !== -1) {
                    updatedScenario.servers[callerServerIndex] = {
                        ...prev.servers[callerServerIndex],
                        state: "message"
                    };
                }
                
                if (recipientServerIndex !== -1) {
                    updatedScenario.servers[recipientServerIndex] = {
                        ...prev.servers[recipientServerIndex],
                        state: "message"
                    };
                }
            }
            
            return updatedScenario;
        });
    }, []);

    /**
     * Handle API call to external service
     * Records the API call step in global steps
     */
    const handleAPICall = useCallback(({ apiCall }: APICallInput) => {
        const step: AgenticAPICallStep = {
            type: 'api-call',
            action: apiCall
        };
        
        setScenario(prev => {
            if(!prev) {
                return prev;
            }
            const updatedScenario: Scenario = { ...prev, steps: [...prev.steps, step] };
            return updatedScenario;
        })
    }, []);

    /**
     * Handle API response from external service
     * Records the API response step in global steps
     */
    const handleAPIResponse = useCallback(({ apiResponse }: APIResponseInput) => {
        const step: AgenticAPIResponseStep = {
            type: 'api-response',
            action: apiResponse
        };
        
setScenario(prev => {
            if(!prev) {
                return prev;
            }
            const updatedScenario: Scenario = { ...prev, steps: [...prev.steps, step] };
            return updatedScenario;
        })    }, []);

    /**
     * Reset the scenario state to initial state or load a new scenario
     * @param newScenario - Optional new scenario to load. If not provided, resets to empty state
     */
    const resetScenario = useCallback((newScenario?: Scenario) => {
        if (newScenario) {
            // Update scenario metadata
            setCurrentScenarioInfo({
                id: newScenario.id,
                title: newScenario.title,
                description: newScenario.description
            });

            // Set the complete scenario with fresh state
            const freshScenario: Scenario = {
                ...newScenario,
                // Reset AI agents with empty steps
                agents: newScenario.agents.map(agent => ({
                    ...agent,
                    steps: []
                })),
                // Reset customer with empty message box
                customer: {
                    ...newScenario.customer,
                    messageBox: {},
                    state: "message"
                },
                // Reset servers with empty message boxes
                servers: newScenario.servers.map(server => ({
                    ...server,
                    messageBox: {},
                    state: "message"
                })),
                steps: []
            };
            
            setScenario(freshScenario);
        } else {
            // Complete reset - clear all scenario info
            setScenario(prev => {
                if(!prev) {
                    return prev;
                }
                const updateScenario: Scenario = {
                    ...prev, 
                    customer: {...prev.customer, messageBox: {}, state: 'message'},
                    agents: [...prev.agents.map(a => ({...a, steps: []}))],
                    servers: [...prev.servers.map(s => ({...s, messageBox: {}, state: 'message'}) satisfies HumanState)],
                    steps: []
                };
                return updateScenario;
            });
        }
        
    }, []);

    /**
     * Memoized context value containing current scenario state and available actions
     */
    const contextValue: ScenarioContextType = useMemo(() => {
        if (!scenario) {
            // Return empty scenario when no scenario is loaded
            return {
                state: {
                    id: currentScenarioInfo.id,
                    title: currentScenarioInfo.title,
                    description: currentScenarioInfo.description,
                    agents: [],
                    customer: {
                        type: "human",
                        name: "customer",
                        state: "message",
                        messageBox: {}
                    },
                    servers: [],
                    steps: [],
                },
                active: {
                    agent: lastAgent || undefined,
                    server: lastServer || undefined
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
            };
        }

        return {
            state: scenario,
            active: {
                agent: lastAgent || undefined,
                server: lastServer || undefined
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
        };
    }, [scenario, currentScenarioInfo, lastAgent, lastServer, handleSendMessage, handleMakeCall, handleAcceptCall, handleFinishCall, handleAPICall, handleAPIResponse, resetScenario]);

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