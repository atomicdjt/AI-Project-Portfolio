# VariantVision Pro — Scientific and Technical Limitations

VariantVision Pro is explicitly designed as an educational bioinformatics evidence workbench and research triage interface. It is **not** a clinical diagnostic system or automated interpretation engine.

This document details the scientific, technical, and data limitations of the implementation.

---

## 1. Responsible Scientific Boundaries

1. **No Diagnostic Claims**: VariantVision Pro does not issue patient-specific diagnoses, clinical interpretations, or treatment recommendations.
2. **No ACMG/AMP Classification**: The software does not compute automated 2015 ACMG/AMP clinical classifications (PVS1, PS1-4, PM1-6, PP1-5, BA1, BS1-4, BP1-7).
3. **No Automated Pathogenicity Assignment**: ClinVar classifications shown are attributed to ClinVar submitters and must be independently evaluated by qualified medical geneticists or molecular pathologists.

---

## 2. Technical and Algorithmic Limitations

1. **Variant Normalization Scope**:
   - **Local Normalization**: Handles gnomAD-style VCF IDs (`11-5227002-T-A`), basic genomic HGVS (`NC_000011.10:g.5227002T>A`), and rsID lookups (`rs334`).
   - **Unsupported Inputs**: Does not perform full transcript-aware coding HGVS (`c.179A>T`) resolution, structural variant breakpoints, or complex indels without pre-parsed VCF coordinates.
   - **No Automated Liftover**: Build conversion between GRCh37 and GRCh38 requires explicit user build selection; coordinates are not automatically converted via CrossMap or UCSC Liftover.

2. **Population Frequency Data**:
   - Population tables use curated demo summary fixtures for demonstration cases (HBB, TP53, BRAF). Live gnomAD GraphQL query integration is documented as a manual browser link fallback due to CORS policies on gnomAD endpoints.

3. **External API Dependencies**:
   - Live calls to ClinVar, UniProt, and PubMed rely on third-party availability (NCBI E-utilities and UniProt REST).
   - If NCBI or UniProt endpoints undergo maintenance or return HTTP errors, the application falls back gracefully to curated fixtures while clearly displaying provider status degradation in the UI.

---

## 3. Recommended Research Use Flow

Always verify primary evidence before using VariantVision Pro outputs for research triage:

1. Confirm transcript accession (e.g. `NM_000518.5`) and reference genome build (GRCh37 vs GRCh38).
2. Inspect ClinVar assertion submitter criteria and star ratings directly on NCBI.
3. Review population allele frequencies in disease-relevant cohort context.
4. Read primary literature citations retrieved from PubMed.
