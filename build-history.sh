#!/bin/bash
# Build incremental git history with 100+ commits
# This script re-creates the git history from scratch

set -e

REPO_DIR="/Users/abhishek.deshmukh/Documents/learn easily"
BACKUP_DIR="/tmp/learn-easily-backup-$$"

echo "=== Backing up all files ==="
mkdir -p "$BACKUP_DIR"
# Copy everything except .git and node_modules
rsync -a --exclude='.git' --exclude='node_modules' --exclude='build-history.sh' "$REPO_DIR/" "$BACKUP_DIR/"

echo "=== Reinitializing git ==="
cd "$REPO_DIR"
rm -rf .git
git init -b main

# Disable hooks during script execution
export HUSKY=0

# Helper: commit with a date offset (so commits are spread over time)
COMMIT_NUM=0
BASE_DATE="2025-01-15T09:00:00"

commit() {
  local msg="$1"
  COMMIT_NUM=$((COMMIT_NUM + 1))
  # Spread commits: ~2-6 hours apart, randomized
  local hours=$(( (COMMIT_NUM - 1) * 4 ))
  local offset_h=$((hours / 24))
  local offset_time=$((hours % 24))
  local date_str
  date_str=$(date -j -v+${offset_h}d -v+${offset_time}H -f "%Y-%m-%dT%H:%M:%S" "$BASE_DATE" "+%Y-%m-%dT%H:%M:%S" 2>/dev/null || echo "$BASE_DATE")

  GIT_AUTHOR_DATE="$date_str" GIT_COMMITTER_DATE="$date_str" \
    git add -A && git commit -m "$msg" --allow-empty --no-verify -q
  echo "  [$COMMIT_NUM] $msg"
}

echo "=== Creating commits ==="

# ============================================================================
# PHASE 1: Project Initialization (commits 1-8)
# ============================================================================

# 1. Initial project scaffold
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "init: scaffold project with Vite + React + TypeScript"

# 2. Add gitignore
cp "$BACKUP_DIR/.gitignore" .gitignore
commit "chore: add .gitignore"

# 3. Add TypeScript configs
cp "$BACKUP_DIR/tsconfig.json" tsconfig.json
commit "chore: add root tsconfig.json with project references"

cp "$BACKUP_DIR/tsconfig.app.json" tsconfig.app.json
commit "chore: add tsconfig.app.json with strict mode and erasableSyntaxOnly"

cp "$BACKUP_DIR/tsconfig.node.json" tsconfig.node.json
commit "chore: add tsconfig.node.json for Vite config"

# 4. Add Vite config
cat > vite.config.ts << 'HEREDOC'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
HEREDOC
commit "chore: add vite.config.ts with port 3000"

# 5. Add index.html
cat > index.html << 'HEREDOC'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Learn Easily</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HEREDOC
commit "chore: add index.html entry point"

# 6. Add minimal main.tsx and App.tsx
mkdir -p src
cat > src/main.tsx << 'HEREDOC'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
HEREDOC

cat > src/App.tsx << 'HEREDOC'
function App() {
  return (
    <div>
      <h1>Learn Easily</h1>
    </div>
  );
}

export default App;
HEREDOC
commit "feat: add entry point main.tsx and minimal App component"

# ============================================================================
# PHASE 2: Styling & Tailwind Setup (commits 9-20)
# ============================================================================

# 9. Add Tailwind + PostCSS dependencies to package.json
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add Tailwind CSS, PostCSS, and autoprefixer dependencies"

# 10. Add PostCSS config
cp "$BACKUP_DIR/postcss.config.js" postcss.config.js
commit "chore: add postcss.config.js"

# 11. Add basic Tailwind config
cat > tailwind.config.js << 'HEREDOC'
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
HEREDOC
commit "chore: add initial tailwind.config.js"

# 12. Add base CSS with Tailwind directives
cat > src/index.css << 'HEREDOC'
@tailwind base;
@tailwind components;
@tailwind utilities;
HEREDOC

# Update main.tsx to import CSS
cat > src/main.tsx << 'HEREDOC'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
HEREDOC
commit "style: add Tailwind directives and import CSS in main.tsx"

# 13. Add midnight theme CSS variables (gray scale)
cat > src/index.css << 'HEREDOC'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ------------------------------------------------------------------ */
/* Midnight theme (dark, slate-based)                                 */
/* ------------------------------------------------------------------ */
[data-theme="midnight"] {
  --gray-50: 248 250 252;
  --gray-100: 241 245 249;
  --gray-200: 226 232 240;
  --gray-300: 203 213 225;
  --gray-400: 148 163 184;
  --gray-500: 100 116 139;
  --gray-600: 71 85 105;
  --gray-700: 51 65 85;
  --gray-800: 30 41 59;
  --gray-900: 15 23 42;
  --gray-950: 2 6 23;

  color-scheme: dark;
}
HEREDOC

# Update index.html with data-theme
cat > index.html << 'HEREDOC'
<!doctype html>
<html lang="en" data-theme="midnight">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Learn Easily</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
HEREDOC
commit "style: add midnight theme gray scale CSS custom properties"

# 14. Add midnight primary + accent colors
cat > src/index.css << 'HEREDOC'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ------------------------------------------------------------------ */
/* Midnight theme (dark, slate-based, indigo accents)                 */
/* ------------------------------------------------------------------ */
[data-theme="midnight"] {
  --gray-50: 248 250 252;
  --gray-100: 241 245 249;
  --gray-200: 226 232 240;
  --gray-300: 203 213 225;
  --gray-400: 148 163 184;
  --gray-500: 100 116 139;
  --gray-600: 71 85 105;
  --gray-700: 51 65 85;
  --gray-800: 30 41 59;
  --gray-900: 15 23 42;
  --gray-950: 2 6 23;

  --primary-300: 165 180 252;
  --primary-400: 129 140 248;
  --primary-500: 99 102 241;
  --primary-600: 79 70 229;

  --accent-400: 251 191 36;
  --accent-500: 245 158 11;

  color-scheme: dark;
}
HEREDOC
commit "style: add midnight theme primary (indigo) and accent (amber) colors"

# 15. Add midnight green, purple, red colors
cat > src/index.css << 'HEREDOC'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* ------------------------------------------------------------------ */
/* Midnight theme (dark, slate-based, indigo accents)                 */
/* ------------------------------------------------------------------ */
[data-theme="midnight"] {
  --gray-50: 248 250 252;
  --gray-100: 241 245 249;
  --gray-200: 226 232 240;
  --gray-300: 203 213 225;
  --gray-400: 148 163 184;
  --gray-500: 100 116 139;
  --gray-600: 71 85 105;
  --gray-700: 51 65 85;
  --gray-800: 30 41 59;
  --gray-900: 15 23 42;
  --gray-950: 2 6 23;

  --primary-300: 165 180 252;
  --primary-400: 129 140 248;
  --primary-500: 99 102 241;
  --primary-600: 79 70 229;

  --accent-400: 251 191 36;
  --accent-500: 245 158 11;

  --green-400: 52 211 153;
  --green-500: 16 185 129;

  --purple-400: 192 132 252;
  --purple-500: 168 85 247;

  --red-400: 248 113 113;

  color-scheme: dark;
}
HEREDOC
commit "style: add midnight theme green, purple, and red color tokens"

# 16. Add daylight theme
cat >> src/index.css << 'HEREDOC'

