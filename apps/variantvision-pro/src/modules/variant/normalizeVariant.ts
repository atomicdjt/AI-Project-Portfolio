import type { AminoAcidCode, GenomeBuild, NormalizedVariant, VariantInput } from '../../types/variant'
import { aminoAcids, threeToOne } from './aminoAcids'

const HBB_HBS_BY_BUILD: Record<GenomeBuild, string> = {
  GRCh37: '11-5248232-T-A',
  GRCh38: '11-5227002-T-A',
}

// Primary chromosome RefSeq versions from the NCBI GRCh37.p13 / GRCh38.p14 assembly reports.
const referenceVersions: Record<GenomeBuild, number[]> = {
  GRCh37: [10, 11, 11, 11, 9, 11, 13, 10, 11, 10, 9, 11, 10, 8, 9, 9, 10, 9, 9, 10, 8, 10, 10, 9],
  GRCh38: [11, 12, 12, 12, 10, 12, 14, 11, 12, 11, 10, 12, 11, 9, 10, 10, 11, 10, 10, 11, 9, 11, 11, 10],
}

export function inferBuildFromRefseq(value: string): GenomeBuild | null {
  const match = value.trim().match(/^NC_0*(\d+)\.(\d+):/i)
  if (!match) return null
  const chromosome = Number(match[1])
  if (chromosome < 1 || chromosome > 24) return null
  return (Object.keys(referenceVersions) as GenomeBuild[]).find((build) => referenceVersions[build][chromosome - 1] === Number(match[2])) ?? null
}

export function datasetForBuild(build: GenomeBuild) {
  return build === 'GRCh37'
    ? { id: 'gnomad_r2_1', label: 'gnomAD v2.1.1', browserLabel: 'gnomad_r2_1' }
    : { id: 'gnomad_r4', label: 'gnomAD v4', browserLabel: 'gnomad_r4' }
}

export function parseGnomadId(value: string) {
  const match = value.trim().replace(/^chr/i, '').match(/^([0-9XYM]+)-(\d+)-([ACGT]+)-([ACGT]+)$/i)
  if (!match) return null
  const chrom = match[1].toUpperCase()
  const pos = Number(match[2])
  if (!/^(?:[1-9]|1\d|2[0-2]|X|Y|M)$/.test(chrom) || !Number.isSafeInteger(pos) || pos < 1 || match[3].toUpperCase() === match[4].toUpperCase()) return null
  return {
    chrom: match[1].toUpperCase(),
    pos: Number(match[2]),
    ref: match[3].toUpperCase(),
    alt: match[4].toUpperCase(),
    id: `${match[1].toUpperCase()}-${match[2]}-${match[3].toUpperCase()}-${match[4].toUpperCase()}`,
  }
}

