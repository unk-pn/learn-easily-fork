# Learn Easily

An interactive web app for learning technical concepts step by step — with 3D visualizations, animations, and deep-dive educational content.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 19, TypeScript, Vite 8 |
| Styling | Tailwind CSS 3, Framer Motion |
| 3D | @react-three/fiber, @react-three/drei, Three.js |
| Routing | React Router v7 |
| Icons | Lucide React |

## Quick Start

```bash
npm install
npm run dev     # → http://localhost:3000
```

## Project Structure

```
src/
├── App.tsx                        # Router: / → HomePage, /learn/:id → ConceptViewer
├── main.tsx                       # Entry point
├── index.css                      # Tailwind directives + dark theme base styles
│
├── lib/
│   └── types.ts                   # Core types: Concept, ConceptStep, VisualizationProps, etc.
│
├── concepts/                      # ← Pluggable concept modules
│   ├── index.ts                   # Registry: registerConcept(), getConcept(), getAllConcepts()
│   └── rag/                       # Example concept: RAG
│       ├── index.ts               # Metadata + 8 step definitions + registerConcept() call
│       └── RagVisualization.tsx   # 3D pipeline scene (uses PipelineScene)
│
├── components/
│   ├── HomePage.tsx               # Concept catalog grid with search & category filter tabs
│   ├── ConceptCard.tsx            # Glassmorphism card (links to /learn/:id)
│   ├── ConceptViewer.tsx          # Main learning layout: StepNav + Visualization + StepDetailPanel
│   ├── StepNav.tsx                # Left sidebar (desktop) / bottom bar (mobile) step navigation
│   ├── StepDetailPanel.tsx        # Right panel with educational text + collapsible deep dive
│   ├── ControlBar.tsx             # Play/pause, prev/next, reset controls
│   └── three/                     # Reusable 3D scene components
│       ├── PipelineScene.tsx      # Canvas + OrbitControls + lighting + node layout
│       ├── StepNode.tsx           # Animated dodecahedron nodes with labels
│       ├── DataFlow.tsx           # Bezier tube connections with instanced particle flow
│       └── FloatingParticles.tsx  # Background star field (200 points)
│
└── hooks/
    └── useConcept.ts              # Step state machine: currentStep, play/pause, nav, keyboard
```

## Architecture

### Concept Module System

Each concept is a self-contained folder under `src/concepts/` that provides:

1. **Metadata** — id, title, description, category, difficulty, icon, color
2. **Steps** — Ordered `ConceptStep[]` with labels, educational text, and deep-dive content
3. **Visualization** — A React component implementing `VisualizationProps` (3D or 2D)

Concepts self-register via `registerConcept()` in their `index.ts`. The registry is imported in `App.tsx`, which triggers all concept modules to register.

### Adding a New Concept

```
src/concepts/your-concept/
├── index.ts              # Define steps + call registerConcept()
└── YourVisualization.tsx # Implement VisualizationProps
```

Then add `import './your-concept'` to `src/concepts/index.ts`.

### Key Types (src/lib/types.ts)

```ts
interface Concept {
  id: string;
  title: string;
  description: string;
  category: ConceptCategory;  // 'AI & ML' | 'Algorithms' | 'Databases' | 'System Design'
  difficulty: Difficulty;      // 'Beginner' | 'Intermediate' | 'Advanced'
  icon: string;
  color: string;               // hex color for 3D nodes and accents
  steps: ConceptStep[];
  Visualization: ComponentType<VisualizationProps>;
}

interface ConceptStep {
  id: string;
  label: string;
  description: string;
  educationalText: string;     // always visible
  deepDiveText: string;        // collapsible accordion
  icon: string;                // lucide-react icon name
}

interface VisualizationProps {
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  isPlaying: boolean;
}
```

### State Management

No external state library. The `useConcept(concept)` hook manages all step state:
- `currentStep`, `completedSteps`, `processingStep`
- `play()` — auto-advance through steps with 1.2s delay
- `pause()`, `reset()`, `next()`, `prev()`, `jumpTo(stepId)`
- Keyboard: `←`/`→` arrows, `Space` for play/pause

### Routing

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` | Concept catalog with category tabs and search |
| `/learn/:conceptId` | `ConceptViewer` | Step-by-step interactive learning view |

### Styling

- **Dark theme** — `gray-950` background, glassmorphism panels (`bg-gray-900/60 backdrop-blur-xl border-gray-700/50`)
- **Colors** — Primary blue (`#5c7cfa`), accent orange (`#ff9800`), green for completed states
- **Responsive** — Mobile-first. Desktop: 3-column layout (nav | viz | detail). Mobile: bottom nav, full-width viz
- **Animations** — Framer Motion for UI (slide-in, fade-in), Three.js `useFrame` for 3D (float, pulse, spin, particles)

## Scripts

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Design Decisions

- **Frontend-only** — All concept data is static. No backend, no API calls, no LLM integration.
- **Pluggable concepts** — New concepts are added as folders, not config files. Each concept owns its visualization.
- **3D optional** — Concepts can use 2D SVG/Canvas visualizations instead of Three.js. The `VisualizationProps` interface is renderer-agnostic.
- **No auth, no CMS** — Concepts are code-defined. Content lives in TypeScript files alongside the visualization code.
