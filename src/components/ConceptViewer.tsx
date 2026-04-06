import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { getConcept } from '../concepts';
import { useConcept } from '../hooks/useConcept';
import { useTheme } from '../lib/theme';
import { ControlBar } from './ControlBar';
import { NotFound } from './NotFound';
import { StepDetailPanel } from './StepDetailPanel';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');
  const { theme, toggleTheme } = useTheme();
  const { currentStep, completedSteps, processingStep, isPlaying, play, pause, reset, next, prev } =
    useConcept(concept);

  const currentStepData = useMemo(() => concept?.steps.find((s) => s.id === currentStep), [concept, currentStep]);

  const stepIds = concept?.steps.map((s) => s.id) ?? [];
  const currentIndex = stepIds.indexOf(currentStep);

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
    return <NotFound />;
  }

  const Visualization = concept.Visualization;

  return (
    <div className="h-screen overflow-hidden bg-gray-950 flex flex-col">
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
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-700/50 px-3 py-2">
            <ControlBar
              canNext={currentIndex < stepIds.length - 1}
              canPrev={currentIndex > 0}
              onReset={reset}
              onNext={next}
              onPrev={prev}
            />
          </div>
        </main>

        {/* Right: Detail Panel */}
        <aside className="hidden md:flex md:flex-col w-[26rem] lg:w-[32rem] border-l border-gray-800/60 bg-gray-950/60 overflow-y-auto">
          {concept.DetailPanel ? (
            <concept.DetailPanel
              step={currentStepData}
              currentStep={currentStep}
              completedSteps={completedSteps}
              processingStep={processingStep}
              isPlaying={isPlaying}
              onPlay={play}
            />
          ) : (
            <StepDetailPanel step={currentStepData} />
          )}
        </aside>
      </div>
    </div>
  );
}
