# BuildWorld AI

BuildWorld AI is a visual systems-simulation lab for designing, running, comparing, and reporting graph-based models of complex systems. It focuses on bottlenecks, cascading failures, resilience, optimization, and emergent behavior while staying clear that the results are educational and exploratory.

Live demo: https://buildworld-ai.netlify.app/

## Features

- Interactive Simulation Studio with draggable graph nodes, editable properties, run/pause/reset controls, speed control, and live metrics.
- Eight built-in demo scenarios: traffic, supply chain, power grid, ecosystem, warehouse, epidemic/population, emergency resilience, and a blank custom network.
- Deterministic simulation engines for flow networks, ecosystem dynamics, epidemic/population models, and cascade stress experiments.
- SSI System Stability Index: an original 0-100 score across throughput, bottleneck risk, resilience, redundancy, cascade resistance, resource balance, recovery, and optimization potential.
- Dashboard charts, event logs, critical-node analysis, optimization suggestions, snapshot comparison, Markdown/JSON report export, local save/load, project import/export, and print-to-PDF support.
- No paid AI API required. The insight layer is deterministic and local.

## Tech Stack

- Vite
- React
- TypeScript
- Custom SVG/CSS visualizations
- Browser localStorage persistence
- Vitest for pure simulation logic tests
- Netlify/Vercel-ready static deployment

## Local Setup

```bash
npm install
npm run dev
```

Open the local Vite URL: `http://127.0.0.1:5183/`.

## Commands

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

## Demo Scenarios

- Small City Traffic Bottleneck
- Regional Supply Chain Disruption
- Neighborhood Power Grid Failure
- Forest Ecosystem Balance
- Warehouse Throughput Optimization
- Disease Spread in Connected Communities
- Emergency Shelter Resource Network
- Custom Blank Network

## Limitations

BuildWorld AI is not a certified engineering model, public-health tool, infrastructure-design recommendation system, ecological forecast, financial tool, or safety-critical decision system. It is intended for education, portfolio review, scenario reasoning, and product exploration.

## Deployment

Netlify:

```bash
npm run build
netlify deploy --prod --dir dist
```

Production demo: https://buildworld-ai.netlify.app/

Vercel:

```bash
npm run build
vercel --prod
```

No environment variables are required for the MVP.

## Portfolio Notes

Suggested screenshots after browser QA:

- `../../docs/images/buildworld-ai-landing.png`
- `../../docs/images/buildworld-ai-studio.png`
- `../../docs/images/buildworld-ai-report.png`
- `../../docs/images/buildworld-ai-mobile.png`

See [CASE_STUDY.md](./CASE_STUDY.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [METHODOLOGY.md](./METHODOLOGY.md), [DEPLOYMENT.md](./DEPLOYMENT.md), [TESTING.md](./TESTING.md), and [ROADMAP.md](./ROADMAP.md).