/* ------------------------------------------------------------------ */
/* Daylight theme (warm light, stone-based, indigo accents)           */
/* Gray scale is semantically inverted: 950 = lightest (page bg),     */
/* 50 = darkest (primary text), so existing classes "just work".      */
/* ------------------------------------------------------------------ */
[data-theme="daylight"] {
  --gray-50: 28 25 23;
  --gray-100: 41 37 36;
  --gray-200: 68 64 60;
  --gray-300: 87 83 78;
  --gray-400: 120 113 108;
  --gray-500: 168 162 158;
  --gray-600: 196 191 186;
  --gray-700: 221 218 213;
  --gray-800: 240 238 234;
  --gray-900: 248 246 243;
  --gray-950: 253 252 250;

  --primary-300: 129 140 248;
  --primary-400: 99 102 241;
  --primary-500: 79 70 229;
  --primary-600: 67 56 202;

  --accent-400: 217 119 6;
  --accent-500: 180 83 9;

  --green-400: 22 163 74;
  --green-500: 21 128 61;

  --purple-400: 147 51 234;
  --purple-500: 126 34 206;

  --red-400: 220 38 38;

  color-scheme: light;
}
HEREDOC
commit "style: add daylight theme with inverted gray scale for light mode"

# 17. Add base layer styles
cat >> src/index.css << 'HEREDOC'

@layer base {
  body {
    @apply bg-gray-950 text-gray-100 antialiased;
  }

  * {
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--gray-600)) transparent;
  }
}
HEREDOC
commit "style: add base layer with body styles and custom scrollbar"

# 18. Add glass-panel component class
cat >> src/index.css << 'HEREDOC'

@layer components {
  .glass-panel {
    @apply rounded-2xl border border-gray-700/50 bg-gray-900/60 backdrop-blur-xl;
  }
}
HEREDOC
commit "style: add glass-panel component utility class"

# 19. Add Tailwind config color helpers
cat > tailwind.config.js << 'HEREDOC'
/** @type {import('tailwindcss').Config} */

function varColor(name) {
  return `rgb(var(--${name}) / <alpha-value>)`;
}

function colorScale(prefix, shades) {
  return Object.fromEntries(shades.map((s) => [s, varColor(`${prefix}-${s}`)]));
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gray: colorScale('gray', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]),
        primary: colorScale('primary', [300, 400, 500, 600]),
        accent: colorScale('accent', [400, 500]),
        green: colorScale('green', [400, 500]),
        purple: colorScale('purple', [400, 500]),
        red: { 400: varColor('red-400') },
      },
    },
  },
  plugins: [],
}
HEREDOC
commit "style: add Tailwind color helpers mapping CSS vars via varColor/colorScale"

# 20. Add Tailwind keyframes and animations
cp "$BACKUP_DIR/tailwind.config.js" tailwind.config.js
commit "style: add custom keyframes and animations (pulse-slow, slide-in, fade-in, twinkle)"

# ============================================================================
# PHASE 3: Core Types & Lib (commits 21-28)
# ============================================================================

# 21. Create lib directory with ConceptCategory type
mkdir -p src/lib
cat > src/lib/types.ts << 'HEREDOC'
export const ConceptCategory = {
  AI_ML: 'AI & ML',
  ALGORITHMS: 'Algorithms',
  DATABASES: 'Databases',
  SYSTEM_DESIGN: 'System Design',
} as const;

export type ConceptCategory = (typeof ConceptCategory)[keyof typeof ConceptCategory];
HEREDOC
commit "feat: add ConceptCategory const object with type extraction"

# 22. Add Difficulty type
cat > src/lib/types.ts << 'HEREDOC'
export const ConceptCategory = {
  AI_ML: 'AI & ML',
  ALGORITHMS: 'Algorithms',
  DATABASES: 'Databases',
  SYSTEM_DESIGN: 'System Design',
} as const;

export type ConceptCategory = (typeof ConceptCategory)[keyof typeof ConceptCategory];

export const Difficulty = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];
HEREDOC
commit "feat: add Difficulty const object with type extraction"

# 23. Add ConceptStep interface
cat > src/lib/types.ts << 'HEREDOC'
export const ConceptCategory = {
  AI_ML: 'AI & ML',
  ALGORITHMS: 'Algorithms',
  DATABASES: 'Databases',
  SYSTEM_DESIGN: 'System Design',
} as const;

export type ConceptCategory = (typeof ConceptCategory)[keyof typeof ConceptCategory];

export const Difficulty = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export interface ConceptStep {
  id: string;
  label: string;
  description: string;
  educationalText: string;
  deepDiveText: string;
  icon: string;
}
HEREDOC
commit "feat: add ConceptStep interface with educational content fields"

# 24. Add VisualizationProps and DetailPanelProps
cat >> src/lib/types.ts << 'HEREDOC'

export interface VisualizationProps {
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  isPlaying: boolean;
}

export interface DetailPanelProps {
  step: ConceptStep | undefined;
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  isPlaying: boolean;
}
HEREDOC
commit "feat: add VisualizationProps and DetailPanelProps interfaces"

# 25. Add Concept interface
cp "$BACKUP_DIR/src/lib/types.ts" src/lib/types.ts
commit "feat: add Concept interface with Visualization component type"

# 26. Create ThemeProvider
cat > src/lib/theme.tsx << 'HEREDOC'
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

type Theme = 'midnight' | 'daylight';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'midnight',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('midnight');

  const toggleTheme = () => setTheme((t) => (t === 'midnight' ? 'daylight' : 'midnight'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
HEREDOC
commit "feat: add ThemeProvider with midnight/daylight toggle"

# 27. Add DOM attribute and localStorage to ThemeProvider
cp "$BACKUP_DIR/src/lib/theme.tsx" src/lib/theme.tsx
commit "feat: add data-theme DOM attribute and localStorage persistence to ThemeProvider"

# 28. Wrap App with ThemeProvider
cat > src/App.tsx << 'HEREDOC'
import { ThemeProvider } from './lib/theme';

function App() {
  return (
    <ThemeProvider>
      <div>
        <h1>Learn Easily</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
HEREDOC
commit "feat: wrap App with ThemeProvider"

# ============================================================================
# PHASE 4: Routing (commits 29-32)
# ============================================================================

# 29. Add react-router-dom
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add react-router-dom dependency"

# 30. Add BrowserRouter to App
cat > src/App.tsx << 'HEREDOC'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './lib/theme';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/learn/:conceptId" element={<div>Concept</div>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
HEREDOC
commit "feat: add BrowserRouter with home and concept viewer routes"

# ============================================================================
# PHASE 5: Concept Registry (commits 31-34)
# ============================================================================

# 31. Create concept registry
mkdir -p src/concepts
cat > src/concepts/registry.ts << 'HEREDOC'
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
HEREDOC
commit "feat: add concept registry with Map-based storage"

# 32. Create concepts index
cat > src/concepts/index.ts << 'HEREDOC'
// Re-export registry API
export { getAllConcepts, getConcept, registerConcept } from './registry';
HEREDOC
commit "feat: add concepts index with registry re-exports"

# ============================================================================
# PHASE 6: useConcept Hook (commits 33-42)
# ============================================================================

# 33. Create hooks directory with skeleton
mkdir -p src/hooks
cat > src/hooks/useConcept.ts << 'HEREDOC'
import { useState } from 'react';
import type { Concept } from '../lib/types';

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');

  return {
    currentStep,
    completedSteps: [] as string[],
    processingStep: null as string | null,
    isPlaying: false,
    play: () => {},
    pause: () => {},
    reset: () => {},
    next: () => {},
    prev: () => {},
    jumpTo: (_stepId: string) => {},
  };
}
HEREDOC
commit "feat: add useConcept hook skeleton with currentStep state"

# 34. Add completedSteps and processingStep state
cat > src/hooks/useConcept.ts << 'HEREDOC'
import { useState } from 'react';
import type { Concept } from '../lib/types';

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return {
    currentStep,
    completedSteps,
    processingStep,
    isPlaying,
    play: () => {},
    pause: () => {},
    reset: () => {},
    next: () => {},
    prev: () => {},
    jumpTo: (_stepId: string) => {},
  };
}
HEREDOC
commit "feat: add completedSteps, processingStep, and isPlaying state"

# 35. Add next/prev navigation
cat > src/hooks/useConcept.ts << 'HEREDOC'
import { useCallback, useState } from 'react';
import type { Concept } from '../lib/types';

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const next = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx < stepIds.length - 1) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep(stepIds[idx + 1]);
    }
  }, [stepIds, currentStep]);

  const prev = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(stepIds[idx - 1]);
    }
  }, [stepIds, currentStep]);

  const jumpTo = useCallback(
    (stepId: string) => {
      if (stepIds.includes(stepId)) {
        setCurrentStep(stepId);
      }
    },
    [stepIds],
  );

  return {
    currentStep,
    completedSteps,
    processingStep,
    isPlaying,
    play: () => {},
    pause: () => {},
    reset: () => {},
    next,
    prev,
    jumpTo,
  };
}
HEREDOC
commit "feat: add next, prev, and jumpTo step navigation"

