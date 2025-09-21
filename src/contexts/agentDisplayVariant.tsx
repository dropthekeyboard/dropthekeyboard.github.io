/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from 'react';

export type ReasoningVariant = 'compact' | 'reasoning';
export type TerminalVariant = 'minimal' | 'formal' | 'hacker';

interface TerminalAgentDisplayType {
  type: 'terminal';
  variants: TerminalVariant;
}

interface ReasoningAgentDisplayType {
  type: 'reasoning';
  variants: 'compact' | 'normal';
}

export type AgentDisplayType = TerminalAgentDisplayType | ReasoningAgentDisplayType;

export interface AgentDisplayVariantContextType {
  value: AgentDisplayType;
  setDisplayType: (value: AgentDisplayType) => void;
}

export const AgentDisplayVariantContext = createContext<AgentDisplayVariantContextType | undefined>(undefined);

interface AgentDisplayVariantProviderProps {
  children: ReactNode;
  defaultDisplayType?: AgentDisplayType;
}

export function AgentDisplayVariantProvider({
  children,
  defaultDisplayType = { type: 'reasoning', variants: 'normal' },
}: AgentDisplayVariantProviderProps) {
  const [displayType, setDisplayType] = useState<AgentDisplayType>(defaultDisplayType);

  return (
    <AgentDisplayVariantContext.Provider
      value={{
        value: displayType,
        setDisplayType
      }}
    >
      {children}
    </AgentDisplayVariantContext.Provider>
  );
}