# Case Study: RedactReady Pro / Human Risk Intelligence OS

## Problem

People often need to share document packets that contain mixed sensitive data, weak context, missing supporting evidence, or unclear administrative references. Existing tools tend to focus on either storage, generic summarization, or manual redaction. RedactReady Pro treats this as a privacy and readiness workflow.

## Constraints

- Sensitive text must remain in the browser for the public MVP.
- Detection must be deterministic and inspectable, with no claim of exhaustive coverage.
- Redaction coordinates must be validated so stale, invalid, or overlapping findings cannot corrupt the exported text.
- Scores and classifications must remain decision-support signals, not official determinations.

## David's Role

David Turner owned the product framing, privacy workflow, acceptance criteria, scoring and reporting requirements, implementation direction, AI-assisted development, testing expectations, documentation, and release decisions. AI tools assisted implementation under David's direction and review.

## Solution

RedactReady Pro gives users a local-first workbench for document packet review:

- intake text and sample packets;
- detect sensitive information with deterministic rules;
- classify likely document types;
- calculate a Human Risk Intelligence Score;
- map evidence, missing context, and possible contradictions;
- generate prioritized action items;
- redact selected entities;
- export a professional report.

## Product Architecture

The app is a static React/Vite MVP. Core logic is separated into pure TypeScript modules:

- `src/modules/detection`
- `src/modules/classification`
- `src/modules/scoring`
- `src/modules/evidence`
- `src/modules/checklist`
- `src/modules/redaction`
- `src/modules/reports`
- `src/modules/analysis`

The pipeline is:

```text
input document -> normalize/classify -> detect sensitive entities -> score HRI categories -> build evidence map -> generate checklist -> build report -> redact output
```

## Human Risk Intelligence Score

The HRI Score is an original readiness model for privacy and packet quality. It evaluates:

- Privacy Exposure
- Administrative Risk
- Identity Risk
- Context Risk
- Sharing Readiness
- Evidence Strength

The score is explicitly framed as organization, privacy, and sharing readiness. It is not a legal, medical, benefits, financial, or official decision score.

## Privacy-First Design

The MVP runs analysis in the browser and does not require a backend or external AI provider. Document state is held in memory for the active session. This keeps the product suitable for public demo deployment without handling real sensitive documents server-side.

## What Makes It Novel

RedactReady Pro combines redaction, risk scoring, evidence mapping, action planning, and report export into one coherent local workflow. The product is not a thin AI wrapper: it uses deterministic, inspectable logic and clear safety boundaries.

## Important Decisions

- Pure TypeScript modules keep detection, classification, scoring, evidence mapping, checklists, redaction, and reports independently testable.
- Browser-only analysis avoids network leakage in the public demonstration.
- Redaction applies only enabled, in-bounds findings whose match still corresponds to the source text, and overlapping ranges are applied once.
- The HRI score is decomposed into named categories and paired with explanations and actions.

## Verification

Vitest protects detection, selective redaction, overlap and range boundaries, classification, HRI scoring, evidence mapping, checklists, and report generation. Monorepo lint, typecheck, and production builds provide additional local verification. These checks do not establish regulatory compliance or prove every sensitive value will be found.

## Responsible Boundaries

RedactReady Pro is not legal advice, a compliance certification, a medical or benefits decision system, or a substitute for trained human review. Rule-based detection can miss context or produce false positives; users must inspect the original and redacted output before sharing.

## Professional Relevance

The project demonstrates privacy-aware workflow design, deterministic text analysis, defensive boundary handling, explainable scoring, human review controls, and the ability to translate a high-risk ambiguous task into a bounded, testable system.

## Future Expansion

The highest-value next steps are OCR, robust PDF text extraction, encrypted local storage, richer evidence graphs, optional provider-based summarization, and collaboration/export workflows.
