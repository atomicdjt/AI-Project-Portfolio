# ProcessHarbor Pro — Case Study

## Overview

ProcessHarbor Pro is a runnable operations-documentation system for small businesses. It turns messy notes, FAQs, tickets, and policy fragments into structured SOPs, training checklists, knowledge-base articles, gap reports, audit events, export bundles, and version history.

The product is designed as a polished operations workflow rather than a generic chatbot. It addresses manager-dependent tribal knowledge while preserving a credible path toward durable storage, authenticated workspaces, optional server-side AI, and integrations.

## Runnable App

- Source: [apps/opspilot-ai-operations-toolkit](../../apps/opspilot-ai-operations-toolkit)
- Default local URL: `http://127.0.0.1:5177/`
- Proof assets: [apps/opspilot-ai-operations-toolkit/docs/proof](../../apps/opspilot-ai-operations-toolkit/docs/proof)
- Deployment status: **[Live on Vercel](https://ai-project-portfolio-opspilot-ai-op.vercel.app/)** — deterministic static workflow only; the source-documented API, AI-provider, and database paths are not deployed on this route.

The deterministic browser workflow is configured for a Vercel preview. Optional backend routes must be exposed and validated as Vercel Functions before server-backed functionality is described as deployed.

## Target Users

- Small-business owners who need repeatable workflows
- Operations managers responsible for documentation quality
- Clinics, contractors, service businesses, and support teams
- Process-sensitive teams that need version, audit, and export history

## Product Capabilities

- **SOP Generator:** converts rough notes into step-by-step procedures.
- **Training Checklist Builder:** creates role-based onboarding tasks and tracks completion.
- **Knowledge Base Generator:** creates concise customer or staff help articles.
- **Documentation Gap Detector:** identifies missing owners, weak escalation paths, missing review cadence, and unclear completion tracking.
- **Version Tracker:** records generated, edited, saved, and published document versions.
- **Admin Dashboard:** summarizes saved and published documents, open gaps, audit events, workspace mode, and demo role.
- **Developer Diagnostics:** reports generation mode, route, provider/model, sanitized configuration, validation status, timestamp, and document ID.
- **Export:** Markdown download, browser PDF print flow, and workspace JSON bundle.

## Engineering Highlights

- React, TypeScript, and Vite app with a structured domain model
- Deterministic local drafting engine for no-secret public review
- Zod validation for intake, update, session, and route payloads
- Service-layer API with role-aware authorization for writes and admin exports
- Optional OpenAI Responses API adapter with strict JSON validation, rate limiting, and deterministic fallback
- Postgres-compatible SQL migration for organizations, users, documents, versions, training items, articles, gaps, and audit events
- Vitest coverage for create/update/version/export/audit/validation/authorization, AI fallback, health metadata, and normalization paths
- Playwright workflow tests plus screenshot, GIF, video, and export proof
- Vercel SPA configuration and documented Vercel Functions migration path

## Honest Scope

The app does not claim durable production workspaces, real identity-provider authentication, production AI automation, billing, or multi-tenant database isolation.

The default frontend remains a local deterministic demo. Optional OpenAI generation exists as a server-side reference path when explicitly configured. The service layer demonstrates contracts, validation, authorization, seeded state, audit events, fallback behavior, and export shape, but it is not described as live until a Vercel deployment verifies those routes.

## License and Reuse Terms

ProcessHarbor Pro is public for portfolio review only. The app-local license is all rights reserved and does not grant reuse, redistribution, sublicensing, resale, fork-for-resale, or production deployment rights without prior written permission.

## Why It Matters

ProcessHarbor Pro is directly aligned with technical operations, support operations, documentation, enablement, and product-operations roles. It demonstrates the ability to translate a real business workflow into a runnable product with disciplined engineering boundaries and a clear production path.

## What This Demonstrates for Employers

- Ability to model messy operational inputs into structured documents and audit records
- Strong alignment with documentation, onboarding, support operations, and knowledge-management work
- Practical scoping between deterministic local functionality, optional AI, and production database/auth work
- Clear packaging through source, tests, case studies, screenshots, deployment documentation, and proof assets
- Vercel-oriented deployment judgment that avoids claiming unverified server functionality

## What I Would Improve Next

- Implement Vercel Functions around the existing service contracts.
- Add the persistent database repository against `database/migrations/001_init.sql`.
- Add server-derived sessions through an identity provider.
- Add production AI controls: tenant limits, trace retention, evaluation fixtures, and admin model configuration.
- Add approval status, comments, review cadence reminders, and audit-log filtering.
- Add integrations with Notion, Google Drive, Slack, and help-desk systems.

## Production Roadmap

- Vercel preview and production deployment for deterministic mode
- Verified Vercel Functions for health, document, audit, export, and optional AI routes
- Durable database persistence and organization isolation
- Server-side authentication and permissions
- Team comments, approvals, review cadences, and notifications
- Subscription limits and external integrations
