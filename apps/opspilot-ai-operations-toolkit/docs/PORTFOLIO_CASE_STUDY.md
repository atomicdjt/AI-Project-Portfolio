# OpsPilot Pro Portfolio Case Study

## Summary

OpsPilot Pro is a polished operations documentation system for small businesses. It focuses on a monetizable business pain: converting messy internal information into repeatable SOPs, onboarding checklists, help articles, gap reports, audit events, export bundles, and versioned documentation.

Live demo: https://opspilot-ai-operations-toolkit.netlify.app/

## Target Users

- Small business owners who need repeatable workflows.
- Operations managers responsible for documentation quality.
- Clinics, service businesses, contractors, and support teams with recurring staff training.
- Compliance-sensitive teams that need visible change history and exportable records.

## Product Decisions

- Built the working dashboard as the first screen instead of a landing page.
- Preserved a deterministic local-first demo mode so reviewers can use the app without accounts, secrets, or paid APIs.
- Added an admin/export dashboard because real buyers care about saved documents, audit history, and handoff evidence.
- Kept the backend honest: the API validates, authorizes, audits, and exports against seeded data, while durable persistence remains a documented production adapter.

## Engineering Decisions

- React and TypeScript for the product surface.
- Zod validation for intake, session, route, and update payloads.
- A service-layer API with role-aware write/export checks.
- Seeded in-memory repository for safe public review plus a Postgres-compatible SQL migration for production persistence.
- `audit_events` model and export bundle format to show compliance-oriented thinking.
- Vitest coverage for create, update, version, export, audit, validation, authorization, gap, and training paths.
- Playwright workflow coverage plus screenshot, GIF, and video proof generation.
- Netlify static deployment config with a modern Netlify Function at `/api/:route`.

## Core Workflow

1. Paste messy operational notes.
2. Select the business, role, department, document type, and priority.
3. Generate an operations document locally.
4. Review SOP steps, training tasks, knowledge base articles, gaps, and versions.
5. Mark findings fixed, save snapshots, publish to team, or export Markdown/PDF.
6. Open the admin dashboard to inspect workspace metrics, switch demo role/mode, review audit events, and export a workspace bundle.

## What Employers Should Notice

- The app solves a real business workflow rather than presenting a generic chatbot.
- The UI is product-grade and optimized for repeated operational use.
- The code is organized around domain models, validation contracts, API boundaries, and product workflows.
- The project includes tests, deployment docs, SQL schema, proof capture, screenshots, and case-study documentation.
- The scope is credible: deterministic demo now, clearly documented path to production database/auth/AI later.

## Validation Surface

- App-level lint, build, typecheck, Vitest tests, and Playwright workflow test.
- Repository-level `check:docs`, `lint:apps`, `typecheck:all`, `test:all`, `build:all`, and `verify`.
- Proof artifacts generated under `docs/proof/` by `npm run proof`.

## Production Roadmap

- Replace the in-memory repository with a database adapter using the included SQL migration.
- Replace demo session payloads with server-derived identity and organization membership.
- Add OpenAI-backed drafting and revision behind strict JSON schemas and fallback handling.
- Add approvals, comments, review cadences, and workspace notifications.
- Add connectors for Notion, Google Drive, Slack, and help desk exports.
- Add billing tiers based on documents, seats, integrations, and compliance history.