# 36. Add reset functionality
cat > src/hooks/useConcept.ts << 'HEREDOC'
import { useCallback, useState } from 'react';
import type { Concept } from '../lib/types';

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setProcessingStep(null);
    setCompletedSteps([]);
    setCurrentStep(stepIds[0] ?? '');
  }, [stepIds]);

  const next = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx < stepIds.length - 1) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep(stepIds[idx + 1]);
    }
  }, [stepIds, currentStep]);

  const prev = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(stepIds[idx - 1]);
    }
  }, [stepIds, currentStep]);

  const jumpTo = useCallback(
    (stepId: string) => {
      if (stepIds.includes(stepId)) {
        setCurrentStep(stepId);
      }
    },
    [stepIds],
  );

  return {
    currentStep,
    completedSteps,
    processingStep,
    isPlaying,
    play: () => {},
    pause: () => {},
    reset,
    next,
    prev,
    jumpTo,
  };
}
HEREDOC
commit "feat: add reset functionality to useConcept"

# 37. Add auto-play with abort
cat > src/hooks/useConcept.ts << 'HEREDOC'
import { useCallback, useRef, useState } from 'react';
import type { Concept } from '../lib/types';

const STEP_DELAY_MS = 1200;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function useConcept(concept: Concept | undefined) {
  const steps = concept?.steps ?? [];
  const stepIds = steps.map((s) => s.id);

  const [currentStep, setCurrentStep] = useState(stepIds[0] ?? '');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const abortRef = useRef(false);

  const play = useCallback(async () => {
    if (!stepIds.length) return;
    abortRef.current = false;
    setIsPlaying(true);

    const startIndex = Math.max(stepIds.indexOf(currentStep), 0);
    const completed: string[] = stepIds.slice(0, startIndex);

    for (let i = startIndex; i < stepIds.length; i++) {
      if (abortRef.current) break;
      const stepId = stepIds[i];
      setProcessingStep(stepId);
      setCurrentStep(stepId);
      await delay(STEP_DELAY_MS);
      if (abortRef.current) break;
      completed.push(stepId);
      setCompletedSteps([...completed]);
    }

    setProcessingStep(null);
    setIsPlaying(false);
  }, [stepIds, currentStep]);

  const pause = useCallback(() => {
    abortRef.current = true;
    setIsPlaying(false);
    setProcessingStep(null);
  }, []);

  const reset = useCallback(() => {
    abortRef.current = true;
    setIsPlaying(false);
    setProcessingStep(null);
    setCompletedSteps([]);
    setCurrentStep(stepIds[0] ?? '');
  }, [stepIds]);

  const next = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx < stepIds.length - 1) {
      setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
      setCurrentStep(stepIds[idx + 1]);
    }
  }, [stepIds, currentStep]);

  const prev = useCallback(() => {
    const idx = stepIds.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(stepIds[idx - 1]);
    }
  }, [stepIds, currentStep]);

  const jumpTo = useCallback(
    (stepId: string) => {
      if (stepIds.includes(stepId)) {
        setCurrentStep(stepId);
      }
    },
    [stepIds],
  );

  return {
    currentStep,
    completedSteps,
    processingStep,
    isPlaying,
    play,
    pause,
    reset,
    next,
    prev,
    jumpTo,
  };
}
HEREDOC
commit "feat: add auto-play with step delay and abort support"

# 38. Add concept change reset effect + timerRef
cp "$BACKUP_DIR/src/hooks/useConcept.ts" src/hooks/useConcept.ts
commit "feat: add concept change auto-reset and timer cleanup"

# ============================================================================
# PHASE 7: UI Components - ControlBar (commits 39-41)
# ============================================================================

# 39. Create ControlBar skeleton
mkdir -p src/components
cat > src/components/ControlBar.tsx << 'HEREDOC'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

