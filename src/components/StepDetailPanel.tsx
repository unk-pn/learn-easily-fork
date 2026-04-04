import { BookOpen, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { ConceptStep } from '../lib/types';

export function StepDetailPanel({ step }: { step: ConceptStep | undefined }) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  if (!step) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
          <p className="text-sm text-gray-400">{step.description}</p>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-800/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/20">
              <BookOpen className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-50 mb-2">How it works</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{step.educationalText}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-800/30">
          <button
            type="button"
            onClick={() => setDeepDiveOpen(!deepDiveOpen)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent-500" />
              <span className="text-sm font-medium text-gray-200">Deep Dive</span>
            </div>
            {deepDiveOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {deepDiveOpen && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-400 leading-relaxed">{step.deepDiveText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
