/**
 * ClinVar provider adapter.
 *
 * Uses NCBI E-utilities (esearch + esummary) to fetch variant classifications
 * from ClinVar by rsID. The E-utilities API is public, CORS-friendly, and
 * does not require an API key for modest request rates (<3 req/s without key).
 *
 * NCBI requests that users provide a tool name and email for identification.
 * We use generic values since this is an educational tool, not a production
 * clinical system.
 *
 * Reference: https://www.ncbi.nlm.nih.gov/clinvar/docs/maintenance_use/
 */

import type { ClinVarClassification, ClinVarResult, ProviderResult } from './types'
import { providerError, providerNoResult, providerSuccess } from './types'

const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const TOOL = 'variantvision-pro'
const EMAIL = 'variantvision@example.com'
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

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    // Step 1: esearch — find ClinVar variation IDs for this rsID
    const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=clinvar&term=${variantIdUsed}[variant+id]&retmode=json&tool=${TOOL}&email=${EMAIL}`
    const searchRes = await fetch(searchUrl, { signal: controller.signal })

    if (!searchRes.ok) {
      return providerError('clinvar', 'error', `ClinVar esearch returned HTTP ${searchRes.status}`, {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const searchData = await searchRes.json()
    const idList: string[] = searchData?.esearchresult?.idlist ?? []

    if (idList.length === 0) {
      return providerNoResult('clinvar', {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    // Step 2: esummary — fetch classification details
    const ids = idList.slice(0, 5).join(',')
    const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=clinvar&id=${ids}&retmode=json&tool=${TOOL}&email=${EMAIL}`
    const summaryRes = await fetch(summaryUrl, { signal: controller.signal })

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

    // Parse classifications from the first variation
    const firstId = idList[0]
    const variation = result[firstId]
    if (!variation) {
      return providerNoResult('clinvar', {
        variantIdUsed,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const classifications: ClinVarClassification[] = []

    // ClinVar esummary returns clinical_significance and supporting_submissions
    const clinSig = variation.clinical_significance?.description ?? variation.germline_classification?.description ?? ''
    const reviewStatus = variation.clinical_significance?.review_status ?? variation.germline_classification?.review_status ?? ''
    const lastEval = variation.clinical_significance?.last_evaluated ?? variation.germline_classification?.last_evaluated ?? null

    if (clinSig) {
      classifications.push({
        clinicalSignificance: clinSig,
        reviewStatus,
        reviewStars: reviewStarsFromStatus(reviewStatus),
        conditions: extractConditions(variation),
        submissionCount: typeof variation.supporting_submissions?.scv === 'number'
          ? variation.supporting_submissions.scv
          : (Array.isArray(variation.supporting_submissions?.scv) ? variation.supporting_submissions.scv.length : 0),
        lastEvaluated: lastEval || null,
      })
    }

    const variationId = String(firstId)
    const url = `https://www.ncbi.nlm.nih.gov/clinvar/variation/${variationId}/`
    const geneSymbol = extractGeneSymbol(variation)
    const title = variation.title ?? `ClinVar Variation ${variationId}`

    const warnings: string[] = []
    if (classifications.length === 0) {
      warnings.push('ClinVar record found but no classification could be extracted from the response.')
    }

    return providerSuccess('clinvar', {
      variationId,
      title,
      classifications,
      geneSymbol,
      url,
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
      return traits.map((t) => t.trait_name ?? 'Unknown condition').filter(Boolean)
    }
    // Alternative structure
    const traitNames = variation.trait_name as string | undefined
    if (traitNames) return [traitNames]
  } catch {
    // Silently return empty — provenance is more important than parsing every edge case
  }
  return []
}

function extractGeneSymbol(variation: Record<string, unknown>): string | null {
  try {
    const genes = variation.genes as Array<{ symbol?: string }> | undefined
    if (Array.isArray(genes) && genes.length > 0) {
      return genes[0].symbol ?? null
    }
  } catch {
    // Non-critical
  }
  return null
}
