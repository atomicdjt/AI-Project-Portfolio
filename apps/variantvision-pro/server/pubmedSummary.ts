import { createRequestScheduler } from '../src/providers/requestScheduler'
import process from 'node:process'

const schedule = createRequestScheduler(350)
const upstreamBase = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'

export async function getPubMedSummary(requestUrl: string, method: string, fetcher: typeof fetch = fetch): Promise<{ status: number; body: unknown }> {
  if (method !== 'GET') return { status: 405, body: { error: 'Only GET is supported.' } }
  const ids = new URL(requestUrl, 'http://localhost').searchParams.get('ids')?.split(',') ?? []
  if (ids.length < 1 || ids.length > 5 || ids.some((id) => !/^\d{1,12}$/.test(id)) || new Set(ids).size !== ids.length) {
    return { status: 400, body: { error: 'Provide one to five unique numeric PubMed IDs.' } }
  }
  const upstream = new URL(upstreamBase)
  upstream.searchParams.set('db', 'pubmed')
  upstream.searchParams.set('id', ids.join(','))
  upstream.searchParams.set('retmode', 'json')
  upstream.searchParams.set('tool', 'variantvision-pro')
  if (process.env.NCBI_EMAIL) upstream.searchParams.set('email', process.env.NCBI_EMAIL)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 7000)
  try {
    await schedule(controller.signal)
    const response = await fetcher(upstream, { signal: controller.signal, headers: { Accept: 'application/json' } })
    if (!response.ok) return { status: 502, body: { error: `NCBI PubMed summary returned HTTP ${response.status}.` } }
    const body: unknown = await response.json()
    if (typeof body !== 'object' || body === null || !('result' in body)) return { status: 502, body: { error: 'NCBI returned an unreadable PubMed summary.' } }
    return { status: 200, body }
  } catch (error) {
    return { status: controller.signal.aborted ? 504 : 502, body: { error: error instanceof Error && error.name === 'AbortError' ? 'NCBI PubMed summary timed out.' : 'NCBI PubMed summary could not be retrieved.' } }
  } finally {
    clearTimeout(timer)
  }
}
