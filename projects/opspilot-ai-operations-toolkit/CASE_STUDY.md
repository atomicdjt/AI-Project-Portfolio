# OpsPilot Case Study

## Overview

OpsPilot is a runnable AI operations toolkit for small businesses. It turns messy notes, FAQs, tickets, and policy fragments into structured operations documents: SOPs, training checklists, knowledge base articles, gap reports, and version history.

The project is built as a polished micro-SaaS product surface rather than a generic chatbot demo. It targets a clear business pain: reducing operational chaos and manager-dependent tribal knowledge.

## Runnable App

- App: [apps/opspilot-ai-operations-toolkit](../../apps/opspilot-ai-operations-toolkit)
- Default local URL: `http://127.0.0.1:5177/`
- Deployment: Netlify-ready static Vite app

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

## Production Roadmap

- Add an OpenAI-backed server endpoint that returns strict `OpsDocument` JSON.
- Add organization accounts, roles, document permissions, and audit logs.
- Store versions and approvals in a backend database.
- Add team comments, approval status, and review cadences.
- Integrate with Notion, Google Drive, Slack, and help desk tools.
- Add subscription tiers around seats, documents, integrations, and compliance history.
