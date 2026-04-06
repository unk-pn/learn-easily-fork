# Copilot Instructions for Learn Easily

## Project Overview

This is "Learn Easily" — a React + TypeScript + Vite SPA for interactive concept learning with 2D pipeline visualizations (React Flow). Frontend-only, no backend. Supports Midnight (dark) and Daylight (light) themes.

## Build & Dev

```bash
yarn install         # Install dependencies
yarn dev             # Dev server at localhost:3000
yarn build           # tsc -b && vite build (must pass with 0 errors)
yarn lint            # Biome check (must pass with 0 errors)
yarn lint:fix        # Auto-fix lint + format issues
```

## Code Conventions

### TypeScript
- Use `const` objects with `as const` instead of enums (`erasableSyntaxOnly` is enabled)
- Prefer named exports for components, default export only for `App`
- Use `interface` for object shapes, `type` for unions/intersections
- Import types with `import type { ... }` when possible

### React
- Functional components only, no class components
- Use custom hooks for state logic (see `useConcept.ts` pattern)
- No external state management library — React hooks + props are sufficient
- Keep components focused: one file per component
- Never call hooks conditionally or after early returns

### Styling
- Tailwind CSS utility classes only — no CSS modules, no styled-components
- **Dual theme system**: colors defined as CSS custom properties in `src/index.css`, mapped via `varColor()`/`colorScale()` helpers in `tailwind.config.js`
- Use `text-gray-50` instead of `text-white` (adapts to theme)
- Don't hardcode hex colors in Tailwind classes — all colors go through CSS vars
- Glassmorphism: `bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl`
- Primary: indigo (`primary-500`/`primary-600`) for interactive elements, Accent: amber (`accent-500`) for highlights
- Green (`green-400`/`green-500`) for completed states
- Animations: Framer Motion for UI transitions

### Visualizations (@xyflow/react)
- React Flow v12 is the primary visualization library for pipeline/flow diagrams
- Custom node types with `Handle` components for edges
- Use `fitView` with padding for auto-sizing
- Disable all user interaction (drag, zoom, pan, select) for presentation-only flows
- Edge styling via CSS custom properties: `rgb(var(--green-400))`, `rgb(var(--primary-400))`

### 3D (Three.js via @react-three/fiber) — legacy
- Legacy 3D components exist in `src/components/three/` but are not used by any current concept
- `useRef` must always receive an initial value: `useRef<Type>(null)`
- Don't call `Math.random()` during render — generate data outside the component

### File Organization
- `src/lib/` — shared types, utilities, theme
- `src/hooks/` — custom React hooks
- `src/components/` — reusable UI components
- `src/components/three/` — reusable 3D scene components (legacy)
- `src/concepts/` — concept modules (one folder per concept)
- Each concept folder: `index.ts` (registration) + `*Visualization.tsx` + optional `*DetailPanel.tsx`, `steps.ts`, `data.ts`, `*Panels.tsx`

## Concept Module Pattern

To add a new concept:

1. Create `src/concepts/<concept-id>/index.ts`:
   - Define steps with `id`, `label`, `description`, `educationalText`, `deepDiveText`, `icon`
   - Call `registerConcept({ id, title, description, category, difficulty, icon, color, steps, Visualization, DetailPanel? })`
   - Import from `'../registry'` for `registerConcept`
2. Create `src/concepts/<concept-id>/<Name>Visualization.tsx`:
   - Accept `VisualizationProps` (`currentStep`, `completedSteps`, `processingStep`, `isPlaying`)
   - Build a React Flow diagram or custom 2D visualization
3. Optionally create a `DetailPanel` component accepting `DetailPanelProps` for custom right-panel content
4. Add `import './<concept-id>'` to `src/concepts/index.ts`

### Available categories
`'AI & ML'`, `'Algorithms'`, `'Databases'`, `'System Design'`

### Available difficulties
`'Beginner'`, `'Intermediate'`, `'Advanced'`

### Available icons (for step.icon)
Lucide icon names: `FileText`, `Scissors`, `Binary`, `Database`, `Search`, `Filter`, `MessageSquare`, `Sparkles`
(Add new icons to `StepNav.tsx`'s `iconMap` if needed)

## Common Pitfalls
- Don't use `enum` — use `const` objects with `as const` + type extraction
- `useRef` requires an initial value argument in React 19 strict mode
- Use `text-gray-50` not `text-white` — white doesn't adapt to themes
- All colors must use CSS custom properties — no hardcoded hex in Tailwind classes
- Don't call hooks after early returns — ESLint react-hooks/rules-of-hooks will catch this
- Tailwind content paths are in `tailwind.config.js` — update if adding new file extensions
- The concept registry auto-imports in `src/concepts/index.ts` — every new concept needs an import there
- Use `yarn` not `npm` — the project uses yarn.lock