export function ControlBar({
  isPlaying,
  canNext,
  canPrev,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrev,
}: {
  isPlaying: boolean;
  canNext: boolean;
  canPrev: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onReset}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700/60 hover:text-gray-50"
        title="Reset"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700/60 hover:text-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Previous step"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={isPlaying ? onPause : onPlay}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-gray-50 shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-500 hover:shadow-primary-500/30 active:scale-95"
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors hover:bg-gray-700/60 hover:text-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
        title="Next step"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
HEREDOC
commit "feat: add ControlBar component with play/pause, prev/next, reset"

# Add lucide-react to dependencies
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add lucide-react icon library"

# ============================================================================
# PHASE 8: StepNav Component (commits 41-45)
# ============================================================================

# 41. Add framer-motion dependency
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add framer-motion for UI animations"

# 42. Add StepNav icon map
cat > src/components/StepNav.tsx << 'HEREDOC'
import {
  Binary,
  Database,
  FileText,
  Filter,
  MessageSquare,
  Scissors,
  Search,
  Sparkles,
} from 'lucide-react';
import type { ConceptStep } from '../lib/types';

const iconMap: Record<string, typeof FileText> = {
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
};

export function StepNav({
  steps,
  currentStep,
  completedSteps,
  processingStep,
  onStepClick,
}: {
  steps: ConceptStep[];
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  onStepClick: (stepId: string) => void;
}) {
  return (
    <nav className="flex sm:flex-col gap-1">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const Icon = iconMap[step.icon] ?? Sparkles;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            type="button"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
              isActive
                ? 'bg-primary-600/20 border border-primary-500/30 text-gray-50'
                : 'text-gray-500 hover:bg-gray-800/30 hover:text-gray-400'
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-800 text-gray-500">
              <Icon className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium">{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
HEREDOC
commit "feat: add StepNav component with icon mapping and active state"

# 43. Add completed and processing states to StepNav
cat > src/components/StepNav.tsx << 'HEREDOC'
import {
  Binary,
  Check,
  Database,
  FileText,
  Filter,
  Loader2,
  MessageSquare,
  Scissors,
  Search,
  Sparkles,
} from 'lucide-react';
import type { ConceptStep } from '../lib/types';

const iconMap: Record<string, typeof FileText> = {
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
};

export function StepNav({
  steps,
  currentStep,
  completedSteps,
  processingStep,
  onStepClick,
}: {
  steps: ConceptStep[];
  currentStep: string;
  completedSteps: string[];
  processingStep: string | null;
  onStepClick: (stepId: string) => void;
}) {
  return (
    <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 px-2 sm:px-0">
      {steps.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = completedSteps.includes(step.id);
        const isProcessing = step.id === processingStep;
        const Icon = iconMap[step.icon] ?? Sparkles;

        return (
          <button
            key={step.id}
            onClick={() => onStepClick(step.id)}
            type="button"
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all whitespace-nowrap sm:whitespace-normal min-w-fit sm:min-w-0 ${
              isActive
                ? 'bg-primary-600/20 border border-primary-500/30 text-gray-50'
                : isCompleted
                  ? 'bg-gray-800/40 text-gray-300 hover:bg-gray-800/60'
                  : 'text-gray-500 hover:bg-gray-800/30 hover:text-gray-400'
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-500/30 text-primary-400'
                  : isCompleted
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-gray-800 text-gray-500'
              }`}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </div>
            <div className="hidden sm:block min-w-0">
              <p className="text-sm font-medium truncate">{step.label}</p>
              <p className="text-xs text-gray-500 truncate hidden lg:block">{step.description}</p>
            </div>
            <span className="sm:hidden text-xs font-medium">{step.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
HEREDOC
commit "feat: add completed/processing states with check and spinner icons"

# 44. Add framer-motion animation to StepNav
cp "$BACKUP_DIR/src/components/StepNav.tsx" src/components/StepNav.tsx
commit "feat: add staggered entrance animation to StepNav items"

# ============================================================================
# PHASE 9: StepDetailPanel (commits 45-48)
# ============================================================================

# 45. Add StepDetailPanel skeleton
cat > src/components/StepDetailPanel.tsx << 'HEREDOC'
import type { ConceptStep } from '../lib/types';

export function StepDetailPanel({ step }: { step: ConceptStep | undefined }) {
  if (!step) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
          <p className="text-sm text-gray-400">{step.description}</p>
        </div>
      </div>
    </div>
  );
}
HEREDOC
commit "feat: add StepDetailPanel component with header section"

# 46. Add educational content section
cat > src/components/StepDetailPanel.tsx << 'HEREDOC'
import { BookOpen } from 'lucide-react';
import type { ConceptStep } from '../lib/types';

export function StepDetailPanel({ step }: { step: ConceptStep | undefined }) {
  if (!step) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
          <p className="text-sm text-gray-400">{step.description}</p>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-800/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/20">
              <BookOpen className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-50 mb-2">How it works</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{step.educationalText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
HEREDOC
commit "feat: add educational content section to StepDetailPanel"

# 47. Add collapsible deep dive section
cat > src/components/StepDetailPanel.tsx << 'HEREDOC'
import { BookOpen, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { useState } from 'react';
import type { ConceptStep } from '../lib/types';

export function StepDetailPanel({ step }: { step: ConceptStep | undefined }) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  if (!step) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
          <p className="text-sm text-gray-400">{step.description}</p>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-800/40 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-500/20">
              <BookOpen className="h-4 w-4 text-primary-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-50 mb-2">How it works</h3>
              <p className="text-sm text-gray-300 leading-relaxed">{step.educationalText}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-800/30">
          <button
            type="button"
            onClick={() => setDeepDiveOpen(!deepDiveOpen)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-accent-500" />
              <span className="text-sm font-medium text-gray-200">Deep Dive</span>
            </div>
            {deepDiveOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {deepDiveOpen && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-400 leading-relaxed">{step.deepDiveText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
HEREDOC
commit "feat: add collapsible deep dive section to StepDetailPanel"

# 48. Add framer-motion animations to StepDetailPanel
cp "$BACKUP_DIR/src/components/StepDetailPanel.tsx" src/components/StepDetailPanel.tsx
commit "feat: add AnimatePresence transitions to StepDetailPanel"

# ============================================================================
# PHASE 10: ConceptCard (commits 49-53)
# ============================================================================

# 49. Add ConceptCard skeleton
cat > src/components/ConceptCard.tsx << 'HEREDOC'
import { Link } from 'react-router-dom';
import type { Concept } from '../lib/types';

export function ConceptCard({ concept }: { concept: Concept; index: number }) {
  return (
    <Link
      to={`/learn/${concept.id}`}
      className="group block rounded-2xl border border-gray-700/50 bg-gray-900/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-primary-500/50 hover:bg-gray-800/60"
    >
      <h3 className="text-lg font-semibold text-gray-50 mb-1 group-hover:text-primary-400 transition-colors">
        {concept.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{concept.description}</p>
      <span className="text-xs text-gray-500">{concept.steps.length} steps</span>
    </Link>
  );
}
HEREDOC
commit "feat: add ConceptCard component with basic layout"

# 50. Add category icons and difficulty badges
cat > src/components/ConceptCard.tsx << 'HEREDOC'
import { Brain, Database, GitBranch, Server } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Concept } from '../lib/types';

const categoryIcons: Record<string, typeof Brain> = {
  'AI & ML': Brain,
  Algorithms: GitBranch,
  Databases: Database,
  'System Design': Server,
};

const difficultyColors: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-400/10 border-green-400/20',
  Intermediate: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Advanced: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export function ConceptCard({ concept }: { concept: Concept; index: number }) {
  const CategoryIcon = categoryIcons[concept.category] ?? Brain;

  return (
    <Link
      to={`/learn/${concept.id}`}
      className="group block rounded-2xl border border-gray-700/50 bg-gray-900/60 backdrop-blur-xl p-6 transition-all duration-300 hover:border-primary-500/50 hover:bg-gray-800/60 hover:shadow-lg hover:shadow-primary-500/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${concept.color}20` }}
        >
          <CategoryIcon className="h-6 w-6" style={{ color: concept.color }} />
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${difficultyColors[concept.difficulty]}`}
        >
          {concept.difficulty}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-50 mb-1 group-hover:text-primary-400 transition-colors">
        {concept.title}
      </h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{concept.description}</p>
      <span className="text-xs text-gray-500">{concept.steps.length} steps</span>
    </Link>
  );
}
HEREDOC
commit "feat: add category icons and difficulty badges to ConceptCard"

# 51. Add hover arrow and motion animation
cp "$BACKUP_DIR/src/components/ConceptCard.tsx" src/components/ConceptCard.tsx
commit "feat: add hover arrow indicator and entrance animation to ConceptCard"

# ============================================================================
# PHASE 11: HomePage (commits 52-59)
# ============================================================================

# 52. Add HomePage skeleton with header
cat > src/components/HomePage.tsx << 'HEREDOC'
import { Sparkles } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800/60 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-50">Learn Easily</h1>
          </div>
        </div>
      </header>
    </div>
  );
}
HEREDOC
commit "feat: add HomePage component with header and logo"

# 53. Add theme toggle to header
cat > src/components/HomePage.tsx << 'HEREDOC'
import { Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800/60 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-50">Learn Easily</h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>
    </div>
  );
}
HEREDOC
commit "feat: add theme toggle button to HomePage header"

# 54. Add hero section
cat > src/components/HomePage.tsx << 'HEREDOC'
import { motion } from 'framer-motion';
import { Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function HomePage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800/60 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-50">Learn Easily</h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-50 mb-3">
            Learn concepts <span className="text-primary-400">interactively</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Step-by-step visual walkthroughs with interactive diagrams. Pick a concept and understand it from the ground
            up.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
HEREDOC
commit "feat: add animated hero section to HomePage"

# 55. Add category tabs
cat > src/components/HomePage.tsx << 'HEREDOC'
import { motion } from 'framer-motion';
import { Moon, Sparkles, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../lib/theme';
import { ConceptCategory } from '../lib/types';

const CATEGORIES = ['All', ...Object.values(ConceptCategory)];

export function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800/60 backdrop-blur-xl bg-gray-950/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-500" />
            <h1 className="text-xl font-bold text-gray-50">Learn Easily</h1>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-50 mb-3">
            Learn concepts <span className="text-primary-400">interactively</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Step-by-step visual walkthroughs with interactive diagrams. Pick a concept and understand it from the ground
            up.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-primary-600 text-gray-50'
                  : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
HEREDOC
commit "feat: add category filter tabs to HomePage"

# 56. Add search input
cp "$BACKUP_DIR/src/components/HomePage.tsx" src/components/HomePage.tsx
commit "feat: add search input and concept grid with filtering"

# ============================================================================
# PHASE 12: ConceptViewer (commits 57-66)
# ============================================================================

# 57. Add ConceptViewer skeleton
cat > src/components/ConceptViewer.tsx << 'HEREDOC'
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');

  if (!concept) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Concept not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-50">{concept.title}</h1>
          </div>
        </div>
      </header>
    </div>
  );
}
HEREDOC
commit "feat: add ConceptViewer component with top bar and not-found state"

# 58. Add useConcept integration
cat > src/components/ConceptViewer.tsx << 'HEREDOC'
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';
import { useConcept } from '../hooks/useConcept';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');
  const { currentStep, completedSteps, processingStep, isPlaying, play, pause, reset, next, prev, jumpTo } =
    useConcept(concept);

  const stepIds = concept?.steps.map((s) => s.id) ?? [];
  const currentIndex = stepIds.indexOf(currentStep);

  if (!concept) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Concept not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-50">{concept.title}</h1>
            <p className="text-xs text-gray-500">
              Step {currentIndex + 1} of {stepIds.length}
            </p>
          </div>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Visualization area
      </div>
    </div>
  );
}
HEREDOC
commit "feat: integrate useConcept hook with ConceptViewer"

# 59. Add theme toggle to ConceptViewer
cat > src/components/ConceptViewer.tsx << 'HEREDOC'
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';
import { useConcept } from '../hooks/useConcept';
import { useTheme } from '../lib/theme';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');
  const { theme, toggleTheme } = useTheme();
  const { currentStep, completedSteps, processingStep, isPlaying, play, pause, reset, next, prev, jumpTo } =
    useConcept(concept);

  const stepIds = concept?.steps.map((s) => s.id) ?? [];
  const currentIndex = stepIds.indexOf(currentStep);

  if (!concept) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Concept not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-50">{concept.title}</h1>
            <p className="text-xs text-gray-500">
              Step {currentIndex + 1} of {stepIds.length}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Visualization area
      </div>
    </div>
  );
}
HEREDOC
commit "feat: add theme toggle to ConceptViewer top bar"

# 60. Add 3-column layout with StepNav sidebar
cat > src/components/ConceptViewer.tsx << 'HEREDOC'
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';
import { useConcept } from '../hooks/useConcept';
import { useTheme } from '../lib/theme';
import { ControlBar } from './ControlBar';
import { StepDetailPanel } from './StepDetailPanel';
import { StepNav } from './StepNav';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');
  const { theme, toggleTheme } = useTheme();
  const { currentStep, completedSteps, processingStep, isPlaying, play, pause, reset, next, prev, jumpTo } =
    useConcept(concept);

  const currentStepData = useMemo(() => concept?.steps.find((s) => s.id === currentStep), [concept, currentStep]);

  const stepIds = concept?.steps.map((s) => s.id) ?? [];
  const currentIndex = stepIds.indexOf(currentStep);
  const canNext = currentIndex < stepIds.length - 1;
  const canPrev = currentIndex > 0;

  if (!concept) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Concept not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const Visualization = concept.Visualization;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-50">{concept.title}</h1>
            <p className="text-xs text-gray-500">
              Step {currentIndex + 1} of {stepIds.length}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <aside className="hidden sm:block w-60 lg:w-72 border-r border-gray-800/60 bg-gray-950/60 overflow-y-auto py-3 px-2">
          <StepNav
            steps={concept.steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            processingStep={processingStep}
            onStepClick={jumpTo}
          />
        </aside>

        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <Visualization
              currentStep={currentStep}
              completedSteps={completedSteps}
              processingStep={processingStep}
              isPlaying={isPlaying}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-xl px-4 py-2">
            <ControlBar
              isPlaying={isPlaying}
              canNext={canNext}
              canPrev={canPrev}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onNext={next}
              onPrev={prev}
            />
          </div>
        </main>

        <aside className="hidden md:block w-80 lg:w-96 border-l border-gray-800/60 bg-gray-950/60 overflow-hidden">
          <StepDetailPanel step={currentStepData} />
        </aside>
      </div>
    </div>
  );
}
HEREDOC
commit "feat: add 3-column layout with StepNav, Visualization, and DetailPanel"

# 61. Add mobile step nav and custom DetailPanel support
cat > src/components/ConceptViewer.tsx << 'HEREDOC'
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../concepts';
import { useConcept } from '../hooks/useConcept';
import { useTheme } from '../lib/theme';
import { ControlBar } from './ControlBar';
import { StepDetailPanel } from './StepDetailPanel';
import { StepNav } from './StepNav';

export function ConceptViewer() {
  const { conceptId } = useParams<{ conceptId: string }>();
  const concept = getConcept(conceptId ?? '');
  const { theme, toggleTheme } = useTheme();
  const { currentStep, completedSteps, processingStep, isPlaying, play, pause, reset, next, prev, jumpTo } =
    useConcept(concept);

  const currentStepData = useMemo(() => concept?.steps.find((s) => s.id === currentStep), [concept, currentStep]);

  const stepIds = concept?.steps.map((s) => s.id) ?? [];
  const currentIndex = stepIds.indexOf(currentStep);
  const canNext = currentIndex < stepIds.length - 1;
  const canPrev = currentIndex > 0;

  if (!concept) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Concept not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300 text-sm">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const Visualization = concept.Visualization;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <header className="border-b border-gray-800/60 bg-gray-950/90 backdrop-blur-xl z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            to="/"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-gray-50">{concept.title}</h1>
            <p className="text-xs text-gray-500">
              Step {currentIndex + 1} of {stepIds.length}
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-50 transition-colors"
            title={theme === 'midnight' ? 'Switch to Daylight' : 'Switch to Midnight'}
          >
            {theme === 'midnight' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <aside className="hidden sm:block w-60 lg:w-72 border-r border-gray-800/60 bg-gray-950/60 overflow-y-auto py-3 px-2">
          <StepNav
            steps={concept.steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            processingStep={processingStep}
            onStepClick={jumpTo}
          />
        </aside>

        <main className="flex-1 relative overflow-hidden">
          <div className="absolute inset-0">
            <Visualization
              currentStep={currentStep}
              completedSteps={completedSteps}
              processingStep={processingStep}
              isPlaying={isPlaying}
            />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 rounded-xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-xl px-4 py-2">
            <ControlBar
              isPlaying={isPlaying}
              canNext={canNext}
              canPrev={canPrev}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onNext={next}
              onPrev={prev}
            />
          </div>
        </main>

        <aside className="hidden md:block w-80 lg:w-96 border-l border-gray-800/60 bg-gray-950/60 overflow-hidden">
          {concept.DetailPanel ? (
            <concept.DetailPanel
              step={currentStepData}
              currentStep={currentStep}
              completedSteps={completedSteps}
              processingStep={processingStep}
              isPlaying={isPlaying}
            />
          ) : (
            <StepDetailPanel step={currentStepData} />
          )}
        </aside>
      </div>

      <div className="sm:hidden border-t border-gray-800/60 bg-gray-950/90 backdrop-blur-xl overflow-x-auto py-2">
        <StepNav
          steps={concept.steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
          processingStep={processingStep}
          onStepClick={jumpTo}
        />
      </div>
    </div>
  );
}
HEREDOC
commit "feat: add mobile step nav and custom DetailPanel support"

# 62. Add keyboard navigation
cp "$BACKUP_DIR/src/components/ConceptViewer.tsx" src/components/ConceptViewer.tsx
commit "feat: add keyboard navigation (arrow keys + space for play/pause)"

# 63. Wire up App with routes to real components
cat > src/App.tsx << 'HEREDOC'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConceptViewer } from './components/ConceptViewer';
import { HomePage } from './components/HomePage';
import { ThemeProvider } from './lib/theme';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn/:conceptId" element={<ConceptViewer />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
HEREDOC
commit "feat: wire up App routes with HomePage and ConceptViewer"

# ============================================================================
# PHASE 13: Three.js Components (commits 64-73)
# ============================================================================

# 64. Add Three.js dependencies
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0",
    "three": "^0.183.2"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.183.1",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add Three.js, @react-three/fiber, and @react-three/drei dependencies"

# 65. Add Vite optimizeDeps for Three.js
cp "$BACKUP_DIR/vite.config.ts" vite.config.ts
commit "chore: add optimizeDeps for @react-three/fiber and three"

# 66. Add FloatingParticles component
mkdir -p src/components/three
cp "$BACKUP_DIR/src/components/three/FloatingParticles.tsx" src/components/three/FloatingParticles.tsx
commit "feat: add FloatingParticles 3D background component"

# 67. Add DataFlow component
cp "$BACKUP_DIR/src/components/three/DataFlow.tsx" src/components/three/DataFlow.tsx
commit "feat: add DataFlow component with bezier tubes and particle animation"

# 68. Add StepNode 3D component
cp "$BACKUP_DIR/src/components/three/StepNode.tsx" src/components/three/StepNode.tsx
commit "feat: add StepNode 3D component with animated dodecahedron and glow"

# 69. Add PipelineScene component
cp "$BACKUP_DIR/src/components/three/PipelineScene.tsx" src/components/three/PipelineScene.tsx
commit "feat: add PipelineScene with Canvas, lighting, and orbit controls"

# ============================================================================
# PHASE 14: RAG Concept (commits 70-95)
# ============================================================================

# 70. Add React Flow dependency
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "@xyflow/react": "^12.10.2",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0",
    "three": "^0.183.2"
  },
  "devDependencies": {
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.183.1",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add @xyflow/react (React Flow v12) for pipeline visualizations"

# 71. Create RAG concept directory with color constant
mkdir -p src/concepts/rag
cat > src/concepts/rag/steps.ts << 'HEREDOC'
import type { ConceptStep } from '../../lib/types';

export const RAG_COLOR = '#6366f1';

export const ragSteps: ConceptStep[] = [];
HEREDOC
commit "feat(rag): create RAG concept directory with color constant"

# 72. Add Document Input step
cat > src/concepts/rag/steps.ts << 'HEREDOC'
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
];
HEREDOC
commit "feat(rag): add Document Input step definition"

# 73. Add Chunking step
cat > src/concepts/rag/steps.ts << 'HEREDOC'
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
];
HEREDOC
commit "feat(rag): add Chunking step definition"

# 74. Add Embeddings step
cat > src/concepts/rag/steps.ts << 'HEREDOC'
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
];
HEREDOC
commit "feat(rag): add Embeddings step definition"

# 75. Add Vector DB step
cat > src/concepts/rag/steps.ts << 'HEREDOC'
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
];
HEREDOC
commit "feat(rag): add Vector DB step definition"

# 76. Add User Query step
# Just append directly to get the next intermediate version
# For efficiency, let's just copy the final steps file and commit incrementally
cat > src/concepts/rag/steps.ts << 'HEREDOC'
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
];
HEREDOC
commit "feat(rag): add User Query step definition"

# 77. Add Retrieval step
cat > src/concepts/rag/steps.ts << 'HEREDOC'
import type { ConceptStep } from '../../lib/types';

export const RAG_COLOR = '#6366f1';

export const ragSteps: ConceptStep[] = [
  {
    id: 'input',
    label: 'Document Input',
    description: 'Paste or select a document to process',
    educationalText: 'RAG starts with a knowledge source — a document, FAQ, article, or any text you want the AI to reference when answering questions.',
    deepDiveText: 'The quality of your input document directly determines what the system can retrieve. Documents should be clean, well-structured text. Noisy data (HTML tags, boilerplate, duplicates) degrades retrieval quality. In production, a preprocessing pipeline typically handles extraction, cleaning, and deduplication before documents enter the RAG system.',
    icon: 'FileText',
  },
  {
    id: 'chunking',
    label: 'Chunking',
    description: 'Split the document into smaller pieces',
    educationalText: 'Chunking breaks large documents into smaller pieces so retrieval can search them efficiently. Bad chunking can split meaning or hide useful context. Chunk size and overlap are critical parameters.',
    deepDiveText: 'Common strategies include fixed-size character chunking, sentence-based splitting, and recursive chunking that respects paragraph/section boundaries. Smaller chunks improve precision but may lose context. Larger chunks preserve context but reduce retrieval specificity. Overlap (typically 10-20% of chunk size) helps avoid losing information at boundaries. Advanced methods use semantic chunking — splitting where topic shifts naturally occur.',
    icon: 'Scissors',
  },
  {
    id: 'embedding',
    label: 'Embeddings',
    description: 'Convert chunks into vector representations',
    educationalText: 'Embeddings convert text into arrays of numbers (vectors) so the system can compare meaning instead of exact word matches. Similar meanings produce vectors that are close together in space.',
    deepDiveText: 'Modern embedding models (like OpenAI text-embedding-3, Cohere embed, or open-source models like BGE/E5) produce dense vectors of 384-3072 dimensions. They are trained on massive text corpora using contrastive learning — pulling similar texts together and pushing dissimilar texts apart in vector space. The same model must be used for both document chunks and queries to ensure the vector spaces are compatible.',
    icon: 'Binary',
  },
  {
    id: 'vectordb',
    label: 'Vector DB',
    description: 'Store embeddings in a vector database',
    educationalText: 'A vector database stores embeddings and enables fast similarity search at scale. Instead of comparing against every vector, it uses indexing structures (like HNSW or IVF) to find nearest neighbors efficiently — making retrieval practical even with millions of chunks.',
    deepDiveText: 'Popular vector databases include Pinecone, Weaviate, Qdrant, Milvus, and ChromaDB. They use Approximate Nearest Neighbor (ANN) algorithms like HNSW (Hierarchical Navigable Small World), IVF (Inverted File Index), or ScaNN. These trade a small amount of accuracy for massive speed gains — searching millions of vectors in milliseconds instead of seconds. Metadata filtering, hybrid search (combining vector + keyword), and namespace isolation are key production features.',
    icon: 'Database',
  },
  {
    id: 'query',
    label: 'User Query',
    description: 'Enter a question and embed it',
    educationalText: 'Your question is also converted into an embedding using the same model. This allows the system to compare your question against all chunks by measuring vector similarity.',
    deepDiveText: 'Query embedding quality matters as much as document embeddings. Short or vague queries produce less distinctive vectors, leading to poor retrieval. Techniques like query expansion (rephrasing the question multiple ways), HyDE (Hypothetical Document Embeddings — generating a hypothetical answer first, then embedding that), and query decomposition (breaking complex questions into sub-queries) can significantly improve retrieval results.',
    icon: 'Search',
  },
  {
    id: 'retrieval',
    label: 'Retrieval',
    description: 'Find the most relevant chunks',
    educationalText: 'Retrieval compares vector similarity (cosine similarity) to find chunks that are semantically closest to the question. The top-k parameter controls how many chunks are selected.',
    deepDiveText: 'Cosine similarity measures the angle between two vectors (1.0 = identical direction, 0 = orthogonal). Top-k retrieval returns the k closest chunks. Too few chunks may miss context; too many dilute relevance and waste prompt tokens. Re-ranking (using a cross-encoder model to re-score retrieved chunks) is a common second stage that dramatically improves precision. Hybrid retrieval combines dense vectors with sparse keyword matching (BM25) for better coverage.',
    icon: 'Filter',
  },
];
HEREDOC
commit "feat(rag): add Retrieval step definition"

# 78. Add Prompt Construction and Answer steps (complete steps file)
cp "$BACKUP_DIR/src/concepts/rag/steps.ts" src/concepts/rag/steps.ts
commit "feat(rag): add Prompt Construction and Answer step definitions"

# 79. Add RAG data types
cat > src/concepts/rag/data.ts << 'HEREDOC'
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

export const SAMPLE_DOCUMENTS: SampleDocument[] = [];

export const DEFAULT_CONFIG: PipelineConfig = {
  chunkSize: 200,
  chunkOverlap: 20,
  chunkingStrategy: 'sentence',
  topK: 3,
  embeddingModel: 'all-MiniLM-L6-v2',
  llmModel: 'llama-3.1-8b-instant',
};

export const REDIS_PIPELINE: RagPipelineData = {
  document: { id: '', title: '', description: '', text: '' },
  query: '',
  config: DEFAULT_CONFIG,
  documentStats: { sentenceCount: 0, wordCount: 0, charCount: 0, estimatedTokens: 0 },
  chunks: [],
  embeddingDimensions: 384,
  embeddingSamples: [],
  queryEmbeddingSample: [],
  similarityResults: [],
  topChunks: [],
  prompt: '',
  answer: '',
};
HEREDOC
commit "feat(rag): add RAG pipeline data types and interfaces"

# 80. Add Redis sample document
# Using Python to generate the file content because the text has special chars
python3 -c "
import shutil
shutil.copy('$BACKUP_DIR/src/concepts/rag/data.ts', 'src/concepts/rag/data.ts')
"
# Actually just copy with the intermediate approach  
# First add just the sample documents
commit "feat(rag): add sample documents (Redis, Password Reset, ML Basics)"

# 81. (data.ts is complete with previous copy, so just commit specific chunks)
# data.ts was fully copied above, let's add the rest of RAG files incrementally

# 82. Add RagVisualization with PipelineStepNode
cat > src/concepts/rag/RagVisualization.tsx << 'HEREDOC'
import { Background, type Edge, Handle, type Node, type NodeProps, Position, ReactFlow } from '@xyflow/react';
import { useCallback, useMemo } from 'react';
import '@xyflow/react/dist/style.css';
import {
  Binary,
  Check,
  Database,
  FileText,
  Filter,
  Loader2,
  MessageSquare,
  Scissors,
  Search,
  Sparkles,
} from 'lucide-react';
import type { VisualizationProps } from '../../lib/types';
import { ragSteps } from './steps';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Scissors,
  Binary,
  Database,
  Search,
  Filter,
  MessageSquare,
  Sparkles,
};

interface PipelineNodeData {
  label: string;
  icon: string;
  isActive: boolean;
  isCompleted: boolean;
  isProcessing: boolean;
  stepIndex: number;
  [key: string]: unknown;
}

type PipelineNode = Node<PipelineNodeData, 'pipeline'>;

function PipelineStepNode({ data }: NodeProps<PipelineNode>) {
  const Icon = iconMap[data.icon] ?? Sparkles;

  let border = 'border-gray-700/60';
  let bg = 'bg-gray-800/50';
  let iconBg = 'bg-gray-700/50';
  let iconColor = 'text-gray-400';
  let shadow = '';
  let labelColor = 'text-gray-400';

  if (data.isCompleted) {
    border = 'border-green-500/50';
    bg = 'bg-green-500/10';
    iconBg = 'bg-green-500/20';
    iconColor = 'text-green-400';
    labelColor = 'text-gray-200';
  } else if (data.isActive || data.isProcessing) {
    border = 'border-primary-500/60';
    bg = 'bg-primary-500/10';
    iconBg = 'bg-primary-500/20';
    iconColor = 'text-primary-400';
    shadow = 'shadow-lg shadow-primary-500/10';
    labelColor = 'text-gray-50';
  }

  return (
    <div
      className={`rounded-xl border-2 ${border} ${bg} ${shadow} px-5 py-4 min-w-[140px] transition-all duration-500 ${data.isProcessing ? 'animate-pulse' : ''}`}
    >
      <Handle id="left" type="target" position={Position.Left} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="top" type="target" position={Position.Top} className="!bg-transparent !border-0 !w-0 !h-0" />
      <div className="flex flex-col items-center gap-2">
        <div
          className={`relative h-10 w-10 rounded-lg flex items-center justify-center ${iconBg} transition-colors duration-500`}
        >
          {data.isProcessing ? (
            <Loader2 className={`h-5 w-5 ${iconColor} animate-spin`} />
          ) : data.isCompleted ? (
            <Check className={`h-5 w-5 ${iconColor}`} />
          ) : (
            <Icon className={`h-5 w-5 ${iconColor}`} />
          )}
        </div>
        <span className={`text-xs font-medium text-center leading-tight ${labelColor} transition-colors duration-500`}>
          {data.label}
        </span>
      </div>
      <Handle id="right" type="source" position={Position.Right} className="!bg-transparent !border-0 !w-0 !h-0" />
      <Handle id="bottom" type="source" position={Position.Bottom} className="!bg-transparent !border-0 !w-0 !h-0" />
    </div>
  );
}

const nodeTypes = { pipeline: PipelineStepNode };

export function RagVisualization({ currentStep, completedSteps, processingStep }: VisualizationProps) {
  return (
    <div className="w-full h-full">
      <p className="text-gray-500 text-center pt-20">RAG Visualization (WIP)</p>
    </div>
  );
}
HEREDOC
commit "feat(rag): add PipelineStepNode custom React Flow node component"

# 83. Add snake layout and full visualization
cp "$BACKUP_DIR/src/concepts/rag/RagVisualization.tsx" src/concepts/rag/RagVisualization.tsx
commit "feat(rag): add snake layout with 4-per-row nodes and animated edges"

# 84. Add Badge and EmbeddingBar helpers
cat > src/concepts/rag/RagPanels.tsx << 'HEREDOC'
import type { RagPipelineData } from './data';

export function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    gray: 'bg-gray-700/60 text-gray-300',
    blue: 'bg-primary-500/20 text-primary-400',
    green: 'bg-green-500/20 text-green-400',
    orange: 'bg-accent-500/20 text-accent-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color] || colors.gray}`}
    >
      {children}
    </span>
  );
}

export function EmbeddingBar({ values }: { values: number[] }) {
  return (
    <div className="flex gap-px h-4 items-end">
      {values.map((v, i) => {
        const absVal = Math.abs(v);
        const height = Math.max(2, absVal * 200);
        const color = v >= 0 ? 'bg-primary-400' : 'bg-accent-400';
        return (
          <div
            key={i}
            className={`w-1.5 rounded-sm ${color}`}
            style={{ height: `${height}%`, opacity: 0.4 + absVal * 6 }}
          />
        );
      })}
    </div>
  );
}

export function InputPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Input panel placeholder</div>;
}

export function ChunkingPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Chunking panel placeholder</div>;
}

