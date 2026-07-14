# VariantVision Pro — Case Study

## Summary

VariantVision Pro is a runnable educational bioinformatics workbench for exploring genetic variants, protein-impact context, population-frequency evidence, source provenance, and non-diagnostic review.

The React/TypeScript MVP lives under `apps/variantvision-pro`. It demonstrates complex-domain product thinking, deterministic analysis, source transparency, and responsible research-tool boundaries without requiring a backend or private data.

**Deployment status:** [Live on Vercel](https://ai-project-portfolio-variantvision.vercel.app/). The static Vite build includes `vercel.json` for SPA routing.

## Problem

Genetic variant interpretation is complex. Useful analysis requires connecting variant notation, protein context, population frequency, structural information, literature, and curated databases while clearly avoiding diagnostic overclaiming.

## Solution

VariantVision Pro provides a guided workbench for curated case exploration, structured evidence review, educational interpretation, and dossier export.

The app separates:

- variant normalization and source routing,
- amino-acid substitution comparison,
- population-frequency context,
- curated database and protein/source review,
- literature handoff,
- evidence quality and uncertainty,
- responsible non-clinical boundaries.

## Key Capabilities

- Runnable React/TypeScript workbench
- Curated cases covering HBB E6V, TP53 R175H, and BRAF V600E examples
- Editable gene, protein-change, genomic HGVS, gnomAD ID, and genome-build inputs
- Local normalization for gnomAD-style IDs and simple genomic HGVS coordinates
- GRCh37 and GRCh38 routing to explicit dataset labels
- HBB HbS teaching-example handling
- Amino-acid comparison by charge, polarity, size, and hydropathy
- Population-frequency table with fixture allele counts and frequencies
- Evidence-quality model across normalization, population, curated review, protein/structure context, and literature handoff
- Source-transparency cards with provenance, links, status labels, and boundaries
- Markdown and JSON evidence-dossier export

## Quality and Deployment Evidence

Repository validation includes linting, automated tests, and production build. The app is migration-ready for a Vercel project using Root Directory `apps/variantvision-pro`, Vite, build command `npm run build`, and output directory `dist`.

The recorded production deployment reported `READY`; browser regression checks should continue to cover case switching, source filtering, export, direct-route refresh, mobile layout, and visible non-diagnostic boundaries.

## Responsible Scope

VariantVision Pro is educational and research-support software, not a diagnostic system or clinical decision tool.

The current MVP uses curated demo fixtures and source leads. It does not perform live public-database calls, generate ACMG/AMP classifications, or provide patient-specific guidance.

## Portfolio Value

This is one of the portfolio's strongest complex-domain demonstrations because it turns a research-tool concept into a runnable product with typed data models, deterministic evidence logic, exportable reports, and source-transparency UX.

## Future Improvements

- Add optional backend API proxying and caching.
- Add robust HGVS normalization.
- Add genome-build conversion handling.
- Add real population breakdown displays.
- Add live ClinVar, UniProt, AlphaFold, and PubMed refresh with rate limiting and source timestamps.
- Expand Playwright coverage for the full review and export workflow.
