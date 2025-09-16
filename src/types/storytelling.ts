import type { AgenticStep } from '@/contexts/scenario';
import type { ComponentType } from 'react';

/**
 * Props passed to each story panel component
 */
export interface StoryPanelProps {
  panel: StoryPanel;
  isActive: boolean;
  progress: number; // Panel内 진행률 0-1
  agentStyle?: 'minimal' | 'formal' | 'hacker';
}

/**
 * Story panel configuration
 */
export interface StoryPanel {
  id: string;
  type: 'intro' | 'demo' | 'transition' | 'summary';
  title: string;
  description?: string;
  component: ComponentType<StoryPanelProps>;
  scrollRange: [number, number]; // [시작%, 끝%] 0-1 범위
  steps?: AgenticStep[]; // demo 패널의 경우만
  duration?: number; // 패널 완료 예상 시간 (ms)
  /**
   * Optional extra props passed to the panel component.
   * Used to avoid creating inline wrapper components (which cause remounts)
   * when a specific panel component needs additional props like demoType.
   */
  extraProps?: Record<string, unknown>;
}

/**
 * Return type for useScrollProgress hook
 */
export interface UseScrollProgressReturn {
  scrollProgress: number; // 전체 스크롤 진행률 0-1
  currentPanel: StoryPanel | null;
  currentPanelProgress: number; // 현재 패널 내 진행률 0-1
  previewStepIndex: number; // 현재 패널 내 미리보기 스텝 인덱스
  previewTotalSteps: number; // 현재 패널 내 전체 스텝 수
  bindScrollToProgress: boolean;
  setBindScrollToProgress: (bind: boolean) => void;
}

/**
 * Props for scroll progress indicator component
 */
export interface ScrollProgressIndicatorProps {
  panels: StoryPanel[];
  currentPanelId?: string;
  previewStepIndex: number;
  previewTotalSteps: number;
  scrollProgress: number; // 전체 스크롤 진행률 0-1
}

/**
 * Props for panel container component
 */
export interface PanelContainerProps {
  panel: StoryPanel;
  isActive: boolean;
  progress: number;
  agentStyle?: 'minimal' | 'formal' | 'hacker';
  style?: React.CSSProperties;
}
