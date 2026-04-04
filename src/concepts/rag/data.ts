// Types for RAG pipeline data

export interface SampleDocument {
  id: string;
  title: string;
  description: string;
  text: string;
}

export interface DocumentStats {
  sentenceCount: number;
  wordCount: number;
  charCount: number;
  estimatedTokens: number;
}

export interface Chunk {
  id: number;
  text: string;
}

export interface SimilarityResult {
  chunkId: number;
  score: number;
  rank: number;
}

export interface PipelineConfig {
  chunkSize: number;
  chunkOverlap: number;
  chunkingStrategy: string;
  topK: number;
  embeddingModel: string;
  llmModel: string;
}

export interface RagPipelineData {
  document: SampleDocument;
  query: string;
  config: PipelineConfig;
  documentStats: DocumentStats;
  chunks: Chunk[];
  embeddingDimensions: number;
  embeddingSamples: number[][];
  queryEmbeddingSample: number[];
  similarityResults: SimilarityResult[];
  topChunks: SimilarityResult[];
  prompt: string;
  answer: string;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [];

export const DEFAULT_CONFIG: PipelineConfig = {
  chunkSize: 200,
  chunkOverlap: 20,
  chunkingStrategy: 'sentence',
  topK: 3,
  embeddingModel: 'all-MiniLM-L6-v2',
  llmModel: 'llama-3.1-8b-instant',
};

export const REDIS_PIPELINE: RagPipelineData = {
  document: { id: '', title: '', description: '', text: '' },
  query: '',
  config: DEFAULT_CONFIG,
  documentStats: { sentenceCount: 0, wordCount: 0, charCount: 0, estimatedTokens: 0 },
  chunks: [],
  embeddingDimensions: 384,
  embeddingSamples: [],
  queryEmbeddingSample: [],
  similarityResults: [],
  topChunks: [],
  prompt: '',
  answer: '',
};
