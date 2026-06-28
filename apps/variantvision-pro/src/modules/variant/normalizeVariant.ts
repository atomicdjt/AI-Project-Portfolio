import type { AminoAcidCode, GenomeBuild, NormalizedVariant, VariantInput } from '../../types/variant'
import { threeToOne } from './aminoAcids'

const HBB_HBS_BY_BUILD: Record<GenomeBuild, string> = {
  GRCh37: '11-5248232-T-A',
  GRCh38: '11-5227002-T-A',
}

export function datasetForBuild(build: GenomeBuild) {
  return build === 'GRCh37'
    ? { id: 'gnomad_r2_1', label: 'gnomAD v2.1.1', browserLabel: '2-1' }
    : { id: 'gnomad_r4', label: 'gnomAD v4', browserLabel: '4' }
}

export function parseGnomadId(value: string) {
  const match = value.trim().replace(/^chr/i, '').match(/^([0-9XYM]+)-(\d+)-([ACGTN]+)-([ACGTN]+)$/i)
  if (!match) return null
  return {
    chrom: match[1].toUpperCase(),
    pos: Number(match[2]),
    ref: match[3].toUpperCase(),
    alt: match[4].toUpperCase(),
    id: `${match[1].toUpperCase()}-${match[2]}-${match[3].toUpperCase()}-${match[4].toUpperCase()}`,
  }
}

export function parseHgvsGenomic(value: string) {
  const match = value.trim().match(/(?:NC_[^:]+:)?g\.(\d+)([ACGT])>([ACGT])/i)
  if (!match) return null
  return {
    pos: Number(match[1]),
    ref: match[2].toUpperCase(),
    alt: match[3].toUpperCase(),
  }
}

export function inferChromosomeFromRefseq(value: string) {
  const match = value.trim().match(/NC_0*([0-9]{1,2}|23|24)\./i)
  if (!match) return null
  const chromosome = Number(match[1])
  if (chromosome === 23) return 'X'
  if (chromosome === 24) return 'Y'
  return chromosome >= 1 && chromosome <= 22 ? String(chromosome) : null
}

export function parseProteinChange(value: string): { original: AminoAcidCode | null; position: number | null; replacement: AminoAcidCode | null } {
  const cleaned = value.trim().replace(/^p\./i, '').replace(/\s+/g, '').toUpperCase()
  const compact = cleaned.match(/^([A-Z])(\d+)([A-Z])$/)
  if (compact) {
    return {
      original: compact[1] as AminoAcidCode,
      position: Number(compact[2]),
      replacement: compact[3] as AminoAcidCode,
    }
  }

  const threeLetter = cleaned.match(/^([A-Z]{3})(\d+)([A-Z]{3})$/)
  if (threeLetter) {
    return {
      original: threeToOne[threeLetter[1]] ?? null,
      position: Number(threeLetter[2]),
      replacement: threeToOne[threeLetter[3]] ?? null,
    }
  }

  return { original: null, position: null, replacement: null }
}

export function normalizeVariant(input: VariantInput): NormalizedVariant {
  const dataset = datasetForBuild(input.build)
  const suppliedId = parseGnomadId(input.gnomadId)
  if (suppliedId) {
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: suppliedId.id,
      spdi: `${suppliedId.chrom}:${suppliedId.pos}:${suppliedId.ref}:${suppliedId.alt}`,
      browserUrl: `https://gnomad.broadinstitute.org/variant/${suppliedId.id}?dataset=${dataset.browserLabel}`,
      parsedFrom: 'gnomAD ID',
      note: 'Parsed locally from a gnomAD-style ID. Human review still needs reference allele and transcript confirmation.',
    }
  }

  const genomic = parseHgvsGenomic(input.hgvs)
  const chromosome = inferChromosomeFromRefseq(input.hgvs)
  if (genomic && chromosome) {
    const id = `${chromosome}-${genomic.pos}-${genomic.ref}-${genomic.alt}`
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: id,
      spdi: `${chromosome}:${genomic.pos}:${genomic.ref}:${genomic.alt}`,
      browserUrl: `https://gnomad.broadinstitute.org/variant/${id}?dataset=${dataset.browserLabel}`,
      parsedFrom: 'genomic HGVS',
      note: 'Derived a VCF-style ID from genomic HGVS syntax. This is coordinate parsing, not transcript-aware HGVS normalization.',
    }
  }

  const isHbbHbS = input.gene.trim().toUpperCase() === 'HBB' && /^(E6V|P\.?GLU6VAL|RS334)$/i.test(input.variant.trim())
  if (isHbbHbS) {
    const id = HBB_HBS_BY_BUILD[input.build]
    const parsed = parseGnomadId(id)
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: id,
      spdi: parsed ? `${parsed.chrom}:${parsed.pos}:${parsed.ref}:${parsed.alt}` : null,
      browserUrl: `https://gnomad.broadinstitute.org/variant/${id}?dataset=${dataset.browserLabel}`,
      parsedFrom: 'known teaching example',
      note: 'Recognized the HBB HbS teaching example and selected the matching demo coordinate for the chosen build.',
    }
  }

  return {
    input,
    dataset: dataset.label,
    datasetId: dataset.id,
    vcfId: null,
    spdi: null,
    browserUrl: null,
    parsedFrom: 'manual review required',
    note: 'No safe local normalization path was available. Provide a gnomAD-style ID or genomic HGVS coordinate for a stronger dossier.',
  }
}
