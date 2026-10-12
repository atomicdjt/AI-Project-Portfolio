import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.resetModules() })
describe('Shared NCBI request scheduling', () => {
  it('spaces simultaneous provider requests instead of releasing a burst', async () => {
    vi.useFakeTimers(); vi.setSystemTime(0); vi.resetModules()
    const starts: number[] = []
    vi.stubGlobal('fetch', vi.fn(async () => { starts.push(Date.now()); return new Response('{}') }))
    const { fetchNcbi } = await import('../providers/ncbi')
    const requests = [0, 1, 2].map(() => fetchNcbi('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed'))
    await vi.runAllTimersAsync()
    await Promise.all(requests)
    expect(starts).toEqual([0, 350, 700])
  })
  it('does not send a request aborted while waiting for a slot', async () => {
    vi.useFakeTimers(); vi.setSystemTime(0); vi.resetModules()
    const fetchMock = vi.fn(async () => new Response('{}'))
    vi.stubGlobal('fetch', fetchMock)
    const { fetchNcbi } = await import('../providers/ncbi')
    await fetchNcbi('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi')
    const controller = new AbortController()
    const queued = expect(fetchNcbi('https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi', { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' })
    controller.abort()
    await queued
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
