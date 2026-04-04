import { motion } from 'framer-motion';
import {
  Binary,
  Check,
  Database,
  FileText,
  Filter,
  Loader2,
  MessageSquare,
  Scissors,
  Search,
  Sparkles,
} from 'lucide-react';
import type { ConceptStep } from '../lib/types';

const iconMap: Record<string, typeof FileText> = {
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
};

export function StepNav({
  steps,
  currentStep,
  completedSteps,
  processingStep,
  onStepClick,
}: {
  steps: ConceptStep[];
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  onStepClick: (stepId: string) => void;
}) {
  return (
    <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 px-2 sm:px-0">
      {steps.map((step, i) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.includes(step.id);
        const isProcessing = step.id === processingStep;
        const Icon = iconMap[step.icon] ?? Sparkles;

        return (
          <motion.button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all whitespace-nowrap sm:whitespace-normal min-w-fit sm:min-w-0 ${
              isActive
                ? 'bg-primary-600/20 border border-primary-500/30 text-gray-50'
                : isCompleted
                  ? 'bg-gray-800/40 text-gray-300 hover:bg-gray-800/60'
                  : 'text-gray-500 hover:bg-gray-800/30 hover:text-gray-400'
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500/30 text-primary-400'
                  : isCompleted
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-gray-500'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium truncate">{step.label}</p>
              <p className="text-xs text-gray-500 truncate hidden lg:block">{step.description}</p>
            </div>
            <span className="sm:hidden text-xs font-medium">{step.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
