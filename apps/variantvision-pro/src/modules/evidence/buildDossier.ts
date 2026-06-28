import type {
  AminoAcidComparison,
  EvidenceDossier,
  EvidenceMetric,
  EvidenceStatus,
  PopulationRecord,
  SourceRecord,
  VariantCase,
  VariantInput,
} from '../../types/variant'
import { aminoAcids } from '../variant/aminoAcids'
import { normalizeVariant, parseProteinChange } from '../variant/normalizeVariant'

const boundary =
  'Educational and research-support software only. Not diagnosis, treatment guidance, risk prediction, genetic counseling, or ACMG/AMP classification.'

function statusScore(status: EvidenceStatus) {
  return {
    ready: 100,
    partial: 70,
    review: 55,
    missing: 10,
  }[status]
}

function summarizePopulation(rows: PopulationRecord[]) {
  const totalAlleles = rows.reduce((sum, row) => sum + row.alleleNumber, 0)
  const totalAltAlleles = rows.reduce((sum, row) => sum + row.alleleCount, 0)
  const estimatedFrequency = totalAlleles ? totalAltAlleles / totalAlleles : 0
  const highest = [...rows].sort((a, b) => b.alleleCount / Math.max(b.alleleNumber, 1) - a.alleleCount / Math.max(a.alleleNumber, 1))[0]

  return {
    totalAlleles,
    totalAltAlleles,
    estimatedFrequency,
    highestGroup: highest ? `${highest.group} ${highest.source}` : 'No population rows',
  }
}

export function compareAminoAcids(originalCode: string, replacementCode: string): AminoAcidComparison {
  const original = aminoAcids[originalCode as keyof typeof aminoAcids] ?? aminoAcids.E
  const replacement = aminoAcids[replacementCode as keyof typeof aminoAcids] ?? aminoAcids.V
  const hydropathyDelta = Number((replacement.hydropathy - original.hydropathy).toFixed(1))
  const chargeShift = original.charge === replacement.charge ? 'No net charge-class shift' : `${original.charge} -> ${replacement.charge}`
  const polarityShift = original.polarity === replacement.polarity ? 'Same polarity class' : `${original.polarity} -> ${replacement.polarity}`
  const interpretation =
    Math.abs(hydropathyDelta) >= 5 || original.charge !== replacement.charge
      ? 'Large biochemical shift; prioritize protein-domain and mechanism review.'
      : Math.abs(hydropathyDelta) >= 2
        ? 'Moderate biochemical shift; review conservation, domain position, and source context.'
        : 'Smaller property shift; source and domain context remain necessary.'

  return {
    original,
    replacement,
    hydropathyDelta,
    chargeShift,
    polarityShift,
    interpretation,
  }
}

function buildMetrics(records: SourceRecord[], normalizedReady: boolean, literatureCount: number): EvidenceMetric[] {
  const byKind = (kind: SourceRecord['kind']) => records.filter((record) => record.kind === kind)
  const sourceMetric = (label: string, sourceRecords: SourceRecord[], fallback: string): EvidenceMetric => {
    if (sourceRecords.length === 0) {
      return { label, score: 10, status: 'missing', explanation: fallback }
    }
    const score = Math.round(sourceRecords.reduce((sum, record) => sum + statusScore(record.status), 0) / sourceRecords.length)
    const lowest = sourceRecords.some((record) => record.status === 'review')
      ? 'review'
      : sourceRecords.some((record) => record.status === 'partial')
        ? 'partial'
        : 'ready'
    return {
      label,
      score,
      status: lowest,
      explanation: sourceRecords.map((record) => record.label).join('; '),
    }
  }

  return [
    {
      label: 'Normalization',
      score: normalizedReady ? 94 : 25,
      status: normalizedReady ? 'ready' : 'review',
      explanation: normalizedReady ? 'Variant can be routed to a source-specific ID.' : 'Variant needs manual normalization before source review.',
    },
    sourceMetric('Population frequency', byKind('Population'), 'No population source attached.'),
    sourceMetric('Curated database review', byKind('Curated database'), 'No curated database source attached.'),
    sourceMetric('Protein / structure context', [...byKind('Protein'), ...byKind('Structure')], 'No protein or structure source attached.'),
    {
      label: 'Literature handoff',
      score: literatureCount >= 2 ? 88 : literatureCount === 1 ? 68 : 20,
      status: literatureCount >= 2 ? 'ready' : literatureCount === 1 ? 'partial' : 'missing',
      explanation: `${literatureCount} literature lead${literatureCount === 1 ? '' : 's'} available for human review.`,
    },
  ]
}

export function buildDossier(variantCase: VariantCase, overrides?: Partial<VariantInput>): EvidenceDossier {
  const input = { ...variantCase, ...overrides }
  const normalized = normalizeVariant(input)
  const parsedProtein = parseProteinChange(input.variant)
  const original = parsedProtein.original ?? variantCase.originalAa
  const replacement = parsedProtein.replacement ?? variantCase.replacementAa
  const aminoAcid = compareAminoAcids(original, replacement)
  const populationSummary = summarizePopulation(variantCase.population)
  const metrics = buildMetrics(variantCase.sourceRecords, Boolean(normalized.vcfId), variantCase.literature.length)
  const evidenceScore = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length)
  const confidenceBand =
    evidenceScore >= 82 ? 'Strong research dossier' : evidenceScore >= 60 ? 'Usable with review' : 'Incomplete dossier'

  return {
    caseId: variantCase.id,
    headline: `${input.gene.trim().toUpperCase() || 'Gene'} ${input.variant.trim() || 'variant'} evidence workspace`,
    generatedAt: new Date().toISOString(),
    input,
    normalized,
    aminoAcid,
    populationSummary,
    evidenceScore,
    confidenceBand,
    metrics,
    sourceRecords: variantCase.sourceRecords,
    literature: variantCase.literature,
    responsibleBoundary: boundary,
  }
}