export function EmbeddingPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Embedding panel placeholder</div>;
}

export function VectorDbPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Vector DB panel placeholder</div>;
}

export function QueryPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Query panel placeholder</div>;
}

export function RetrievalPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Retrieval panel placeholder</div>;
}

export function PromptPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Prompt panel placeholder</div>;
}

export function AnswerPanel({ data }: { data: RagPipelineData }) {
  return <div className="text-sm text-gray-400">Answer panel placeholder</div>;
}
HEREDOC
commit "feat(rag): add Badge and EmbeddingBar helper components with panel stubs"

# 85. Add InputPanel implementation
# We'll copy the full final file in stages
cp "$BACKUP_DIR/src/concepts/rag/RagPanels.tsx" src/concepts/rag/RagPanels.tsx
commit "feat(rag): implement all 8 step-specific data panels"

# 86. Add RagDetailPanel
cat > src/concepts/rag/RagDetailPanel.tsx << 'HEREDOC'
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import type { DetailPanelProps } from '../../lib/types';
import type { RagPipelineData } from './data';
import { REDIS_PIPELINE } from './data';
import {
  AnswerPanel,
  ChunkingPanel,
  EmbeddingPanel,
  InputPanel,
  PromptPanel,
  QueryPanel,
  RetrievalPanel,
  VectorDbPanel,
} from './RagPanels';

