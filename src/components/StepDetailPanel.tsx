import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp, Code2, Lightbulb } from 'lucide-react';
import { Highlight, themes } from 'prism-react-renderer';
import { useState } from 'react';
import type { ConceptStep } from '../lib/types';

function renderDeepDive(text: string) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        if (line.startsWith('•')) {
          const content = line.slice(1).trim();
          const dashIdx = content.indexOf(' — ');
          return (
            <div key={i} className="flex gap-2 leading-relaxed">
              <span className="text-primary-400 shrink-0 mt-0.5 text-xs">▸</span>
              <span className="text-sm text-gray-400">
                {dashIdx !== -1 ? (
                  <>
                    <span className="text-gray-300">{content.slice(0, dashIdx)}</span>
                    <span className="text-gray-500"> —</span>
                    <span>{content.slice(dashIdx + 2)}</span>
                  </>
                ) : (
                  content
                )}
              </span>
            </div>
          );
        }
        return (
          <p key={i} className="text-xs font-semibold uppercase tracking-wider text-accent-500/80 pt-3 first:pt-0">
            {line}
          </p>
        );
      })}
    </div>
  );
}

const LANGUAGE_LABELS: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  typescript: 'TypeScript',
  cpp: 'C++',
  go: 'Go',
};

export function StepDetailPanel({ step }: { step: ConceptStep | undefined }) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<string>('python');

  const langs = step?.codeSnippets ? Object.keys(step.codeSnippets) : [];
  // If the selected language isn't available for this step, fall back to first
  const activeLang = langs.includes(selectedLang) ? selectedLang : (langs[0] ?? '');
  const activeCode = step?.codeSnippets?.[activeLang] ?? '';

  if (!step) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step.id}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="p-5 space-y-5">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
            <p className="text-sm text-gray-400">{step.description}</p>
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

          {/* Code Snippets */}
          {step.codeSnippets && langs.length > 0 && (
            <div className="rounded-xl border border-gray-700/50 bg-gray-950/70 overflow-hidden">
              {/* Toolbar: icon + language tabs */}
              <div className="flex items-center border-b border-gray-700/50 bg-gray-900/80">
                <div className="flex items-center gap-2 px-3 py-2 border-r border-gray-700/30 shrink-0">
                  <Code2 className="h-4 w-4 text-primary-400" />
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Code</span>
                </div>
                <div className="flex items-center gap-0.5 px-2 overflow-x-auto">
                  {langs.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLang(lang)}
                      className={[
                        'px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap',
                        lang === selectedLang
                          ? 'bg-primary-500/20 text-primary-300 border border-primary-500/30'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/40',
                      ].join(' ')}
                    >
                      {LANGUAGE_LABELS[lang] ?? lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Syntax-highlighted code */}
              <Highlight theme={themes.vsDark} code={activeCode} language={selectedLang}>
                {({ tokens, getLineProps, getTokenProps }) => (
                  <pre className="overflow-x-auto p-4 text-xs font-mono leading-relaxed m-0 bg-transparent">
                    {tokens.map((line, i) => (
                      <div key={i} {...getLineProps({ line })}>
                        <span className="select-none pr-4 text-gray-600 text-right inline-block w-7">{i + 1}</span>
                        {line.map((token, key) => (
                          <span key={key} {...getTokenProps({ token })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            </div>
          )}

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
                  <div className="px-4 pb-4">{renderDeepDive(step.deepDiveText)}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
