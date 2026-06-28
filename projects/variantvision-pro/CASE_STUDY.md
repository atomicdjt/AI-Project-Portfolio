# VariantVision Pro - Case Study

## Summary

VariantVision Pro is now a runnable educational bioinformatics workbench for exploring genetic variants, protein impact, population-frequency context, source provenance, and non-diagnostic evidence review.

The MVP is built as a static-deployable React/TypeScript application under `apps/variantvision-pro`. It demonstrates complex-domain product thinking, deterministic analysis logic, source transparency, and responsible AI/research-tool boundaries without requiring a backend or private data.

- Live demo: [variantvisionpro.netlify.app](https://variantvisionpro.netlify.app/)

## Problem

Genetic variant interpretation is complex. Useful analysis requires connecting variant notation, protein context, population frequency, structural information, literature, and curated databases while clearly avoiding diagnostic overclaiming.

## Solution

VariantVision Pro provides a guided variant-analysis workbench that supports curated case exploration, structured evidence review, educational interpretation, and report export.

The app deliberately separates:

- Variant normalization and source routing.
- Amino acid substitution comparison.
- Population frequency context.
- Curated database and protein/source review.
- Literature handoff.
- Evidence quality and uncertainty.
- Responsible non-clinical boundaries.

## Key Capabilities

- Runnable React/TypeScript workbench.
- Curated case library covering HBB E6V, TP53 R175H, and BRAF V600E examples.
- Editable gene, protein-change, genomic HGVS, gnomAD ID, and genome-build inputs.
- Local normalization for gnomAD-style IDs and simple genomic HGVS coordinates.
- GRCh37 / GRCh38 routing to explicit gnomAD dataset labels.
- Known-example handling for the HBB HbS teaching variant.
- Amino acid substitution comparison by charge, polarity, size, and hydropathy.
- Population-frequency table with allele counts, allele numbers, homozygotes, and fixture AF.
- Evidence quality model across normalization, population, curated database review, protein/structure context, and literature handoff.
- Source transparency cards with provenance, source links, status labels, and review boundaries.
- Markdown and JSON evidence dossier export.

## Responsible Scope

VariantVision should be presented as educational and research-support software, not as a diagnostic system or clinical decision tool.

The current MVP uses curated demo fixtures and source leads. It does not perform live public database calls in production, does not generate ACMG/AMP classifications, and does not provide patient-specific guidance.

## Portfolio Value

This project is one of the strongest complex-domain demonstrations in the portfolio because it turns a research-tool concept into a runnable product with typed data models, deterministic evidence logic, exportable reports, and polished source-transparency UX.

## Future Improvements

- Add optional backend API proxying and caching.
- Add robust HGVS normalization.
- Add genome-build conversion handling.
- Add real gnomAD population breakdown display.
- Add live ClinVar, UniProt, AlphaFold, and PubMed refresh with rate limiting.
- Add Playwright E2E coverage for the full review/export workflow.
