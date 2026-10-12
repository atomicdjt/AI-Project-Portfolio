import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchClinVar } from '../providers/clinvar'
import { fetchNcbi } from '../providers/ncbi'

vi.mock('../providers/ncbi', () => ({ fetchNcbi: vi.fn() }))
const expected = { gene: 'HBB', build: 'GRCh38' as const, gnomadId: '11-5227002-T-A' }
const single = {
  obj_type: 'single nucleotide variant', title: 'NM_000518.5(HBB):c.20A>T (p.Glu7Val)', genes: [{ symbol: 'HBB' }],
  variation_set: [{ variant_type: 'single nucleotide variant', canonical_spdi: 'NC_000011.10:5227001:T:A', variation_loc: [{ assembly_name: 'GRCh38', chr: '11', start: '5227002', stop: '5227002' }] }],
  germline_classification: { description: 'Pathogenic', review_status: 'reviewed by expert panel', trait_set: [{ trait_name: 'Sickle cell disease' }] },
}
function responses(records: Record<string, unknown>) {
  vi.mocked(fetchNcbi).mockResolvedValueOnce(new Response(JSON.stringify({ esearchresult: { idlist: Object.keys(records) } })))
    .mockResolvedValueOnce(new Response(JSON.stringify({ result: records })))
}
afterEach(() => vi.resetAllMocks())

describe('ClinVar identity selection', () => {
  it('selects the exact allele after a haplotype and another allele at the same locus', async () => {
    responses({
      '446748': { ...single, obj_type: 'Haplotype', variation_set: [...single.variation_set, ...single.variation_set] },
      '15175': { ...single, variation_set: [{ ...single.variation_set[0], canonical_spdi: 'NC_000011.10:5227001:T:G' }] },
      '15333': single,
    })
    const result = await fetchClinVar('rs334', expected)
    expect(result.status).toBe('success')
    expect(result.data?.variationId).toBe('15333')
    expect(result.data?.classifications[0]).toMatchObject({ track: 'germline', conditions: ['Sickle cell disease'], reviewStars: 3 })
    expect(result.warnings.join(' ')).toContain('compound records and alternate alleles were excluded')
    expect(String(vi.mocked(fetchNcbi).mock.calls[1][0])).toContain('15333')
  })
  it('withholds assertions when only a compound record is available', async () => {
    responses({ '446748': { ...single, obj_type: 'Haplotype' } })
    const result = await fetchClinVar('rs334', expected)
    expect(result.status).toBe('no_result')
    expect(result.data).toBeNull()
    expect(result.warnings.join(' ')).toContain('No single-variant ClinVar record matched')
  })
  it('withholds assertions when exact candidates remain ambiguous', async () => {
    responses({ '1': single, '2': single })
    expect((await fetchClinVar('rs334', expected)).status).toBe('no_result')
  })
  it('requires an assembly-specific allele and preserves timeout failures', async () => {
    expect((await fetchClinVar('rs334')).status).toBe('unsupported_variant')
    vi.mocked(fetchNcbi).mockRejectedValueOnce(new DOMException('Aborted', 'AbortError'))
    expect((await fetchClinVar('rs334', expected, 1)).status).toBe('timeout')
  })
})
