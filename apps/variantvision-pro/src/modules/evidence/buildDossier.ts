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

export function compareAminoAcids(originalCode: string | null, replacementCode: string | null): AminoAcidComparison {
  if (!originalCode || !replacementCode || !(originalCode in aminoAcids) || !(replacementCode in aminoAcids)) {
    return {
      original: { code: '?', name: 'Unknown', polarity: 'nonpolar', charge: 'neutral', size: 'medium', hydropathy: 0 },
      replacement: { code: '?', name: 'Unknown', polarity: 'nonpolar', charge: 'neutral', size: 'medium', hydropathy: 0 },
      hydropathyDelta: 0,
      chargeShift: 'Unknown',
      polarityShift: 'Unknown',
      interpretation: 'Unavailable / Manual Review Required: Protein change could not be parsed or contains unsupported residues.',
    }
  }
  const original = aminoAcids[originalCode as keyof typeof aminoAcids]
  const replacement = aminoAcids[replacementCode as keyof typeof aminoAcids]
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

import type { OrchestratorResult } from '../../providers/types'

export function buildDossier(
  variantCase: VariantCase,
  overrides?: Partial<VariantInput>,
  liveProviders?: OrchestratorResult,
): EvidenceDossier {
  const input = { ...variantCase, ...overrides }
  const isCustomInput =
    input.gene.trim().toUpperCase() !== variantCase.gene.trim().toUpperCase() ||
    input.variant.trim().toUpperCase() !== variantCase.variant.trim().toUpperCase() ||
    input.hgvs.trim() !== variantCase.hgvs.trim() ||
    input.gnomadId.trim() !== variantCase.gnomadId.trim() ||
    input.build !== variantCase.build

  const normalized = normalizeVariant(input)
  const parsedProtein = parseProteinChange(input.variant)
  const original = isCustomInput ? parsedProtein.original : (parsedProtein.original ?? variantCase.originalAa)
  const replacement = isCustomInput ? parsedProtein.replacement : (parsedProtein.replacement ?? variantCase.replacementAa)
  const aminoAcid = compareAminoAcids(original, replacement)
  const populationSummary = summarizePopulation(isCustomInput ? [] : variantCase.population)

  // Merge static sourceRecords with live provider records if available
  let sourceRecords = isCustomInput ? [] : [...variantCase.sourceRecords]

  if (liveProviders) {
    const { clinvar, uniprot } = liveProviders

    const isClinVarMapped = !isCustomInput && clinvar.variantIdUsed === variantCase.rsid

    if (isClinVarMapped && clinvar.status === 'success' && clinvar.data) {
      const liveClinvar: SourceRecord = {
        id: `live-clinvar-${clinvar.data.variationId}`,
        kind: 'Curated database',
        label: `ClinVar: ${clinvar.data.title}`,
        source: `NCBI ClinVar API (Live ${clinvar.data.variationId})`,
        status: clinvar.data.classifications.some((c) => c.reviewStars >= 2) ? 'ready' : 'partial',
        weight: 'high',
        detail:
          clinvar.data.classifications
            .map((c) => {
              const conditions = c.conditions.length > 0 ? ` for ${c.conditions.join(', ')}` : ''
              return `${c.clinicalSignificance} (${c.reviewStatus})${conditions}`
            })
            .join('; ') || 'Record retrieved; review details on NCBI.',
        url: clinvar.data.url,
        lastReviewed: 'Live API response',
        retrievedAt: clinvar.retrievedAt,
        isLive: true,
        retrievalStatus: clinvar.status,
      }
      sourceRecords = sourceRecords.filter((r) => !r.id.includes('clinvar')).concat(liveClinvar)
    } else if (isCustomInput && clinvar.status !== 'success') {
      // Prevent custom input from appearing successful if live lookup failed/returned nothing.
    }

    const isUniProtMapped = !isCustomInput && uniprot.variantIdUsed === variantCase.uniprot

    if (isUniProtMapped && uniprot.status === 'success' && uniprot.data) {
      const hasMismatch = (uniprot.warnings && uniprot.warnings.length > 0) || uniprot.data.reviewStatus === 'unreviewed'
      const status: EvidenceStatus = hasMismatch ? 'review' : 'ready'

      const liveUniprot: SourceRecord = {
        id: `live-uniprot-${uniprot.data.accession}`,
        kind: 'Protein',
        label: `UniProt ${uniprot.data.accession}: ${uniprot.data.proteinName}`,
        source: `UniProt REST API (${uniprot.data.reviewStatus})`,
        status,
        weight: 'supporting',
        detail: (uniprot.warnings?.join(' ') || '') + ' ' + (uniprot.data.function ?? `Subcellular: ${uniprot.data.subcellularLocation ?? 'N/A'}`),
        url: uniprot.data.url,
        lastReviewed: 'Live API response',
        retrievedAt: uniprot.retrievedAt,
        isLive: true,
        retrievalStatus: uniprot.status,
      }
      sourceRecords = sourceRecords.filter((r) => !r.id.includes('uniprot')).concat(liveUniprot)
    }
  }

  // Merge literature if live PubMed results arrived
  let literature = isCustomInput ? [] : [...variantCase.literature]
  
  const currentQuery = `${input.gene.trim().toUpperCase()} ${input.variant.trim().toUpperCase()}`
  const isPubMedMapped = liveProviders?.pubmed?.variantIdUsed === currentQuery

  if (isPubMedMapped && liveProviders?.pubmed.status === 'success' && liveProviders.pubmed.data) {
    const liveArticles = liveProviders.pubmed.data.articles.map((art) => ({
      id: `pubmed-${art.pmid}`,
      title: art.title,
      journal: art.journal,
      year: art.year,
      role: 'clinical context' as const,
      url: art.url,
    }))
    if (liveArticles.length > 0) {
      literature = liveArticles
    }
    
    if (liveProviders.pubmed.warnings && liveProviders.pubmed.warnings.length > 0) {
      const pubmedWarningRecord: SourceRecord = {
        id: 'pubmed-warning',
        kind: 'Literature',
        label: 'PubMed Search Fallback',
        source: 'NCBI E-utilities',
        status: 'review',
        weight: 'context',
        detail: liveProviders.pubmed.warnings.join(' '),
        lastReviewed: 'Live API response',
        isLive: true,
      }
      sourceRecords.push(pubmedWarningRecord)
    }
  }

  const metrics = buildMetrics(sourceRecords, Boolean(normalized.vcfId), literature.length)
  const coverageScore = Math.round(metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length)
  const coverageBand =
    coverageScore >= 82 ? 'High source coverage' : coverageScore >= 60 ? 'Moderate source coverage' : 'Limited source coverage'

  return {
    caseId: variantCase.id,
    headline: `${input.gene.trim().toUpperCase() || 'Gene'} ${input.variant.trim() || 'variant'} evidence workspace`,
    generatedAt: new Date().toISOString(),
    input,
    normalized,
    aminoAcid,
    populationSummary,
    coverageScore,
    coverageBand,
    metrics,
    sourceRecords,
    literature,
    responsibleBoundary: boundary,
    liveProviderHealth: liveProviders?.health,
  }
}
