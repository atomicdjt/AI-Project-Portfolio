# ProcessHarbor Canonical Model

## Decision

**ProcessHarbor Pro** is the canonical public product name. **ProcessHarbor** is the permitted portfolio shorthand. **OpsPilot** and **OpsPilot AI Operations Toolkit** are historical implementation aliases for the same product, not a separate product or an underlying methodology.

This conclusion is supported by the original addition of `apps/opspilot-ai-operations-toolkit` in `8cfb134` and the explicit rename commit `2519882` (`Rename OpsPilot to ProcessHarbor Pro`). Current package metadata, UI headings, generated export names, documentation, and the Vercel deployment title all use ProcessHarbor Pro; the directory, deployment-project slug, and generated `.vercel.app` hostname retain the older OpsPilot wording.

## Authority and migration map

| Concern | Canonical record | Historical/technical alias | Handling |
| --- | --- | --- | --- |
| Public product | ProcessHarbor Pro | ProcessHarbor (short form) | Use the full name first in case studies; short form is allowed in compact portfolio UI. |
| Source repository | `atomicdjt/AI-Project-Portfolio` | `apps/opspilot-ai-operations-toolkit` | Keep the path unchanged; it is the authoritative monorepo workspace. |
| Authoritative branch | `main` after approval of the local remediation commits | Local `audit/portfolio-remediation-2026-08-05` | Do not push, rename, or merge as part of this remediation. |
| Public static surface | `https://ai-project-portfolio-opspilot-ai-op.vercel.app/` | Vercel project `ai-project-portfolio-opspilot-ai-operations-toolkit` | Keep the existing provider identity and URL. Portfolio copy explains the legacy slug rather than masking it. |
| Product scope | Deterministic local-first operations-document workflow | Reference API, optional server-side AI, and SQL migration | The static route does not establish deployed API, AI, database, or authenticated-workspace capability. |

## Current maturity and user model

The product is a technically verified **pilot-evaluation demonstrator** for small-business owners, operations managers, documentation/enablement leads, and teams converting recurring notes, tickets, policy fragments, and FAQs into reviewable operating documents. It supports intake capture; deterministic SOP, checklist, and knowledge-base drafting; gap detection; human review and status changes; versions/audit events; local export; and a simulated workspace mode.

The browser workflow persists its demo workspace in `localStorage`. The reference service code uses seeded in-memory data and validates contracts, role checks, exports, health metadata, optional provider configuration, and deterministic fallback. It is not an assertion of durable storage, real identity, tenant isolation, production AI automation, or deployed server routes.

## Migration and historical-reference rule

Do not rename the repository, workspace directory, Vercel project, hostname, or external account. Preserve historic `OpsPilot` references where they identify a commit, file path, provider resource, or artifact. New controlled portfolio and case-study material should call the product ProcessHarbor Pro, identify the OpsPilot alias once, and link the existing source/deployment records. This prevents competing identities while retaining traceability.

## Evidence references

- `git log -- apps/opspilot-ai-operations-toolkit`: `8cfb134` (addition) and `2519882` (explicit rename).
- `apps/opspilot-ai-operations-toolkit/package.json` and `src/App.tsx`: current product/package/UI identity.
- `config/vercel-projects.json` and `docs/deployment-and-previews.md`: current source and static deployment record.
- `apps/opspilot-ai-operations-toolkit/README.md`: supported workflow and scope boundary.
