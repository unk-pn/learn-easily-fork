import { ConceptCategory, Difficulty } from '../../lib/types';
import { registerConcept } from '../registry';
import { RagDetailPanel } from './RagDetailPanel';
import { RagVisualization } from './RagVisualization';
import { RAG_COLOR, ragSteps } from './steps';

registerConcept({
  id: 'rag',
  title: 'RAG (Retrieval-Augmented Generation)',
  description:
    'Learn how RAG works step by step — from raw text and chunking to embeddings, retrieval, prompt construction, and final LLM answer generation.',
  category: ConceptCategory.AI_ML,
  difficulty: Difficulty.INTERMEDIATE,
  icon: 'Brain',
  color: RAG_COLOR,
  steps: ragSteps,
  Visualization: RagVisualization,
  DetailPanel: RagDetailPanel,
});
