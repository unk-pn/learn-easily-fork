import { motion } from 'framer-motion';
import { ArrowRight, Brain, Database, GitBranch, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Concept } from '../lib/types';

const categoryIcons: Record<string, typeof Brain> = {
  'AI & ML': Brain,
  Algorithms: GitBranch,
  Databases: Database,
  'System Design': Server,
};

const difficultyColors: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export function ConceptCard({ concept, index }: { concept: Concept; index: number }) {
  const CategoryIcon = categoryIcons[concept.category] ?? Brain;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Link
        to={`/learn/${concept.id}`}
        className="group block rounded-2xl border border-gray-700/50 bg-gray-900/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-primary-500/50 hover:bg-gray-800/60 hover:shadow-lg hover:shadow-primary-500/5"
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${concept.color}20` }}
          >
            <CategoryIcon className="h-6 w-6" style={{ color: concept.color }} />
          </div>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColors[concept.difficulty]}`}
          >
            {concept.difficulty}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-50 mb-1 group-hover:text-primary-400 transition-colors">
          {concept.title}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{concept.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{concept.steps.length} steps</span>
          <span className="text-xs text-primary-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            Start learning <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
