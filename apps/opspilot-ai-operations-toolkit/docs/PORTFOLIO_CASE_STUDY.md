# OpsPilot Portfolio Case Study

## Summary

OpsPilot is a polished AI operations toolkit for small businesses. It focuses on a monetizable business pain: converting messy internal information into repeatable SOPs, onboarding checklists, help articles, gap reports, and versioned documentation.

## Target Users

- Small business owners who need repeatable workflows.
- Operations managers responsible for documentation quality.
- Clinics, service businesses, contractors, and support teams with recurring staff training.
- Compliance-sensitive teams that need visible change history.

## Product Decisions

- Built the working dashboard as the first screen instead of a landing page.
- Used a dense but readable operations layout: navigation, document library, intake, generated output, and review insights.
- Kept all critical workflows interactive so reviewers can evaluate product thinking without backend setup.
- Made the drafting engine deterministic and local-first so the project can be deployed safely without secrets.

## Engineering Decisions

- React and TypeScript for a maintainable product surface.
- Strong document types for SOPs, training items, knowledge articles, gap findings, and versions.
- Local persistence via `localStorage` for frictionless demos.
- Plain CSS design system for predictable responsive behavior and no external styling lock-in.
- Netlify configuration with SPA fallback, production Node version, security headers, and immutable asset caching.
- GitHub Actions workflow validates lint and production build.

## Core Workflow

1. Paste messy operational notes.
2. Select the business, role, department, document type, and priority.
3. Generate an operations document.
4. Review SOP steps, training tasks, knowledge base articles, gaps, and versions.
5. Mark findings fixed, save snapshots, publish to team, or export Markdown/PDF.

## What Employers Should Notice

- The app solves a real business workflow rather than presenting a generic chatbot.
- The UI is product-grade and optimized for repeated operational use.
- The code is organized around domain models and product workflows.
- The project includes validation, deployment configuration, screenshots, and case-study documentation.

## Production Roadmap

- Replace the deterministic local drafting engine with an OpenAI-backed server endpoint.
- Add organization accounts, document permissions, and role-based access.
- Store versions, approvals, and audit events in a database.
- Add collaborative comments and approval workflows.
- Add connectors for Notion, Google Drive, Slack, and help desk exports.
- Add billing tiers based on documents, seats, and integrations.
