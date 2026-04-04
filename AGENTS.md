# AGENTS.md — AI Agent Context for Learn Easily

## What This Project Is

"Learn Easily" is a frontend-only React + TypeScript + Vite web app for interactive concept learning. Users browse a catalog of technical concepts (RAG, algorithms, databases, etc.) and learn each one through a step-by-step interactive experience with 2D pipeline visualizations (React Flow) and educational content. Supports Midnight (dark) and Daylight (light) themes.

## Build & Run

```bash
yarn install         # Install dependencies
yarn dev             # Dev server at http://localhost:3000
yarn build           # tsc -b && vite build (must pass with 0 errors)
yarn lint            # Biome check (must pass with 0 errors)
yarn lint:fix        # Auto-fix lint + format issues
yarn format          # Format all files
yarn preview         # Preview production build
```

- **Package manager**: Yarn 1.x (classic) — do NOT use npm
- TypeScript strict mode with `erasableSyntaxOnly` — no `enum`, use `const` objects with `as const`
- Tailwind CSS 3 via PostCSS with CSS custom property color system
- Vite 8 with `@vitejs/plugin-react`
- **Biome** for linting + formatting (replaces ESLint + Prettier). Config in `biome.json`
- **Pre-commit hooks**: husky + lint-staged — runs `biome check --write` on staged files before each commit

## Key Architecture

### Entry Flow
`main.tsx` → `App.tsx` (ThemeProvider → BrowserRouter with 2 routes) → `HomePage` or `ConceptViewer`

### Concept Registry
- `src/concepts/registry.ts` — `registerConcept()`, `getConcept(id)`, `getAllConcepts()`
- `src/concepts/index.ts` — re-exports registry + side-effect imports for each concept
- Each concept is a folder under `src/concepts/` that calls `registerConcept()` in its `index.ts`

### Core Types (src/lib/types.ts)
- `Concept` — metadata + steps array + Visualization component + optional DetailPanel
- `ConceptStep` — id, label, description, educationalText, deepDiveText, icon
- `VisualizationProps` — currentStep, completedSteps, processingStep, isPlaying
- `DetailPanelProps` — step, currentStep, completedSteps, processingStep, isPlaying
- `ConceptCategory` — `'AI & ML' | 'Algorithms' | 'Databases' | 'System Design'` (const object, not enum)
- `Difficulty` — `'Beginner' | 'Intermediate' | 'Advanced'` (const object, not enum)

### Theme System (src/lib/theme.tsx)
- `ThemeProvider` wraps the app, sets `data-theme` attribute on `<html>`
- Two themes: `midnight` (dark, slate-based) and `daylight` (light, warm stone-based)
- Colors defined as CSS custom properties with space-separated RGB values in `src/index.css`
- Tailwind maps colors to CSS vars via `varColor()` / `colorScale()` helpers in `tailwind.config.js`
- Theme persisted to `localStorage` key `le-theme`
- `useTheme()` hook returns `{ theme, toggleTheme }`

### State Management (src/hooks/useConcept.ts)
Custom hook, no external libraries. Provides:
- `currentStep`, `completedSteps`, `processingStep`, `isPlaying`
- `play()`, `pause()`, `reset()`, `next()`, `prev()`, `jumpTo(stepId)`
- Auto-resets when concept changes

### Components
| Component | Location | Role |
|---|---|---|
| `HomePage` | components/HomePage.tsx | Catalog grid with category tabs + search + theme toggle |
| `ConceptCard` | components/ConceptCard.tsx | Card linking to /learn/:id |
| `ConceptViewer` | components/ConceptViewer.tsx | 3-column layout: StepNav + Visualization + DetailPanel + theme toggle |
| `StepNav` | components/StepNav.tsx | Step list with active/completed/processing states |
| `StepDetailPanel` | components/StepDetailPanel.tsx | Educational content + collapsible deep dive |
| `ControlBar` | components/ControlBar.tsx | Play/pause, prev/next, reset |

### Visualization Libraries
- **@xyflow/react (React Flow v12)** — primary visualization library for pipeline/flow diagrams
- **@react-three/fiber + drei + three** — available for 3D visualizations (legacy, not currently used by any concept)

### Styling
- **Dual theme**: Midnight (slate dark + indigo) / Daylight (warm white + indigo)
- Colors via CSS custom properties: `--gray-50` through `--gray-950`, `--primary-300` through `--primary-600`, etc.
- Gray scale is semantically inverted between themes (e.g. `gray-950` = darkest in midnight, lightest in daylight)
- Primary: indigo (`primary-500`), Accent: amber (`accent-500`), Completed: green (`green-400/500`)
- All styling via Tailwind utility classes — no CSS files except `index.css` (Tailwind directives + CSS vars)
- Use `text-gray-50` instead of `text-white` for theme compatibility

## How to Add a New Concept

1. Create `src/concepts/<id>/index.ts`:
   ```ts
   import { registerConcept } from '../registry';
   import { ConceptCategory, Difficulty } from '../../lib/types';
   import { MyVisualization } from './MyVisualization';

   registerConcept({
     id: '<id>',
     title: 'My Concept',
     description: 'One-line description',
     category: ConceptCategory.ALGORITHMS,
     difficulty: Difficulty.BEGINNER,
     icon: 'GitBranch',
     color: '#22c55e',
     steps: [
       { id: 'step1', label: 'Step 1', description: '...', educationalText: '...', deepDiveText: '...', icon: 'FileText' },
     ],
     Visualization: MyVisualization,
     // Optional: DetailPanel: MyDetailPanel,
   });
   ```

2. Create `src/concepts/<id>/MyVisualization.tsx`:
   ```ts
   import type { VisualizationProps } from '../../lib/types';

   export function MyVisualization({ currentStep, completedSteps, processingStep, isPlaying }: VisualizationProps) {
     return <div className="w-full h-full">/* React Flow diagram or custom visualization */</div>;
   }
   ```

3. Add `import './<id>'` to `src/concepts/index.ts`

## Existing Concepts

| ID | Title | Steps | Category | Visualization |
|---|---|---|---|---|
| `rag` | RAG (Retrieval-Augmented Generation) | 8 (input → chunking → embedding → vectordb → query → retrieval → prompt → answer) | AI & ML | React Flow pipeline (snake layout, 4 per row) + custom DetailPanel with step-specific data panels |

### RAG Concept File Structure
```
src/concepts/rag/
├── index.ts              # Concept registration
├── steps.ts              # Step definitions + RAG_COLOR constant
├── data.ts               # Hardcoded precomputed pipeline data (chunks, embeddings, etc.)
├── RagVisualization.tsx   # React Flow pipeline with custom PipelineStepNode
├── RagDetailPanel.tsx     # Right-panel orchestrator (picks panel per step)
└── RagPanels.tsx          # 8 step-specific data panel components + Badge/EmbeddingBar helpers
```

## Common Mistakes to Avoid
- Don't use TypeScript `enum` — the tsconfig has `erasableSyntaxOnly` enabled
- `useRef` needs an initial value: `useRef<T>(null)` not `useRef<T>()`
- New lucide icons used in step definitions must be added to `StepNav.tsx`'s `iconMap`
- Every new concept folder needs a side-effect import in `src/concepts/index.ts`
- Use `text-gray-50` instead of `text-white` — white doesn't adapt to theme changes
- Don't call hooks conditionally or after early returns — ESLint react-hooks/rules-of-hooks will catch this
- All colors must go through CSS custom properties — don't hardcode hex colors in Tailwind classes
- Use `yarn` not `npm` — the project uses yarn.lock
