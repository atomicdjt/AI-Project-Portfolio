# Authorship, AI Assistance, and Verification

This portfolio was developed through a human-directed, AI-assisted engineering workflow. This document explains what that means, what evidence the repositories provide, and what should not be inferred.

## Working model

David Turner owns the product direction and is responsible for:

- selecting the problems and intended users;
- defining requirements, constraints, non-goals, and responsible-use boundaries;
- choosing which concepts and generated suggestions to accept, reject, revise, or test;
- directing architecture, product behavior, source authority, release packaging, and deployment structure;
- reviewing outputs for internal consistency, unsupported claims, privacy risk, and usability;
- preserving repository history and separating canonical source from generated packages and deployments;
- requiring tests, builds, verification records, and explicit limitations before presenting work publicly.

AI systems have been used as implementation, research, drafting, review, and debugging collaborators. The amount and type of AI assistance varies by project. No repository should be interpreted as a claim that every line was typed manually or produced without automated assistance.

## What the portfolio demonstrates

The public evidence is intended to demonstrate the ability to:

- convert ambiguous operational or research problems into structured software requirements;
- supervise complex AI-assisted implementation across multiple iterations;
- evaluate proposed plans and generated code rather than accepting them uncritically;
- identify source-of-truth, release, deployment, and documentation problems;
- establish deterministic behavior, human-review stages, privacy boundaries, and claim-safe product language;
- design quality gates using tests, type checking, linting, builds, browser checks, packaging checks, and documentation validation;
- communicate architecture, limitations, verification status, and handoff requirements to technical and nontechnical reviewers;
- maintain a coherent portfolio and delivery system across separate repositories and deployments.

## What it does not prove by itself

Repository and deployment evidence does not independently prove:

- traditional senior-engineering tenure;
- that every implementation choice was made without AI assistance;
- production operation at enterprise scale;
- independent security certification;
- clinical, legal, financial, scientific, or engineering validity beyond the stated project scope;
- verified customers, revenue, active users, conversion improvement, or completed acquisitions;
- that a successful build or deployment verifies every browser interaction.

Those boundaries are deliberate. Claims should remain no stronger than the available evidence.

## Project contribution and evidence matrix

| Project | Human-directed contribution | AI-assisted work | Strongest verification evidence | Important boundary |
| --- | --- | --- | --- | --- |
| BuildWorld AI | Problem framing, graph-simulation product direction, deterministic/reproducible requirements, scenario and report structure, responsible-use limits, release review | Implementation generation, refactoring, test and documentation assistance, debugging support | Type checking, linting, unit tests, production build, CI, deterministic seeds/fingerprints, architecture and methodology docs | Exploratory simulation heuristics, not certified prediction or professional advice |
| ProcessHarbor | Operations-documentation workflow, artifact taxonomy, deterministic-first public demo, version/validation/export requirements, backend-extension boundaries | UI and implementation assistance, content structuring, test and documentation support | Runnable static workflow, tests/build, crawler-readable scope disclosure, case study and contracts | Static public deployment does not represent active provider-backed services |
| WeaveStudio | Product direction, local-first workflow model, review-before-apply AI behavior, acquisition packaging, transfer and source-authority decisions | Canvas implementation assistance, provider integration support, browser-test and documentation generation | Unit tests, lint, type checking, build, Playwright checks, buyer verification, acquisition packaging | Packaging readiness does not establish market demand or acquisition value |
| RedactReady Pro | Privacy-first workflow, evidence review and redaction requirements, human confirmation, responsible-use and report boundaries | Detection/UI implementation assistance, testing and documentation support | Local-first architecture, tests/build, evidence mapping, report and case-study documentation | Not independently security-certified and not a substitute for professional review |
| QuoteForge Local | Buyer definition, commercial scope, template and lead workflow, license boundaries, packaging, canonical purchase path, source/deployment governance | Next.js implementation assistance, copy and documentation drafting, QA and release automation support | Unit tests, Playwright tests, link checks, build, packaging and validation scripts, live canonical demo | No verified sales, customers, client deployments, or conversion claims |

## How reviewers can assess understanding

A reviewer should not rely only on application polish. Useful review questions include:

1. Why was the project designed as local-first or deterministic-first?
2. Which alternatives were rejected, and why?
3. What failure modes or misleading claims were discovered during review?
4. Which behaviors are covered by tests, and which still require manual verification?
5. Where is the authoritative source, and how is it connected to the public deployment?
6. What data leaves the browser, if any?
7. What would need to change for genuine production use?
8. Which technical decisions can be explained and modified without relying on generated prose?

The repository documentation, code, commit history, validation commands, and live behavior should be used together.

## Verification vocabulary

Use these terms precisely:

- **Implemented** — source changes exist.
- **Build-verified** — a production build completed successfully.
- **Tested** — named automated tests completed successfully.
- **Browser-verified** — the stated browser workflow was exercised.
- **Deployed** — a hosting provider produced a reachable deployment.
- **Production-verified** — behavior was verified in the intended production configuration.
- **Documentation-first** — the case study or specification is the principal maintained artifact.
- **Legacy preserved** — a deployment or artifact remains available without complete current source authority.
- **Unverified** — evidence has not been collected or is no longer current.

## Updating this record

Material changes to project authority, deployment status, verification, or traction should update:

- `config/portfolio-authority.json`;
- `docs/PROJECT_INDEX.md`;
- `docs/project-ranking.md` when review priority changes;
- the relevant project README or case study;
- this document when contribution or evidence boundaries materially change.

CI validates core authority and public-status consistency, but human review remains required for nuanced claims.