import { describe, expect, it } from 'vitest'
import { defaultCase } from '../data/cases'
import { buildDossier, compareAminoAcids } from '../modules/evidence/buildDossier'
import { datasetForBuild, normalizeVariant, parseGnomadId, parseHgvsGenomic, parseProteinChange } from '../modules/variant/normalizeVariant'
import { generateMarkdownReport } from '../modules/reports/generateReport'
import type { OrchestratorResult } from '../providers/types'

describe('VariantVision Pro evidence engine', () => {
  it('parses gnomAD IDs and genomic HGVS coordinates', () => {
    expect(parseGnomadId('11-5227002-T-A')).toEqual({
      chrom: '11',
      pos: 5227002,
      ref: 'T',
      alt: 'A',
      id: '11-5227002-T-A',
    })
    expect(parseHgvsGenomic('NC_000011.10:g.5227002T>A')).toEqual({ pos: 5227002, ref: 'T', alt: 'A' })
  })

  it('routes GRCh37 and GRCh38 to different gnomAD datasets', () => {
    expect(datasetForBuild('GRCh38').id).toBe('gnomad_r4')
    expect(datasetForBuild('GRCh37').id).toBe('gnomad_r2_1')
  })

  it('recognizes compact and three-letter protein notation', () => {
    expect(parseProteinChange('E6V')).toMatchObject({ original: 'E', position: 6, replacement: 'V' })
    expect(parseProteinChange('p.Glu6Val')).toMatchObject({ original: 'E', position: 6, replacement: 'V' })
  })

  it('rejects invalid or unsupported amino acids safely', () => {
    // X is not a standard amino acid code in our dictionary
    expect(parseProteinChange('X100Y')).toEqual({ original: null, position: null, replacement: null })
    expect(parseProteinChange('B12Z')).toEqual({ original: null, position: null, replacement: null })
  })

  it('normalizes the HBB HbS teaching example without requiring a backend', () => {
    const normalized = normalizeVariant({ ...defaultCase, gnomadId: '', hgvs: '' })
    expect(normalized.vcfId).toBe('11-5227002-T-A')
    expect(normalized.parsedFrom).toBe('known teaching example')
  })

  it('scores amino acid shifts and builds an evidence dossier', () => {
    const aa = compareAminoAcids('E', 'V')
    expect(aa.chargeShift).toBe('negative -> neutral')
    expect(aa.hydropathyDelta).toBeGreaterThan(7)

    const aaInvalid = compareAminoAcids(null, null)
    expect(aaInvalid.interpretation).toContain('Unavailable / Manual Review Required')
    expect(aaInvalid.original?.code).toBe('?')

    const dossier = buildDossier(defaultCase)
    expect(dossier.coverageScore).toBeGreaterThanOrEqual(70)
    expect(dossier.responsibleBoundary).toContain('Not diagnosis')
  })

  it('clears curated fixture data when user input deviates from identity', () => {
    const customInput = { ...defaultCase, variant: 'p.Val600Glu' }
    const dossier = buildDossier(defaultCase, customInput)
    // Because it differs from defaultCase, it should have fewer source records and low coverage
    expect(dossier.coverageScore).toBeLessThan(70)
    expect(dossier.sourceRecords.length).toBe(0)
    expect(dossier.populationSummary.estimatedFrequency).toBe(0)
  })

  it('drops stale live provider evidence when input identity changes', () => {
    const liveProviders = {
      clinvar: { status: 'success', data: { variationId: defaultCase.rsid }, variantIdUsed: defaultCase.rsid },
      uniprot: { status: 'success', data: { accession: defaultCase.uniprot }, variantIdUsed: defaultCase.uniprot },
      pubmed: { status: 'success', data: { articles: [] }, variantIdUsed: `${defaultCase.gene} ${defaultCase.variant}` },
      health: [],
      totalDurationMs: 100,
    } as OrchestratorResult

    const customInput = { ...defaultCase, variant: 'p.Val600Glu' }
    const dossier = buildDossier(defaultCase, customInput, liveProviders)

    // Live providers for the default case should NOT be merged since variant changed.
    expect(dossier.sourceRecords).not.toEqual(expect.arrayContaining([
      expect.objectContaining({ isLive: true }),
    ]))
    // Literature should also be empty because the pubmed query no longer matches.
    expect(dossier.literature.length).toBe(0)
  })

  it('generates a transparent markdown report', () => {
    const dossier = buildDossier(defaultCase)
    const report = generateMarkdownReport(defaultCase, dossier)
    expect(report).toContain('VariantVision Pro Evidence Dossier')
    expect(report).toContain('Fixture Note')
    expect(report).toContain('not as standalone interpretation')
  })
})
