# ScamShield AI Design

## Product Goal

ScamShield AI is a local-first, defensive consumer-protection web app that helps vulnerable users identify possible scam indicators, preserve evidence, build a chronological case record, choose safer next steps, and export a professional evidence packet. It does not make final fraud determinations or provide legal, financial, investigative, or law-enforcement advice.

## Product Boundaries

- Analyze only user-entered text, file metadata/previews, and URL text. Never crawl or open suspicious links.
- Keep case data in browser memory and localStorage. No backend, database, account, API key, or telemetry is required.
- Warn users not to submit passwords, authentication codes, Social Security numbers, private keys, or full financial account numbers.
- Use conditional, non-accusatory language and recommend verification through official channels.
- Support caregivers without encouraging blame, confrontation, tracing, baiting, or retaliation.

## Architecture

The app is an isolated Vite, React, and TypeScript static site in `scamshield-ai`. A typed case model is coordinated by a small Zustand store. Pure domain modules own deterministic scam-pattern matching, URL heuristics, entity extraction, transparent scoring, checklist generation, timeline suggestions, local persistence, and PDF report composition. React components own the five-step user workflow and consume those modules through explicit typed interfaces.

The primary workflow is:

1. Start or load a fake demo case.
2. Enter case context and evidence.
3. Run local deterministic analysis and review risk signals.
4. Edit the evidence timeline and safe-action checklist.
5. Review official reporting guidance and export the evidence packet.

## Visual System

The interface uses a calm civic-tech direction derived from the approved visual concept: warm off-white canvas, deep navy text and navigation, indigo-blue primary actions, muted teal trust cues, restrained amber warnings, and red only for critical status. Large type, generous spacing, visible labels, 44px minimum controls, high-contrast focus rings, and clear section cards make the app senior-friendly. The primary screen uses a progress stepper and responsive two-column workspace that collapses to one column on mobile.

## Core Modules

- `case`: case identity, role, suspected scam type, urgency, contact channel, caregiver fields, evidence, notes, and attachments.
- `analysis`: pattern definitions, URL heuristics, red-flag findings, score, label, summary, found/not-found categories, and extracted entities.
- `timeline`: suggested and user-authored events with editable dates, descriptions, amounts, contacts, and references.
- `checklist`: urgency- and evidence-aware safety actions with printable state.
- `reporting`: maintained configuration of official public reporting resources and safe verification guidance.
- `export`: deterministic PDF packet and print-friendly checklist.
- `privacy`: localStorage disclosure, sensitive-data warnings, demo mode, and one-action case-data clearing.

## Error Handling

Validation is inline and plain-language. Analysis requires meaningful evidence text or metadata. Unsupported or oversized files remain local and produce actionable messages. Storage and PDF errors are surfaced without losing the active in-memory case. URL parsing failures become a finding or input hint, never a network request. Empty and malformed cases cannot produce misleading reports.

## Testing

- Unit tests cover pattern detection, URL analysis, scoring caps and labels, entity extraction, sensitive-data warnings, timeline suggestions, checklist branching, demo fixtures, and persistence serialization.
- Component tests cover case creation, demo loading, analysis, plain-language mode, caregiver fields, timeline editing, privacy clearing, and export warnings.
- Playwright verifies the main desktop workflow and a mobile viewport.
- Completion requires clean lint, typecheck, unit tests, production build, security review, and browser smoke verification.

## Deployment

The production output is `dist/`. `netlify.toml` uses `npm run build`, publishes `dist`, applies SPA fallback routing, and adds defensive response headers. No environment variables are required.

## Approved Scope Decisions

- Image uploads include safe local preview, filename/type/size capture, and manual extracted-text entry. OCR is an optional future enhancement rather than a required runtime dependency.
- PDF uploads are accepted as evidence metadata but are not parsed or rendered in the MVP.
- The application is a single-page workflow with persistent local state, not a multi-user case-management system.
- Official reporting destinations are maintained in a typed configuration file and displayed with copyable official addresses plus instructions to type or independently search them.
