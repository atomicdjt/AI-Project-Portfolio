import { inferBuildFromRefseq, inferChromosomeFromRefseq, parseGnomadId } from '../modules/variant/normalizeVariant'
import type { ClinVarExpectedVariant } from './types'

export function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null
}

/** An rsID is a locus identifier: it can refer to multiple alleles and compound records. */
export function matchesClinVarAllele(value: unknown, expected: ClinVarExpectedVariant): boolean {
  const record = asRecord(value)
  const allele = parseGnomadId(expected.gnomadId)
  if (!record || !allele || record.obj_type !== 'single nucleotide variant') return false
  const variants = record.variation_set
  if (!Array.isArray(variants) || variants.length !== 1) return false
  const variant = asRecord(variants[0])
  if (!variant || variant.variant_type !== 'single nucleotide variant') return false
  const genes = Array.isArray(record.genes) ? record.genes : []
  if (!genes.some((gene) => asRecord(gene)?.symbol === expected.gene.trim().toUpperCase())) return false

  const locations = Array.isArray(variant.variation_loc) ? variant.variation_loc : []
  const locationMatches = locations.some((value) => {
    const location = asRecord(value)
    return location?.assembly_name === expected.build && String(location.chr) === allele.chrom
      && Number(location.start) === allele.pos && Number(location.stop) === allele.pos
  })
  // canonical_spdi supplies alleles when variation_loc leaves ref/alt empty.
  const spdi = typeof variant.canonical_spdi === 'string' ? variant.canonical_spdi.split(':') : []
  const canonicalBuild = inferBuildFromRefseq(`${spdi[0]}:`)
  const canonicalLocationMatches = locations.some((value) => {
    const location = asRecord(value)
    return canonicalBuild && location?.assembly_name === canonicalBuild && String(location.chr) === allele.chrom
      && Number(location.start) === Number(spdi[1]) + 1 && Number(location.stop) === Number(spdi[1]) + 1
  })
  return locationMatches && canonicalLocationMatches && inferChromosomeFromRefseq(spdi[0] ?? '') === allele.chrom
    && spdi.length === 4 && spdi[2] === allele.ref && spdi[3] === allele.alt
}
