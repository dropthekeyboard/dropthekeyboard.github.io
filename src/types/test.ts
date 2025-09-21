import type { ComponentType } from 'react';
import type { SlideProps } from './slide';

// Progress tracking types
export interface ProgressNode {
  id: string;
  type: 'slide' | 'scenario-intro' | 'scenario';
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

export interface TestScrollProgressState {
  currentSection: number;
  totalSections: number;
  overallProgress: number;
  sectionProgress: number;
}

// Extended section data with progress tracking
export interface TestSectionNode {
  type: 'slide' | 'scenario' | 'scenario-intro';
  title: string;
  pinned: boolean;
  pinEnd?: string;
  Component?: ComponentType<object> | ComponentType<SlideProps>;
  id?: string;
  description?: string;
  animationType?: 'fade' | 'slideUp' | 'slideDown' | 'scale';
  animationDelay?: number;
  enableAnimation?: boolean;
  isActive: boolean;
  isCompleted: boolean;
  progressPercentage: number;
}

// Scroll progress tracker props
export interface ScrollProgressTrackerProps {
  sections: ProgressNode[];
  onNodeClick: (index: number) => void;
  position?: 'left' | 'right';
  className?: string;
}

// Hook return type
export interface UseTestScrollProgressReturn {
  currentSectionIndex: number;
  scrollProgress: number;
  updateProgressNodes: (nodes: ProgressNode[]) => ProgressNode[];
}