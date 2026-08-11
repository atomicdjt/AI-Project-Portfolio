# VariantVision Pro — Case Study Evidence Ledger

This document maps every major technical claim made in the VariantVision Pro case study to its exact implementation file, line range, and automated test verification.

---

| Claim | Verified Implementation | Location | Test Coverage |
|---|---|---|---|
| **Live NCBI ClinVar API Integration** | E-utilities `esearch` + `esummary` REST adapter | `src/providers/clinvar.ts` | `src/tests/providers.test.ts` |
| **Live UniProt REST Integration** | REST API fetching accession metadata & function | `src/providers/uniprot.ts` | `src/tests/providers.test.ts` |
| **Live PubMed REST Integration** | E-utilities search by gene + variant | `src/providers/pubmed.ts` | `src/tests/providers.test.ts` |
| **Fault-Tolerant Provider Orchestration** | `Promise.allSettled` concurrent fetching with timeouts | `src/providers/orchestrator.ts` | `src/tests/providers.test.ts` |
| **Typed Provider Response Envelopes** | `ProviderResult<T>` with error classification & duration | `src/providers/types.ts` | `src/tests/providers.test.ts` |
| **4-Path Variant Normalization** | gnomAD ID, genomic HGVS, rsID, teaching fallback | `src/modules/variant/normalizeVariant.ts` | `src/tests/normalization.test.ts` |
| **RefSeq Chromosome Inference** | `NC_000011` → 11, `NC_000023` → X, `NC_000024` → Y | `src/modules/variant/normalizeVariant.ts` | `src/tests/normalization.test.ts` |
| **Amino Acid Biochemical Shifts** | Kyte-Doolittle hydropathy, charge, polarity shifts | `src/modules/variant/aminoAcids.ts` | `src/tests/variantEngine.test.ts` |
| **5-Dimension Evidence Coverage Scoring** | Normalization, Population, ClinVar, Protein, Literature | `src/modules/evidence/buildDossier.ts` | `src/tests/variantEngine.test.ts` |
| **Live Provider Status Bar UI** | Latency, error classification badges, refresh button | `src/components/ProviderStatusBar.tsx` | App integration |
| **Markdown & JSON Dossier Export** | `generateMarkdownReport` & JSON stringification | `src/modules/reports/generateReport.ts` | `src/tests/variantEngine.test.ts` |
| **18 Vitest Automated Tests** | 3 test suites passing in 1.28s | `src/tests/*.test.ts` | `npm run test` output |
| **Zero-Warning Production Build** | Vite production bundle compilation | `package.json` | `npm run build` output |
