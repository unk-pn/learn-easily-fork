# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- GitHub issue templates and community health files
- `CONTRIBUTING.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`

---

## [0.3.0] - 2026-04-05

### Added
- BFS (Breadth-First Search) concept with step-by-step React Flow visualization
- DFS (Depth-First Search) concept with step-by-step React Flow visualization

---

## [0.2.0] - 2026-03-01

### Added
- Dual theme system: **Midnight** (dark) and **Daylight** (light)
- Theme toggle in `HomePage` and `ConceptViewer`
- Theme persistence via `localStorage`
- CSS custom property color system with semantic color inversion between themes

### Changed
- Migrated color system from hardcoded Tailwind values to CSS custom properties via `varColor()` / `colorScale()` helpers in `tailwind.config.js`

---

## [0.1.0] - 2026-01-15

### Added
- Initial release of Learn Easily
- Concept catalog with category tabs and search
- **RAG** (Retrieval-Augmented Generation) concept — 8-step React Flow pipeline with custom `DetailPanel` and step-specific data panels
- Step-by-step navigation with `useConcept` hook (play/pause, prev/next, reset, jump-to)
- `ConceptViewer` — 3-column layout: step nav + visualization + detail panel
- `ControlBar` — playback controls
- `StepDetailPanel` — educational content with collapsible deep-dive
- Modular concept registry (`registerConcept`, `getConcept`, `getAllConcepts`)
- Vite + React + TypeScript + Tailwind CSS 3 setup
- Biome for linting and formatting
- Husky + lint-staged pre-commit hooks
