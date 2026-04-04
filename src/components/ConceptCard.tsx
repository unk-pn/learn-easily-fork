import { Link } from 'react-router-dom';
import type { Concept } from '../lib/types';

export function ConceptCard({ concept }: { concept: Concept; index: number }) {
  return (
    <Link
      to={`/learn/${concept.id}`}
      className="group block rounded-2xl border border-gray-700/50 bg-gray-900/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-primary-500/50 hover:bg-gray-800/60"
    >
      <h3 className="text-lg font-semibold text-gray-50 mb-1 group-hover:text-primary-400 transition-colors">
        {concept.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{concept.description}</p>
      <span className="text-xs text-gray-500">{concept.steps.length} steps</span>
    </Link>
  );
}
