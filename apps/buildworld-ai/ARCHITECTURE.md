# BuildWorld AI Architecture

## Frontend

The app is a Vite React TypeScript SPA. `src/App.tsx` composes the main experience: navigation, landing, Simulation Studio, Scenario Library, Dashboard, Cascade Analyzer, Optimization Lab, Reports, Methodology, canvas, inspector, and persistence controls.

## State Model

The app keeps the active `ScenarioTemplate`, `SimulationState`, selection, snapshots, cascade result, and UI state in React state. The state is intentionally local-first and easy to serialize.

## Core Types

Centralized types live in `src/types/simulation.ts`, including:

- `SimulationProject`
- `ScenarioTemplate`
- `SystemType`
- `SimulationNode`
- `SimulationEdge`
- `SimulationState`
- `SimulationMetrics`
- `SSIResult`
- `BottleneckFinding`
- `CascadeFinding`
- `OptimizationSuggestion`
- `ScenarioSnapshot`
- `ScenarioComparison`
- `ReportData`
- `ProjectExport`

## Simulation Modules

- `simulationRunner.ts`: deterministic tick runner and history generation.
- `cascadeEngine.ts`: stress experiments and before/after analysis.
- `ssi.ts`: SSI component scoring.
- `optimizer.ts`: ranked intervention suggestions.
- `insightGenerator.ts`: deterministic AI-style explanations.
- `reportBuilder.ts`: Markdown/JSON report builder.
- `projectStorage.ts`: local save/load and import/export validation.
- `templates.ts`: eight built-in demo scenarios.

## API Route Plan

The MVP is static for deployment safety. If upgraded to Next.js or a server-backed app, the current module boundaries map cleanly to:

- `GET /api/scenarios`
- `GET /api/scenarios/[id]`
- `POST /api/reports/generate`
- `POST /api/simulations/validate`
- `POST /api/projects/export`

## Persistence

Browser localStorage stores project JSON. Users can also export/import `.json` files. No sensitive data or API key is required.

## Performance

The current engine is designed for educational graphs around dozens of nodes and hundreds of ticks. History is bounded to 240 ticks. Future large-graph support should move tick execution to a Web Worker and virtualize canvas rendering.

## Testing

Vitest covers pure simulation behavior, SSI scoring, cascade analysis, optimizer output, report generation, and export/import validation.
