import { describe, expect, it } from 'vitest'
import { defaultCase, variantCases } from '../data/cases'
import { buildDossier } from '../modules/evidence/buildDossier'
import { changeInputBuild, inputFromCase, isCaseIdentityMatch } from '../modules/variant/caseIdentity'
import { normalizeVariant } from '../modules/variant/normalizeVariant'

describe('Assembly and curated identity', () => {
  it.each(variantCases)('switches $gene to its verified GRCh37 coordinate and back', (variantCase) => {
    const original = inputFromCase(variantCase)
    const grch37 = changeInputBuild(original, variantCase, 'GRCh37')
    expect(isCaseIdentityMatch(grch37, variantCase)).toBe(true)
    expect(grch37.gnomadId).not.toBe(original.gnomadId)
    expect(normalizeVariant(grch37).datasetId).toBe('gnomad_r2_1')
    expect(buildDossier(variantCase, grch37).populationRecords).toEqual(variantCase.population)
    expect(changeInputBuild(grch37, variantCase, 'GRCh38')).toEqual(original)
  })

  it('clears custom coordinates rather than treating a dataset change as liftover', () => {
    const custom = { ...inputFromCase(defaultCase), gene: 'CUSTOM', variant: 'R12H', gnomadId: '1-123-A-G', hgvs: '' }
    const changed = changeInputBuild(custom, defaultCase, 'GRCh37')
    expect(changed).toMatchObject({ build: 'GRCh37', gnomadId: '', hgvs: '' })
    expect(normalizeVariant(changed).vcfId).toBeNull()
  })
})
