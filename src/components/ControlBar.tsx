import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

export function ControlBar({
  isPlaying,
  canNext,
  canPrev,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrev,
}: {
  isPlaying: boolean;
  canNext: boolean;
  canPrev: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onReset}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700/60 hover:text-gray-50"
        title="Reset"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700/60 hover:text-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Previous step"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-gray-50 shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-primary-500/30 active:scale-95"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700/60 hover:text-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Next step"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
