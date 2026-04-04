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

// ---------------------------------------------------------------------------
// Sample Documents (from rag-visualizer repo)
// ---------------------------------------------------------------------------

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'redis',
    title: 'Redis info',
    description: 'A technical overview of Redis performance',
    text: `Redis is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine. Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.

Redis achieves its remarkable speed primarily because it stores all data in memory (RAM) rather than on disk. Accessing data in memory is orders of magnitude faster than reading from a hard drive or even an SSD. This is the single most important factor behind Redis's performance.

Redis uses a single-threaded event loop model for processing commands. While this might seem like a limitation, it actually eliminates the overhead of context switching and locking that multi-threaded systems face. The single thread processes commands sequentially, which also ensures that operations are atomic without the need for locks.

The event loop in Redis is built on the I/O multiplexing model. It uses system calls like epoll (Linux), kqueue (BSD/macOS), and select to handle many client connections without creating a thread for each connection. This allows Redis to handle tens of thousands of connections simultaneously with very low overhead.

Redis uses optimized data structures internally. For example, small hashes are stored as ziplists instead of full hash tables, and small sets use intsets. These compact representations reduce memory usage and improve cache locality, which helps performance even further.

Redis supports pipelining, which allows a client to send multiple commands without waiting for the response of each one. The server processes all the commands and sends back responses in bulk. This dramatically reduces network round-trip time, especially for batch operations.

Persistence in Redis is handled through RDB snapshots and AOF (Append Only File) logging. RDB creates point-in-time snapshots of the dataset at configurable intervals using a forked child process, so the main thread is never blocked by disk writes. AOF logs every write operation and can be configured with different fsync policies.

Redis Cluster provides horizontal scaling by automatically sharding data across multiple Redis nodes. Each node handles a subset of the hash slot space (16384 slots total). This allows Redis to scale beyond the memory limits of a single machine while maintaining its performance characteristics.

For caching use cases, Redis supports configurable eviction policies like LRU (Least Recently Used), LFU (Least Frequently Used), random eviction, and TTL-based expiry. These policies allow Redis to manage memory effectively when the dataset exceeds available RAM.

Redis also supports Lua scripting, which allows you to execute complex operations atomically on the server side. This reduces network round trips and ensures that multi-step operations are performed without interruption, which is especially useful for distributed locking and rate limiting.`,
  },
  {
    id: 'password-reset',
    title: 'Password Reset FAQ',
    description: 'Common questions about resetting passwords',
    text: `How do I reset my password?

To reset your password, go to the login page and click "Forgot Password". Enter the email address associated with your account. You will receive a password reset link within 5 minutes. Click the link and enter your new password. Your new password must be at least 8 characters long and include a number and a special character.

What if I don't receive the reset email?

If you don't receive the password reset email, first check your spam or junk folder. Make sure you entered the correct email address. If you still don't see the email after 10 minutes, try requesting a new reset link. If the problem persists, contact our support team at support@example.com.

Can I reset my password using my phone number?

Currently, password reset is only available via email. We are working on adding SMS-based password reset in a future update. In the meantime, make sure your email address is up to date in your account settings.

How often can I request a password reset?

You can request up to 3 password reset links within a 1-hour period. After that, you will need to wait before requesting again. This limit helps protect your account from unauthorized reset attempts.

What are the password requirements?

Your password must be at least 8 characters long. It must contain at least one uppercase letter, one lowercase letter, one number, and one special character (such as !, @, #, $, %). Passwords cannot contain your username or email address. We recommend using a password manager to generate and store strong passwords.

Does resetting my password log me out of other devices?

Yes, resetting your password will automatically log you out of all active sessions on all devices. You will need to log in again with your new password on each device. This is a security measure to ensure that no unauthorized sessions remain active.

Can I reuse an old password?

No, you cannot reuse any of your last 5 passwords. This policy helps maintain account security by ensuring you regularly create new, unique passwords.

What should I do if someone else reset my password?

If you receive a password reset email that you did not request, do not click the link. Instead, log in to your account immediately and change your password. Enable two-factor authentication for additional security. If you cannot access your account, contact our support team immediately.`,
  },
  {
    id: 'ml-basics',
    title: 'Machine Learning Basics',
    description: 'Introduction to core ML concepts',
    text: `Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. Instead of writing rules by hand, machine learning algorithms build models from data and use those models to make predictions or decisions.

There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning. Each type addresses different kinds of problems and uses different approaches to learn from data.

Supervised learning is the most common type. In supervised learning, the algorithm learns from labeled training data. Each training example consists of an input and the corresponding correct output. The algorithm learns to map inputs to outputs by finding patterns in the training data. Common supervised learning tasks include classification (predicting a category) and regression (predicting a number).

Unsupervised learning works with unlabeled data. The algorithm tries to find hidden patterns or structure in the data without being told what to look for. Common unsupervised learning tasks include clustering (grouping similar items), dimensionality reduction (simplifying data while preserving important information), and anomaly detection (finding unusual data points).

Reinforcement learning is inspired by behavioral psychology. An agent learns to make decisions by interacting with an environment. The agent receives rewards or penalties based on its actions and learns to maximize cumulative rewards over time. Reinforcement learning is used in robotics, game playing, and autonomous vehicles.

A machine learning model is trained through a process of optimization. The model starts with random parameters and gradually adjusts them to minimize a loss function, which measures how far the model's predictions are from the correct answers. This process is called training or fitting the model.

Overfitting is a common problem in machine learning. It occurs when a model learns the training data too well, including its noise and random fluctuations. An overfitted model performs well on training data but poorly on new, unseen data. Techniques like regularization, cross-validation, and using more training data help prevent overfitting.

Feature engineering is the process of selecting and transforming the input variables (features) used by a machine learning model. Good features can dramatically improve model performance. Feature engineering often requires domain expertise and is considered one of the most important and time-consuming parts of building a machine learning system.

Neural networks are a class of machine learning models inspired by the structure of the brain. They consist of layers of interconnected nodes (neurons) that process information. Deep learning refers to neural networks with many layers. Deep learning has achieved breakthrough results in image recognition, natural language processing, and speech recognition.

The bias-variance tradeoff is a fundamental concept in machine learning. Bias refers to errors from overly simplistic models that underfit the data. Variance refers to errors from overly complex models that overfit the data. The goal is to find the right balance between bias and variance for optimal model performance.`,
  },
];

