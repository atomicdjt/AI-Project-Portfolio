# Testing

## Commands

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Current Coverage

`src/tests/simulationCore.test.ts` verifies:

- Deterministic flow simulation tick.
- Bottleneck detection.
- SSI scoring components and severity bands.
- Cascade experiment before/after behavior.
- Ranked optimization suggestions.
- Report generation and deterministic insights.
- Project export/import validation.

## Manual QA Checklist

- Load the landing page.
- Open Simulation Studio.
- Change scenarios from the left rail.
- Run, pause, step, and reset the simulation.
- Drag at least one node.
- Edit node capacity or demand in the inspector.
- Save two snapshots and compare in Reports.
- Run a cascade test.
- Preview, copy, and download the Markdown report.
- Export project JSON, clear local save, import the JSON, and verify the graph returns.
- Check mobile layout around 390px width.

## Known Test Gaps

- No Playwright smoke test yet.
- No visual-regression test yet.
- No large-graph performance benchmark yet.
- LocalStorage is covered through pure import/export functions, not browser automation.
