/**
 * PubMed provider adapter.
 *
 * Uses NCBI E-utilities (esearch + esummary) to search for literature leads by gene and variant terms.
 * Browser access depends on NCBI availability and CORS response headers.
 */

import type { ProviderResult, PubMedArticle, PubMedResult } from './types'
import { providerError, providerNoResult, providerSuccess } from './types'
import { fetchNcbi } from './ncbi'

const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const DEFAULT_TIMEOUT_MS = 10_000

export async function fetchPubMed(
  gene: string,
  variant: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<ProviderResult<PubMedResult>> {
  const start = performance.now()
  const cleanGene = gene.trim().toUpperCase()
  const cleanVariant = variant.trim()
  const searchQuery = `${cleanGene} ${cleanVariant}`.trim()

  if (!cleanGene) {
    return providerError('pubmed', 'unsupported_variant', 'Gene name required for PubMed search', {
      variantIdUsed: searchQuery,
      durationMs: Math.round(performance.now() - start),
    })
  }
  if (!/^[A-Z0-9][A-Z0-9._-]{0,39}$/.test(cleanGene) || cleanVariant.length > 120 || [...cleanVariant].some((character) => character.charCodeAt(0) < 32)) {
    return providerError('pubmed', 'unsupported_variant', 'Use a gene symbol and a short variant term for the literature query.', { variantIdUsed: searchQuery, durationMs: 0 })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const exactTerm = encodeURIComponent(cleanVariant ? `"${cleanGene}"[Title/Abstract] AND "${cleanVariant}"[Title/Abstract]` : `"${cleanGene}"[Title/Abstract]`)
    let searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pubmed&term=${exactTerm}&retmax=5&sort=pub_date&retmode=json`

    let searchRes = await fetchNcbi(searchUrl, { signal: controller.signal })
    if (!searchRes.ok) {
      return providerError('pubmed', 'error', `PubMed esearch returned HTTP ${searchRes.status}`, {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    let searchData = await searchRes.json()
    let idList: string[] = Array.isArray(searchData?.esearchresult?.idlist) ? searchData.esearchresult.idlist.filter((id: unknown): id is string => typeof id === 'string' && /^\d+$/.test(id)).slice(0, 5) : []
    let totalCount = Number(searchData?.esearchresult?.count ?? idList.length)
    if (!Number.isFinite(totalCount) || totalCount < 0) totalCount = idList.length
    const warnings: string[] = []
    if (!cleanVariant) warnings.push('No variant term supplied; these are gene-level literature leads.')

    if (idList.length === 0) {
      warnings.push('No exact gene+variant Title/Abstract matches were found; results come from a broader gene-level literature search and may not describe the exact variant.')
      const term = encodeURIComponent(`${searchQuery}[Title/Abstract] OR ${cleanGene}[Gene]`)
      searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pubmed&term=${term}&retmax=5&sort=pub_date&retmode=json`
      searchRes = await fetchNcbi(searchUrl, { signal: controller.signal })
      if (!searchRes.ok) {
        return providerError('pubmed', 'error', `PubMed esearch returned HTTP ${searchRes.status}`, {
          variantIdUsed: searchQuery,
          durationMs: Math.round(performance.now() - start),
        })
      }
      searchData = await searchRes.json()
      idList = Array.isArray(searchData?.esearchresult?.idlist) ? searchData.esearchresult.idlist.filter((id: unknown): id is string => typeof id === 'string' && /^\d+$/.test(id)).slice(0, 5) : []
      totalCount = Number(searchData?.esearchresult?.count ?? idList.length)
      if (!Number.isFinite(totalCount) || totalCount < 0) totalCount = idList.length
    }

    if (idList.length === 0) {
      return providerNoResult('pubmed', {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const ids = idList.join(',')
    const summaryUrl = `/api/pubmed?ids=${encodeURIComponent(ids)}`
    const summaryRes = await fetchNcbi(summaryUrl, { signal: controller.signal })

    if (!summaryRes.ok) {
      return providerError('pubmed', summaryRes.status === 504 ? 'timeout' : 'error', `PubMed metadata endpoint returned HTTP ${summaryRes.status}`, {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const summaryData = await summaryRes.json()
    const resultObj = summaryData?.result ?? {}

    const articles: PubMedArticle[] = []
    for (const id of idList) {
      const item = resultObj[id]
      if (!item || typeof item.title !== 'string') continue

      const pubDate = item.pubdate ?? ''
      const yearMatch = String(pubDate).match(/\b(19|20)\d{2}\b/)
      const year = yearMatch ? Number(yearMatch[0]) : null

      const authors = Array.isArray(item.authors)
        ? item.authors.map((a: { name?: unknown }) => typeof a?.name === 'string' ? a.name : '').filter(Boolean)
        : []

      articles.push({
        pmid: id,
        title: item.title,
        journal: typeof item.source === 'string' ? item.source : 'PubMed',
        year,
        authors,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      })
    }

    if (articles.length === 0) return providerNoResult('pubmed', {
      variantIdUsed: searchQuery, durationMs: Math.round(performance.now() - start),
      warnings: [...warnings, 'Search returned PMIDs, but no readable article summaries were returned.'],
      sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchQuery)}`,
    })

    return providerSuccess(
      'pubmed',
      {
        query: searchQuery,
        totalResults: totalCount,
        articles,
      },
      {
        variantIdUsed: searchQuery,
        sourceUrl: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchQuery)}`,
        durationMs: Math.round(performance.now() - start),
        warnings,
      },
    )
  } catch (err: unknown) {
    const duration = Math.round(performance.now() - start)
    if (err instanceof DOMException && err.name === 'AbortError') {
      return providerError('pubmed', 'timeout', `PubMed request timed out after ${timeoutMs}ms`, {
        variantIdUsed: searchQuery,
        durationMs: duration,
      })
    }
    return providerError('pubmed', 'unavailable', `PubMed request failed: ${String(err)}`, {
      variantIdUsed: searchQuery,
      durationMs: duration,
    })
  } finally {
    clearTimeout(timer)
  }
}
