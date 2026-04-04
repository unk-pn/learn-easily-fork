# Adding a New Concept

This guide explains how to add a new interactive concept to Learn Easily.

## Overview

Each concept is a self-contained module under `src/concepts/<concept-id>/`. A concept provides:

1. **Metadata** — title, description, category, difficulty, color
2. **Steps** — ordered learning steps with educational content
3. **Visualization** — a React component for the interactive visual (3D or 2D)

## Step-by-Step

### 1. Create the concept folder

```
src/concepts/<concept-id>/
├── index.ts              # Metadata + steps + registration
└── <Name>Visualization.tsx  # Visual component
```

### 2. Define concept metadata and steps (`index.ts`)

```typescript
import { registerConcept } from '../index';
import { ConceptCategory, Difficulty } from '../../lib/types';
import type { ConceptStep } from '../../lib/types';
import { MyVisualization } from './MyVisualization';

const steps: ConceptStep[] = [
  {
    id: 'step-1',
    label: 'Step 1 Name',
    description: 'Brief one-line description',
    educationalText: 'Paragraph explaining what happens at this step. Always visible in the detail panel.',
    deepDiveText: 'Longer in-depth explanation shown in a collapsible accordion.',
    icon: 'FileText',  // Lucide icon name — must exist in StepNav.tsx iconMap
  },
  // ... more steps
];

registerConcept({
  id: 'my-concept',          // URL-safe slug, used in /learn/:conceptId
  title: 'My Concept',
  description: 'One-line description shown on the catalog card.',
  category: ConceptCategory.ALGORITHMS,  // AI_ML | ALGORITHMS | DATABASES | SYSTEM_DESIGN
  difficulty: Difficulty.BEGINNER,       // BEGINNER | INTERMEDIATE | ADVANCED
  icon: 'GitBranch',         // Lucide icon for the catalog card
  color: '#22c55e',          // Hex color used in 3D nodes and accents
  steps,
  Visualization: MyVisualization,
});
```

### 3. Create the visualization component

The visualization receives `VisualizationProps`:

```typescript
interface VisualizationProps {
  currentStep: string;          // ID of the currently active step
  completedSteps: string[];     // IDs of all completed steps
  processingStep: string | null; // ID of step being animated (during auto-play)
  isPlaying: boolean;           // Whether auto-play is running
}
```

**Option A: Reuse the 3D pipeline scene** (for pipeline/flow concepts):

```tsx
import type { VisualizationProps } from '../../lib/types';
import { PipelineScene } from '../../components/three/PipelineScene';
import { getConcept } from '../../concepts';

export function MyVisualization(props: VisualizationProps) {
  const concept = getConcept('my-concept');
  if (!concept) return null;

  return (
    <div className="w-full h-full">
      <PipelineScene
        steps={concept.steps}
        color={concept.color}
        onStepClick={() => {}}
        {...props}
      />
    </div>
  );
}
```

**Option B: Custom 2D visualization** (for algorithms, data structures):

```tsx
import type { VisualizationProps } from '../../lib/types';

export function MyVisualization({ currentStep, completedSteps }: VisualizationProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {/* SVG, Canvas, or HTML-based visualization */}
      <svg viewBox="0 0 800 600" className="max-w-full max-h-full">
        {/* Render based on currentStep */}
      </svg>
    </div>
  );
}
```

### 4. Register the concept

Add a side-effect import to `src/concepts/index.ts`:

```typescript
// At the bottom of the file
import './my-concept';
```

### 5. Add any new icons

If your steps use Lucide icons not already in `StepNav.tsx`, add them to the `iconMap`:

```typescript
// In src/components/StepNav.tsx
import { GitBranch, Layers, /* ...new icons */ } from 'lucide-react';

const iconMap: Record<string, typeof FileText> = {
  // ... existing icons
  GitBranch,
  Layers,
};
```

## Available Categories

| Constant | Display Value |
|---|---|
| `ConceptCategory.AI_ML` | AI & ML |
| `ConceptCategory.ALGORITHMS` | Algorithms |
| `ConceptCategory.DATABASES` | Databases |
| `ConceptCategory.SYSTEM_DESIGN` | System Design |

## Available Icons Already in StepNav

`FileText`, `Scissors`, `Binary`, `Database`, `Search`, `Filter`, `MessageSquare`, `Sparkles`

## Tips

- Keep step IDs URL-safe and short (e.g., `'init'`, `'partition'`, `'merge'`)
- Educational text should be 1-3 sentences. Deep dive text can be a full paragraph.
- For algorithm concepts, consider animating array/tree state changes per step
- The `color` field is used for 3D node glow, active connection tubes, and UI accents
- Test with `npm run build` to catch TypeScript errors before committing