export function parseHgvsGenomic(value: string) {
  const match = value.trim().match(/^(?:NC_\d+\.\d+:)?g\.(\d+)([ACGT])>([ACGT])$/i)
  if (!match) return null
  if (!Number.isSafeInteger(Number(match[1])) || Number(match[1]) < 1 || match[2].toUpperCase() === match[3].toUpperCase()) return null
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

export function parseRsId(value: string): string | null {
  const match = value.trim().match(/^rs(\d+)$/i)
  return match ? `rs${match[1]}` : null
}

export function parseProteinChange(value: string): { original: AminoAcidCode | null; position: number | null; replacement: AminoAcidCode | null } {
  const cleaned = value.trim().replace(/^p\./i, '').replace(/\s+/g, '').toUpperCase()
  const compact = cleaned.match(/^([A-Z])(\d+)([A-Z])$/)
  if (compact) {
    const orig = compact[1]
    const rep = compact[3]
    if (orig in aminoAcids && rep in aminoAcids && Number(compact[2]) > 0 && Number.isSafeInteger(Number(compact[2]))) {
      return {
        original: orig as AminoAcidCode,
        position: Number(compact[2]),
        replacement: rep as AminoAcidCode,
      }
    }
  }

  const threeLetter = cleaned.match(/^([A-Z]{3})(\d+)([A-Z]{3})$/)
  if (threeLetter && Number(threeLetter[2]) > 0 && Number.isSafeInteger(Number(threeLetter[2]))) {
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
  const review = (note: string): NormalizedVariant => ({
    input, dataset: dataset.label, datasetId: dataset.id, vcfId: null, vcfLikeCoordinate: null,
    browserUrl: null, parsedFrom: 'manual review required', note,
  })
  const genomic = parseHgvsGenomic(input.hgvs)
  const chromosome = inferChromosomeFromRefseq(input.hgvs)
  const referenceBuild = inferBuildFromRefseq(input.hgvs)
  if (input.hgvs.trim() && !genomic) return review('Genomic HGVS is malformed or outside the supported single-nucleotide substitution syntax. No coordinate was routed.')
  if (referenceBuild && referenceBuild !== input.build) return review(`The RefSeq accession belongs to ${referenceBuild}, but ${input.build} is selected. Correct the assembly or provide a verified mapping; local parsing does not perform liftover.`)
  if (genomic && chromosome && !referenceBuild) return review('The RefSeq accession version could not be mapped to a supported primary GRCh37/GRCh38 reference. Confirm the assembly before source routing.')

  // Path 1: Direct gnomAD-style ID (e.g. 11-5227002-T-A)
  const suppliedId = parseGnomadId(input.gnomadId)
  if (input.gnomadId.trim() && !suppliedId && !parseRsId(input.gnomadId)) return review('The supplied gnomAD-style ID is invalid. Use a valid chromosome, positive position, and different reference/alternate alleles.')
  if (suppliedId && genomic && (suppliedId.pos !== genomic.pos || suppliedId.ref !== genomic.ref || suppliedId.alt !== genomic.alt || (chromosome && suppliedId.chrom !== chromosome))) {
    return review('The gnomAD-style ID and genomic HGVS describe different alleles. Resolve the conflict before source routing.')
  }
  // E6V is the mature-chain teaching alias; canonical HGVS includes the initiator methionine.
  const isHbbHbS = input.gene.trim().toUpperCase() === 'HBB' && /^(E6V|P\.GLU7VAL|P\.E7V)$/i.test(input.variant.trim())
  if (isHbbHbS && suppliedId && Object.values(HBB_HBS_BY_BUILD).includes(suppliedId.id) && suppliedId.id !== HBB_HBS_BY_BUILD[input.build]) {
    return review('The supplied HBB teaching coordinate belongs to the other genome build. Use the verified coordinate for the selected assembly.')
  }
  if (suppliedId) {
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: suppliedId.id,
      vcfLikeCoordinate: `chr${suppliedId.chrom}:${suppliedId.pos}:${suppliedId.ref}:${suppliedId.alt}`,
      browserUrl: `https://gnomad.broadinstitute.org/variant/${suppliedId.id}?dataset=${dataset.browserLabel}`,
      parsedFrom: 'gnomAD ID',
      note: 'Parsed locally from a gnomAD-style ID (1-based chrom-pos-ref-alt). The assembly is declared by the input; no reference allele validation, left alignment or liftover was performed.',
    }
  }

  // Path 2: Genomic HGVS (e.g. NC_000011.10:g.5227002T>A)
  if (genomic && chromosome) {
    const id = `${chromosome}-${genomic.pos}-${genomic.ref}-${genomic.alt}`
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: id,
      vcfLikeCoordinate: `chr${chromosome}:${genomic.pos}:${genomic.ref}:${genomic.alt}`,
      browserUrl: `https://gnomad.broadinstitute.org/variant/${id}?dataset=${dataset.browserLabel}`,
      parsedFrom: 'genomic HGVS',
      note: 'Derived a VCF-style ID from genomic HGVS syntax. Coordinate parsing only; not transcript-aware HGVS normalization.',
    }
  }

  // Path 3: rsID in gnomadId or variant input field
  const rsId = parseRsId(input.gnomadId) || parseRsId(input.variant)
  if (rsId) {
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: null,
      vcfLikeCoordinate: null,
      browserUrl: `https://www.ncbi.nlm.nih.gov/snp/${rsId}`,
      parsedFrom: 'rsID lookup',
      note: `Recognized ${rsId}. Genomic coordinates require a dbSNP or ClinVar API lookup to resolve build-specific position.`,
    }
  }

  // Path 4: HBB HbS teaching fallback
  if (isHbbHbS) {
    const id = HBB_HBS_BY_BUILD[input.build]
    const parsed = parseGnomadId(id)
    return {
      input,
      dataset: dataset.label,
      datasetId: dataset.id,
      vcfId: id,
      vcfLikeCoordinate: parsed ? `chr${parsed.chrom}:${parsed.pos}:${parsed.ref}:${parsed.alt}` : null,
      browserUrl: `https://gnomad.broadinstitute.org/variant/${id}?dataset=${dataset.browserLabel}`,
      parsedFrom: 'known teaching example',
      note: 'Recognized the HBB HbS teaching example and selected the matching demo coordinate for the chosen build.',
    }
  }

  return review('No safe local normalization path was available. Provide a gnomAD-style ID, genomic HGVS coordinate, or rsID for source review.')
}
