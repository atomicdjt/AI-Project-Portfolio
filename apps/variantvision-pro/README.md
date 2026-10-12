# VariantVision Pro — Genomic Evidence Workbench

VariantVision Pro is an educational workbench combining local coordinate parsing, three curated teaching cases, optional ClinVar/UniProt/PubMed retrieval, and attributed source leads. Population counts are illustrative fixtures, not live gnomAD observations.

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
- **Genome Build Routing**: Uses verified GRCh37/GRCh38 coordinates for HBB, TP53 and BRAF teaching variants and explicit gnomAD dataset labels. Changing a custom input's build clears genomic coordinates; the application does not perform liftover.
- **Biochemical Substitution Context**: Calculates amino acid property shifts (charge, polarity, size, hydropathy delta on Kyte-Doolittle scale).
- **Workflow Coverage Heuristic**: Averages five dimensions equally: coordinate routing, population source presence, curated database status, protein/structure status, and literature lead count. The score is uncalibrated and does not measure scientific correctness or clinical confidence.
- **Source Transparency & Health Bar**: Live provider status bar displaying per-provider health, response time, error classification (`success`, `no_result`, `timeout`, `unavailable`), and direct source links.
- **Dossier Export**: Exports self-contained Markdown (`.md`) reports and structured JSON (`.json`) evidence bundles.
- **Exact ClinVar Identity Selection**: Requires a single SNV record matching the selected assembly, chromosome, position and alleles. Compound records and alternate alleles are excluded; ambiguous matches are withheld.
- **Separate Population Cohorts**: Summarizes the highest fixture row frequency without pooling denominators.
- **Accessible Workbench**: Keyboard tabs support arrows, Home and End, with explicit panel relationships; errors, warnings and empty states are visible.

## Runtime and Data Flow

The React workbench runs in the browser. A small Node endpoint at `/api/pubmed` retrieves NCBI article summaries because that upstream endpoint does not consistently permit browser CORS access. It accepts one to five public numeric PMIDs, uses a fixed upstream URL, times out, and stores no results. Vite serves the same handler in development and preview; Vercel serves it as a function. A purely static host must provide this route for live PubMed metadata to work.

Explicit live fetch sends gene/variant terms to NCBI, protein accessions to UniProt, and public PMIDs through the metadata endpoint. Application code does not persist inputs or results. Markdown includes source URLs, retrieval times, errors and warnings; JSON additionally retains provider envelopes. Custom inputs detach teaching fixtures throughout the interface and exports.

---

## Quick Start

### Run Locally

From the repository root:

```bash
npm ci --workspace apps/variantvision-pro --include-workspace-root=true
npm run dev:variantvision
```

Open `http://127.0.0.1:5182`.

### Execute Test Suite

```bash
npm run test --workspace apps/variantvision-pro
npx playwright install chromium
npm run test:e2e --workspace apps/variantvision-pro
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
