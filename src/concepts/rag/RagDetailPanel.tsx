import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { DetailPanelProps } from '../../lib/types';
import type { RagPipelineData } from './data';
import { REDIS_PIPELINE } from './data';
import {
  AnswerPanel,
  ChunkingPanel,
  EmbeddingPanel,
  InputPanel,
  PromptPanel,
  QueryPanel,
  RetrievalPanel,
  VectorDbPanel,
} from './RagPanels';

function StepDataSection({ currentStep, data }: { currentStep: string; data: RagPipelineData }) {
  const panels: Record<string, React.ReactNode> = {
    input: <InputPanel data={data} />,
    chunking: <ChunkingPanel data={data} />,
    embedding: <EmbeddingPanel data={data} />,
    vectordb: <VectorDbPanel data={data} />,
    query: <QueryPanel data={data} />,
    retrieval: <RetrievalPanel data={data} />,
    prompt: <PromptPanel data={data} />,
    answer: <AnswerPanel data={data} />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {panels[currentStep] ?? null}
      </motion.div>
    </AnimatePresence>
  );
}

export function RagDetailPanel({ step, currentStep }: DetailPanelProps) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  if (!step) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="h-full overflow-y-auto"
      >
        <div className="p-5 space-y-5">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
            <p className="text-sm text-gray-400">{step.description}</p>
          </div>

          {/* Step-specific data panel */}
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-4">
            <StepDataSection currentStep={currentStep} data={REDIS_PIPELINE} />
          </div>

          {/* Educational Content */}
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

          {/* Deep Dive */}
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
            <AnimatePresence>
              {deepDiveOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-400 leading-relaxed">{step.deepDiveText}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
