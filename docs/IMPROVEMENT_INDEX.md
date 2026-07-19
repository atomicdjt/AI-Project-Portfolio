# Portfolio Improvement Index

This page connects the portfolio’s credibility, validation, and deployment-governance evidence.

## Canonical records

- [Portfolio authority manifest](../config/portfolio-authority.json) — machine-readable source, branch, canonical URL, review tier, and evidence boundary record.
- [Project index](PROJECT_INDEX.md) — human-readable project inventory.
- [Contextual project rankings](project-ranking.md) — review paths by audience.

## Evidence and authorship

- [Authorship, AI Assistance, and Verification](AUTHORSHIP_AND_VERIFICATION.md) — describes the human-directed, AI-assisted workflow, what the portfolio demonstrates, and what it does not independently prove.
- [Verification guide](VERIFICATION.md) — repository verification procedures and claim-safe completion language.

## External proof

- [External Validation Protocol](EXTERNAL_VALIDATION_PROTOCOL.md) — ethical five-participant usability pilot, metrics, defect handling, retesting, testimonial rules, and report format.

## Deployment governance

- [Vercel Deployment Record](VERCEL_DEPLOYMENT.md) — deployment evidence and status.
- [Deployment and Source-Authority Map](deployment-and-previews.md) — relationship among source workspaces, deployments, and previews.
- [Vercel Consolidation Runbook](VERCEL_CLEANUP_RUNBOOK.md) — safe procedure for retiring duplicate projects, correcting BuildWorld’s production target, reducing alias ambiguity, and reviewing security headers.

## Automated protection

The `Portfolio Authority` GitHub Actions workflow runs `scripts/check-portfolio-authority.mjs` when the authority manifest or public status documents change. It checks:

- unique project identities and canonical URLs;
- expected source branches;
- canonical Vercel project mapping;
- claim-safe traction status;
- valid review-order references;
- classification of noncanonical deployments;
- required current-status language;
- forbidden stale status language.

Automated checks protect structural consistency. They do not replace manual verification of deployment behavior, source equivalence, market claims, or nuanced documentation.