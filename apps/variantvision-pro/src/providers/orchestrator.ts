/**
 * Provider Orchestrator for VariantVision Pro.
 *
 * Runs external data providers concurrently using Promise.allSettled with timeout controls.
 * Implements fault-tolerant partial failure execution: if ClinVar fails or times out,
 * UniProt and PubMed results are still collected and returned with complete health status.
 */

import type { OrchestratorResult, ProviderHealth } from './types'
import { fetchClinVar } from './clinvar'
import { fetchUniProt } from './uniprot'
import { fetchPubMed } from './pubmed'
import { providerError } from './types'

export interface OrchestratorParams {
  gene: string
  variant: string
  rsId?: string
  uniprotAccession?: string
  timeoutMs?: number
}

export async function fetchAllProviders(params: OrchestratorParams): Promise<OrchestratorResult> {
  const start = performance.now()
  const timeoutMs = params.timeoutMs ?? 8000

  // Trigger all API requests in parallel
  const clinvarPromise = params.rsId
    ? fetchClinVar(params.rsId, timeoutMs)
    : Promise.resolve(
        providerError('clinvar', 'unsupported_variant', 'No rsID provided for ClinVar lookup', {
          variantIdUsed: 'N/A',
          durationMs: 0,
        }),
      )

  const uniprotPromise = params.uniprotAccession
    ? fetchUniProt(params.uniprotAccession, params.gene, timeoutMs)
    : Promise.resolve(
        providerError('uniprot', 'unsupported_variant', 'No UniProt accession provided', {
          variantIdUsed: 'N/A',
          durationMs: 0,
        }),
      )

  const pubmedPromise = params.gene
    ? fetchPubMed(params.gene, params.variant, timeoutMs)
    : Promise.resolve(
        providerError('pubmed', 'unsupported_variant', 'No gene symbol provided', {
          variantIdUsed: 'N/A',
          durationMs: 0,
        }),
      )

  const [clinvarRes, uniprotRes, pubmedRes] = await Promise.allSettled([
    clinvarPromise,
    uniprotPromise,
    pubmedPromise,
  ])

  const clinvar =
    clinvarRes.status === 'fulfilled'
      ? clinvarRes.value
      : providerError('clinvar', 'unavailable', String(clinvarRes.reason), {
          variantIdUsed: params.rsId ?? 'N/A',
          durationMs: Math.round(performance.now() - start),
        })

  const uniprot =
    uniprotRes.status === 'fulfilled'
      ? uniprotRes.value
      : providerError('uniprot', 'unavailable', String(uniprotRes.reason), {
          variantIdUsed: params.uniprotAccession ?? 'N/A',
          durationMs: Math.round(performance.now() - start),
        })

  const pubmed =
    pubmedRes.status === 'fulfilled'
      ? pubmedRes.value
      : providerError('pubmed', 'unavailable', String(pubmedRes.reason), {
          variantIdUsed: params.gene ?? 'N/A',
          durationMs: Math.round(performance.now() - start),
        })

  const health: ProviderHealth[] = [
    {
      provider: 'clinvar',
      status: clinvar.status,
      durationMs: clinvar.durationMs,
      error: clinvar.error,
      retrievedAt: clinvar.retrievedAt,
    },
    {
      provider: 'uniprot',
      status: uniprot.status,
      durationMs: uniprot.durationMs,
      error: uniprot.error,
      retrievedAt: uniprot.retrievedAt,
    },
    {
      provider: 'pubmed',
      status: pubmed.status,
      durationMs: pubmed.durationMs,
      error: pubmed.error,
      retrievedAt: pubmed.retrievedAt,
    },
  ]

  const totalDurationMs = Math.round(performance.now() - start)

  return {
    clinvar,
    uniprot,
    pubmed,
    health,
    totalDurationMs,
  }
}
