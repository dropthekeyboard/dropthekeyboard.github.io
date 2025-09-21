import type { AgenticStep, ServerState } from '@/contexts/scenario';
import { useScenario } from '@/hooks/useScenario';
import { useTheme } from '@/hooks/useTheme';
import { SectionLabel } from '@/components/shared/SectionLabel';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Brain, Lightbulb, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { transformToReasoningSteps, filterReasoningStepsByAgent } from '@/utils/reasoningTransform';
import type { ReasoningStep } from '@/types/reasoning';

interface ReasoningAgentSectionProps {
  entity: ServerState | null;
  label: string;
  labelColor: string;
  sectionClass: string;
  steps?: AgenticStep[];
  entityName?: string;
  isActive?: boolean;
  variant?: 'minimal' | 'formal' | 'hacker' | 'reasoning';
}

// Reasoning Step Component
interface ReasoningStepComponentProps {
  step: ReasoningStep;
  isActive: boolean;
}

function ReasoningStepComponent({ step, isActive }: ReasoningStepComponentProps) {
  const { isDark } = useTheme();
  const getStepIcon = () => {
    switch (step.type) {
      case 'input':
        return '📥';
      case 'reasoning':
        return '🤔';
      case 'output':
        return '📤';
      default:
        return '⚡';
    }
  };

  const getStepColor = () => {
    switch (step.type) {
      case 'input':
        return isDark ? 'text-blue-400' : 'text-blue-600';
      case 'reasoning':
        return isDark ? 'text-purple-400' : 'text-purple-600';
      case 'output':
        return isDark ? 'text-green-400' : 'text-green-600';
      default:
        return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getBorderColor = () => {
    switch (step.type) {
      case 'input':
        return isDark ? 'border-blue-600/30' : 'border-blue-200';
      case 'reasoning':
        return isDark ? 'border-purple-600/30' : 'border-purple-200';
      case 'output':
        return isDark ? 'border-green-600/30' : 'border-green-200';
      default:
        return isDark ? 'border-gray-600/30' : 'border-gray-200';
    }
  };

  const getBackgroundColor = () => {
    switch (step.type) {
      case 'input':
        return isDark ? 'bg-blue-950/40' : 'bg-blue-50/80';
      case 'reasoning':
        return isDark ? 'bg-purple-950/40' : 'bg-purple-50/80';
      case 'output':
        return isDark ? 'bg-green-950/40' : 'bg-green-50/80';
      default:
        return isDark ? 'bg-gray-800/40' : 'bg-gray-50/80';
    }
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
          isActive && (isDark ? 'ring-2 ring-purple-400/60 animate-pulse' : 'ring-2 ring-purple-300 ring-opacity-60 animate-pulse')
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
            <p className="text-xs text-gray-500 dark:text-gray-400">Decision Making in Progress</p>
          </div>
        </div>

        {/* Reasoning Content */}
        {step.reasoning && (
          <div className="space-y-3">
            {step.reasoning.situation && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Situation Analysis</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 pl-6 leading-relaxed">
                  {step.reasoning.situation}
                </p>
              </div>
            )}

            {step.reasoning.requiredInfo && step.reasoning.requiredInfo.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">📋</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Required Information</span>
                </div>
                <ul className="text-sm text-gray-800 dark:text-gray-200 pl-6 space-y-1">
                  {step.reasoning.requiredInfo.map((info, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">•</span>
                      <span>{info}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.reasoning.strategy && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">🎯</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Strategy</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 pl-6 leading-relaxed">
                  {step.reasoning.strategy}
                </p>
              </div>
            )}

            {step.reasoning.evaluation && step.reasoning.evaluation.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">⚖️</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Evaluation Criteria</span>
                </div>
                <ul className="text-sm text-gray-800 dark:text-gray-200 pl-6 space-y-1">
                  {step.reasoning.evaluation.map((criterion, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">•</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step.reasoning.decision && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">✅</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Final Decision</span>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 pl-6 leading-relaxed font-medium">
                  {step.reasoning.decision}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Active indicator */}
        {isActive && (
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg" />
          </div>
        )}
      </motion.div>
    );
  }

  // Input/Output steps - simplified display
  return (
    <motion.div
      initial={{ opacity: 0, x: step.type === 'input' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: step.type === 'input' ? -20 : 20 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex items-center space-x-3 p-3 rounded-lg border backdrop-blur-sm',
        getBackgroundColor(),
        getBorderColor(),
        step.type === 'input' ? 'justify-start' : 'justify-end'
      )}
    >
      {step.type === 'input' && (
        <>
          <span className="text-xl">{step.actionIcon || getStepIcon()}</span>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className={cn('text-sm font-medium', getStepColor())}>
                {step.actionType || 'Input'}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Received</p>
          </div>
        </>
      )}

      {step.type === 'output' && (
        <>
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end space-x-2">
              <ArrowRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <span className={cn('text-sm font-medium', getStepColor())}>
                {step.actionType || 'Output'}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Sent</p>
          </div>
          <span className="text-xl">{step.actionIcon || getStepIcon()}</span>
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
    const agentSteps = state.steps.filter(
      (s: AgenticStep) =>
        s.action.from === (entityName || entity?.name) ||
        s.action.to === (entityName || entity?.name)
    );

    const transformedSteps = transformToReasoningSteps(agentSteps);
    return filterReasoningStepsByAgent(transformedSteps, entityName || entity?.name || '');
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
    if (reasoningSteps.length > 0) {
      const scrollToBottom = () => {
        if (lastStepRef.current) {
          lastStepRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest',
          });
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
        'relative flex flex-col h-[60vh] w-[20vw] mx-auto'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-6">
        <motion.div
          className={cn(
            'flex items-center space-x-3 rounded-lg px-4 py-2 border',
            isDark
              ? 'bg-gray-800/95 backdrop-blur-sm border-purple-600/30'
              : 'bg-white/95 backdrop-blur-sm border-purple-200/50'
          )}
        >
          <Brain className={cn('w-6 h-6', isDark ? 'text-purple-400' : 'text-purple-600')} />
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full animate-pulse',
              isDark ? 'bg-purple-400' : 'bg-purple-600'
            )} />
            <span className={cn(
              'text-sm font-mono',
              isDark ? 'text-purple-300' : 'text-purple-700'
            )}>AI_REASONING</span>
          </div>
          <Lightbulb className="w-5 h-5 text-yellow-500" />
        </motion.div>
      </div>

      {/* Section label */}
      <SectionLabel
        label={label}
        labelColor={labelColor}
        position="top-high"
        animation="fade"
        delay={0.2}
      />

      {/* Reasoning Flow Container */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto px-4 py-3 min-h-[200px] w-[20vw] custom-scrollbar will-change-scroll',
          'rounded-lg shadow-lg scroll-smooth',
          isDark
            ? 'bg-gray-800/95 backdrop-blur-md shadow-purple-500/10 border border-purple-600/30'
            : 'bg-white/95 backdrop-blur-md shadow-purple-500/10 border border-purple-200/50',
          isActive && (isDark
            ? 'ring-2 ring-purple-400/60'
            : 'ring-2 ring-purple-300 ring-opacity-60')
        )}
      >
        {/* Flow Header */}
        <div className={cn(
          'mb-4 pb-2 border-b',
          isDark
            ? 'border-purple-400/30 text-purple-300'
            : 'border-purple-500/30 text-purple-700'
        )}>
          <div className="flex items-center space-x-2 mb-1">
            <Brain className={cn('w-4 h-4', isDark ? 'text-purple-400' : 'text-purple-600')} />
            <span className="font-mono text-sm">reasoning_process --analyze</span>
          </div>
          <div className={cn(
            'text-xs',
            isDark ? 'text-purple-400/70' : 'text-purple-600/70'
          )}>
            Visualizing AI decision-making process | Agent: {entity?.name || 'AI Agent'}
          </div>
        </div>

        {/* Reasoning Steps */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {reasoningSteps.map((step, index) => (
              <div
                key={step.id}
                ref={index === reasoningSteps.length - 1 ? lastStepRef : null}
              >
                <ReasoningStepComponent
                  step={step}
                  isActive={isActive && index === reasoningSteps.length - 1}
                />

                {/* Connection line between steps */}
                {index < reasoningSteps.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-600 dark:to-gray-700" />
                  </div>
                )}
              </div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {reasoningSteps.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Brain className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-500" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Waiting for AI reasoning process...</p>
            </div>
          )}
        </div>

        {/* Process Indicator */}
        <div className={cn(
          'mt-4 pt-2 border-t',
          isDark ? 'border-purple-400/30' : 'border-purple-500/30'
        )}>
          <div className={cn(
            'flex items-center space-x-2',
            isDark ? 'text-purple-300' : 'text-purple-700'
          )}>
            <Brain className={cn('w-4 h-4', isDark ? 'text-purple-400' : 'text-purple-600')} />
            <span className="animate-pulse text-sm font-mono">
              {isActive ? 'Processing...' : 'Ready'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}