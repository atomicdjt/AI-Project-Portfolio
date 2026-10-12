# VariantVision Pro — Case Study Evidence Ledger

This document maps every major technical claim made in the VariantVision Pro case study to its exact implementation file, line range, and automated test verification.

---

| Claim | Verified Implementation | Location | Test Coverage |
|---|---|---|---|
| **ClinVar Identity Selection** | E-utilities search plus exact SNV/assembly/allele matching | `src/providers/clinvar.ts`, `src/providers/clinvarMatch.ts` | `src/tests/clinvar.test.ts`, browser live-provider regression |
| **UniProt Metadata and Mismatches** | Reviewed protein retrieval; missing/mismatched identity remains explicit | `src/providers/uniprot.ts` | `src/tests/uniprot.test.ts` |
| **PubMed Metadata Integration** | ESearch plus fixed-upstream same-origin summary endpoint | `src/providers/pubmed.ts`, `server/pubmedSummary.ts`, `api/pubmed.ts` | `src/tests/pubmed.test.ts`, `server/pubmedSummary.test.ts`, browser regressions |
| **Fault-Tolerant Provider Orchestration** | `Promise.allSettled` concurrent fetching with timeouts | `src/providers/orchestrator.ts` | `src/tests/providers.test.ts` |
| **Typed Provider Response Envelopes** | `ProviderResult<T>` with error classification & duration | `src/providers/types.ts` | `src/tests/providers.test.ts` |
| **4-Path Variant Normalization** | gnomAD ID, genomic HGVS, rsID, teaching fallback | `src/modules/variant/normalizeVariant.ts` | `src/tests/normalization.test.ts` |
| **RefSeq Chromosome Inference** | `NC_000011` → 11, `NC_000023` → X, `NC_000024` → Y | `src/modules/variant/normalizeVariant.ts` | `src/tests/normalization.test.ts` |
| **Amino Acid Biochemical Shifts** | Kyte-Doolittle hydropathy, charge, polarity shifts | `src/modules/variant/aminoAcids.ts` | `src/tests/variantEngine.test.ts` |
| **5-Dimension Evidence Coverage Scoring** | Normalization, Population, ClinVar, Protein, Literature | `src/modules/evidence/buildDossier.ts` | `src/tests/variantEngine.test.ts` |
| **Live Provider Status Bar UI** | Latency, error classification badges, refresh button | `src/components/ProviderStatusBar.tsx` | App integration |
| **Markdown & JSON Dossier Export** | `generateMarkdownReport` & JSON stringification | `src/modules/reports/generateReport.ts` | `src/tests/variantEngine.test.ts` |
| **Regression Verification** | 44 unit tests / nine files and ten browser tests passed on 2026-10-12 | `src/tests`, `server`, `e2e` | Unit/browser runner output; no claim of exhaustive coverage |
| **Zero-Warning Production Build** | Vite production bundle compilation | `package.json` | `npm run build` output |
