# Contributing to Learn Easily

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Adding a New Concept](#adding-a-new-concept)
- [Code Conventions](#code-conventions)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)

---

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/learn-easily.git
   cd learn-easily
   ```
3. Install dependencies (use **yarn**, not npm):
   ```bash
   yarn install
   ```
4. Start the dev server:
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:3000`.

---

## Development Setup

| Command | Description |
|---|---|
| `yarn dev` | Start dev server at `localhost:3000` |
| `yarn build` | Production build (must pass with 0 errors) |
| `yarn lint` | Run Biome linter (must pass with 0 errors) |
| `yarn lint:fix` | Auto-fix lint + format issues |
| `yarn format` | Format all files |
| `yarn preview` | Preview production build |

> **Note:** Always run `yarn lint` and `yarn build` before opening a PR.

---

## Adding a New Concept

The concept system is modular — each concept lives in its own folder under `src/concepts/`.

### Step-by-step

1. **Create the concept folder** `src/concepts/<concept-id>/`

2. **Create `index.ts`** — registers the concept:
   ```ts
   import { registerConcept } from '../registry';
   import { ConceptCategory, Difficulty } from '../../lib/types';
   import { MyVisualization } from './MyVisualization';

   registerConcept({
     id: 'my-concept',
     title: 'My Concept',
     description: 'One-line description shown on the catalog card.',
     category: ConceptCategory.ALGORITHMS,
     difficulty: Difficulty.BEGINNER,
     icon: 'GitBranch',
     color: '#22c55e',
     steps: [
       {
         id: 'step-1',
         label: 'Step 1',
         description: 'Short step description.',
         educationalText: 'Detailed explanation shown in the right panel.',
         deepDiveText: 'Optional deep-dive content (collapsed by default).',
         icon: 'FileText',
       },
     ],
     Visualization: MyVisualization,
   });
   ```

3. **Create `MyVisualization.tsx`** — the interactive visual:
   ```tsx
   import type { VisualizationProps } from '../../lib/types';

   export function MyVisualization({ currentStep, completedSteps, isPlaying }: VisualizationProps) {
     return <div className="w-full h-full">/* your React Flow diagram or custom visual */</div>;
   }
   ```

4. **Register the import** in `src/concepts/index.ts`:
   ```ts
   import './my-concept';
   ```

5. If your steps use new Lucide icons, add them to the `iconMap` in `src/components/StepNav.tsx`.

### Available categories
`ConceptCategory.AI_ML`, `ConceptCategory.ALGORITHMS`, `ConceptCategory.DATABASES`, `ConceptCategory.SYSTEM_DESIGN`

### Available difficulties
`Difficulty.BEGINNER`, `Difficulty.INTERMEDIATE`, `Difficulty.ADVANCED`

For a full walkthrough, see [docs/adding-a-concept.md](docs/adding-a-concept.md).

---

## Code Conventions

- **No `enum`** — use `const` objects with `as const` (TypeScript `erasableSyntaxOnly` is enabled)
- **`useRef` requires an initial value**: `useRef<T>(null)` not `useRef<T>()`
- **Colors via CSS custom properties** — no hardcoded hex in Tailwind classes
- **`text-gray-50` not `text-white`** — adapts correctly to both themes
- **Functional components only** — no class components
- **`import type { ... }`** for type-only imports
- **Yarn only** — do not commit a `package-lock.json`

---

## Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-feature
   ```
2. Make your changes, keeping commits focused and descriptive.
3. Ensure `yarn lint` and `yarn build` both pass with **0 errors**.
4. Push your branch and open a PR against `main`.
5. Fill in the PR template (if present) — describe *what* changed and *why*.
6. A maintainer will review and merge.

---

## Reporting Bugs

Open a [GitHub Issue](https://github.com/abhishekDeshmukh74/learn-easily/issues/new) with:

- A clear, descriptive title
- Steps to reproduce
- Expected vs. actual behavior
- Browser / OS version
- Screenshot or screen recording (if applicable)
