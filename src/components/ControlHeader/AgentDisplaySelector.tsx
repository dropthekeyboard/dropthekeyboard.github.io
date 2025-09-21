import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Brain, Cpu, Eye, Monitor, Terminal } from 'lucide-react';
import { useAgentDisplayVariants } from '@/hooks/useAgentDisplayVariants';

interface AgentDisplaySelectorProps {
  className?: string;
}

const displayTypeConfig = {
  terminal: {
    icon: Terminal,
    label: 'Terminal',
    description: 'Terminal-style display',
    color: 'green',
  },
  reasoning: {
    icon: Brain,
    label: 'Reasoning',
    description: 'AI reasoning display',
    color: 'purple',
  },
} as const;

const terminalVariantConfig = {
  minimal: {
    icon: Eye,
    label: 'Minimal',
    description: 'Clean minimal terminal',
  },
  formal: {
    icon: Monitor,
    label: 'Formal',
    description: 'Professional terminal style',
  },
  hacker: {
    icon: Terminal,
    label: 'Hacker',
    description: 'Hacker-style terminal',
  },
} as const;

const reasoningVariantConfig = {
  compact: {
    icon: Cpu,
    label: 'Compact',
    description: 'Condensed minimal view',
  },
  normal: {
    icon: Brain,
    label: 'Normal',
    description: 'Standard reasoning display',
  },
} as const;

export function AgentDisplaySelector({
  className,
}: AgentDisplaySelectorProps) {
  const { value: displayType, setDisplayType } = useAgentDisplayVariants();

  const handleTypeChange = (type: 'terminal' | 'reasoning') => {
    if (type === 'terminal') {
      setDisplayType({ type: 'terminal', variants: 'minimal' });
    } else {
      setDisplayType({ type: 'reasoning', variants: 'normal' });
    }
  };

  const handleVariantChange = (variant: string) => {
    if (displayType.type === 'terminal') {
      setDisplayType({ type: 'terminal', variants: variant as 'minimal' | 'formal' | 'hacker' });
    } else {
      setDisplayType({ type: 'reasoning', variants: variant as 'compact' | 'normal' });
    }
  };

  return (
    <Card className={cn('p-3', className)}>
      <h3 className="font-semibold text-sm mb-3 flex items-center">
        <Brain className="w-4 h-4 mr-2" />
        Agent Display Configuration
      </h3>

      <div className="space-y-4">
        {/* Display Type Selection */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-muted-foreground uppercase tracking-wide">
            Display Type
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(displayTypeConfig) as [keyof typeof displayTypeConfig, typeof displayTypeConfig[keyof typeof displayTypeConfig]][]).map(
              ([type, config]) => {
                const Icon = config.icon;
                const isSelected = displayType.type === type;

                return (
                  <motion.button
                    key={type}
                    onClick={() => handleTypeChange(type as 'terminal' | 'reasoning')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'px-3 py-2 text-sm rounded border transition-all duration-200 flex flex-col items-center space-y-1',
                      isSelected
                        ? `border-${config.color}-500 bg-${config.color}-100 dark:bg-${config.color}-900/50 text-${config.color}-700 dark:text-${config.color}-300 ring-1 ring-${config.color}-500/20`
                        : `border-${config.color}-500/30 bg-${config.color}-50 dark:bg-${config.color}-950/30 text-${config.color}-700 dark:text-${config.color}-300 hover:bg-${config.color}-100 dark:hover:bg-${config.color}-900/50`
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
        </div>

        {/* Variant Selection */}
        <div>
          <h4 className="font-medium text-xs mb-2 text-muted-foreground uppercase tracking-wide">
            {displayType.type === 'terminal' ? 'Terminal Style' : 'Reasoning Style'}
          </h4>
          <div className="grid grid-cols-3 gap-1">
            {displayType.type === 'terminal' ? (
              (Object.entries(terminalVariantConfig) as [keyof typeof terminalVariantConfig, typeof terminalVariantConfig[keyof typeof terminalVariantConfig]][]).map(
                ([variant, config]) => {
                  const Icon = config.icon;
                  const isSelected = displayType.variants === variant;

                  return (
                    <motion.button
                      key={variant}
                      onClick={() => handleVariantChange(variant)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'px-2 py-1.5 text-xs rounded border transition-all duration-200 flex flex-col items-center space-y-1',
                        isSelected
                          ? 'border-green-500 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 ring-1 ring-green-500/20'
                          : 'border-green-500/30 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
                      )}
                      title={config.description}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="font-medium">{config.label}</span>
                    </motion.button>
                  );
                }
              )
            ) : (
              (Object.entries(reasoningVariantConfig) as [keyof typeof reasoningVariantConfig, typeof reasoningVariantConfig[keyof typeof reasoningVariantConfig]][]).map(
                ([variant, config]) => {
                  const Icon = config.icon;
                  const isSelected = displayType.variants === variant;

                  return (
                    <motion.button
                      key={variant}
                      onClick={() => handleVariantChange(variant)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'px-2 py-1.5 text-xs rounded border transition-all duration-200 flex flex-col items-center space-y-1',
                        isSelected
                          ? 'border-purple-500 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20'
                          : 'border-purple-500/30 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                      )}
                      title={config.description}
                    >
                      <Icon className="w-3 h-3" />
                      <span className="font-medium">{config.label}</span>
                    </motion.button>
                  );
                }
              )
            )}
          </div>
        </div>

        {/* Current Selection Display */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t border-border/50">
          <span>Current: </span>
          <span className="font-mono font-medium capitalize">
            {displayType.type} ({displayType.variants})
          </span>
        </div>
      </div>
    </Card>
  );
}