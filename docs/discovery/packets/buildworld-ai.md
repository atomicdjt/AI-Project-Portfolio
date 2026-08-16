# BuildWorld AI — External Discovery Packet

Prepared: 2026-08-16
Primary surface: Hacker News Show HN

## Canonical assets

- Live demo: https://buildworld-ai-v01-improvements.vercel.app/
- Source: https://github.com/atomicdjt/buildworld-ai
- Portfolio: https://ai-project-portfolio-portfolio-hub.vercel.app/
- Case study: https://github.com/atomicdjt/buildworld-ai/blob/main/CASE_STUDY.md
- Architecture: https://github.com/atomicdjt/buildworld-ai/blob/main/ARCHITECTURE.md
- Methodology: https://github.com/atomicdjt/buildworld-ai/blob/main/METHODOLOGY.md

## Recommended Show HN title

**Show HN: BuildWorld AI – local-first deterministic systems simulation**

Alternative if title length/context needs tightening:

**Show HN: BuildWorld AI – a browser lab for graph-system simulations**

## Submission text / first comment

I built BuildWorld AI as a browser-based lab for reasoning about complex systems without requiring an AI API or a backend.

The core is deterministic: you model a system as a graph, change nodes/edges and assumptions, run scenarios, and compare bottlenecks, cascades, resilience, throughput, and recovery behavior. It includes eight example systems (traffic, supply chain, power grid, ecosystem, warehouse, epidemic/population, emergency shelter, and a blank network), plus reproducible reports that record the model version, seed, input fingerprint, and multi-seed ranges.

One part I am especially interested in having challenged is the **System Stability Index (SSI)**. It is an original 0–100 heuristic that combines several model-derived dimensions. I do **not** treat it as a certified prediction or professional decision score; the app labels it as exploratory and keeps the underlying assumptions visible.

The project is React/TypeScript/Vite, runs locally in the browser, and the public demo is usable without an account. Source, methodology, testing notes, and limitations are public as well.

I would value criticism more than launch praise. In particular:

1. Where does the simulation model feel genuinely useful versus misleading?
2. What evidence or controls would you need before trusting one of its reports for real planning work?
3. Which system type exposes the weakest assumptions in the current model?

Demo: https://buildworld-ai-v01-improvements.vercel.app/

Source: https://github.com/atomicdjt/buildworld-ai

## Facts safe to use

- Browser-local application; no required paid AI API.
- Deterministic simulation engines and explicit seed/input fingerprints.
- Eight built-in example scenarios.
- Graph editing, cascade/bottleneck analysis, comparisons, reports, and export.
- Original SSI heuristic is explicitly labeled exploratory.
- React, TypeScript, Vite, custom SVG/CSS visualization, Vitest.
- Public source and public runnable demo.

## Do not claim

- Scientifically validated forecasting.
- Certified engineering/public-health/infrastructure decision support.
- Production adoption, users, customers, revenue, or external validation unless later documented.
- That SSI represents a standardized or peer-reviewed metric.

## Submission checklist

- Confirm the demo is reachable and does not require signup.
- Confirm repository links and screenshots still resolve.
- Read the current Show HN guidelines immediately before submission.
- Submit from David's own HN account; do not create an account automatically.
- Do not ask friends, communities, or contacts for upvotes/comments.
- Be available to answer technical questions after posting.
- Record the actual public HN URL in `docs/discovery/discovery-ledger.md` only after publication.