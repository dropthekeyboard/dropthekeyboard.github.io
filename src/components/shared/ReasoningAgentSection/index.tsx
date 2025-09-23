import type { AgenticStep, ServerState } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';
import { useTheme } from '@/hooks/useTheme';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  ArrowRight,
  Download,
  Cpu,
  Upload,
  Zap,
  ClipboardList,
  Target,
  Scale,
  Settings,
} from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import {
  transformAndFilterByAgent,
} from '@/utils/reasoningTransform';
import type { ReasoningStep } from '@/types/reasoning';

interface ReasoningAgentSectionProps {
  entity: ServerState | null;
  label: string;
  labelColor: string;
  sectionClass: string;
  steps?: AgenticStep[];
  entityName?: string;
  isActive?: boolean;
  variant?: 'normal' | 'compact';
}

// Reasoning Step Component
interface ReasoningStepComponentProps {
  step: ReasoningStep;
  isActive: boolean;
  variant?: 'normal' | 'compact';
}

function ReasoningStepComponent({
  step,
  isActive,
  variant = 'normal',
}: ReasoningStepComponentProps) {
  const { isDark } = useTheme();

  // Compact mode - simplified display
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{
          opacity: 0,
          x: step.type === 'input' ? -20 : step.type === 'output' ? 20 : 0,
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{
          opacity: 0,
          x: step.type === 'input' ? -20 : step.type === 'output' ? 20 : 0,
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'flex items-center p-2 sm:p-3 rounded-lg border backdrop-blur-sm w-full',
          isDark
            ? 'bg-gray-800/40 border-gray-600/30'
            : 'bg-gray-50/60 border-gray-300/50',
          step.type === 'input'
            ? 'justify-start mr-auto max-w-[85%] sm:max-w-[75%]' // Input from others - align left
            : step.type === 'output'
              ? 'justify-end ml-auto max-w-[85%] sm:max-w-[75%]'   // Output from agent - align right
              : 'justify-center',
          isActive &&
            step.type === 'reasoning' &&
            (isDark
              ? 'ring-2 ring-gray-400/60 animate-pulse'
              : 'ring-2 ring-gray-500/60 animate-pulse')
        )}
      >
        {step.type === 'input' && (
          <div className="flex items-center space-x-3">
            <Download className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span
              className={cn(
                'text-sm font-medium truncate',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              {step.actionType
                ? `${step.actionType} Received`
                : 'Message Received'}
            </span>
          </div>
        )}

        {step.type === 'reasoning' && (
          <div className="flex flex-col items-center space-y-1">
            <div className="relative flex items-center">
              <motion.div
                animate={{
                  y: [0, -3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Cpu className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              </motion.div>
            </div>
            {/* Gear rotation at bottom */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="flex items-center justify-center"
            >
              <Settings className="w-3 h-3 text-purple-400 dark:text-purple-300 opacity-60" />
            </motion.div>
            <span
              className={cn(
                'text-sm font-medium',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              Processing...
            </span>
          </div>
        )}

        {step.type === 'output' && (
          <div className="flex items-center space-x-3">
            <span
              className={cn(
                'text-sm font-medium truncate',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              {step.actionType ? `${step.actionType} Sent` : 'Message Sent'}
            </span>
            <Upload className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
          </div>
        )}

        {isActive && step.type === 'reasoning' && (
          <div className="ml-2">
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
          </div>
        )}
      </motion.div>
    );
  }
  const getStepIcon = () => {
    switch (step.type) {
      case 'input':
        return <Download className="w-5 h-5" />;
      case 'reasoning':
        return <Cpu className="w-5 h-5" />;
      case 'output':
        return <Upload className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getStepColor = () => {
    return isDark ? 'text-gray-300' : 'text-gray-700';
  };

  const getBorderColor = () => {
    return isDark ? 'border-gray-600/30' : 'border-gray-300/50';
  };

  const getBackgroundColor = () => {
    return isDark ? 'bg-gray-800/40' : 'bg-gray-50/60';
  };

  if (step.type === 'reasoning') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'relative p-4 rounded-lg border-2 backdrop-blur-sm',
          getBackgroundColor(),
          getBorderColor(),
          isActive &&
            (isDark
              ? 'ring-2 ring-gray-400/60 animate-pulse'
              : 'ring-2 ring-gray-500/60 animate-pulse')
        )}
      >
        {/* Reasoning Header */}
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getStepIcon()}</span>
            <Brain className={cn('w-5 h-5', getStepColor())} />
          </div>
          <div>
            <h4 className={cn('font-semibold text-sm', getStepColor())}>
              {step.title || 'AI Reasoning Process'}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Decision Making in Progress
            </p>
          </div>
        </div>

        {/* Reasoning Content */}
        {step.reasoning && (
          <div className="space-y-3">
            {step.reasoning.requiredInfo &&
              step.reasoning.requiredInfo.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ClipboardList className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Required Information
                    </span>
                  </div>
                  <ul className="text-sm text-gray-800 dark:text-gray-200 pl-6 space-y-1">
                    {step.reasoning.requiredInfo.map((info, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          •
                        </span>
                        <span>{info}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {step.reasoning.strategy && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    Strategy
                  </span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 pl-6 leading-relaxed">
                  {step.reasoning.strategy}
                </p>
              </div>
            )}

            {step.reasoning.evaluation &&
              step.reasoning.evaluation.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Evaluation Criteria
                    </span>
                  </div>
                  <ul className="text-sm text-gray-800 dark:text-gray-200 pl-6 space-y-1">
                    {step.reasoning.evaluation.map((criterion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          •
                        </span>
                        <span>{criterion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {step.reasoning.decision && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    AI 생각중
                  </span>
                </div>
                <div className="pl-6">
                  <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                      {step.reasoning.decision}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse shadow-lg" />
          </div>
        )}
      </motion.div>
    );
  }

  // Input/Output steps - simplified display with proper alignment
  return (
    <motion.div
      initial={{ opacity: 0, x: step.type === 'input' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: step.type === 'input' ? -20 : 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex items-center p-2 sm:p-3 rounded-lg border backdrop-blur-sm w-full',
        getBackgroundColor(),
        getBorderColor(),
        step.type === 'input'
          ? 'justify-start mr-auto max-w-[85%] sm:max-w-[75%]' // Input from others - align left
          : 'justify-end ml-auto max-w-[85%] sm:max-w-[75%]'   // Output from agent - align right
      )}
    >
      {step.type === 'input' && (
        <>
          <Download className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="flex-1 ml-3 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={cn('text-sm font-medium truncate', getStepColor())}>
                {step.actionType || 'Input'}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Received</p>
          </div>
        </>
      )}

      {step.type === 'output' && (
        <>
          <div className="flex-1 mr-3 text-right min-w-0">
            <div className="flex items-center justify-end space-x-2">
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
              <span className={cn('text-sm font-medium truncate', getStepColor())}>
                {step.actionType || 'Output'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Sent</p>
          </div>
          <Upload className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
        </>
      )}
    </motion.div>
  );
}

export function ReasoningAgentSection({
  entity,
  label,
  labelColor,
  sectionClass,
  steps: externalSteps,
  entityName,
  isActive: externalIsActive = false,
  variant = 'normal',
}: ReasoningAgentSectionProps) {
  const { state: scenarioState } = useScenario();
  const { isDark } = useTheme();

  // Use external steps if provided, otherwise get from scenario
  const state = useMemo(
    () => (externalSteps ? { steps: externalSteps } : scenarioState),
    [externalSteps, scenarioState]
  );

  // Transform AgenticSteps to ReasoningSteps
  const reasoningSteps = useMemo(() => {
    const targetAgentName = entityName || entity?.name;
    if (!targetAgentName) return [];

    return transformAndFilterByAgent(state.steps, targetAgentName);
  }, [state.steps, entity, entityName]);

  // Determine if the section is active
  const isActive = useMemo(() => {
    if (externalIsActive !== false) return externalIsActive;

    if (reasoningSteps.length > 0) {
      const latestStep = reasoningSteps[reasoningSteps.length - 1];
      const timeSinceLatest = Date.now() - latestStep.timestamp;
      return timeSinceLatest < 3000; // 3 seconds
    }

    return false;
  }, [reasoningSteps, externalIsActive]);

  // Auto-scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reasoningSteps.length > 0 && scrollRef.current) {
      const scrollToBottom = () => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      };

      setTimeout(scrollToBottom, 200);
    }
  }, [reasoningSteps.length]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        sectionClass,
        'relative flex flex-col h-[70vh] w-full mx-auto'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <motion.div
          className={cn(
            'flex items-center space-x-3 rounded-lg px-4 py-2 border',
            isDark
              ? 'bg-gray-800/95 backdrop-blur-sm border-gray-600/30'
              : 'bg-white/95 backdrop-blur-sm border-gray-300/50'
          )}
        >
          <Brain
            className={cn(
              'w-6 h-6',
              isDark ? 'text-gray-400' : 'text-gray-600'
            )}
          />
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                'w-2 h-2 rounded-full animate-pulse',
                isDark ? 'bg-gray-400' : 'bg-gray-600'
              )}
            />
            <span
              className={cn(
                'text-sm font-mono',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              {variant === 'compact' ? 'AI' : 'AI_REASONING'}
            </span>
          </div>
          {variant !== 'compact' && (
            <Brain className="w-5 h-5 text-purple-500" />
          )}
        </motion.div>
      </div>

      {/* Section label */}
      {variant !== 'compact' && (
        <SectionLabel
          label={label}
          labelColor={labelColor}
          position="top-high"
          animation="fade"
          delay={0.2}
        />
      )}

      {/* Reasoning Flow Container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto px-4 py-3 min-h-[200px] w-full scrollbar-hide will-change-scroll',
          'rounded-lg shadow-lg scroll-smooth',
          isDark
            ? 'bg-gray-800/95 backdrop-blur-md shadow-gray-500/10 border border-gray-600/30'
            : 'bg-white/95 backdrop-blur-md shadow-gray-500/10 border border-gray-300/50',
          isActive &&
            (isDark ? 'ring-2 ring-gray-400/60' : 'ring-2 ring-gray-500/60')
        )}
      >
        {/* Flow Header */}
        {variant !== 'compact' && (
          <div
            className={cn(
              'mb-4 pb-2 border-b',
              isDark
                ? 'border-gray-400/30 text-gray-300'
                : 'border-gray-500/30 text-gray-700'
            )}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Brain
                className={cn(
                  'w-4 h-4',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}
              />
              <span className="font-mono text-sm">
                reasoning_process --analyze
              </span>
            </div>
            <div
              className={cn(
                'text-xs',
                isDark ? 'text-gray-400/70' : 'text-gray-600/70'
              )}
            >
              Visualizing AI decision-making process | Agent:{' '}
              {entity?.displayName || entity?.name || 'AI Agent'}
            </div>
          </div>
        )}

        {/* Reasoning Steps */}
        <div className="space-y-4 flex flex-col">
          <AnimatePresence mode="popLayout" initial={false}>
            {reasoningSteps.map((step, index) => (
              <div
                key={step.id}
                ref={index === reasoningSteps.length - 1 ? lastStepRef : null}
                className="flex flex-col w-full"
              >
                <ReasoningStepComponent
                  step={step}
                  isActive={isActive && index === reasoningSteps.length - 1}
                  variant={variant}
                />

                {/* Connection line between steps */}
                {index < reasoningSteps.length - 1 && variant !== 'compact' && (
                  <div className="flex justify-center my-2">
                    <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {reasoningSteps.length === 0 && variant !== 'compact' && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Waiting for AI reasoning process...
              </p>
            </div>
          )}
        </div>

        {/* Process Indicator */}
        {variant !== 'compact' && (
          <div
            className={cn(
              'mt-4 pt-2 border-t',
              isDark ? 'border-gray-400/30' : 'border-gray-500/30'
            )}
          >
            <div
              className={cn(
                'flex items-center space-x-2',
                isDark ? 'text-gray-300' : 'text-gray-700'
              )}
            >
              <Brain
                className={cn(
                  'w-4 h-4',
                  isDark ? 'text-gray-400' : 'text-gray-600'
                )}
              />
              <span className="animate-pulse text-sm font-mono">
                {isActive ? 'Processing...' : 'Ready'}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
