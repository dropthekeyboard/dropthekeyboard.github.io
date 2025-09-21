import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Brain, Cpu, Eye, Monitor, Terminal } from 'lucide-react';
import { useAgentDisplayVariants } from '@/hooks/useAgentDisplayVariants';
import type { ReasoningVariant, TerminalVariant } from '@/contexts/reasoningVariant';

interface ReasoningVariantSelectorProps {
  className?: string;
}

const reasoningVariantConfig = {
  minimal: {
    icon: Eye,
    label: 'Minimal',
    description: 'Simple clean interface',
    selectedClasses: 'border-blue-500 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20',
    defaultClasses: 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50',
    textColor: 'text-blue-600 dark:text-blue-400',
  },
  formal: {
    icon: Monitor,
    label: 'Formal',
    description: 'Professional corporate style',
    selectedClasses: 'border-slate-500 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 ring-1 ring-slate-500/20',
    defaultClasses: 'border-slate-500/30 bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50',
    textColor: 'text-slate-600 dark:text-slate-400',
  },
  hacker: {
    icon: Terminal,
    label: 'Hacker',
    description: 'Terminal-style interface',
    selectedClasses: 'border-green-500 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 ring-1 ring-green-500/20',
    defaultClasses: 'border-green-500/30 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50',
    textColor: 'text-green-600 dark:text-green-400',
  },
  reasoning: {
    icon: Brain,
    label: 'Reasoning',
    description: 'Detailed thought process',
    selectedClasses: 'border-purple-500 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20',
    defaultClasses: 'border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50',
    textColor: 'text-purple-600 dark:text-purple-400',
  },
  compact: {
    icon: Cpu,
    label: 'Compact',
    description: 'Condensed minimal view',
    selectedClasses: 'border-orange-500 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 ring-1 ring-orange-500/20',
    defaultClasses: 'border-orange-500/30 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50',
    textColor: 'text-orange-600 dark:text-orange-400',
  },
} as const;

const terminalVariantConfig = {
  minimal: {
    icon: Eye,
    label: 'Minimal',
    description: 'Clean minimal terminal',
    selectedClasses: 'border-cyan-500 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 ring-1 ring-cyan-500/20',
    defaultClasses: 'border-cyan-500/30 bg-cyan-50 dark:bg-cyan-950/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50',
    textColor: 'text-cyan-600 dark:text-cyan-400',
  },
  formal: {
    icon: Monitor,
    label: 'Formal',
    description: 'Professional terminal style',
    selectedClasses: 'border-slate-500 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 ring-1 ring-slate-500/20',
    defaultClasses: 'border-slate-500/30 bg-slate-50 dark:bg-slate-950/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50',
    textColor: 'text-slate-600 dark:text-slate-400',
  },
  hacker: {
    icon: Terminal,
    label: 'Hacker',
    description: 'Hacker-style terminal',
    selectedClasses: 'border-green-500 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 ring-1 ring-green-500/20',
    defaultClasses: 'border-green-500/30 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50',
    textColor: 'text-green-600 dark:text-green-400',
  },
} as const;

export function ReasoningVariantSelector({
  className,
}: ReasoningVariantSelectorProps) {
  const {
    reasoningVariant,
    setReasoningVariant,
    terminalVariant,
    setTerminalVariant,
  } = useAgentDisplayVariants();

  return (
    <Card className={cn('p-3', className)}>
      <h3 className="font-semibold text-sm mb-3 flex items-center">
        <Brain className="w-4 h-4 mr-2" />
        Display Style Configuration
      </h3>

      <div className="space-y-4">
        {/* Reasoning Agent Variants */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-muted-foreground uppercase tracking-wide">
            Reasoning Agent Style
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(reasoningVariantConfig) as [ReasoningVariant, typeof reasoningVariantConfig[ReasoningVariant]][]).map(
              ([variant, config]) => {
                const Icon = config.icon;
                const isSelected = reasoningVariant === variant;

                return (
                  <motion.button
                    key={variant}
                    onClick={() => setReasoningVariant(variant)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'px-3 py-2 text-sm rounded border transition-all duration-200 flex flex-col items-center space-y-1',
                      isSelected ? config.selectedClasses : config.defaultClasses
                    )}
                    title={config.description}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{config.label}</span>
                  </motion.button>
                );
              }
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50 mt-3">
            <span>Current: </span>
            <span className={cn(
              'font-mono font-medium capitalize',
              reasoningVariantConfig[reasoningVariant as keyof typeof reasoningVariantConfig].textColor
            )}>
              {reasoningVariant === 'reasoning' ? 'Detailed' : 'Compact'}
            </span>
          </div>
        </div>

        {/* Terminal Variants */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-muted-foreground uppercase tracking-wide">
            Terminal Display Style
          </h4>
          <div className="grid grid-cols-3 gap-1">
            {(Object.entries(terminalVariantConfig) as [TerminalVariant, typeof terminalVariantConfig[TerminalVariant]][]).map(
              ([variant, config]) => {
                const Icon = config.icon;
                const isSelected = terminalVariant === variant;

                return (
                  <motion.button
                    key={variant}
                    onClick={() => setTerminalVariant(variant)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'px-2 py-1.5 text-xs rounded border transition-all duration-200 flex flex-col items-center space-y-1',
                      isSelected ? config.selectedClasses : config.defaultClasses
                    )}
                    title={config.description}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="font-medium">{config.label}</span>
                  </motion.button>
                );
              }
            )}
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50 mt-3">
            <span>Current: </span>
            <span className={cn(
              'font-mono font-medium capitalize',
              terminalVariantConfig[terminalVariant as keyof typeof terminalVariantConfig].textColor
            )}>
              {terminalVariant}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}