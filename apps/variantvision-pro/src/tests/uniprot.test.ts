import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchUniProt } from '../providers/uniprot'

afterEach(() => vi.unstubAllGlobals())
const record = { primaryAccession: 'P68871', entryType: 'UniProtKB reviewed (Swiss-Prot)', organism: { scientificName: 'Homo sapiens' }, genes: [{ geneName: { value: 'HBB' } }], proteinDescription: { recommendedName: { fullName: { value: 'Hemoglobin subunit beta' } } } }
function response(body: unknown, status = 200) { vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status }))) }

describe('UniProt adapter', () => {
  it('returns reviewed human protein metadata for the requested accession', async () => {
    response(record)
    const result = await fetchUniProt('P68871', 'HBB')
    expect(result.status).toBe('success')
    expect(result.data?.proteinName).toBe('Hemoglobin subunit beta')
    expect(result.warnings).toEqual([])
  })
  it('does not infer human or gene identity from missing metadata', async () => {
    response({ entryType: record.entryType })
    const result = await fetchUniProt('P68871', 'HBB')
    expect(result.data?.organism).toBe('Unknown organism')
    expect(result.warnings).toHaveLength(2)
  })
  it('flags gene and organism mismatches without changing the source data', async () => {
    response({ ...record, genes: [{ geneName: { value: 'OTHER' } }], organism: { scientificName: 'Mus musculus' } })
    expect((await fetchUniProt('P68871', 'HBB')).warnings).toHaveLength(2)
  })
  it('distinguishes a missing entry from a response for a different accession', async () => {
    response({}, 404)
    expect((await fetchUniProt('P68871', 'HBB')).status).toBe('no_result')
    response({ ...record, primaryAccession: 'P00000' })
    expect((await fetchUniProt('P68871', 'HBB')).status).toBe('error')
  })
})
