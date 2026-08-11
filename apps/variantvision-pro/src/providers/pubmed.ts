/**
 * PubMed provider adapter.
 *
 * Uses NCBI E-utilities (esearch + esummary) to search for literature leads by gene and variant terms.
 * Public, CORS-friendly REST API.
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

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const exactTerm = encodeURIComponent(`"${cleanGene}"[Title/Abstract] AND "${cleanVariant}"[Title/Abstract]`)
    let searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pubmed&term=${exactTerm}&retmax=5&sort=pub_date&retmode=json`

    let searchRes = await fetchNcbi(searchUrl, { signal: controller.signal })
    if (!searchRes.ok) {
      return providerError('pubmed', 'error', `PubMed esearch returned HTTP ${searchRes.status}`, {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    let searchData = await searchRes.json()
    let idList: string[] = searchData?.esearchresult?.idlist ?? []
    let totalCount = Number(searchData?.esearchresult?.count ?? idList.length)
    const warnings: string[] = []

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
      idList = searchData?.esearchresult?.idlist ?? []
      totalCount = Number(searchData?.esearchresult?.count ?? idList.length)
    }

    if (idList.length === 0) {
      return providerNoResult('pubmed', {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const ids = idList.join(',')
    const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`
    const summaryRes = await fetchNcbi(summaryUrl, { signal: controller.signal })

    if (!summaryRes.ok) {
      return providerError('pubmed', 'error', `PubMed esummary returned HTTP ${summaryRes.status}`, {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const summaryData = await summaryRes.json()
    const resultObj = summaryData?.result ?? {}

    const articles: PubMedArticle[] = []
    for (const id of idList) {
      const item = resultObj[id]
      if (!item) continue

      const pubDate = item.pubdate ?? ''
      const yearMatch = String(pubDate).match(/\b(19|20)\d{2}\b/)
      const year = yearMatch ? Number(yearMatch[0]) : null

      const authors = Array.isArray(item.authors)
        ? item.authors.map((a: { name?: string }) => a.name ?? '').filter(Boolean)
        : []

      articles.push({
        pmid: id,
        title: item.title ?? 'Untitled Article',
        journal: item.source ?? 'PubMed',
        year,
        authors,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      })
    }

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
