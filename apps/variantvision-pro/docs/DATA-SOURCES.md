# VariantVision Pro — Data Sources & Integration Strategy

VariantVision Pro integrates evidence from authoritative scientific databases. This document details each data source, API protocol, authentication requirements, normalization handling, and provenance guarantees.

---

## Data Source Matrix

| Source | Integration Mode | Endpoint / Protocol | Auth Required | Provenance Guarantee | Reliability Mechanism |
|---|---|---|---|---|---|
| **ClinVar** | Live REST API | NCBI E-utilities (`esearch` + `esummary`) | None (Public) | Versioned Variation ID, Submission Count, Star Rating | 10s Timeout, Graceful fallback to fixture |
| **UniProt** | Live REST API | UniProt REST (`rest.uniprot.org`) | None (Public) | Accession ID, Review Status (Swiss-Prot), Function | 10s Timeout, Graceful fallback to fixture |
| **PubMed** | Live REST API | NCBI E-utilities (`esearch` + `esummary`) | None (Public) | PMID, Title, Journal, Year, URL | 10s Timeout, Graceful fallback to fixture |
| **gnomAD** | Curated Fixture + Direct Link | gnomAD v4 / v2.1.1 Browser Routing | None | Dataset label, Build-specific VCF ID | Direct URL deep-link routing |

---

## Provider Details

### 1. NCBI ClinVar
- **Purpose**: Curated clinical assertions and variation records.
- **Data Retrieved**: Clinical significance (Pathogenic, Benign, VUS), review status (e.g. `criteria provided, single submitter`), review stars (0–4), conditions, submission count, variation ID.
- **Identifier**: dbSNP rsID (`rs334`, `rs28934578`, `rs113488022`).
- **User Attribution**: Displays explicit ClinVar variation link (`ncbi.nlm.nih.gov/clinvar/variation/<id>/`).

### 2. UniProtKB
- **Purpose**: Human protein function, domain mapping, and subcellular localization.
- **Data Retrieved**: Recommended protein name, gene symbol, organism, functional summary, subcellular location, review status (Swiss-Prot vs TrEMBL).
- **Identifier**: UniProt Accession (`P68871`, `P04637`, `P15056`).
- **User Attribution**: Displays direct link to UniProt entry (`uniprot.org/uniprotkb/<accession>/entry`).

### 3. PubMed (NCBI Literature)
- **Purpose**: Primary literature leads for human review.
- **Data Retrieved**: Article PMID, title, journal, publication year, author list.
- **Identifier**: Gene symbol + protein change query (`HBB E6V`, `TP53 R175H`, `BRAF V600E`).
- **User Attribution**: Displays direct PMID link (`pubmed.ncbi.nlm.nih.gov/<pmid>/`).

### 4. gnomAD (Genome Aggregation Database)
- **Purpose**: Population allele frequencies and ancestry stratification.
- **Data Retrieved**: Curated demo allele counts (AC), allele numbers (AN), homozygote counts across ancestry groups (AFR, AMR, NFE, Global).
- **Identifier**: VCF-style coordinate string (`11-5227002-T-A`, `17-7675088-C-T`, `7-140753336-A-T`).
- **Build Routing**:
  - **GRCh38** → gnomAD v4 dataset (`gnomad_r4`)
  - **GRCh37** → gnomAD v2.1.1 dataset (`gnomad_r2_1`)