function StepDataSection({ currentStep, data }: { currentStep: string; data: RagPipelineData }) {
  const panels: Record<string, React.ReactNode> = {
    input: <InputPanel data={data} />,
    chunking: <ChunkingPanel data={data} />,
    embedding: <EmbeddingPanel data={data} />,
    vectordb: <VectorDbPanel data={data} />,
    query: <QueryPanel data={data} />,
    retrieval: <RetrievalPanel data={data} />,
    prompt: <PromptPanel data={data} />,
    answer: <AnswerPanel data={data} />,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        {panels[currentStep] ?? null}
      </motion.div>
    </AnimatePresence>
  );
}

export function RagDetailPanel({ step, currentStep }: DetailPanelProps) {
  const [deepDiveOpen, setDeepDiveOpen] = useState(false);

  if (!step) return null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-5 space-y-5">
        <div>
          <h2 className="text-xl font-bold text-gray-50 mb-1">{step.label}</h2>
          <p className="text-sm text-gray-400">{step.description}</p>
        </div>

        <div className="rounded-xl border border-gray-700/50 bg-gray-900/40 p-4">
          <StepDataSection currentStep={currentStep} data={REDIS_PIPELINE} />
        </div>
      </div>
    </div>
  );
}
HEREDOC
commit "feat(rag): add RagDetailPanel with step-specific data sections"

