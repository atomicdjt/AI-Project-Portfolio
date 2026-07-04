# OpsPilot Pro Case Study

## Overview

OpsPilot Pro is a runnable operations documentation system for small businesses. It turns messy notes, FAQs, tickets, and policy fragments into structured operations documents: SOPs, training checklists, knowledge base articles, gap reports, audit events, export bundles, and version history.

The project is built as a polished micro-SaaS product surface rather than a generic chatbot demo. It targets a clear business pain: reducing operational chaos and manager-dependent tribal knowledge while preserving a credible production path.

## Runnable App

- App: [apps/opspilot-ai-operations-toolkit](../../apps/opspilot-ai-operations-toolkit)
- Live demo: [opspilot-ai-operations-toolkit.netlify.app](https://opspilot-ai-operations-toolkit.netlify.app/)
- Default local URL: `http://127.0.0.1:5177/`
- Deployment: Netlify Vite frontend plus seeded reference Function API
- Proof artifacts: [apps/opspilot-ai-operations-toolkit/docs/proof](../../apps/opspilot-ai-operations-toolkit/docs/proof)

## Target Users

- Small business owners who need repeatable workflows.
- Operations managers responsible for documentation quality.
- Clinics, contractors, service businesses, and support teams.
- Compliance-sensitive teams that need version, audit, and export history.

## Product Capabilities

- SOP Generator: converts rough notes into step-by-step procedures.
- Training Checklist Builder: creates role-based onboarding tasks and tracks completion.
- Knowledge Base Generator: creates short customer or staff help articles.
- Documentation Gap Detector: identifies missing owners, weak escalation paths, missing review cadence, and unclear completion tracking.
- Version Tracker: records generated, edited, saved, and published document versions.
- Admin Dashboard: summarizes saved docs, published docs, open gaps, audit events, workspace mode, and demo role.
- Export: Markdown download, browser PDF print flow, and workspace JSON bundle.

## Engineering Highlights

- React, TypeScript, and Vite app with a structured domain model.
- Deterministic local drafting engine for no-secret public review.
- Zod validation for intake, update, session, and route payloads.
- Service-layer API with role-aware authorization for writes and admin exports.
- Netlify Function reference API using modern `Request`/`Response` syntax.
- Postgres-compatible SQL migration for organizations, users, documents, versions, training items, articles, gaps, and `audit_events`.
- Vitest tests for create/update/version/export/audit/validation/authorization paths.
- Playwright workflow test plus screenshot, GIF, and video proof capture.

## Honest Scope

The app does not claim durable production workspaces, real identity-provider authentication, live AI generation, or billing. The default frontend remains a local deterministic demo. The backend demonstrates the contracts, validation, authorization, seeded state, audit events, and export shape that a production repository/database adapter would use.

## Why It Matters

OpsPilot Pro is directly aligned with technical operations, support operations, documentation, enablement, and product-operations roles. It demonstrates the ability to translate a real business workflow into a runnable, polished product with monetization potential and credible engineering boundaries.

## What This Demonstrates for Employers

- Ability to model messy operational inputs into structured SOPs, checklists, articles, gaps, versions, and audit records.
- Strong alignment with documentation, onboarding, support operations, and knowledge-management work.
- Practical product scoping: local deterministic drafting now, backend/database/auth/AI adapters clearly separated as production work.
- Clear packaging through a runnable app, live demo, tests, case studies, screenshots, deployment docs, and proof artifacts.

## What I Would Improve Next

- Implement the persistent database repository against `database/migrations/001_init.sql`.
- Add server-derived sessions through Netlify Identity, Supabase Auth, Clerk, Auth0, or WorkOS.
- Add an OpenAI-backed endpoint that returns strict validated JSON with graceful fallback.
- Add approval status, comments, review cadence reminders, and audit-log filtering.
- Add integrations with Notion, Google Drive, Slack, or help desk tools.

## Production Roadmap

- Add durable database persistence for documents, versions, and audit events.
- Add organization accounts, roles, document permissions, and server-side auth.
- Add team comments, approval status, review cadences, and notification workflows.
- Integrate with Notion, Google Drive, Slack, and help desk tools.
- Add subscription tiers around seats, documents, integrations, and compliance history.
