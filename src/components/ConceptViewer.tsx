import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';
import { useConcept } from '../hooks/useConcept';
import { useTheme } from '../lib/theme';
import { ControlBar } from './ControlBar';
import { StepDetailPanel } from './StepDetailPanel';
import { StepNav } from './StepNav';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');
  const { theme, toggleTheme } = useTheme();
  const { currentStep, completedSteps, processingStep, isPlaying, play, pause, reset, next, prev, jumpTo } =
    useConcept(concept);

  const currentStepData = useMemo(() => concept?.steps.find((s) => s.id === currentStep), [concept, currentStep]);

  const stepIds = concept?.steps.map((s) => s.id) ?? [];
  const currentIndex = stepIds.indexOf(currentStep);
  const canNext = currentIndex < stepIds.length - 1;
  const canPrev = currentIndex > 0;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          play();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev, play, pause, isPlaying]);

  if (!concept) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Concept not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const Visualization = concept.Visualization;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-50">{concept.title}</h1>
            <p className="text-xs text-gray-500">
              Step {currentIndex + 1} of {stepIds.length}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Left: Step Nav (desktop) */}
        <aside className="hidden sm:block w-60 lg:w-72 border-r border-gray-800/60 bg-gray-950/60 overflow-y-auto py-3 px-2">
          <StepNav
            steps={concept.steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            processingStep={processingStep}
            onStepClick={jumpTo}
          />
        </aside>

        {/* Center: Visualization */}
        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <Visualization
              currentStep={currentStep}
              completedSteps={completedSteps}
              processingStep={processingStep}
              isPlaying={isPlaying}
            />
          </div>

          {/* Control Bar overlay */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-xl px-4 py-2">
            <ControlBar
              isPlaying={isPlaying}
              canNext={canNext}
              canPrev={canPrev}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onNext={next}
              onPrev={prev}
            />
          </div>
        </main>

        {/* Right: Detail Panel */}
        <aside className="hidden md:block w-80 lg:w-96 border-l border-gray-800/60 bg-gray-950/60 overflow-hidden">
          {concept.DetailPanel ? (
            <concept.DetailPanel
              step={currentStepData}
              currentStep={currentStep}
              completedSteps={completedSteps}
              processingStep={processingStep}
              isPlaying={isPlaying}
            />
          ) : (
            <StepDetailPanel step={currentStepData} />
          )}
        </aside>
      </div>

      {/* Bottom: Step Nav (mobile) */}
      <div className="sm:hidden border-t border-gray-800/60 bg-gray-950/90 backdrop-blur-xl overflow-x-auto py-2">
        <StepNav
          steps={concept.steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          processingStep={processingStep}
          onStepClick={jumpTo}
        />
      </div>
    </div>
  );
}
