import type {
  AgenticStep,
  AIAgentState,
  HumanState,
} from '@/contexts/scenario';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRelevantAction(
  action: AgenticStep,
  entity?: AIAgentState | HumanState
) {
  if (!entity) {
    return false;
  }
  return action.action.to === entity.name || action.action.from === entity.name;
}