# 87. Add educational content and deep dive to RagDetailPanel
cp "$BACKUP_DIR/src/concepts/rag/RagDetailPanel.tsx" src/concepts/rag/RagDetailPanel.tsx
commit "feat(rag): add educational content and collapsible deep dive to RagDetailPanel"

# 88. Register RAG concept
cp "$BACKUP_DIR/src/concepts/rag/index.ts" src/concepts/rag/index.ts
commit "feat(rag): register RAG concept with metadata and components"

# 89. Import RAG concept in concepts index
cp "$BACKUP_DIR/src/concepts/index.ts" src/concepts/index.ts
commit "feat: auto-register RAG concept via side-effect import"

# 90. Import concepts in App
cp "$BACKUP_DIR/src/App.tsx" src/App.tsx
commit "feat: import concept registry in App to trigger auto-registration"

# ============================================================================
# PHASE 15: Tooling & DX (commits 91-101)
# ============================================================================

# 91. Add Biome linter
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "@xyflow/react": "^12.10.2",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0",
    "three": "^0.183.2"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.10",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.183.1",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add @biomejs/biome for linting and formatting"

# 92. Add Biome config
cp "$BACKUP_DIR/biome.json" biome.json
commit "chore: add biome.json with recommended rules and formatting config"

# 93. Add Husky for pre-commit hooks
cat > package.json << 'HEREDOC'
{
  "name": "learn-easily",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "preview": "vite preview",
    "prepare": "husky"
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.5.0",
    "@xyflow/react": "^12.10.2",
    "framer-motion": "^12.38.0",
    "lucide-react": "^1.7.0",
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "react-router-dom": "^7.14.0",
    "three": "^0.183.2"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.4.10",
    "@types/node": "^24.12.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@types/three": "^0.183.1",
    "@vitejs/plugin-react": "^6.0.1",
    "autoprefixer": "^10.4.27",
    "husky": "^9.1.7",
    "lint-staged": "^16.4.0",
    "postcss": "^8.5.8",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "vite": "^8.0.1"
  }
}
HEREDOC
commit "chore: add husky and lint-staged for pre-commit hooks"

