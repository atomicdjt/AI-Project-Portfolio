/**
 * PubMed provider adapter.
 *
 * Uses NCBI E-utilities (esearch + esummary) to search for literature leads by gene and variant terms.
 * Public, CORS-friendly REST API.
 */

import type { ProviderResult, PubMedArticle, PubMedResult } from './types'
import { providerError, providerNoResult, providerSuccess } from './types'

const EUTILS_BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils'
const TOOL = 'variantvision-pro'
const EMAIL = 'variantvision@example.com'
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
    const term = encodeURIComponent(`${searchQuery}[Title/Abstract] OR ${cleanGene}[Gene]`)
    const searchUrl = `${EUTILS_BASE}/esearch.fcgi?db=pubmed&term=${term}&retmax=5&sort=pub_date&retmode=json&tool=${TOOL}&email=${EMAIL}`

    const searchRes = await fetch(searchUrl, { signal: controller.signal })
    if (!searchRes.ok) {
      return providerError('pubmed', 'error', `PubMed esearch returned HTTP ${searchRes.status}`, {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const searchData = await searchRes.json()
    const idList: string[] = searchData?.esearchresult?.idlist ?? []
    const totalCount = Number(searchData?.esearchresult?.count ?? idList.length)

    if (idList.length === 0) {
      return providerNoResult('pubmed', {
        variantIdUsed: searchQuery,
        durationMs: Math.round(performance.now() - start),
      })
    }

    const ids = idList.join(',')
    const summaryUrl = `${EUTILS_BASE}/esummary.fcgi?db=pubmed&id=${ids}&retmode=json&tool=${TOOL}&email=${EMAIL}`
    const summaryRes = await fetch(summaryUrl, { signal: controller.signal })

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
      const year = yearMatch ? Number(yearMatch[0]) : new Date().getFullYear()

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
