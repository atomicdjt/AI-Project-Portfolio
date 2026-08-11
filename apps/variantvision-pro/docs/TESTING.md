# VariantVision Pro — Testing Strategy

VariantVision Pro uses a multi-layered testing methodology to ensure scientific precision, normalization correctness, API resilience, and UI regression prevention.

---

## 1. Test Architecture

```text
src/tests/
├── normalization.test.ts   # Unit tests for gnomAD IDs, HGVS, rsIDs, RefSeq, protein changes
├── providers.test.ts       # Unit tests for provider envelope builders, error types, orchestrator
└── variantEngine.test.ts   # Integration tests for dossier building, amino acid shifts, reports
```

All tests are executed using **Vitest** in pure Node environment for rapid, deterministic validation.

---

## 2. Test Coverage Summary

### Normalization Suite (`normalization.test.ts`)
- **gnomAD ID Parsing**: Tests valid `11-5227002-T-A`, `chrX-123456-A-G`, and malformed strings.
- **Genomic HGVS Parsing**: Tests `NC_000011.10:g.5227002T>A` and short `g.1000A>C` forms.
- **RefSeq Chromosome Inference**: Tests `NC_000011` → 11, `NC_000023` → X, `NC_000024` → Y.
- **rsID Detection**: Tests `rs334`, `RS28934578`, and invalid numeric strings.
- **Protein Notation**: Tests single-letter (`E6V`) and three-letter (`p.Glu6Val`, `p.Arg175His`) parsing.
- **Genome Build Routing**: Verifies GRCh38 maps to `gnomad_r4` and GRCh37 maps to `gnomad_r2_1`.
- **4 Resolution Paths**: Verifies resolution behavior across gnomAD ID, genomic HGVS, rsID, and fallback paths.

### Provider Suite (`providers.test.ts`)
- **Envelope Builders**: Tests `providerSuccess`, `providerNoResult`, and `providerError` envelope generation.
- **Timestamping**: Verifies ISO 8601 `retrievedAt` timestamp formatting.
- **Error Classification**: Tests `timeout`, `unavailable`, `unsupported_variant`, and `error` statuses.
- **Orchestrator Resilience**: Verifies orchestrator handles empty/invalid inputs without throwing exceptions.

### Variant Engine Suite (`variantEngine.test.ts`)
- **Amino Acid Comparison**: Tests charge shift, polarity shift, and hydropathy delta calculations.
- **Evidence Scoring**: Tests score calculation across 5 quality metrics.
- **Markdown Report Generation**: Verifies report output contains required sections, provenance headers, and responsible scope disclaimers.

---

## 3. Running Automated Tests

Run the complete test suite from repository root:

```bash
npm run test --workspace apps/variantvision-pro
```

Run tests in watch mode during development:

```bash
npx vitest apps/variantvision-pro
```
