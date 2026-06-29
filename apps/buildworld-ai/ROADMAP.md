# Roadmap

## Near Term

- Add Playwright smoke tests for studio, scenario loading, cascade analyzer, reports, and import/export.
- Add Web Worker execution for larger simulations.
- Add richer graph editing: manual edge creation, multi-select, delete, duplicate, and keyboard shortcuts.
- Add screenshot capture for portfolio documentation.
- Add scenario-specific inspector fields for population and ecosystem parameters.

## Product Depth

- Scenario branching with named baseline, failure, optimized, and custom variants.
- More detailed cost/difficulty modeling for interventions.
- Better graph layout and minimap.
- Larger chart suite with risk heatmap and node utilization distribution.
- Shareable project files and signed public demos.

## Optional AI Layer

- Add a provider abstraction for OpenAI or other model providers only when a user configures a key.
- Keep deterministic local insights as the required fallback.
- Never require an API key for demo scenarios, simulations, reports, or core workflows.

## Portfolio Launch

- Capture screenshots.
- Integrate into the AI Project Portfolio under `apps/buildworld-ai`.
- Add a case study under `projects/buildworld-ai`.
- Deploy to Netlify or Vercel and verify the live URL.
