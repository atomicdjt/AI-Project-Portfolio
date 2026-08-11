# VariantVision Pro — Short Case Study

## Provenance-First Genomic Evidence Workbench

---

### What I Built

**VariantVision Pro** is a client-side React 19 / TypeScript 6 bioinformatics evidence workbench for research triage and variant review. It aggregates live scientific data from NCBI ClinVar, UniProt, PubMed, and gnomAD datasets into a unified, explainable interface.

The application normalizes genomic coordinates, calculates amino acid biochemical property shifts, scores evidence quality across 5 dimensions, and displays live provider health without making diagnostic claims.

---

### Why It Matters

Genomic variant interpretation requires querying multiple distributed databases (NCBI, UniProt, gnomAD) that use different identifiers (`rs334`, `11-5227002-T-A`, `p.Glu6Val`), varying schemas, and independent network availability. Existing tools often obscure source provenance or collapse conflicting submitter assertions into a single unexplained classification.

VariantVision Pro solves this by prioritizing provenance transparency, displaying live provider health, handling partial API outages gracefully, and reinforcing responsible research boundaries.

---

### Key Technical Accomplishments

1. **Fault-Tolerant Provider Orchestration**: Built a concurrent fetching layer using `Promise.allSettled` and typed `ProviderResult<T>` envelopes. If NCBI PubMed times out, ClinVar and UniProt data still load cleanly.
2. **4-Path Variant Normalization**: Implemented a local normalization engine handling gnomAD VCF IDs, genomic HGVS, rsIDs, and teaching fallbacks (HBB E6V), while flagging unresolvable inputs for manual review.
3. **Biochemical Substitution Engine**: Built a pure functional property comparison module that computes charge, polarity, size, and Kyte-Doolittle hydropathy deltas for amino acid substitutions.
4. **Live Provider Status Bar**: Designed a real-time health indicator showing status, response latency, and error classification for each external API.
5. **Deterministic Testing**: Created 18 Vitest unit/integration tests covering normalization edge cases, provider envelopes, and report generation.

---

### Technology Used

- **Framework**: React 19, TypeScript 6, Vite 8, Tailwind CSS 4
- **Testing**: Vitest 4
- **APIs**: NCBI E-utilities (ClinVar, PubMed), UniProt REST API
- **Deployment**: Vercel Static SPA (`vercel.json`)
