# VariantVision Pro — Data Sources & Integration Strategy

VariantVision Pro integrates evidence from authoritative scientific databases. This document details each data source, API protocol, authentication requirements, normalization handling, and provenance guarantees.

---

## Data Source Matrix

| Source | Integration Mode | Endpoint / Protocol | Auth Required | Provenance Guarantee | Reliability Mechanism |
|---|---|---|---|---|---|
| **ClinVar** | Live REST API | NCBI E-utilities (`esearch` + `esummary`) | None (Public) | Versioned Variation ID, Submission Count, Star Rating | 10s Timeout, Graceful fallback to fixture |
| **UniProt** | Live REST API | UniProt REST (`rest.uniprot.org`) | None (Public) | Accession ID, Review Status (Swiss-Prot), Function | 10s Timeout, Graceful fallback to fixture |
| **PubMed** | Live REST API | Direct NCBI ESearch + `/api/pubmed` relay to NCBI ESummary | None (Public) | PMID, Title, Journal, Year, URL | App timeout 8s; relay timeout 7s; attributed fallback |
| **gnomAD** | Curated Fixture + Direct Link | gnomAD v4 / v2.1.1 Browser Routing | None | Dataset label, Build-specific VCF ID | Direct URL deep-link routing |

---

## Provider Details

### 1. NCBI ClinVar
- **Purpose**: Curated clinical assertions and variation records.
- **Data Retrieved**: Clinical significance (Pathogenic, Benign, VUS), review status (e.g. `criteria provided, single submitter`), review stars (0–4), conditions, submission count, variation ID.
- **Identifier**: dbSNP rsID (`rs334`, `rs28934578`, `rs113488022`).
- **Identity Check**: An rsID can include multiple alleles and compound records. Only one exact SNV record matching assembly, locus and alleles is selected. Germline, clinical-impact and oncogenicity assertions remain separate.
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

## Verified Teaching Coordinates

| Case | GRCh38 | GRCh37 | Coordinate source |
|---|---|---|---|
| HBB E6V / HGVS p.Glu7Val | `11-5227002-T-A` | `11-5248232-T-A` | [ClinVar 15333](https://www.ncbi.nlm.nih.gov/clinvar/variation/15333/) |
| TP53 R175H | `17-7675088-C-T` | `17-7578406-C-T` | [ClinVar 12374](https://www.ncbi.nlm.nih.gov/clinvar/variation/12374/) |
| BRAF V600E | `7-140753336-A-T` | `7-140453136-A-T` | [ClinVar 13961](https://www.ncbi.nlm.nih.gov/clinvar/variation/13961/) |

Primary chromosome accession versions come from the [GRCh37.p13 assembly report](https://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/001/405/GCF_000001405.25_GRCh37.p13/GCF_000001405.25_GRCh37.p13_assembly_report.txt) and [GRCh38.p14 assembly report](https://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/001/405/GCF_000001405.40_GRCh38.p14/GCF_000001405.40_GRCh38.p14_assembly_report.txt). This supports the named teaching cases and primary chromosome RefSeq versions; it is not a general liftover service.

Population rows are illustrative, independently denominated teaching fixtures. Their counts are not verified observations from a particular gnomAD release. The summary shows the maximum row AF and its matching group; it never pools exome/genome or ancestry rows.

All six curated literature leads were checked against NCBI PubMed metadata on 2026-10-12. The HBB sources are [Rees et al., 2010](https://pubmed.ncbi.nlm.nih.gov/21131035/) and [Sundd et al., 2019](https://pubmed.ncbi.nlm.nih.gov/30332562/). Curated metadata verification is distinct from a live search and from scientific endorsement of a dossier.
