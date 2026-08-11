# VariantVision Pro — Provenance-First Genomic Evidence Workbench

VariantVision Pro is an evidence-first bioinformatics workbench engineered to aggregate, normalize, interpret, and present genomic variant evidence from multiple authoritative scientific sources (ClinVar, UniProt, PubMed, gnomAD) while handling uncertainty, provenance, API failures, inconsistent identifiers, and incomplete evidence responsibly.

It demonstrates complex-domain product design, typed asynchronous data pipelines, fault-tolerant provider orchestration, and evidence transparency without making diagnostic claims.

---

## Technical Documentation Package

- **[System Architecture](docs/ARCHITECTURE.md)**: System components, Mermaid data flow, provider abstraction, normalization pipeline, evidence scoring model.
- **[Data Sources & Integration Strategy](docs/DATA-SOURCES.md)**: Per-provider API protocols, endpoints, authentication, normalization handling, and attribution rules.
- **[Scientific & Technical Limitations](docs/LIMITATIONS.md)**: Explicit boundaries, unsupported inputs, liftover scope, and CORS/API fallback policies.
- **[Testing Strategy](docs/TESTING.md)**: Test layers, Vitest suite coverage across normalization, provider abstraction, and dossier scoring.
- **[Technical Case Study](docs/CASE-STUDY.md)**: Comprehensive engineering case study detailing architecture, trade-offs, reliability engineering, and verified results.
- **[Short Case Study](docs/CASE-STUDY-SHORT.md)**: Concise 700-word portfolio overview.
- **[Portfolio Summary](docs/PORTFOLIO-SUMMARY.md)**: Recruiter-friendly summary and resume bullets.
- **[Evidence Ledger](docs/CASE-STUDY-EVIDENCE.md)**: Verifiable claim-to-code mapping for all case study claims.

---

## Key Capabilities

- **Multi-Source Live Aggregation**: Concurrently fetches live scientific data from NCBI ClinVar (assertions & stars), UniProtKB (protein function & subcellular location), and PubMed (literature leads) with real ISO 8601 timestamps and latency tracking.
- **Fault-Tolerant Provider Orchestration**: Uses `Promise.allSettled` with per-provider timeouts. Partial failure in one API (e.g. PubMed timeout) does not break dossier generation or other provider streams.
- **Local Variant Normalization**: 4-path normalization supporting gnomAD-style VCF IDs (`11-5227002-T-A`), genomic HGVS (`NC_000011.10:g.5227002T>A`), rsIDs (`rs334`), and teaching fallback cases.
- **Genome Build Routing**: Maps GRCh37 vs GRCh38 inputs to explicit gnomAD dataset labels (`gnomad_r2_1` vs `gnomad_r4`).
- **Biochemical Substitution Context**: Calculates amino acid property shifts (charge, polarity, size, hydropathy delta on Kyte-Doolittle scale).
- **Evidence Quality Model**: Scores evidence completeness (0–100) across 5 weighted dimensions (Normalization, Population, Curated Database, Protein/Structure, Literature).
- **Source Transparency & Health Bar**: Live provider status bar displaying per-provider health, response time, error classification (`success`, `no_result`, `timeout`, `unavailable`), and direct source links.
- **Dossier Export**: Exports self-contained Markdown (`.md`) reports and structured JSON (`.json`) evidence bundles.

---

## Quick Start

### Run Locally

From the repository root:

```bash
npm install
npm run dev:variantvision
```

Open `http://127.0.0.1:5182`.

### Execute Test Suite

```bash
npm run test --workspace apps/variantvision-pro
```

### Validate Production Build

```bash
npm run lint --workspace apps/variantvision-pro
npm run build --workspace apps/variantvision-pro
```

---

## Responsible Scope

VariantVision Pro is educational and research-support software only. It is not diagnosis, treatment guidance, genetic counseling, risk prediction, or automated ACMG/AMP classification.

Live provider data is retrieved directly from public REST endpoints (NCBI, UniProt) for research exploration. Always review primary source records before drawing clinical or research conclusions.