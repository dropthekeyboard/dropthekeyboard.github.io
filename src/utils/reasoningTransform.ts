import type { AgenticStep } from '@/contexts/scenario';
import type { ReasoningStep, ReasoningContent } from '@/types/reasoning';
import { ACTION_TYPE_MAPPING, REASONING_TITLES } from '@/types/reasoning';

/**
 * Transform an array of AgenticSteps into ReasoningSteps for visualization
 * This creates a input→reasoning→output flow for each step that has reasoning
 */
export function transformToReasoningSteps(
  steps: AgenticStep[]
): ReasoningStep[] {
  const reasoningSteps: ReasoningStep[] = [];

  steps.forEach((step, index) => {
    const baseTimestamp = step.action.timestamp || Date.now() + index * 1000;
    const nextStep = steps[index + 1];

    // 1. Create input step for incoming actions (not from agents)
    if (isInputAction(step)) {
      reasoningSteps.push({
        id: `input-${baseTimestamp}`,
        type: 'input',
        timestamp: baseTimestamp,
        actionType: getActionType(step),
        actionIcon: getActionIcon(step),
        originalStep: step,
      });
    }

    // 2. Create output step for agent actions (moved before reasoning)
    if (isOutputAction(step)) {
      reasoningSteps.push({
        id: `output-${baseTimestamp}`,
        type: 'output',
        timestamp: baseTimestamp + 1,
        actionType: getActionType(step),
        actionIcon: getActionIcon(step),
        originalStep: step,
      });

      // 3. Create reasoning step only if next step has reasoning
      if (nextStep && 'reason' in nextStep.action && nextStep.action.reason) {
        reasoningSteps.push({
          id: `reasoning-${baseTimestamp}`,
          type: 'reasoning',
          timestamp: baseTimestamp + 2, // Show processing after output
          title: generateReasoningTitle(nextStep),
          reasoning: parseReasoningContent(nextStep.action.reason),
          originalStep: nextStep,
        });
      }
    }
  });

  return reasoningSteps.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Determine if an action represents input to the agent
 */
function isInputAction(step: AgenticStep): boolean {
  // Input actions are typically from customer or external services to the agent
  const from = step.action.from;
  return from !== 'customer_agent' && from !== 'ai_agent';
}

/**
 * Determine if an action represents output from the agent
 */
function isOutputAction(step: AgenticStep): boolean {
  // Output actions are from the agent to other entities
  const from = step.action.from;
  return from === 'customer_agent' || from === 'ai_agent';
}

/**
 * Get the action type for display purposes
 */
function getActionType(step: AgenticStep): string {
  const mapping = ACTION_TYPE_MAPPING[step.type];
  return mapping?.type || step.type.toUpperCase();
}

/**
 * Get the icon for the action type
 */
function getActionIcon(step: AgenticStep): string {
  const mapping = ACTION_TYPE_MAPPING[step.type];
  return mapping?.icon || '⚡';
}

/**
 * Generate a title for the reasoning step based on the action type
 */
function generateReasoningTitle(step: AgenticStep): string {
  const title = REASONING_TITLES[step.type];
  return title || 'Decision Process';
}

/**
 * Parse natural language reasoning into structured components
 * This function attempts to extract structured information from the reason text
 */
function parseReasoningContent(reasonText: string): ReasoningContent {
  // For now, we'll use basic heuristics to structure the reasoning
  // In a more sophisticated implementation, this could use NLP or predefined patterns

  const content: ReasoningContent = {};

  // Try to identify different components of reasoning
  const reasoningSegments = splitReasoningText(reasonText);

  // Extract situation analysis (usually at the beginning)
  if (reasoningSegments.situation) {
    content.situation = reasoningSegments.situation;
  }

  // Extract strategy/decision (usually contains keywords like "해야겠다", "위해", "하기 위해")
  if (reasoningSegments.strategy) {
    content.strategy = reasoningSegments.strategy;
  }

  // Extract final decision (usually the main action being taken)
  if (reasoningSegments.decision) {
    content.decision = reasoningSegments.decision;
  }

  // If we couldn't parse it structurally, use the entire text as strategy
  if (!content.situation && !content.strategy && !content.decision) {
    content.strategy = reasonText;
  }

  return content;
}

/**
 * Split reasoning text into logical segments
 * This is a basic implementation that can be enhanced with more sophisticated parsing
 */
function splitReasoningText(text: string): {
  situation?: string;
  strategy?: string;
  decision?: string;
} {
  // Korean text patterns for reasoning
  const decisionPatterns = [
    /(.+?)(해야겠다|하겠다|드려야겠다|해보겠다)/,
    /(.+?)(위해|하기 위해|때문에)/,
    /(.+?)(확인해|전달해|연결해|문의해)/,
  ];

  // Look for decision patterns
  for (const pattern of decisionPatterns) {
    const match = text.match(pattern);
    if (match) {
      const beforeDecision = match[1]?.trim();
      const decision = match[0]?.trim();

      // If there's content before the decision, it might be situation analysis
      if (beforeDecision && beforeDecision.length > 10) {
        return {
          situation: beforeDecision,
          decision: decision,
        };
      } else {
        return {
          strategy: decision,
        };
      }
    }
  }

  // If no patterns matched, try to split on common conjunctions
  const conjunctions = ['따라서', '그래서', '이제', '이후', '다음'];
  for (const conjunction of conjunctions) {
    if (text.includes(conjunction)) {
      const parts = text.split(conjunction);
      if (parts.length === 2) {
        return {
          situation: parts[0].trim(),
          strategy: `${conjunction} ${parts[1].trim()}`,
        };
      }
    }
  }

  // Default: return as strategy
  return {
    strategy: text,
  };
}

/**
 * Filter reasoning steps by a specific agent
 */
export function filterReasoningStepsByAgent(
  steps: ReasoningStep[],
  agentName: string
): ReasoningStep[] {
  return steps.filter((step) => {
    if (!step.originalStep) return false;

    const action = step.originalStep.action;
    return action.from === agentName || action.to === agentName;
  });
}

/**
 * Get the most recent reasoning step that's currently active
 */
export function getActiveReasoningStep(
  steps: ReasoningStep[],
  currentTimestamp?: number
): ReasoningStep | null {
  const timestamp = currentTimestamp || Date.now();
  const activeSteps = steps.filter((step) => step.timestamp <= timestamp);

  if (activeSteps.length === 0) return null;

  // Return the most recent step
  return activeSteps[activeSteps.length - 1];
}
