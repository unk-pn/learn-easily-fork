import { motion } from 'framer-motion';
import { Moon, Search, Sparkles, Sun } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getAllConcepts } from '../concepts';
import { useTheme } from '../lib/theme';
import { ConceptCategory } from '../lib/types';
import { ConceptCard } from './ConceptCard';

const CATEGORIES = ['All', ...Object.values(ConceptCategory)];

export function HomePage() {
  const concepts = getAllConcepts();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { theme, toggleTheme } = useTheme();

  const filtered = useMemo(() => {
    return concepts.filter((c) => {
      const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
      const matchesSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [concepts, activeCategory, search]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800/60 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-50">Learn Easily</h1>
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

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-50 mb-3">
            Learn concepts <span className="text-primary-400">interactively</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Step-by-step visual walkthroughs with interactive diagrams. Pick a concept and understand it from the ground
            up.
          </p>
        </motion.div>
      </section>

      {/* Filters */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-gray-50'
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700/50 bg-gray-900/60 py-2 pl-9 pr-4 text-sm text-gray-50 placeholder-gray-500 focus:border-primary-500/50 focus:outline-none focus:ring-1 focus:ring-primary-500/30"
            />
          </div>
        </div>
      </section>

      {/* Concept Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((concept, i) => (
              <ConceptCard key={concept.id} concept={concept} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No concepts found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </section>
    </div>
  );
}
