# VariantVision Pro — Portfolio Summary & Resume Bullets

---

## One-Line Description

A provenance-first bioinformatics evidence workbench aggregating live data from ClinVar, UniProt, and PubMed with fault-tolerant provider orchestration and local variant normalization.

---

## 50-Word Description

VariantVision Pro is a React 19 / TypeScript 6 bioinformatics workbench for research triage. It aggregates live scientific data from NCBI ClinVar, UniProt, and PubMed using concurrent `Promise.allSettled` fetching, 4-path coordinate normalization, biochemical amino acid property calculation, and live provider health tracking without making diagnostic claims.

---

## 150-Word Description

VariantVision Pro is an evidence-first bioinformatics workbench designed to aggregate, normalize, and present genomic variant evidence from multiple scientific databases. Built with React 19, TypeScript 6, and Vite 8, it resolves identifier heterogeneity through a 4-path local normalization engine supporting gnomAD VCF IDs, genomic HGVS, rsIDs, and teaching fallbacks.

The application features a fault-tolerant provider orchestration layer that concurrently fetches live evidence from NCBI ClinVar, UniProt, and PubMed via REST APIs. Using typed response envelopes (`ProviderResult<T>`) and per-provider timeouts, partial network failures (such as a PubMed timeout) do not break dossier generation or degrade other data streams.

The interface includes a real-time provider health status bar, biochemical amino acid shift analysis (hydropathy, charge, polarity), a 5-dimension evidence quality score, and self-contained Markdown and JSON dossier export. VariantVision Pro is fully covered by 18 Vitest automated tests.

---

## Key Engineering Competencies Demonstrated

- **Third-Party REST API Integration**: Integration of public NCBI E-utilities and UniProt REST APIs without client-side credentials.
- **Typed Asynchronous Data Pipelines**: Custom `ProviderResult<T>` envelopes with error classification (`success`, `no_result`, `timeout`, `error`, `unavailable`).
- **Fault-Tolerant Orchestration**: Concurrent execution via `Promise.allSettled` with graceful partial failure.
- **Domain Normalization**: Local 4-path variant parsing and RefSeq chromosome inference.
- **Scientific Provenance Modeling**: ISO 8601 timestamping, source URI attribution, and ClinVar review status tracking.
- **Deterministic Automated Testing**: 18 Vitest unit and integration tests.

---

## Suggested Resume Bullets

- Engineered a multi-source genomic variant evidence workbench in React 19 / TypeScript 6, integrating 3 live REST APIs (ClinVar, UniProt, PubMed) with concurrent `Promise.allSettled` fetching and graceful partial-failure handling.
- Implemented a 4-path local variant normalization engine supporting gnomAD VCF IDs, genomic HGVS, rsID lookups, and RefSeq chromosome inference, backed by 18 Vitest unit and integration tests.
- Designed a provenance-first data model with real-time provider health tracking, response latency metrics, ISO 8601 timestamps, and exportable Markdown/JSON evidence dossiers.
