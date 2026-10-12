/**
 * ClinVar provider adapter.
 *
 * Uses NCBI E-utilities (esearch + esummary) to fetch variant classifications
 * from ClinVar by rsID. Browser access depends on upstream CORS headers, and
 * does not require an API key for modest request rates (<3 req/s without key).
 *
 * NCBI requests that users provide a tool name and email for identification.
 * The client sends a tool name and an optional configured contact email.
 *
 * Reference: https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/
 */

import type { ClinVarClassification, ClinVarExpectedVariant, ClinVarResult, ProviderResult } from './types'
import { providerError, providerNoResult, providerSuccess } from './types'
import { fetchNcbi } from './ncbi'
import { asRecord, matchesClinVarAllele } from './clinvarMatch'

const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const DEFAULT_TIMEOUT_MS = 10_000

function reviewStarsFromStatus(status: string): number {
  const lower = status.toLowerCase()
  if (lower.includes('practice guideline')) return 4
  if (lower.includes('reviewed by expert panel')) return 3
  if (lower.includes('criteria provided, multiple submitters')) return 2
  if (lower.includes('criteria provided, single submitter')) return 1
  if (lower.includes('criteria provided, conflicting')) return 1
  return 0
}

/**
 * Fetches ClinVar classification data for a given rsID.
 *
 * Strategy:
 * 1. esearch: find ClinVar variation IDs matching the rsID
 * 2. esummary: retrieve classification details for each variation
 *
 * Returns a typed ProviderResult envelope.
 */
export async function fetchClinVar(
  rsId: string,
  expected?: ClinVarExpectedVariant,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProviderResult<ClinVarResult>> {
  const start = performance.now()
  const cleanRsId = rsId.trim().toLowerCase().replace(/^rs/, '')
  const variantIdUsed = `rs${cleanRsId}`

  if (!cleanRsId || !/^\d+$/.test(cleanRsId)) {
    return providerError('clinvar', 'unsupported_variant', `Invalid rsID: ${rsId}`, {
      variantIdUsed,
      durationMs: Math.round(performance.now() - start),
    })
  }

  if (!expected) {
    return providerError('clinvar', 'unsupported_variant', 'An assembly-specific genomic allele is required to select a ClinVar record safely.', {
      variantIdUsed, durationMs: Math.round(performance.now() - start),
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    // Step 1: esearch — find ClinVar variation IDs for this rsID
    const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=clinvar&term=${variantIdUsed}[variant+id]&retmax=100&retmode=json`
    const searchRes = await fetchNcbi(searchUrl, { signal: controller.signal })

    if (!searchRes.ok) {
      return providerError('clinvar', 'error', `ClinVar esearch returned HTTP ${searchRes.status}`, {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const searchData = await searchRes.json()
    const idList: string[] = Array.isArray(searchData?.esearchresult?.idlist)
      ? searchData.esearchresult.idlist.filter((id: unknown): id is string => typeof id === 'string' && /^\d+$/.test(id)) : []

    if (idList.length === 0) {
      return providerNoResult('clinvar', {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    // Step 2: esummary — fetch classification details
    const ids = idList.join(',')
    const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=clinvar&id=${ids}&retmode=json`
    const summaryRes = await fetchNcbi(summaryUrl, { signal: controller.signal })

    if (!summaryRes.ok) {
      return providerError('clinvar', 'error', `ClinVar esummary returned HTTP ${summaryRes.status}`, {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const summaryData = await summaryRes.json()
    const result = summaryData?.result
    if (!result) {
      return providerNoResult('clinvar', {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const matchingIds = idList.filter((id) => matchesClinVarAllele(result[id], expected))
    if (matchingIds.length !== 1) {
      return providerNoResult('clinvar', {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
        sourceUrl: `https://www.ncbi.nlm.nih.gov/clinvar/?term=${variantIdUsed}`,
        warnings: [matchingIds.length === 0
          ? `No single-variant ClinVar record matched ${expected.build} ${expected.gnomadId}. Compound records and other alleles were excluded; inspect the search results manually.`
          : `More than one ClinVar record matched ${expected.build} ${expected.gnomadId}; no assertion was selected automatically.`],
      })
    }
    const matchedId = matchingIds[0]
    const variation = result[matchedId]

    const classifications: ClinVarClassification[] = []

    const tracks = [
      ['germline', variation.germline_classification ?? variation.clinical_significance],
      ['somatic clinical impact', variation.clinical_impact_classification],
      ['oncogenicity', variation.oncogenicity_classification],
    ] as const
    for (const [track, value] of tracks) {
      const assertion = asRecord(value)
      if (!assertion || typeof assertion.description !== 'string' || !assertion.description) continue
      const reviewStatus = typeof assertion.review_status === 'string' ? assertion.review_status : ''
      classifications.push({
        track,
        clinicalSignificance: assertion.description,
        reviewStatus,
        reviewStars: reviewStarsFromStatus(reviewStatus),
        conditions: extractConditions(assertion),
        submissionCount: typeof variation.supporting_submissions?.scv === 'number'
          ? variation.supporting_submissions.scv
          : (Array.isArray(variation.supporting_submissions?.scv) ? variation.supporting_submissions.scv.length : 0),
        lastEvaluated: typeof assertion.last_evaluated === 'string' ? assertion.last_evaluated : null,
      })
    }

    const variationId = String(matchedId)
    const url = `https://www.ncbi.nlm.nih.gov/clinvar/variation/${variationId}/`
    const geneSymbol = expected.gene.trim().toUpperCase()
    const title = typeof variation.title === 'string' ? variation.title : `ClinVar Variation ${variationId}`

    const warnings: string[] = []
    if (idList.length > 1) {
      warnings.push(`Selected the exact single-variant allele from ${idList.length} ClinVar search records; compound records and alternate alleles were excluded.`)
    }
    if (classifications.length === 0) {
      warnings.push('ClinVar record found but no classification could be extracted from the response.')
    }

    return providerSuccess('clinvar', {
      variationId,
      title,
      classifications,
      geneSymbol,
      url,
      matchedAssembly: expected.build,
      matchedGenomicId: expected.gnomadId,
      accessionVersion: typeof variation.accession_version === 'string' ? variation.accession_version : null,
    }, {
      variantIdUsed,
      sourceUrl: url,
      durationMs: Math.round(performance.now() - start),
      warnings,
    })
  } catch (err: unknown) {
    const duration = Math.round(performance.now() - start)
    if (err instanceof DOMException && err.name === 'AbortError') {
      return providerError('clinvar', 'timeout', `ClinVar request timed out after ${timeoutMs}ms`, {
        variantIdUsed,
        durationMs: duration,
      })
    }
    return providerError('clinvar', 'unavailable', `ClinVar request failed: ${String(err)}`, {
      variantIdUsed,
      durationMs: duration,
    })
  } finally {
    clearTimeout(timer)
  }
}

function extractConditions(variation: Record<string, unknown>): string[] {
  try {
    const traits = variation.trait_set as Array<{ trait_name?: string }> | undefined
    if (Array.isArray(traits)) {
      return [...new Set(traits.map((t) => t.trait_name ?? 'Unknown condition').filter(Boolean))]
    }
    // Alternative structure
    const traitNames = variation.trait_name as string | undefined
    if (traitNames) return [traitNames]
  } catch {
    // Silently return empty — provenance is more important than parsing every edge case
  }
  return []
}
