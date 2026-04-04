// Re-export registry API
export { getAllConcepts, getConcept, registerConcept } from './registry';

// Auto-register all concepts via side-effect imports
import './rag';
