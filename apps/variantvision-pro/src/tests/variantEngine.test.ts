import { describe, expect, it } from 'vitest'
import { defaultCase } from '../data/cases'
import { buildDossier, compareAminoAcids } from '../modules/evidence/buildDossier'
import { datasetForBuild, normalizeVariant, parseGnomadId, parseHgvsGenomic, parseProteinChange } from '../modules/variant/normalizeVariant'
import { generateMarkdownReport } from '../modules/reports/generateReport'

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

  it('normalizes the HBB HbS teaching example without requiring a backend', () => {
    const normalized = normalizeVariant({ ...defaultCase, gnomadId: '', hgvs: '' })
    expect(normalized.vcfId).toBe('11-5227002-T-A')
    expect(normalized.parsedFrom).toBe('known teaching example')
  })

  it('scores amino acid shifts and builds an evidence dossier', () => {
    const aa = compareAminoAcids('E', 'V')
    expect(aa.chargeShift).toBe('negative -> neutral')
    expect(aa.hydropathyDelta).toBeGreaterThan(7)

    const dossier = buildDossier(defaultCase)
    expect(dossier.evidenceScore).toBeGreaterThanOrEqual(70)
    expect(dossier.responsibleBoundary).toContain('Not diagnosis')
  })

  it('generates a transparent markdown report', () => {
    const dossier = buildDossier(defaultCase)
    const report = generateMarkdownReport(defaultCase, dossier)
    expect(report).toContain('VariantVision Pro Evidence Dossier')
    expect(report).toContain('Fixture Note')
    expect(report).toContain('not as standalone interpretation')
  })
})
