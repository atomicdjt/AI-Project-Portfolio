# VariantVision Pro — Portfolio Summary & Resume Bullets

---

## One-Line Description

A provenance-first bioinformatics evidence workbench aggregating live data from ClinVar, UniProt, and PubMed with fault-tolerant provider orchestration and local variant normalization.

---

## 50-Word Description

VariantVision Pro is a React 19 / TypeScript 7 educational variant source review workbench. It retrieves attributed ClinVar, UniProt and PubMed leads on request, with exact SNV identity checks, local coordinate parsing, biochemical property comparisons and explicit provider health.

---

## 150-Word Description

VariantVision Pro combines local coordinate parsing and verified teaching-case mappings with optional public API leads. Built with React 19, TypeScript 7 and Vite 8, it keeps illustrative population fixtures separate from retrieved data and withholds conflicting or ambiguous identity matches.

The application features a fault-tolerant provider orchestration layer that concurrently fetches live evidence from NCBI ClinVar, UniProt, and PubMed via REST APIs. Using typed response envelopes (`ProviderResult<T>`) and per-provider timeouts, partial network failures (such as a PubMed timeout) do not break dossier generation or degrade other data streams.

The interface includes provider health details, biochemical property comparisons, a documented five-dimension workflow heuristic and Markdown/JSON export with source URLs, retrieval logs and warnings. Focused unit and browser regressions verify the documented software behavior.

---

## Key Engineering Competencies Demonstrated

- **Third-Party REST API Integration**: Integration of public NCBI E-utilities and UniProt REST APIs without client-side credentials.
- **Typed Asynchronous Data Pipelines**: Custom `ProviderResult<T>` envelopes with error classification (`success`, `no_result`, `timeout`, `error`, `unavailable`).
- **Fault-Tolerant Orchestration**: Concurrent execution via `Promise.allSettled` with graceful partial failure.
- **Domain Normalization**: Local 4-path variant parsing and RefSeq chromosome inference.
- **Scientific Provenance Modeling**: ISO 8601 timestamping, source URI attribution, and ClinVar review status tracking.
- **Automated Regression Testing**: Vitest adapter/domain suites and Playwright browser flows, including axe accessibility checks.

---

## Suggested Resume Bullets

- Engineered a React 19 / TypeScript 7 variant source workbench with three optional public providers, exact ClinVar allele matching, a restricted PubMed metadata endpoint and graceful partial failure handling.
- Implemented local coordinate parsing with RefSeq assembly checks, verified teaching-case mappings, and regression coverage for conflicting alleles and assembly changes.
- Designed a provenance-first data model with real-time provider health tracking, response latency metrics, ISO 8601 timestamps, and exportable Markdown/JSON evidence dossiers.
