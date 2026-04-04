import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');

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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
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
          </div>
        </div>
      </header>
    </div>
  );
}
