import type { ConceptStep } from '../../lib/types';

export const RAG_COLOR = '#6366f1';

export const ragSteps: ConceptStep[] = [
  {
    id: 'input',
    label: 'Document Input',
    description: 'Paste or select a document to process',
    educationalText:
      'RAG starts with a knowledge source — a document, FAQ, article, or any text you want the AI to reference when answering questions.',
    deepDiveText:
      'The quality of your input document directly determines what the system can retrieve. Documents should be clean, well-structured text. Noisy data (HTML tags, boilerplate, duplicates) degrades retrieval quality. In production, a preprocessing pipeline typically handles extraction, cleaning, and deduplication before documents enter the RAG system.',
    icon: 'FileText',
  },
  {
    id: 'chunking',
    label: 'Chunking',
    description: 'Split the document into smaller pieces',
    educationalText:
      'Chunking breaks large documents into smaller pieces so retrieval can search them efficiently. Bad chunking can split meaning or hide useful context. Chunk size and overlap are critical parameters.',
    deepDiveText:
      'Common strategies include fixed-size character chunking, sentence-based splitting, and recursive chunking that respects paragraph/section boundaries. Smaller chunks improve precision but may lose context. Larger chunks preserve context but reduce retrieval specificity. Overlap (typically 10-20% of chunk size) helps avoid losing information at boundaries. Advanced methods use semantic chunking — splitting where topic shifts naturally occur.',
    icon: 'Scissors',
  },
  {
    id: 'embedding',
    label: 'Embeddings',
    description: 'Convert chunks into vector representations',
    educationalText:
      'Embeddings convert text into arrays of numbers (vectors) so the system can compare meaning instead of exact word matches. Similar meanings produce vectors that are close together in space.',
    deepDiveText:
      'Modern embedding models (like OpenAI text-embedding-3, Cohere embed, or open-source models like BGE/E5) produce dense vectors of 384-3072 dimensions. They are trained on massive text corpora using contrastive learning — pulling similar texts together and pushing dissimilar texts apart in vector space. The same model must be used for both document chunks and queries to ensure the vector spaces are compatible.',
    icon: 'Binary',
  },
];