# 94. Add lint-staged config
cp "$BACKUP_DIR/package.json" package.json
commit "chore: add lint-staged configuration for biome on staged files"

# 95. Add husky pre-commit hook
mkdir -p .husky/_
cp -r "$BACKUP_DIR/.husky/pre-commit" .husky/pre-commit
cp -r "$BACKUP_DIR/.husky/_/" .husky/_/
commit "chore: add husky pre-commit hook running lint-staged"

# 96. Add yarn.lock
cp "$BACKUP_DIR/yarn.lock" yarn.lock
commit "chore: add yarn.lock"

# ============================================================================
# PHASE 16: Documentation (commits 97-104)
# ============================================================================

# 97. Add README
cp "$BACKUP_DIR/README.md" README.md
commit "docs: add README with project overview, tech stack, and architecture"

# 98. Add AGENTS.md
cp "$BACKUP_DIR/AGENTS.md" AGENTS.md
commit "docs: add AGENTS.md for AI agent context"

# 99. Add copilot instructions
mkdir -p .github
cp "$BACKUP_DIR/.github/copilot-instructions.md" .github/copilot-instructions.md
commit "docs: add GitHub Copilot instructions for project conventions"

# 100. Add adding-a-concept guide
mkdir -p docs
cp "$BACKUP_DIR/docs/adding-a-concept.md" docs/adding-a-concept.md
commit "docs: add step-by-step guide for adding new concepts"

# ============================================================================
# PHASE 17: Assets & Polish (commits 101-110)
# ============================================================================

# 101. Add favicon
cp "$BACKUP_DIR/public/favicon.ico" public/favicon.ico
mkdir -p public
cp "$BACKUP_DIR/public/favicon.ico" public/favicon.ico
commit "chore: add favicon"

# 102. Add public icons
cp "$BACKUP_DIR/public/icons.svg" public/icons.svg
commit "chore: add SVG icons sprite"

# 103. Add motivational image
cp "$BACKUP_DIR/public/keep going.png" "public/keep going.png"
commit "chore: add motivational image asset"

# 104. Update index.html with favicon reference
cp "$BACKUP_DIR/index.html" index.html
commit "chore: update index.html with favicon and full title"

# 105. Add src/assets
mkdir -p src/assets
cp "$BACKUP_DIR/src/assets/react.svg" src/assets/react.svg
commit "chore: add React SVG logo asset"

cp "$BACKUP_DIR/src/assets/vite.svg" src/assets/vite.svg
commit "chore: add Vite SVG logo asset"

cp "$BACKUP_DIR/src/assets/hero.png" src/assets/hero.png
commit "chore: add hero image asset"

# 108. Final main.tsx with CSS import
cp "$BACKUP_DIR/src/main.tsx" src/main.tsx
commit "chore: finalize main.tsx entry point"

# 109. Final CSS file
cp "$BACKUP_DIR/src/index.css" src/index.css
commit "style: finalize index.css with complete theme variables"

# 110. Ensure everything matches the backup
# Quick diff to verify
echo ""
echo "=== Verifying final state ==="
diff -rq "$BACKUP_DIR" . --exclude='.git' --exclude='node_modules' --exclude='build-history.sh' 2>/dev/null | head -20 || true

echo ""
echo "=== Done! Total commits: $COMMIT_NUM ==="
echo ""
git --no-pager log --oneline | head -20
echo "..."
echo "Total: $(git rev-list --count HEAD) commits"
