# OpsPilot Case Study

## Overview

OpsPilot is a runnable AI operations toolkit for small businesses. It turns messy notes, FAQs, tickets, and policy fragments into structured operations documents: SOPs, training checklists, knowledge base articles, gap reports, and version history.

The project is built as a polished micro-SaaS product surface rather than a generic chatbot demo. It targets a clear business pain: reducing operational chaos and manager-dependent tribal knowledge.

## Runnable App

- App: [apps/opspilot-ai-operations-toolkit](../../apps/opspilot-ai-operations-toolkit)
- Live demo: [opspilot-ai-operations-toolkit.netlify.app](https://opspilot-ai-operations-toolkit.netlify.app/)
- Default local URL: `http://127.0.0.1:5177/`
- Deployment: production Netlify static Vite app

## Target Users

- Small business owners who need repeatable workflows.
- Operations managers responsible for documentation quality.
- Clinics, contractors, service businesses, and support teams.
- Compliance-sensitive teams that need version and review history.

## Product Capabilities

- SOP Generator: converts rough notes into step-by-step procedures.
- Training Checklist Builder: creates role-based onboarding tasks.
- Knowledge Base Generator: creates short customer or staff help articles.
- Documentation Gap Detector: identifies missing owners, weak escalation paths, missing review cadence, and unclear completion tracking.
- Version Tracker: records generated, edited, saved, and published document versions.
- Export: Markdown download and browser PDF print flow.

## Engineering Highlights

- React, TypeScript, and Vite app with a structured domain model.
- Local deterministic drafting engine for no-secret deployment.
- Strong typed schema for documents, steps, training items, articles, gap findings, and versions.
- Browser localStorage persistence for frictionless review.
- Netlify configuration with SPA fallback, security headers, and immutable asset caching.
- Responsive layout verified on desktop and mobile.

## Why It Matters

OpsPilot is directly aligned with technical operations, support operations, documentation, enablement, and product-operations roles. It demonstrates the ability to translate a real business workflow into a runnable, polished product with clear monetization potential.

## What This Demonstrates for Employers

- Ability to model messy operational inputs into structured SOPs, checklists, articles, gaps, and versions.
- Strong alignment with documentation, onboarding, support operations, and knowledge-management work.
- Practical product scoping: local deterministic drafting now, backend/AI integrations reserved for roadmap scope.
- Clear packaging through a runnable app, live demo, case study, screenshots, and deployment configuration.

## What I Would Improve Next

- Add automated tests for document generation, gap detection, and version history.
- Add an OpenAI-backed endpoint that returns strict validated JSON.
- Add organization roles, permissions, approval status, and audit history.
- Add integrations with Notion, Google Drive, Slack, or help desk tools.
- Add clearer import/export flows for teams migrating existing documentation.

## Production Roadmap

- Add an OpenAI-backed server endpoint that returns strict `OpsDocument` JSON.
- Add organization accounts, roles, document permissions, and audit logs.
- Store versions and approvals in a backend database.
- Add team comments, approval status, and review cadences.
- Integrate with Notion, Google Drive, Slack, and help desk tools.
- Add subscription tiers around seats, documents, integrations, and compliance history.
