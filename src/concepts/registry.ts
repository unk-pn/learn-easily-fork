import type { Concept } from '../lib/types';

const conceptRegistry = new Map<string, Concept>();

export function registerConcept(concept: Concept) {
  conceptRegistry.set(concept.id, concept);
}

export function getConcept(id: string): Concept | undefined {
  return conceptRegistry.get(id);
}

export function getAllConcepts(): Concept[] {
  return Array.from(conceptRegistry.values());
}
