/**
 * ProviderStatusBar component.
 * Displays live API provider health, retrieval status, duration, and timestamps.
 * Differentiates clearly between "success", "no_result", "error", "timeout", and "loading".
 */

import { Activity, CheckCircle2, Clock, AlertTriangle, RefreshCw, XCircle } from 'lucide-react'
import type { OrchestratorResult } from '../providers/types'

interface ProviderStatusBarProps {
  liveProviders: OrchestratorResult | null
  isLoading: boolean
  onRefresh: () => void
}

export function ProviderStatusBar({ liveProviders, isLoading, onRefresh }: ProviderStatusBarProps) {
  if (isLoading) {
    return (
      <div className="provider-status-bar loading" aria-live="polite">
        <RefreshCw className="spin" size={16} />
        <span>Fetching live evidence from ClinVar, UniProt, and PubMed...</span>
      </div>
    )
  }

  if (!liveProviders) {
    return (
      <div className="provider-status-bar idle">
        <Activity size={16} />
        <span>Using curated demo fixtures. Click to fetch live external evidence.</span>
        <button type="button" onClick={onRefresh} className="live-fetch-btn">
          Fetch Live Evidence
        </button>
      </div>
    )
  }

  return (
    <div className="provider-status-bar active">
      <div className="health-chips">
        <span className="health-title">Live Providers ({liveProviders.totalDurationMs}ms):</span>
        {liveProviders.health.map((h) => {
          const isNoResult = h.status === 'no_result' || h.status === 'unsupported_variant'
          const isTimeout = h.status === 'timeout'
          const isError = h.status === 'error' || h.status === 'unavailable'

          let Icon = CheckCircle2
          let chipClass = 'chip-success'
          if (isNoResult) {
            Icon = Clock
            chipClass = 'chip-warning'
          } else if (isTimeout) {
            Icon = AlertTriangle
            chipClass = 'chip-timeout'
          } else if (isError) {
            Icon = XCircle
            chipClass = 'chip-error'
          }

          return (
            <span key={h.provider} className={`health-chip ${chipClass}`} title={h.error ?? `Status: ${h.status}`}>
              <Icon size={13} />
              <strong>{h.provider}</strong>
              <small>{h.durationMs}ms</small>
            </span>
          )
        })}
      </div>
      <button type="button" onClick={onRefresh} className="live-fetch-btn compact">
        <RefreshCw size={13} /> Refresh
      </button>
    </div>
  )
}
