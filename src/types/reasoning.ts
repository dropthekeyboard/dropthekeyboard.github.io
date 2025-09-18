import type { AgenticStep } from '@/contexts/scenario';

/**
 * Reasoning step types for the AI agent decision process
 */
export type ReasoningStepType = 'input' | 'reasoning' | 'output';

/**
 * Structured reasoning content that breaks down the AI's decision-making process
 */
export interface ReasoningContent {
  /** Current situation analysis */
  situation?: string;
  /** Required information for decision making */
  requiredInfo?: string[];
  /** Optimal strategy determined by the AI */
  strategy?: string;
  /** Evaluation criteria being considered */
  evaluation?: string[];
  /** Final decision made by the AI */
  decision?: string;
}

/**
 * Reasoning-focused step interface for visualizing AI agent decision process
 */
export interface ReasoningStep {
  /** Unique identifier for the reasoning step */
  id: string;
  /** Type of reasoning step */
  type: ReasoningStepType;
  /** Timestamp when this step occurred */
  timestamp: number;

  // Input/Output step properties
  /** Action type for display (e.g., 'SMS', 'Call', 'API', 'Response') */
  actionType?: string;
  /** Icon for visual representation (emoji or icon name) */
  actionIcon?: string;

  // Reasoning step properties
  /** Title/heading for the reasoning step */
  title?: string;
  /** Structured reasoning content */
  reasoning?: ReasoningContent;

  /** Reference to the original AgenticStep that generated this reasoning step */
  originalStep?: AgenticStep;
}

/**
 * Action type mapping for consistent iconography
 */
export const ACTION_TYPE_MAPPING = {
  'send-message': {
    type: 'SMS',
    icon: '=ñ'
  },
  'make-call': {
    type: 'Call',
    icon: '=Þ'
  },
  'accept-call': {
    type: 'Answer',
    icon: ''
  },
  'finish-call': {
    type: 'Hangup',
    icon: '=ô'
  },
  'api-call': {
    type: 'API',
    icon: '='
  },
  'api-response': {
    type: 'Response',
    icon: '=Ê'
  }
} as const;

/**
 * Reasoning titles based on action types
 */
export const REASONING_TITLES = {
  'send-message': 'Message Analysis',
  'make-call': 'Call Decision',
  'accept-call': 'Call Acceptance',
  'finish-call': 'Call Termination',
  'api-call': 'Data Request',
  'api-response': 'Response Processing'
} as const;