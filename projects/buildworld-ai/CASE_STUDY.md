# BuildWorld AI — Case Study

- **Canonical Vercel demo:** [buildworld-ai-v01-improvements.vercel.app](https://buildworld-ai-v01-improvements.vercel.app/)
- **Authoritative source:** [atomicdjt/buildworld-ai](https://github.com/atomicdjt/buildworld-ai)
- **Portfolio review copy:** `apps/buildworld-ai`

## Problem

Complex systems are difficult to reason about because local changes can create nonlinear downstream effects. Students, educators, product strategists, and technical reviewers often need an approachable way to inspect bottlenecks, redundancy, cascading failures, and resilience tradeoffs without specialized simulation software.

## Solution

BuildWorld AI turns systems into editable node-edge graphs. Users can load scenarios, change node or edge assumptions, run deterministic simulations, save before/after variants, inspect cascade risk, compare outcomes, and export structured reports.

## Why Systems Simulation Matters

The product makes invisible structure visible: constrained nodes, overloaded edges, low-redundancy paths, fragile recovery zones, and high-dependency clusters. It is intentionally framed as exploratory education, not a certified professional model.

## Product Architecture

- React application shell with scenario navigation, graph canvas, inspector, dashboard, analyzer, optimizer, and reports
- Centralized TypeScript models for scenarios, nodes, edges, metrics, events, SSI results, variants, comparisons, and exports
- Pure deterministic simulation modules for testability
- Browser-local persistence and project import/export
- Reproducible reports with model version, seed, input fingerprint, and multi-seed ranges in the authoritative standalone product
- Vercel deployment connected to the standalone repository

## Simulation Engines

The product includes:

- Flow-network simulation for traffic, supply chains, warehouses, factories, power grids, and resilience networks
- Ecosystem simulation for stock/resource balance, growth, decay, invasive pressure, and collapse risk
- Epidemic/population simulation for educational susceptible/infected/recovered dynamics, contact pressure, mitigation, and healthcare load
- Cascade experiments for node removal, demand spikes, resource shortages, edge-capacity reductions, and recovery investment

## SSI Scoring Model

The System Stability Index is an original educational score across:

1. Throughput Efficiency
2. Bottleneck Risk
3. Resilience
4. Redundancy
5. Cascade Resistance
6. Resource Balance
7. Recovery Capacity
8. Optimization Potential

Each component includes a severity band, explanation, contributing factors, and suggested improvements.

## Technical Implementation

The implementation emphasizes typed contracts, deterministic seeded simulation, bounded history, generated insight summaries, local project portability, multi-run comparison, and tests for core behavior.

## UI/UX Strategy

The interface is dashboard-oriented: scenario/tools navigation, central canvas, inspector, metric cards, charts, experiment controls, and report generation. The goal is a recruiter-visible product with real workflows rather than a static concept.

![BuildWorld AI simulation studio](../../docs/images/buildworld-ai-studio.png)

![BuildWorld AI report builder](../../docs/images/buildworld-ai-report.png)

## Deployment and Source Authority

The standalone repository and its `main` branch are authoritative. The verified Vercel project is `buildworld-ai-v01-improvements`. The monorepo workspace remains review evidence and should not be deployed as a competing product source.

## Novelty

BuildWorld combines graph editing, simulation, cascade stress testing, SSI scoring, optimization suggestions, variants, reproducible reporting, and portfolio-grade presentation in a browser-first product that requires no paid AI API.

## Responsible Scope

BuildWorld is not a certified engineering, public-health, infrastructure, ecological, financial, or safety-critical model. Results depend on user assumptions and deterministic heuristics.

## Future Roadmap

- Web Worker execution
- Larger-graph editing and virtualization
- Richer scenario branching and comparison
- Shareable project packages
- Expanded calibration and sensitivity tools
- Optional AI interpretation behind an explicit provider boundary