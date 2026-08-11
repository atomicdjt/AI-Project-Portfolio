import { describe, expect, it } from 'vitest'
import {
  datasetForBuild,
  inferChromosomeFromRefseq,
  normalizeVariant,
  parseGnomadId,
  parseHgvsGenomic,
  parseProteinChange,
  parseRsId,
} from '../modules/variant/normalizeVariant'

describe('Variant Normalization Module', () => {
  it('parses valid gnomAD IDs with or without chr prefix', () => {
    expect(parseGnomadId('11-5227002-T-A')).toEqual({
      chrom: '11',
      pos: 5227002,
      ref: 'T',
      alt: 'A',
      id: '11-5227002-T-A',
    })
    expect(parseGnomadId('chrX-123456-A-G')).toEqual({
      chrom: 'X',
      pos: 123456,
      ref: 'A',
      alt: 'G',
      id: 'X-123456-A-G',
    })
  })

  it('returns null for invalid gnomAD IDs', () => {
    expect(parseGnomadId('invalid-id')).toBeNull()
    expect(parseGnomadId('11-abc-T-A')).toBeNull()
    expect(parseGnomadId('11-5227002-T')).toBeNull()
  })

  it('parses genomic HGVS expressions', () => {
    expect(parseHgvsGenomic('NC_000011.10:g.5227002T>A')).toEqual({
      pos: 5227002,
      ref: 'T',
      alt: 'A',
    })
    expect(parseHgvsGenomic('g.1000A>C')).toEqual({
      pos: 1000,
      ref: 'A',
      alt: 'C',
    })
  })

  it('infers chromosome numbers from RefSeq accessions', () => {
    expect(inferChromosomeFromRefseq('NC_000011.10:g.5227002T>A')).toBe('11')
    expect(inferChromosomeFromRefseq('NC_000023.11:g.1234A>T')).toBe('X')
    expect(inferChromosomeFromRefseq('NC_000024.10:g.5678C>G')).toBe('Y')
    expect(inferChromosomeFromRefseq('NM_000518.5')).toBeNull()
  })

  it('parses rsIDs accurately', () => {
    expect(parseRsId('rs334')).toBe('rs334')
    expect(parseRsId('RS28934578')).toBe('rs28934578')
    expect(parseRsId('334')).toBeNull()
    expect(parseRsId('invalid')).toBeNull()
  })

  it('parses single-letter and three-letter protein changes', () => {
    expect(parseProteinChange('E6V')).toEqual({ original: 'E', position: 6, replacement: 'V' })
    expect(parseProteinChange('p.Glu6Val')).toEqual({ original: 'E', position: 6, replacement: 'V' })
    expect(parseProteinChange('p.Arg175His')).toEqual({ original: 'R', position: 175, replacement: 'H' })
    expect(parseProteinChange('p.V600E')).toEqual({ original: 'V', position: 600, replacement: 'E' })
    expect(parseProteinChange('invalid')).toEqual({ original: null, position: null, replacement: null })
  })

  it('routes builds to proper dataset metadata', () => {
    expect(datasetForBuild('GRCh38')).toEqual({
      id: 'gnomad_r4',
      label: 'gnomAD v4',
      browserLabel: 'gnomad_r4',
    })
    expect(datasetForBuild('GRCh37')).toEqual({
      id: 'gnomad_r2_1',
      label: 'gnomAD v2.1.1',
      browserLabel: 'gnomad_r2_1',
    })
  })

  it('normalizes variants across all four resolution paths', () => {
    // Path 1: gnomAD ID
    const gnomadResult = normalizeVariant({
      gene: 'HBB',
      variant: 'E6V',
      hgvs: '',
      gnomadId: '11-5227002-T-A',
      build: 'GRCh38',
      condition: 'sickle cell',
    })
    expect(gnomadResult.parsedFrom).toBe('gnomAD ID')
    expect(gnomadResult.vcfId).toBe('11-5227002-T-A')

    // Path 2: Genomic HGVS
    const hgvsResult = normalizeVariant({
      gene: 'HBB',
      variant: 'E6V',
      hgvs: 'NC_000011.10:g.5227002T>A',
      gnomadId: '',
      build: 'GRCh38',
      condition: 'sickle cell',
    })
    expect(hgvsResult.parsedFrom).toBe('genomic HGVS')
    expect(hgvsResult.vcfId).toBe('11-5227002-T-A')

    // Path 3: rsID lookup
    const rsidResult = normalizeVariant({
      gene: 'HBB',
      variant: 'rs334',
      hgvs: '',
      gnomadId: '',
      build: 'GRCh38',
      condition: 'sickle cell',
    })
    expect(rsidResult.parsedFrom).toBe('rsID lookup')
    expect(rsidResult.browserUrl).toContain('ncbi.nlm.nih.gov/snp/rs334')

    // Path 4: Teaching example fallback
    const fallbackResult = normalizeVariant({
      gene: 'HBB',
      variant: 'E6V',
      hgvs: '',
      gnomadId: '',
      build: 'GRCh38',
      condition: 'sickle cell',
    })
    expect(fallbackResult.parsedFrom).toBe('known teaching example')

    // Path 5: Manual review required
    const manualResult = normalizeVariant({
      gene: 'UNKNOWN',
      variant: 'X100Y',
      hgvs: '',
      gnomadId: '',
      build: 'GRCh38',
      condition: 'unknown',
    })
    expect(manualResult.parsedFrom).toBe('manual review required')
    expect(manualResult.vcfId).toBeNull()
  })
})
