import type { ComponentType } from 'react';

export const ConceptCategory = {
  AI_ML: 'AI & ML',
  ALGORITHMS: 'Algorithms',
  DATABASES: 'Databases',
  SYSTEM_DESIGN: 'System Design',
} as const;

export type ConceptCategory = (typeof ConceptCategory)[keyof typeof ConceptCategory];

export const Difficulty = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface ConceptStep {
  id: string;
  label: string;
  description: string;
  educationalText: string;
  deepDiveText: string;
  icon: string;
}

export interface VisualizationProps {
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  isPlaying: boolean;
}

export interface DetailPanelProps {
  step: ConceptStep | undefined;
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  isPlaying: boolean;
}

export interface Concept {
  id: string;
  title: string;
  description: string;
  category: ConceptCategory;
  difficulty: Difficulty;
  icon: string;
  color: string;
  steps: ConceptStep[];
  Visualization: ComponentType<VisualizationProps>;
  DetailPanel?: ComponentType<DetailPanelProps>;
}
