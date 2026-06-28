# VariantVision Pro

VariantVision Pro is a static-deployable bioinformatics evidence workbench for educational variant review and research triage. It demonstrates complex-domain product design without making diagnostic claims.

Live demo: [https://variantvisionpro.netlify.app/](https://variantvisionpro.netlify.app/)

## What It Does

- Normalizes gnomAD-style IDs and simple genomic HGVS coordinates locally.
- Routes GRCh37 / GRCh38 inputs to explicit gnomAD dataset labels.
- Recognizes the HBB HbS teaching example without a backend.
- Compares amino acid substitutions by charge, polarity, size, and hydropathy.
- Scores evidence completeness across normalization, population frequency, curated database review, protein/structure context, and literature handoff.
- Presents source records with status, provenance, source links, and review boundaries.
- Exports Markdown and JSON evidence dossiers.

## Run Locally

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

## Responsible Scope

VariantVision Pro is educational and research-support software only. It is not diagnosis, treatment guidance, genetic counseling, risk prediction, or automated ACMG/AMP classification.

The MVP uses curated demo fixtures and source leads. Real research use would require live database refresh, versioned transcripts, reference validation, liftover handling, and auditable source timestamps.
