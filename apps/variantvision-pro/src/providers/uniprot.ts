/**
 * UniProt provider adapter.
 *
 * Fetches protein metadata from the public UniProt REST API by UniProt Accession.
 * The UniProt API is CORS-enabled, public, and requires no API key.
 *
 * Reference: https://www.uniprot.org/help/api
 */

import type { ProviderResult, UniProtResult } from './types'
import { providerError, providerNoResult, providerSuccess } from './types'

const UNIPROT_BASE = 'https://rest.uniprot.org/uniprotkb'
const DEFAULT_TIMEOUT_MS = 10_000

export async function fetchUniProt(
  accession: string,
  expectedGene: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProviderResult<UniProtResult>> {
  const start = performance.now()
  const cleanAccession = accession.trim().toUpperCase()

  if (!cleanAccession || !/^[A-Z0-9]{6,10}$/.test(cleanAccession)) {
    return providerError('uniprot', 'unsupported_variant', `Invalid UniProt accession: ${accession}`, {
      variantIdUsed: cleanAccession,
      durationMs: Math.round(performance.now() - start),
    })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const url = `${UNIPROT_BASE}/${cleanAccession}.json`
    const res = await fetch(url, { signal: controller.signal })

    if (res.status === 404) {
      return providerNoResult('uniprot', {
        variantIdUsed: cleanAccession,
        durationMs: Math.round(performance.now() - start),
      })
    }

    if (!res.ok) {
      return providerError('uniprot', 'error', `UniProt returned HTTP ${res.status}`, {
        variantIdUsed: cleanAccession,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const data = await res.json()
    if (!data || typeof data !== 'object' || Array.isArray(data) || (data.primaryAccession && data.primaryAccession !== cleanAccession)) {
      return providerError('uniprot', 'error', 'UniProt returned malformed metadata or a different accession.', { variantIdUsed: cleanAccession, durationMs: Math.round(performance.now() - start) })
    }

    const proteinNameValue =
      data?.proteinDescription?.recommendedName?.fullName?.value ??
      data?.proteinDescription?.submissionNames?.[0]?.fullName?.value ??
      `UniProt Entry ${cleanAccession}`
    const proteinName = typeof proteinNameValue === 'string' ? proteinNameValue : `UniProt Entry ${cleanAccession}`

    const geneValue = data?.genes?.[0]?.geneName?.value
    const geneName = typeof geneValue === 'string' ? geneValue : null
    const organismValue = data?.organism?.scientificName
    const organism = typeof organismValue === 'string' ? organismValue : 'Unknown organism'

    const warnings: string[] = []
    if (!geneName) warnings.push('UniProt did not return a gene symbol; gene identity could not be confirmed.')
    if (geneName && expectedGene && geneName.toUpperCase() !== expectedGene.toUpperCase()) {
      warnings.push(`Warning: UniProt gene (${geneName}) does not match expected gene (${expectedGene}).`)
    }
    if (!['homo sapiens', 'human'].includes(organism.trim().toLowerCase())) {
      warnings.push(`Warning: UniProt organism is ${organism}, expected Human.`)
    }

    // Extract primary function comment
    let functionComment: string | null = null
    if (Array.isArray(data?.comments)) {
      const funcObj = data.comments.find((c: { commentType: string }) => c.commentType === 'FUNCTION')
      if (funcObj?.texts?.[0]?.value) {
        functionComment = funcObj.texts[0].value
      }
    }

    // Extract subcellular location
    let subLoc: string | null = null
    if (Array.isArray(data?.comments)) {
      const locObj = data.comments.find((c: { commentType: string }) => c.commentType === 'SUBCELLULAR LOCATION')
      if (locObj?.subcellularLocations?.[0]?.location?.value) {
        subLoc = locObj.subcellularLocations[0].location.value
      }
    }

    const reviewStatus = data?.entryType === 'UniProtKB reviewed (Swiss-Prot)' ? 'reviewed' : 'unreviewed'
    const entryUrl = `https://www.uniprot.org/uniprotkb/${cleanAccession}/entry`

    return providerSuccess(
      'uniprot',
      {
        accession: cleanAccession,
        proteinName,
        geneName,
        organism,
        function: functionComment,
        subcellularLocation: subLoc,
        reviewStatus,
        url: entryUrl,
      },
      {
        variantIdUsed: cleanAccession,
        sourceUrl: entryUrl,
        durationMs: Math.round(performance.now() - start),
        warnings,
      },
    )
  } catch (err: unknown) {
    const duration = Math.round(performance.now() - start)
    if (err instanceof DOMException && err.name === 'AbortError') {
      return providerError('uniprot', 'timeout', `UniProt request timed out after ${timeoutMs}ms`, {
        variantIdUsed: cleanAccession,
        durationMs: duration,
      })
    }
    return providerError('uniprot', 'unavailable', `UniProt request failed: ${String(err)}`, {
      variantIdUsed: cleanAccession,
      durationMs: duration,
    })
  } finally {
    clearTimeout(timer)
  }
}
