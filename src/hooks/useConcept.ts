import { useState } from 'react';
import type { Concept } from '../lib/types';

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');

  return {
    currentStep,
    completedSteps: [] as string[],
    processingStep: null as string | null,
    isPlaying: false,
    play: () => {},
    pause: () => {},
    reset: () => {},
    next: () => {},
    prev: () => {},
    jumpTo: (_stepId: string) => {},
  };
}
