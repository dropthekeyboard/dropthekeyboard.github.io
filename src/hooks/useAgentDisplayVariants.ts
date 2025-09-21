import { useContext } from 'react';
import {
  AgentDisplayVariantContext,
  type AgentDisplayVariantContextType,
  type ReasoningVariant,
  type TerminalVariant
} from '@/contexts/agentDisplayVariant';

export function useAgentDisplayVariants(): AgentDisplayVariantContextType {
  const context = useContext(AgentDisplayVariantContext);
  if (context === undefined) {
    throw new Error('useAgentDisplayVariants must be used within a AgentDisplayVariantProvider');
  }
  return context;
}

// Optional hook for components that may or may not have the context
export function useOptionalAgentDisplayVariants(): AgentDisplayVariantContextType | null {
  return useContext(AgentDisplayVariantContext) || null;
}

// Alias for easier consumption - reasoning variant
export function useReasoningVariantOnly(): {
  variant: ReasoningVariant;
  setVariant: (variant: ReasoningVariant) => void;
} {
  const { value, setDisplayType } = useAgentDisplayVariants();

  const variant = value.type === 'reasoning'
    ? (value.variants === 'normal' ? 'reasoning' : 'compact')
    : 'reasoning'; // fallback

  const setVariant = (newVariant: ReasoningVariant) => {
    setDisplayType({
      type: 'reasoning',
      variants: newVariant === 'reasoning' ? 'normal' : 'compact'
    });
  };

  return { variant, setVariant };
}

export function useTerminalVariant(): {
  variant: TerminalVariant;
  setVariant: (variant: TerminalVariant) => void;
} {
  const { value, setDisplayType } = useAgentDisplayVariants();

  const variant = value.type === 'terminal' ? value.variants : 'minimal'; // fallback

  const setVariant = (newVariant: TerminalVariant) => {
    setDisplayType({
      type: 'terminal',
      variants: newVariant
    });
  };

  return { variant, setVariant };
}

export function useOptionalTerminalVariant(): {
  variant: TerminalVariant;
  setVariant: (variant: TerminalVariant) => void;
} | null {
  const context = useOptionalAgentDisplayVariants();
  if (!context) return null;

  const { value, setDisplayType } = context;

  const variant = value.type === 'terminal' ? value.variants : 'minimal';
  const setVariant = (newVariant: TerminalVariant) => {
    setDisplayType({
      type: 'terminal',
      variants: newVariant
    });
  };

  return { variant, setVariant };
}