// ---------------------------------------------------------------------------
// Default Pipeline Configuration
// ---------------------------------------------------------------------------

export const DEFAULT_CONFIG: PipelineConfig = {
  chunkSize: 200,
  chunkOverlap: 20,
  chunkingStrategy: 'sentence',
  topK: 3,
  embeddingModel: 'all-MiniLM-L6-v2',
  llmModel: 'llama-3.1-8b-instant',
};

// ---------------------------------------------------------------------------
// Precomputed Pipeline Result for Redis document
// ---------------------------------------------------------------------------

const redisChunks: Chunk[] = [
  {
    id: 0,
    text: 'Redis is an open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine.',
  },
  {
    id: 1,
    text: 'streaming engine. Redis provides data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes, and streams.',
  },
  {
    id: 2,
    text: 'and streams. Redis achieves its remarkable speed primarily because it stores all data in memory (RAM) rather than on disk. Accessing data in memory is orders of magnitude faster than reading from a hard drive or even an SSD.',
  },
  { id: 3, text: "or even an SSD. This is the single most important factor behind Redis's performance." },
  {
    id: 4,
    text: 'Redis uses a single-threaded event loop model for processing commands. While this might seem like a limitation, it actually eliminates the overhead of context switching and locking that multi-threaded systems face.',
  },
  {
    id: 5,
    text: 'systems face. The single thread processes commands sequentially, which also ensures that operations are atomic without the need for locks.',
  },
  {
    id: 6,
    text: 'The event loop in Redis is built on the I/O multiplexing model. It uses system calls like epoll (Linux), kqueue (BSD/macOS), and select to handle many client connections without creating a thread for each connection.',
  },
  {
    id: 7,
    text: 'each connection. This allows Redis to handle tens of thousands of connections simultaneously with very low overhead.',
  },
  {
    id: 8,
    text: 'Redis uses optimized data structures internally. For example, small hashes are stored as ziplists instead of full hash tables, and small sets use intsets.',
  },
  {
    id: 9,
    text: 'use intsets. These compact representations reduce memory usage and improve cache locality, which helps performance even further.',
  },
  {
    id: 10,
    text: 'Redis supports pipelining, which allows a client to send multiple commands without waiting for the response of each one. The server processes all the commands and sends back responses in bulk.',
  },
  { id: 11, text: 'in bulk. This dramatically reduces network round-trip time, especially for batch operations.' },
  {
    id: 12,
    text: 'Persistence in Redis is handled through RDB snapshots and AOF (Append Only File) logging. RDB creates point-in-time snapshots of the dataset at configurable intervals using a forked child process, so the main thread is never blocked by disk writes.',
  },
  { id: 13, text: 'disk writes. AOF logs every write operation and can be configured with different fsync policies.' },
  {
    id: 14,
    text: 'Redis Cluster provides horizontal scaling by automatically sharding data across multiple Redis nodes. Each node handles a subset of the hash slot space (16384 slots total).',
  },
  {
    id: 15,
    text: 'slots total). This allows Redis to scale beyond the memory limits of a single machine while maintaining its performance characteristics.',
  },
  {
    id: 16,
    text: 'For caching use cases, Redis supports configurable eviction policies like LRU (Least Recently Used), LFU (Least Frequently Used), random eviction, and TTL-based expiry.',
  },
  {
    id: 17,
    text: 'TTL-based expiry. These policies allow Redis to manage memory effectively when the dataset exceeds available RAM.',
  },
  {
    id: 18,
    text: 'Redis also supports Lua scripting, which allows you to execute complex operations atomically on the server side. This reduces network round trips and ensures that multi-step operations are performed without interruption, which is especially useful for distributed locking and rate limiting.',
  },
];

