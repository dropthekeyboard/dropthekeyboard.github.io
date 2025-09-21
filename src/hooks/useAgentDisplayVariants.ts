import { useContext } from 'react';
import { 
  ReasoningVariantContext, 
  type ReasoningVariantContextType,
  type ReasoningVariant,
  type TerminalVariant
} from '@/contexts/reasoningVariant';

export function useAgentDisplayVariants(): ReasoningVariantContextType {
  const context = useContext(ReasoningVariantContext);
  if (context === undefined) {
    throw new Error('useAgentDisplayVariants must be used within a ReasoningVariantProvider');
  }
  return context;
}

// Optional hook for components that may or may not have the context
export function useOptionalAgentDisplayVariants(): ReasoningVariantContextType | null {
  return useContext(ReasoningVariantContext) || null;
}

// Alias for easier consumption
export function useReasoningVariantOnly(): {
  variant: ReasoningVariant;
  setVariant: (variant: ReasoningVariant) => void;
} {
  const { reasoningVariant, setReasoningVariant } = useAgentDisplayVariants();
  return { variant: reasoningVariant, setVariant: setReasoningVariant };
}

export function useTerminalVariant(): {
  variant: TerminalVariant;
  setVariant: (variant: TerminalVariant) => void;
} {
  const { terminalVariant, setTerminalVariant } = useAgentDisplayVariants();
  return { variant: terminalVariant, setVariant: setTerminalVariant };
}

export function useOptionalTerminalVariant(): {
  variant: TerminalVariant;
  setVariant: (variant: TerminalVariant) => void;
} | null {
  const context = useOptionalAgentDisplayVariants();
  if (!context) return null;
  
  const { terminalVariant, setTerminalVariant } = context;
  return { variant: terminalVariant, setVariant: setTerminalVariant };
}