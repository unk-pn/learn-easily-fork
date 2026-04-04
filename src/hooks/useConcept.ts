import { useCallback, useEffect, useRef, useState } from 'react';
import type { Concept } from '../lib/types';

const STEP_DELAY_MS = 1200;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const abortRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Reset when concept changes
  const firstStepId = concept?.steps[0]?.id ?? '';
  useEffect(() => {
    setCurrentStep(firstStepId);
    setCompletedSteps([]);
    setProcessingStep(null);
    setIsPlaying(false);
    abortRef.current = true;
  }, [firstStepId]);

  const play = useCallback(async () => {
    if (!stepIds.length) return;
    abortRef.current = false;
    setIsPlaying(true);

    const startIndex = Math.max(stepIds.indexOf(currentStep), 0);
    const completed: string[] = stepIds.slice(0, startIndex);

    for (let i = startIndex; i < stepIds.length; i++) {
      if (abortRef.current) break;
      const stepId = stepIds[i];
      setProcessingStep(stepId);
      setCurrentStep(stepId);
      await delay(STEP_DELAY_MS);
      if (abortRef.current) break;
      completed.push(stepId);
      setCompletedSteps([...completed]);
    }

    setProcessingStep(null);
    setIsPlaying(false);
  }, [stepIds, currentStep]);

  const pause = useCallback(() => {
    abortRef.current = true;
    setIsPlaying(false);
    setProcessingStep(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
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
    play,
    pause,
    reset,
    next,
    prev,
    jumpTo,
  };
}
