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
  {
    id: 'vectordb',
    label: 'Vector DB',
    description: 'Store embeddings in a vector database',
    educationalText:
      'A vector database stores embeddings and enables fast similarity search at scale. Instead of comparing against every vector, it uses indexing structures (like HNSW or IVF) to find nearest neighbors efficiently — making retrieval practical even with millions of chunks.',
    deepDiveText:
      'Popular vector databases include Pinecone, Weaviate, Qdrant, Milvus, and ChromaDB. They use Approximate Nearest Neighbor (ANN) algorithms like HNSW (Hierarchical Navigable Small World), IVF (Inverted File Index), or ScaNN. These trade a small amount of accuracy for massive speed gains — searching millions of vectors in milliseconds instead of seconds. Metadata filtering, hybrid search (combining vector + keyword), and namespace isolation are key production features.',
    icon: 'Database',
  },
  {
    id: 'query',
    label: 'User Query',
    description: 'Enter a question and embed it',
    educationalText:
      'Your question is also converted into an embedding using the same model. This allows the system to compare your question against all chunks by measuring vector similarity.',
    deepDiveText:
      'Query embedding quality matters as much as document embeddings. Short or vague queries produce less distinctive vectors, leading to poor retrieval. Techniques like query expansion (rephrasing the question multiple ways), HyDE (Hypothetical Document Embeddings — generating a hypothetical answer first, then embedding that), and query decomposition (breaking complex questions into sub-queries) can significantly improve retrieval results.',
    icon: 'Search',
  },
  {
    id: 'retrieval',
    label: 'Retrieval',
    description: 'Find the most relevant chunks',
    educationalText:
      'Retrieval compares vector similarity (cosine similarity) to find chunks that are semantically closest to the question. The top-k parameter controls how many chunks are selected.',
    deepDiveText:
      'Cosine similarity measures the angle between two vectors (1.0 = identical direction, 0 = orthogonal). Top-k retrieval returns the k closest chunks. Too few chunks may miss context; too many dilute relevance and waste prompt tokens. Re-ranking (using a cross-encoder model to re-score retrieved chunks) is a common second stage that dramatically improves precision. Hybrid retrieval combines dense vectors with sparse keyword matching (BM25) for better coverage.',
    icon: 'Filter',
  },
  {
    id: 'prompt',
    label: 'Prompt Construction',
    description: 'Build the prompt sent to the LLM',
    educationalText:
      'The LLM answers from the prompt you build. Retrieved chunks are placed as context alongside your question. The model can only use the context it receives — good retrieval directly impacts answer quality.',
    deepDiveText:
      'Prompt engineering for RAG involves structuring context placement, adding system instructions ("Answer only from the provided context"), and managing token budgets. If retrieved chunks exceed the model\'s context window, you must truncate or summarize. Chain-of-thought prompting and few-shot examples can improve answer quality. Citation instructions ("cite which chunk you used") help with answer traceability and hallucination detection.',
    icon: 'MessageSquare',
  },
  {
    id: 'answer',
    label: 'Answer',
    description: 'Generate the final answer with sources',
    educationalText:
      'The quality of the final answer depends on chunking, retrieval quality, and the prompt. RAG grounds the LLM in your actual documents instead of relying on its training data alone.',
    deepDiveText:
      'Even with good retrieval, LLMs can still hallucinate or ignore context. Evaluation frameworks like RAGAS measure faithfulness (does the answer match the context?), relevancy (is the retrieved context relevant?), and correctness. Production systems add guardrails: checking if the answer is grounded in sources, flagging low-confidence responses, and falling back gracefully when retrieval finds nothing relevant.',
    icon: 'Sparkles',
  },
];
