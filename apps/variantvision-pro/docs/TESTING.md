# VariantVision Pro — Testing Strategy

VariantVision Pro tests coordinate routing, exact provider identity selection, error handling, exports and browser behavior. Passing these checks verifies the exercised software behavior; it does not validate biological models or clinical use.

---

## 1. Test Architecture

```text
src/tests/
├── normalization.test.ts   # Unit tests for gnomAD IDs, HGVS, rsIDs, RefSeq, protein changes
├── providers.test.ts       # Unit tests for provider envelope builders, error types, orchestrator
└── variantEngine.test.ts   # Integration tests for dossier building, amino acid shifts, reports
```

Additional suites exercise case/build identity, ClinVar record selection, request scheduling, PubMed and UniProt adapters. `server/pubmedSummary.test.ts` checks endpoint validation and upstream failures. Unit tests use Vitest with mocked HTTP responses. `e2e/workbench.spec.ts` uses Playwright and axe against the running app.

The 2026-10-12 repair verification passed 44 unit tests across nine files and ten browser regressions. Browser coverage includes build switching, custom-input isolation, keyboard tabs, Markdown/JSON downloads, clipboard copy, late-response rejection, provider failures, all-tab accessibility checks, and overflow checks at 320/768/1024/1440 px.

---

## 2. Test Coverage Summary

### Normalization Suite (`normalization.test.ts`)
- **gnomAD ID Parsing**: Tests valid `11-5227002-T-A`, `chrX-123456-A-G`, and malformed strings.
- **Genomic HGVS Parsing**: Tests `NC_000011.10:g.5227002T>A` and short `g.1000A>C` forms.
- **RefSeq Chromosome Inference**: Tests `NC_000011` → 11, `NC_000023` → X, `NC_000024` → Y.
- **rsID Detection**: Tests `rs334`, `RS28934578`, and invalid numeric strings.
- **Protein Notation**: Tests single-letter (`E6V`) and three-letter (`p.Glu6Val`, `p.Arg175His`) parsing.
- **Genome Build Routing**: Verifies GRCh38 maps to `gnomad_r4` and GRCh37 maps to `gnomad_r2_1`.
- **Assembly Safety**: Rejects mismatched primary RefSeq versions, contradictory alleles, invalid chromosomes and zero positions. Teaching mappings are checked in both directions; custom build changes clear coordinates.
- **4 Resolution Paths**: Verifies resolution behavior across gnomAD ID, genomic HGVS, rsID, and fallback paths.

### Provider Suite (`providers.test.ts`)
- **Envelope Builders**: Tests `providerSuccess`, `providerNoResult`, and `providerError` envelope generation.
- **Timestamping**: Verifies ISO 8601 `retrievedAt` timestamp formatting.
- **Error Classification**: Tests `timeout`, `unavailable`, `unsupported_variant`, and `error` statuses.
- **Orchestrator Resilience**: Verifies orchestrator handles empty/invalid inputs without throwing exceptions.
- **ClinVar Identity**: Haplotype and alternate-allele records precede the correct SNV in mocked search responses; only the exact single record is selected. Ambiguity withholds assertions.
- **Real Adapter Paths**: Mocked successful, missing, malformed, mismatched and failed PubMed/UniProt responses exercise parsing and provenance.
- **NCBI Scheduling**: Concurrent requests reserve distinct start slots; requests aborted while queued are never sent.

### Variant Engine Suite (`variantEngine.test.ts`)
- **Amino Acid Comparison**: Tests charge shift, polarity shift, and hydropathy delta calculations.
- **Evidence Scoring**: Tests score calculation across 5 coverage metrics.
- **Markdown Report Generation**: Verifies report output contains required sections, provenance headers, and responsible scope disclaimers.

---

## 3. Running Automated Tests

Run the complete test suite from repository root:

```bash
npm run test --workspace apps/variantvision-pro
```

Run tests in watch mode during development:

```bash
npm exec --workspace apps/variantvision-pro -- vitest
```

Run browser regressions from the repository root:

```bash
npx playwright install chromium
npm run test:e2e --workspace apps/variantvision-pro
```

The dedicated VariantVision GitHub workflow runs this browser suite. Public provider availability is checked separately because CI uses deterministic mocked responses. Automated axe and browser viewport checks do not replace genuine screen-reader, physical-device or expert scientific validation.
