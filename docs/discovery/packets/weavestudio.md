# WeaveStudio — External Discovery Packet

Prepared: 2026-08-16
Primary surface: Product Hunt

## Canonical assets

- Live product: https://weavestudio-nine.vercel.app/
- Source/review repository: https://github.com/atomicdjt/weavestudio
- Acquisition overview: https://weavestudio-nine.vercel.app/acquire
- Portfolio: https://ai-project-portfolio-portfolio-hub.vercel.app/

## Product Hunt fields

**Product name:** WeaveStudio

**Tagline:** Local-first workflow canvas for structured, reviewable deliverables

**Short description (≤260 characters):**

Turn messy notes, transcripts, research, and client inputs into a visible workflow, validate the structure, generate an editable deliverable, and export Markdown, PDF, or portable Project JSON—all from a browser-local workspace.

**Suggested topics/categories:**

- Productivity
- Developer Tools / No-Code or Workflow Tools, if currently available and accurate in Product Hunt's taxonomy
- Artificial Intelligence only as a secondary topic because AI Assist is optional rather than the core product

Use the current Product Hunt topic picker rather than inventing unavailable categories.

## Maker comment

I built WeaveStudio because I kept running into the same operational problem: useful source material starts as fragments—notes, transcripts, logs, research snippets—and the hard part is not generating more text; it is making the path from source → structure → reviewed deliverable visible.

WeaveStudio is a local-first visual workflow canvas. You can paste source material, organize it into connected nodes, validate the workflow, create an editable deliverable, and export Markdown, PDF, or re-importable Project JSON. Named workspaces, snapshots, undo/redo, backups, and restore are browser-local.

AI is deliberately optional. OpenAI/Gemini assistance is BYOK, disabled until a user explicitly confirms a request, and generated output is not applied without human review. The normal workflow requires no backend, account, cloud database, or API.

I would especially like feedback on two things: whether the canvas genuinely improves the transition from messy input to a finished deliverable, and where the local-first storage model creates too much friction compared with cloud collaboration tools.

Known limitations are public: localStorage is not encrypted or durable cloud storage, the validator checks workflow structure rather than factual correctness, and dense graph editing is still better on desktop.

## Gallery plan

Use existing real product screenshots rather than mockups:

1. `docs/screenshots/weavestudio-home.png` — landing/start experience.
2. `docs/screenshots/weavestudio-workspace.png` — guided workflow canvas.
3. `docs/screenshots/weavestudio-templates.png` — template gallery.
4. `docs/screenshots/weavestudio-deliverable.png` — deliverable/export flow.

Before upload, resize/crop copies to Product Hunt's current recommended gallery dimensions without altering the product UI or fabricating usage.

## Facts safe to use

- Local-first browser application with no required account/backend/cloud database.
- Visual workflow canvas using `@xyflow/react`.
- Five primary templates plus additional starters.
- Named local workspaces, autosave, snapshots, undo/redo, validation, backup/restore.
- Markdown, PDF, and Project JSON export.
- Optional consent-gated OpenAI/Gemini BYOK assistance with human review.
- Public demo and public evaluation source repository.
- Current release is v1.0.0 and acquisition-ready in its repository documentation.

## Do not claim

- Customers, revenue, active users, completed acquisition, or market validation.
- End-to-end encryption, cloud durability, compliance certification, or multi-user collaboration.
- That optional AI assistance is required for core functionality.

## Launch checklist

- Use David's personal Product Hunt account; company accounts cannot post.
- Verify account posting eligibility/current onboarding rules immediately before scheduling.
- Use the direct canonical product URL, not a blog or portfolio intermediary.
- Confirm the product is live and immediately usable.
- Upload real product imagery and include David as maker.
- Do not purchase promoted placement as part of this program.
- Do not mass-message for votes, offer incentives, or coordinate upvotes.
- Respond substantively to real comments/questions.
- Add the public launch URL to the discovery ledger only after it is actually live.