// Simplified embedding heatmap samples (first 20 of 384 dimensions per chunk)
const embeddingSamples: number[][] = [
  [
    0.032, -0.048, 0.071, -0.015, 0.089, -0.041, 0.023, 0.067, -0.055, 0.012, -0.038, 0.084, -0.029, 0.051, -0.073,
    0.018, 0.046, -0.062, 0.037, -0.009,
  ],
  [
    -0.021, 0.058, -0.033, 0.076, -0.044, 0.019, -0.067, 0.041, 0.053, -0.028, 0.065, -0.017, 0.082, -0.039, 0.024,
    -0.056, 0.048, 0.013, -0.071, 0.035,
  ],
  [
    0.087, -0.022, 0.064, -0.047, 0.031, 0.078, -0.053, 0.015, -0.069, 0.042, -0.026, 0.091, -0.034, 0.058, 0.011,
    -0.082, 0.039, -0.063, 0.027, 0.074,
  ],
  [
    -0.045, 0.068, -0.019, 0.083, -0.037, 0.052, 0.014, -0.076, 0.029, -0.058, 0.043, 0.071, -0.025, -0.064, 0.036,
    0.088, -0.042, 0.017, -0.073, 0.055,
  ],
  [
    0.074, -0.036, 0.059, 0.022, -0.081, 0.045, -0.018, 0.063, -0.051, 0.033, 0.077, -0.029, 0.046, -0.068, 0.012,
    -0.054, 0.085, -0.041, 0.028, -0.066,
  ],
  [
    -0.013, 0.079, -0.052, 0.034, -0.067, 0.021, 0.056, -0.038, 0.084, -0.026, 0.048, -0.071, 0.016, 0.062, -0.045,
    0.033, -0.078, 0.054, 0.019, -0.061,
  ],
  [
    0.041, -0.063, 0.028, -0.084, 0.052, 0.017, -0.039, 0.075, -0.023, 0.066, -0.048, 0.031, -0.057, 0.082, -0.014,
    0.043, -0.069, 0.025, 0.058, -0.036,
  ],
  [
    -0.057, 0.032, 0.073, -0.018, 0.046, -0.065, 0.038, -0.024, 0.081, -0.043, 0.016, -0.072, 0.059, 0.027, -0.086,
    0.041, 0.064, -0.033, -0.051, 0.078,
  ],
  [
    0.065, -0.041, 0.018, 0.082, -0.027, 0.053, -0.074, 0.036, 0.049, -0.062, 0.023, -0.048, 0.071, -0.035, 0.087,
    -0.019, 0.044, -0.058, 0.032, 0.076,
  ],
  [
    -0.028, 0.054, -0.073, 0.039, 0.066, -0.015, 0.081, -0.047, 0.022, 0.068, -0.034, 0.057, -0.083, 0.026, 0.041,
    -0.065, 0.013, 0.079, -0.046, -0.022,
  ],
  [
    0.048, -0.019, 0.072, -0.056, 0.035, -0.083, 0.027, 0.064, -0.038, 0.051, 0.016, -0.074, 0.043, -0.029, 0.067,
    0.088, -0.052, 0.023, -0.041, 0.061,
  ],
  [
    -0.066, 0.038, -0.024, 0.075, -0.049, 0.061, 0.014, -0.082, 0.046, -0.031, 0.069, -0.017, 0.053, 0.085, -0.042,
    -0.026, 0.058, -0.073, 0.037, 0.021,
  ],
  [
    0.023, -0.079, 0.045, 0.016, -0.063, 0.084, -0.032, 0.057, -0.048, 0.071, -0.019, 0.036, -0.065, 0.028, -0.081,
    0.053, 0.042, -0.027, 0.068, -0.014,
  ],
  [
    -0.051, 0.024, 0.067, -0.083, 0.041, -0.016, 0.073, -0.055, 0.032, -0.078, 0.049, 0.018, -0.064, 0.086, -0.037,
    0.022, -0.059, 0.044, 0.076, -0.031,
  ],
  [
    0.059, -0.034, 0.081, -0.023, 0.047, 0.015, -0.068, 0.036, -0.054, 0.079, -0.041, 0.063, -0.028, 0.017, 0.074,
    -0.046, 0.032, -0.085, 0.051, 0.025,
  ],
  [
    -0.042, 0.076, -0.018, 0.054, -0.069, 0.033, -0.051, 0.085, -0.027, 0.044, 0.067, -0.036, 0.021, -0.078, 0.056,
    0.013, -0.064, 0.048, -0.023, 0.082,
  ],
  [
    0.036, -0.058, 0.024, 0.069, -0.043, 0.081, -0.015, 0.047, -0.072, 0.038, -0.026, 0.054, -0.079, 0.062, 0.019,
    -0.087, 0.045, -0.031, 0.073, -0.048,
  ],
  [
    -0.074, 0.043, -0.029, 0.061, 0.017, -0.085, 0.052, -0.036, 0.078, -0.021, 0.064, -0.047, 0.033, -0.059, 0.086,
    -0.024, 0.041, 0.068, -0.053, 0.015,
  ],
  [
    0.027, -0.065, 0.053, -0.038, 0.079, -0.024, 0.046, 0.014, -0.082, 0.057, -0.033, 0.071, -0.016, 0.048, -0.076,
    0.035, -0.061, 0.084, 0.022, -0.044,
  ],
];

