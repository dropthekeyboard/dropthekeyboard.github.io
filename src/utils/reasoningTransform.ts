import type { AgenticStep } from '@/contexts/scenario';
import type { ReasoningStep, ReasoningContent } from '@/types/reasoning';
import { ACTION_TYPE_MAPPING, REASONING_TITLES } from '@/types/reasoning';

/**
 * Transform an array of AgenticSteps into ReasoningSteps for visualization
 * This creates a input→reasoning→output flow for each step that has reasoning
 */
export function transformToReasoningSteps(
  steps: AgenticStep[],
  targetAgentName?: string
): ReasoningStep[] {
  const reasoningSteps: ReasoningStep[] = [];

  steps.forEach((step, index) => {
    const baseTimestamp = step.action.timestamp || Date.now() + index * 1000;

    // 1. Create input step for incoming actions (to this agent)
    if (isInputAction(step, targetAgentName)) {
      reasoningSteps.push({
        id: `input-${baseTimestamp}`,
        type: 'input',
        timestamp: baseTimestamp,
        actionType: getActionType(step),
        actionIcon: getActionIcon(step),
        originalStep: step,
      });
    }

    // 2. Create output step for agent actions (from this agent)
    if (isOutputAction(step, targetAgentName)) {
      reasoningSteps.push({
        id: `output-${baseTimestamp}`,
        type: 'output',
        timestamp: baseTimestamp + 1,
        actionType: getActionType(step),
        actionIcon: getActionIcon(step),
        originalStep: step,
      });

      // 3. Create reasoning step if this step has reasoning
      if ('reason' in step.action && step.action.reason) {
        reasoningSteps.push({
          id: `reasoning-${baseTimestamp}`,
          type: 'reasoning',
          timestamp: baseTimestamp + 2, // Show processing after output
          title: generateReasoningTitle(step),
          reasoning: parseReasoningContent(step.action.reason),
          originalStep: step,
        });
      }
    }
  });

  return reasoningSteps.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Determine if an action represents input to the agent
 */
function isInputAction(step: AgenticStep, targetAgentName?: string): boolean {
  if (!targetAgentName) return false;

  // Input actions are those directed TO this agent (agent is the recipient)
  return step.action.to === targetAgentName && step.action.from !== targetAgentName;
}

/**
 * Determine if an action represents output from the agent
 */
function isOutputAction(step: AgenticStep, targetAgentName?: string): boolean {
  if (!targetAgentName) return false;

  // Output actions are those initiated BY this agent (agent is the sender)
  return step.action.from === targetAgentName;
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
 * Transform AgenticSteps to ReasoningSteps and filter by agent in one step
 */
export function transformAndFilterByAgent(
  steps: AgenticStep[],
  agentName: string
): ReasoningStep[] {
  // First filter relevant steps for this agent
  const agentSteps = steps.filter(
    (s: AgenticStep) =>
      s.action.from === agentName || s.action.to === agentName
  );

  // Then transform with proper agent context
  return transformToReasoningSteps(agentSteps, agentName);
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
