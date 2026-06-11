import { AlertOctagon, AlertTriangle, CircleAlert, Info } from 'lucide-react'
import type { RedFlagFinding } from '../../types/analysis'

const icons = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: CircleAlert,
  low: Info,
}

export function RedFlagCard({ finding, plainLanguage }: { finding: RedFlagFinding; plainLanguage: boolean }) {
  const Icon = icons[finding.severity]
  return (
    <article className={`finding-card severity-${finding.severity}`}>
      <div className="finding-icon"><Icon size={20} aria-hidden="true" /></div>
      <div className="finding-body">
        <div className="finding-topline"><h3>{finding.category}</h3><span>{finding.severity}</span></div>
        <p>{plainLanguage ? finding.plainExplanation : finding.explanation}</p>
        <div className="matched-evidence"><span>Matched signal</span><q>{finding.matched}</q></div>
        <div className="safer-step"><strong>Safer next step</strong><p>{finding.saferNextStep}</p></div>
      </div>
    </article>
  )
}
