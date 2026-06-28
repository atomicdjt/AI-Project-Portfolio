export type GenomeBuild = 'GRCh37' | 'GRCh38'

export type EvidenceStatus = 'ready' | 'partial' | 'review' | 'missing'

export type EvidenceWeight = 'high' | 'moderate' | 'supporting' | 'context'

export type SourceKind = 'Normalization' | 'Population' | 'Curated database' | 'Protein' | 'Structure' | 'Literature'

export type AminoAcidCode =
  | 'A'
  | 'R'
  | 'N'
  | 'D'
  | 'C'
  | 'Q'
  | 'E'
  | 'G'
  | 'H'
  | 'I'
  | 'L'
  | 'K'
  | 'M'
  | 'F'
  | 'P'
  | 'S'
  | 'T'
  | 'W'
  | 'Y'
  | 'V'

export interface VariantInput {
  gene: string
  variant: string
  hgvs: string
  gnomadId: string
  build: GenomeBuild
  condition: string
}

export interface AminoAcidProfile {
  code: AminoAcidCode
  name: string
  polarity: 'nonpolar' | 'polar' | 'acidic' | 'basic'
  charge: 'negative' | 'neutral' | 'positive'
  size: 'small' | 'medium' | 'large'
  hydropathy: number
}

export interface SourceRecord {
  id: string
  kind: SourceKind
  label: string
  source: string
  status: EvidenceStatus
  weight: EvidenceWeight
  detail: string
  url?: string
  lastReviewed: string
}

export interface PopulationRecord {
  source: 'exome' | 'genome'
  group: string
  alleleCount: number
  alleleNumber: number
  homozygotes: number
}

export interface LiteratureRecord {
  id: string
  title: string
  journal: string
  year: number
  role: 'mechanism' | 'clinical context' | 'methodology' | 'population context'
  url: string
}

export interface VariantCase extends VariantInput {
  id: string
  title: string
  summary: string
  transcript: string
  protein: string
  uniprot: string
  rsid: string
  originalAa: AminoAcidCode
  replacementAa: AminoAcidCode
  position: number
  population: PopulationRecord[]
  clinvarDirection: string
  structuralContext: string
  literature: LiteratureRecord[]
  sourceRecords: SourceRecord[]
}

export interface NormalizedVariant {
  input: VariantInput
  dataset: string
  datasetId: string
  vcfId: string | null
  spdi: string | null
  browserUrl: string | null
  parsedFrom: 'gnomAD ID' | 'genomic HGVS' | 'known teaching example' | 'manual review required'
  note: string
}

export interface AminoAcidComparison {
  original: AminoAcidProfile
  replacement: AminoAcidProfile
  chargeShift: string
  polarityShift: string
  hydropathyDelta: number
  interpretation: string
}

export interface EvidenceMetric {
  label: string
  score: number
  status: EvidenceStatus
  explanation: string
}

export interface EvidenceDossier {
  caseId: string
  headline: string
  generatedAt: string
  input: VariantInput
  normalized: NormalizedVariant
  aminoAcid: AminoAcidComparison
  populationSummary: {
    totalAlleles: number
    totalAltAlleles: number
    estimatedFrequency: number
    highestGroup: string
  }
  evidenceScore: number
  confidenceBand: 'Strong research dossier' | 'Usable with review' | 'Incomplete dossier'
  metrics: EvidenceMetric[]
  sourceRecords: SourceRecord[]
  literature: LiteratureRecord[]
  responsibleBoundary: string
}
