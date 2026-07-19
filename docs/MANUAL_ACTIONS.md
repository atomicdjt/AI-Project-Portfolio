# Remaining Manual Account Actions

The repository-level remediation can prepare, document, and validate changes, but several account-level actions require the authenticated Vercel or domain-management interface.

## Vercel

- Confirm BuildWorld’s production branch and promote the verified `main` deployment to production.
- Compare environment-variable names, domains, and settings between `source` and `quoteforge-local`; delete `source` only after equivalence and reference checks.
- Compare `weavestudio-demo` with canonical `weavestudio`; retire the duplicate after parity and reference checks.
- Remove or redirect obsolete public aliases where supported.
- Confirm canonical deployment URLs after cleanup.

Use [VERCEL_CLEANUP_RUNBOOK.md](VERCEL_CLEANUP_RUNBOOK.md). Do not paste secret values into documentation, issues, or chat.

## Custom domain

A custom domain may improve presentation, but it is optional. Purchase and DNS changes require explicit account-owner approval. Canonical source and deployment governance must remain clear without it.

## External validation

Real user evidence requires real participants and consent. Execute [EXTERNAL_VALIDATION_PROTOCOL.md](EXTERNAL_VALIDATION_PROTOCOL.md); do not synthesize testimonials, usage, customers, sales, or market validation.

## Merge and deployment

Review pull-request checks and wording before merge. Merging may trigger Vercel deployments. Confirm the intended affected projects and available plan capacity before merging a portfolio-wide change.