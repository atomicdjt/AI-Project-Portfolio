/**
 * Provider type system for VariantVision Pro.
 *
 * Every external data source returns results wrapped in a ProviderResult
 * envelope that preserves provenance, retrieval status, and error
 * classification. This ensures the UI can always distinguish between
 * "no evidence found" and "source unavailable."
 */

export type ProviderName = 'clinvar' | 'uniprot' | 'pubmed' | 'gnomad'

export type RetrievalStatus =
  | 'success'
  | 'no_result'
  | 'error'
  | 'timeout'
  | 'unavailable'
  | 'unsupported_variant'

export interface ProviderResult<T> {
  provider: ProviderName
  status: RetrievalStatus
  data: T | null
  error: string | null
  retrievedAt: string // ISO 8601
  variantIdUsed: string
  sourceUrl: string | null
  warnings: string[]
  durationMs: number
}

export function providerSuccess<T>(
  provider: ProviderName,
  data: T,
  meta: { variantIdUsed: string; sourceUrl: string | null; durationMs: number; warnings?: string[] },
): ProviderResult<T> {
  return {
    provider,
    status: 'success',
    data,
    error: null,
    retrievedAt: new Date().toISOString(),
    variantIdUsed: meta.variantIdUsed,
    sourceUrl: meta.sourceUrl,
    warnings: meta.warnings ?? [],
    durationMs: meta.durationMs,
  }
}

export function providerNoResult(
  provider: ProviderName,
  meta: { variantIdUsed: string; durationMs: number },
): ProviderResult<never> {
  return {
    provider,
    status: 'no_result',
    data: null,
    error: null,
    retrievedAt: new Date().toISOString(),
    variantIdUsed: meta.variantIdUsed,
    sourceUrl: null,
    warnings: [],
    durationMs: meta.durationMs,
  }
}

export function providerError(
  provider: ProviderName,
  status: 'error' | 'timeout' | 'unavailable' | 'unsupported_variant',
  error: string,
  meta: { variantIdUsed: string; durationMs: number },
): ProviderResult<never> {
  return {
    provider,
    status,
    data: null,
    error,
    retrievedAt: new Date().toISOString(),
    variantIdUsed: meta.variantIdUsed,
    sourceUrl: null,
    warnings: [],
    durationMs: meta.durationMs,
  }
}

// --- ClinVar response types ---

export interface ClinVarClassification {
  clinicalSignificance: string
  reviewStatus: string
  reviewStars: number
  conditions: string[]
  submissionCount: number
  lastEvaluated: string | null
}

export interface ClinVarResult {
  variationId: string
  title: string
  classifications: ClinVarClassification[]
  geneSymbol: string | null
  url: string
}

// --- UniProt response types ---

export interface UniProtResult {
  accession: string
  proteinName: string
  geneName: string | null
  organism: string
  function: string | null
  subcellularLocation: string | null
  reviewStatus: 'reviewed' | 'unreviewed'
  url: string
}

// --- PubMed response types ---

export interface PubMedArticle {
  pmid: string
  title: string
  journal: string
  year: number
  authors: string[]
  url: string
}

export interface PubMedResult {
  query: string
  totalResults: number
  articles: PubMedArticle[]
}

// --- Provider health summary ---

export interface ProviderHealth {
  provider: ProviderName
  status: RetrievalStatus
  durationMs: number
  error: string | null
  retrievedAt: string
}

export interface OrchestratorResult {
  clinvar: ProviderResult<ClinVarResult>
  uniprot: ProviderResult<UniProtResult>
  pubmed: ProviderResult<PubMedResult>
  health: ProviderHealth[]
  totalDurationMs: number
}
