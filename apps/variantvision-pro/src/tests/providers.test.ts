import { describe, expect, it } from 'vitest'
import { providerError, providerNoResult, providerSuccess } from '../providers/types'
import { fetchAllProviders } from '../providers/orchestrator'

describe('Provider Abstraction Layer', () => {
  it('creates standardized providerSuccess envelopes', () => {
    const res = providerSuccess(
      'clinvar',
      { variationId: '123', title: 'Test', classifications: [], geneSymbol: 'HBB', url: 'https://example.com' },
      { variantIdUsed: 'rs334', sourceUrl: 'https://example.com', durationMs: 42 },
    )

    expect(res.provider).toBe('clinvar')
    expect(res.status).toBe('success')
    expect(res.data?.variationId).toBe('123')
    expect(res.error).toBeNull()
    expect(res.durationMs).toBe(42)
    expect(res.retrievedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('creates standardized providerNoResult envelopes', () => {
    const res = providerNoResult('uniprot', { variantIdUsed: 'P00000', durationMs: 15 })

    expect(res.provider).toBe('uniprot')
    expect(res.status).toBe('no_result')
    expect(res.data).toBeNull()
    expect(res.error).toBeNull()
  })

  it('creates standardized providerError envelopes', () => {
    const res = providerError('pubmed', 'timeout', 'Request timed out after 5000ms', {
      variantIdUsed: 'HBB E6V',
      durationMs: 5000,
    })

    expect(res.provider).toBe('pubmed')
    expect(res.status).toBe('timeout')
    expect(res.error).toBe('Request timed out after 5000ms')
    expect(res.data).toBeNull()
  })

  it('handles invalid inputs gracefully in the orchestrator without throwing', async () => {
    const result = await fetchAllProviders({
      gene: '',
      variant: '',
      rsId: '',
      uniprotAccession: '',
    })

    expect(result.health).toHaveLength(3)
    expect(result.clinvar.status).toBe('unsupported_variant')
    expect(result.uniprot.status).toBe('unsupported_variant')
    expect(result.pubmed.status).toBe('unsupported_variant')
    expect(result.totalDurationMs).toBeGreaterThanOrEqual(0)
  })
})
