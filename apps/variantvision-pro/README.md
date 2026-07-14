# VariantVision Pro

VariantVision Pro is a static bioinformatics evidence workbench for educational variant review and research triage. It demonstrates complex-domain product design without making diagnostic claims.

## Deployment Status

VariantVision Pro is configured for Vercel through `vercel.json`. A production Vercel alias is not claimed until a preview and production deployment are verified.

## What It Does

- Normalizes gnomAD-style IDs and simple genomic HGVS coordinates locally.
- Routes GRCh37 and GRCh38 inputs to explicit gnomAD dataset labels.
- Recognizes the HBB HbS teaching example without a backend.
- Compares amino acid substitutions by charge, polarity, size, and hydropathy.
- Scores evidence completeness across normalization, population frequency, curated database review, protein/structure context, and literature handoff.
- Presents source records with status, provenance, source links, and review boundaries.
- Exports Markdown and JSON evidence dossiers.

## Run Locally

From the repository root:

```bash
npm install
npm run dev --workspace apps/variantvision-pro
```

Open `http://127.0.0.1:5182`.

## Validate

```bash
npm run lint --workspace apps/variantvision-pro
npm run test --workspace apps/variantvision-pro
npm run build --workspace apps/variantvision-pro
```

## Deploy to Vercel

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with:

```text
Project name: variantvision-pro
Root Directory: apps/variantvision-pro
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Production Branch: main
Node.js: 22
```

No server-side environment variables are required for the curated educational MVP.

Use a preview deployment first and verify:

1. each curated case and source record,
2. genome-build labels and normalization helpers,
3. amino-acid comparison,
4. evidence-completeness scoring,
5. source filtering and provenance links,
6. Markdown and JSON export,
7. direct-route refresh and static assets,
8. mobile layout and browser console,
9. the visible educational and non-diagnostic boundaries.

Promote only after Vercel reports `READY` and the review workflow succeeds.

## Responsible Scope

VariantVision Pro is educational and research-support software only. It is not diagnosis, treatment guidance, genetic counseling, risk prediction, or automated ACMG/AMP classification.

The MVP uses curated demo fixtures and source leads. Real research use would require live database refresh, versioned transcripts, reference validation, liftover handling, auditable source timestamps, and qualified domain review.

## Source and Deployment Authority

The authoritative source remains `atomicdjt/AI-Project-Portfolio/main` for this workspace. Vercel previews and production deployments are derivative outputs of recorded commits.