const queryEmbeddingSample = [
  0.078, -0.035, 0.062, -0.049, 0.024, 0.086, -0.031, 0.055, -0.067, 0.041, -0.023, 0.079, -0.048, 0.064, 0.011, -0.073,
  0.038, -0.056, 0.027, 0.083,
];

const allSimilarityResults: SimilarityResult[] = [
  { chunkId: 2, score: 0.872, rank: 1 },
  { chunkId: 4, score: 0.761, rank: 2 },
  { chunkId: 3, score: 0.743, rank: 3 },
  { chunkId: 8, score: 0.721, rank: 4 },
  { chunkId: 9, score: 0.698, rank: 5 },
  { chunkId: 6, score: 0.674, rank: 6 },
  { chunkId: 10, score: 0.651, rank: 7 },
  { chunkId: 0, score: 0.582, rank: 8 },
  { chunkId: 7, score: 0.564, rank: 9 },
  { chunkId: 5, score: 0.541, rank: 10 },
  { chunkId: 14, score: 0.423, rank: 11 },
  { chunkId: 12, score: 0.385, rank: 12 },
  { chunkId: 16, score: 0.352, rank: 13 },
  { chunkId: 1, score: 0.341, rank: 14 },
  { chunkId: 15, score: 0.328, rank: 15 },
  { chunkId: 17, score: 0.312, rank: 16 },
  { chunkId: 18, score: 0.298, rank: 17 },
  { chunkId: 11, score: 0.284, rank: 18 },
  { chunkId: 13, score: 0.261, rank: 19 },
];

const promptText = `You are a helpful assistant. Answer the question based only on the provided context. If the context doesn't contain enough information to answer the question, say "I don't have enough information to answer this question."

CONTEXT:
---
[Chunk 2] and streams. Redis achieves its remarkable speed primarily because it stores all data in memory (RAM) rather than on disk. Accessing data in memory is orders of magnitude faster than reading from a hard drive or even an SSD.

[Chunk 4] Redis uses a single-threaded event loop model for processing commands. While this might seem like a limitation, it actually eliminates the overhead of context switching and locking that multi-threaded systems face.

[Chunk 3] or even an SSD. This is the single most important factor behind Redis's performance.
---

QUESTION:
How does Redis achieve high performance?

INSTRUCTIONS:
Answer the question based only on the provided context. Cite specific information from the context to support your answer. Be concise.`;

const answerText = `Redis achieves high performance through several key architectural decisions:

1. **In-memory storage**: Redis stores all data in RAM rather than on disk. Accessing data in memory is orders of magnitude faster than reading from a hard drive or even an SSD — this is described as "the single most important factor behind Redis's performance."

2. **Single-threaded event loop**: Redis uses a single-threaded event loop model for processing commands. While this might seem like a limitation, it actually eliminates the overhead of context switching and locking that multi-threaded systems face, ensuring operations are processed efficiently without lock contention.

These two design choices work together to make Redis exceptionally fast for both read and write operations.`;

export const REDIS_PIPELINE: RagPipelineData = {
  document: SAMPLE_DOCUMENTS[0],
  query: 'How does Redis achieve high performance?',
  config: DEFAULT_CONFIG,
  documentStats: {
    sentenceCount: 27,
    wordCount: 439,
    charCount: 2957,
    estimatedTokens: 570,
  },
  chunks: redisChunks,
  embeddingDimensions: 384,
  embeddingSamples: embeddingSamples,
  queryEmbeddingSample: queryEmbeddingSample,
  similarityResults: allSimilarityResults,
  topChunks: allSimilarityResults.slice(0, 3),
  prompt: promptText,
  answer: answerText,
};
