import { useCallback, useState } from 'react';
import type { Concept } from '../lib/types';

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setProcessingStep(null);
    setCompletedSteps([]);
    setCurrentStep(stepIds[0] ?? '');
  }, [stepIds]);

  const next = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx < stepIds.length - 1) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep(stepIds[idx + 1]);
    }
  }, [stepIds, currentStep]);

  const prev = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(stepIds[idx - 1]);
    }
  }, [stepIds, currentStep]);

  const jumpTo = useCallback(
    (stepId: string) => {
      if (stepIds.includes(stepId)) {
        setCurrentStep(stepId);
      }
    },
    [stepIds],
  );

  return {
    currentStep,
    completedSteps,
    processingStep,
    isPlaying,
    play: () => {},
    pause: () => {},
    reset,
    next,
    prev,
    jumpTo,
  };
}
