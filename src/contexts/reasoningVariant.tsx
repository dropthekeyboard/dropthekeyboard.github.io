import { createContext, useState, type ReactNode } from 'react';

export type ReasoningVariant = 'compact' | 'reasoning';
export type TerminalVariant = 'minimal' | 'formal' | 'hacker';

export interface ReasoningVariantContextType {
  reasoningVariant: ReasoningVariant;
  setReasoningVariant: (variant: ReasoningVariant) => void;
  terminalVariant: TerminalVariant;
  setTerminalVariant: (variant: TerminalVariant) => void;
}

export const ReasoningVariantContext = createContext<ReasoningVariantContextType | undefined>(undefined);

interface ReasoningVariantProviderProps {
  children: ReactNode;
  defaultReasoningVariant?: ReasoningVariant;
  defaultTerminalVariant?: TerminalVariant;
}

export function ReasoningVariantProvider({
  children,
  defaultReasoningVariant = 'reasoning',
  defaultTerminalVariant = 'minimal',
}: ReasoningVariantProviderProps) {
  const [reasoningVariant, setReasoningVariant] = useState<ReasoningVariant>(defaultReasoningVariant);
  const [terminalVariant, setTerminalVariant] = useState<TerminalVariant>(defaultTerminalVariant);

  return (
    <ReasoningVariantContext.Provider 
      value={{ 
        reasoningVariant, 
        setReasoningVariant,
        terminalVariant,
        setTerminalVariant
      }}
    >
      {children}
    </ReasoningVariantContext.Provider>
  );
}