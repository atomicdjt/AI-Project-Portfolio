import { describe, expect, it, vi } from 'vitest'
import { getPubMedSummary } from './pubmedSummary'

describe('PubMed metadata endpoint', () => {
  it('rejects arbitrary URLs, excessive IDs and non-GET requests without fetching', async () => {
    const upstream = vi.fn<typeof fetch>()
    for (const query of ['https://example.com', '1,2,3,4,5,6', '1,1', '']) {
      expect((await getPubMedSummary(`/api/pubmed?ids=${encodeURIComponent(query)}`, 'GET', upstream)).status).toBe(400)
    }
    expect((await getPubMedSummary('/api/pubmed?ids=123', 'POST', upstream)).status).toBe(405)
    expect(upstream).not.toHaveBeenCalled()
  })
  it('uses a fixed NCBI database and preserves article metadata', async () => {
    const body = { result: { '123': { title: 'Synthetic metadata' } } }
    const upstream = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify(body)))
    const result = await getPubMedSummary('/api/pubmed?ids=123&url=https://example.com', 'GET', upstream)
    expect(result).toEqual({ status: 200, body })
    const url = new URL(String(upstream.mock.calls[0][0]))
    expect(url.origin).toBe('https://eutils.ncbi.nlm.nih.gov')
    expect(url.searchParams.get('db')).toBe('pubmed')
    expect(url.searchParams.get('id')).toBe('123')
  })
  it('reports upstream failures and malformed metadata as retrieval failures', async () => {
    expect((await getPubMedSummary('/api/pubmed?ids=123', 'GET', vi.fn<typeof fetch>().mockResolvedValue(new Response('{}', { status: 429 })))).status).toBe(502)
    expect((await getPubMedSummary('/api/pubmed?ids=123', 'GET', vi.fn<typeof fetch>().mockResolvedValue(new Response('{}')))).status).toBe(502)
  })
})
