import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchPubMed } from '../providers/pubmed'
import { fetchNcbi } from '../providers/ncbi'

vi.mock('../providers/ncbi', () => ({ fetchNcbi: vi.fn() }))
afterEach(() => vi.resetAllMocks())
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

describe('PubMed adapter', () => {
  it('retrieves metadata through the same-origin route and retains publication details', async () => {
    vi.mocked(fetchNcbi).mockResolvedValueOnce(reply({ esearchresult: { count: '1', idlist: ['123'] } }))
      .mockResolvedValueOnce(reply({ result: { '123': { title: 'Synthetic title', source: 'Test journal', pubdate: '2026 Oct', authors: [{ name: 'Test author' }] } } }))
    const result = await fetchPubMed('HBB', 'E6V')
    expect(result.status).toBe('success')
    expect(result.data?.articles[0]).toMatchObject({ pmid: '123', title: 'Synthetic title', year: 2026, authors: ['Test author'] })
    expect(vi.mocked(fetchNcbi).mock.calls[1][0]).toBe('/api/pubmed?ids=123')
  })
  it('labels broader search results when the exact query has no matches', async () => {
    vi.mocked(fetchNcbi).mockResolvedValueOnce(reply({ esearchresult: { count: '0', idlist: [] } }))
      .mockResolvedValueOnce(reply({ esearchresult: { count: '1', idlist: ['123'] } }))
      .mockResolvedValueOnce(reply({ result: { '123': { title: 'Gene-level lead' } } }))
    expect((await fetchPubMed('HBB', 'E6V')).warnings.join(' ')).toContain('may not describe the exact variant')
  })
  it('preserves metadata failure and refuses unreadable article titles', async () => {
    vi.mocked(fetchNcbi).mockResolvedValueOnce(reply({ esearchresult: { idlist: ['123'] } })).mockResolvedValueOnce(reply({}, 502))
    expect((await fetchPubMed('HBB', 'E6V')).status).toBe('error')
    vi.mocked(fetchNcbi).mockResolvedValueOnce(reply({ esearchresult: { idlist: ['123'] } })).mockResolvedValueOnce(reply({}, 504))
    expect((await fetchPubMed('HBB', 'E6V')).status).toBe('timeout')
    vi.mocked(fetchNcbi).mockResolvedValueOnce(reply({ esearchresult: { idlist: ['123'] } })).mockResolvedValueOnce(reply({ result: { '123': { title: {} } } }))
    const result = await fetchPubMed('HBB', 'E6V')
    expect(result.status).toBe('no_result')
    expect(result.data).toBeNull()
  })
})
