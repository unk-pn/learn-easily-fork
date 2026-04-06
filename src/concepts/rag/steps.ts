import type { ConceptStep } from '../../lib/types';

export const RAG_COLOR = '#6366f1';

export const ragSteps: ConceptStep[] = [
  {
    id: 'input',
    label: 'Document Input',
    description: 'Imagine the following documents are ingested.',
    educationalText:
      'RAG starts with a knowledge source — a document, FAQ, article, or any text you want the AI to reference when answering questions.',
    deepDiveText:
      'Input quality dictates retrieval quality\n• Noisy data (HTML tags, boilerplate, duplicates) degrades every downstream step\n• Clean, well-structured text is the single most impactful investment in a RAG pipeline\n\nTypical preprocessing pipeline\n1. Extract — pull raw text from PDFs, HTML, databases\n2. Clean — strip formatting noise, normalise whitespace\n3. Deduplicate — remove near-identical passages\n4. Validate — check for minimum length, language, encoding issues\n\nIn production this pipeline runs continuously as new documents are ingested, not just once at setup.',
    icon: 'FileText',
  },
  {
    id: 'chunking',
    label: 'Chunking',
    description: 'Split the document into smaller pieces',
    educationalText:
      'Chunking breaks large documents into smaller pieces so retrieval can search them efficiently. Bad chunking can split meaning or hide useful context. Chunk size and overlap are critical parameters.',
    deepDiveText:
      'The chunk size trade-off\n• Too small — loses surrounding context; a sentence loses meaning without its paragraph\n• Too large — retrieval becomes imprecise; pulls a whole page when only one paragraph was needed\n\nWhy overlap exists\nMeaning often spans chunk boundaries. Without overlap, a sentence split across two chunks may never be fully retrieved together.\n\nChunking strategies (simplest → most advanced)\n1. Fixed character count — fast, but can cut mid-sentence\n2. Sentence / paragraph boundaries — keeps semantic units intact\n3. Recursive splitting — tries paragraphs first, falls back to sentences, then characters\n4. Semantic / topic-aware splitting — detects topic shifts and splits there, keeping each chunk about one coherent idea',
    icon: 'Scissors',
  },
  {
    id: 'embedding',
    label: 'Embeddings',
    description: 'Convert chunks into vector representations',
    educationalText:
      'Embeddings convert text into arrays of numbers (vectors) so the system can compare meaning instead of exact word matches. Similar meanings produce vectors that are close together in space.',
    deepDiveText:
      'How embedding models work\n• Trained with contrastive learning — similar texts pulled together, dissimilar texts pushed apart\n• Produce dense vectors of 384–3072 dimensions\n• Trained on massive corpora to capture semantic relationships\n\nPopular models\n• OpenAI text-embedding-3-small / large\n• Cohere embed\n• Open-source: BGE, E5, GTE (run locally, no API cost)\n\nCritical rule\nThe same model must embed both documents and queries. Mixing models produces incompatible vector spaces and breaks retrieval entirely.',
    icon: 'Binary',
  },
  {
    id: 'vectordb',
    label: 'Vector DB',
    description: 'Store embeddings in a vector database',
    educationalText:
      'A vector database stores embeddings and enables fast similarity search at scale. Instead of comparing against every vector, it uses indexing structures (like HNSW or IVF) to find nearest neighbors efficiently — making retrieval practical even with millions of chunks.',
    deepDiveText:
      "ANN algorithms — the speed secret\n• HNSW (Hierarchical Navigable Small World) — graph-based, very fast, high recall\n• IVF (Inverted File Index) — clusters vectors, searches only nearby clusters\n• ScaNN — Google's quantization-based approach\n• Trade a small accuracy loss for searching millions of vectors in milliseconds\n\nPopular vector databases\nPinecone, Weaviate, Qdrant, Milvus, ChromaDB (local/open-source)\n\nKey production features\n• Metadata filtering — narrow search to a subset before doing ANN\n• Hybrid search — combine vector similarity + keyword (BM25)\n• Namespace isolation — separate collections per tenant or data source",
    icon: 'Database',
  },
  {
    id: 'query',
    label: 'User Query',
    description: 'Enter a question and embed it',
    educationalText:
      'Your question is also converted into an embedding using the same model. This allows the system to compare your question against all chunks by measuring vector similarity.',
    deepDiveText:
      "Why query quality matters\nShort or vague queries produce less distinctive embeddings, leading to poor retrieval. The query is the signal — garbage in, garbage out.\n\nTechniques to improve query embeddings\n• Query expansion — rephrase the question multiple ways, use all variants\n• HyDE (Hypothetical Document Embedding) — generate a hypothetical answer first, embed that instead of the raw question; it's closer in vector space to real document chunks\n• Query decomposition — break a complex question into focused sub-queries, retrieve for each, then merge results",
    icon: 'Search',
  },
  {
    id: 'retrieval',
    label: 'Retrieval',
    description: 'Find the most relevant chunks',
    educationalText:
      'Retrieval compares vector similarity (cosine similarity) to find chunks that are semantically closest to the question. The top-k parameter controls how many chunks are selected.',
    deepDiveText:
      'Similarity scoring\n• Cosine similarity measures the angle between two vectors\n• 1.0 = identical direction, 0 = completely orthogonal (no relation)\n• Score threshold filtering removes low-confidence matches\n\nTuning top-k\n• Too few chunks — may miss critical context\n• Too many chunks — dilutes relevance and wastes prompt tokens\n• Typical range: 3–10 chunks\n\nAdvanced retrieval stages\n• Re-ranking — a cross-encoder model re-scores retrieved chunks; high precision, slower\n• Hybrid retrieval — dense vectors + sparse BM25 keyword matching for better recall coverage',
    icon: 'Filter',
  },
  {
    id: 'prompt',
    label: 'Prompt Construction',
    description: 'Build the prompt sent to the LLM',
    educationalText:
      'The LLM answers from the prompt you build. Retrieved chunks are placed as context alongside your question. The model can only use the context it receives — good retrieval directly impacts answer quality.',
    deepDiveText:
      'Prompt structure for RAG\n• System instruction — "Answer only from the provided context; say I don\'t know if unsure"\n• Context block — retrieved chunks, ideally with source labels\n• User question — the original query\n\nToken budget management\n• If chunks exceed the model\'s context window, truncate lowest-ranked chunks first\n• Or summarise chunks before injecting them\n\nQuality boosters\n• Chain-of-thought prompting — ask the model to reason step by step\n• Few-shot examples — show the format you expect\n• Citation instructions — "cite which chunk you used" — helps detect hallucinations',
    icon: 'MessageSquare',
  },
  {
    id: 'answer',
    label: 'Answer',
    description: 'Generate the final answer with sources',
    educationalText:
      'The quality of the final answer depends on chunking, retrieval quality, and the prompt. RAG grounds the LLM in your actual documents instead of relying on its training data alone.',
    deepDiveText:
      'Why RAG still hallucinates (and how to catch it)\n• LLMs can ignore or misread context even when it\'s present\n• Low-quality retrieval means the LLM never had the right information\n\nEvaluation with RAGAS\n• Faithfulness — does the answer match the retrieved context?\n• Answer relevancy — does the answer address the question?\n• Context recall — did retrieval surface the right chunks?\n\nProduction guardrails\n• Groundedness check — verify every claim in the answer against a source chunk\n• Confidence thresholding — flag or refuse low-confidence responses\n• Graceful fallback — return "I don\'t know" when retrieval finds nothing relevant rather than hallucinating an answer',
    icon: 'Sparkles',
  },
];
