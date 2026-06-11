import { ArrowRight } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'
import { SafetyChecklist } from '../checklist/SafetyChecklist'
import { TimelineBuilder } from './TimelineBuilder'

export function TimelineWorkspace() {
  const setStep = useCaseStore((state) => state.setStep)
  return (
    <div className="workflow-page timeline-page">
      <header className="page-heading"><div><p className="eyebrow">Step 4 of 5 · Organize</p><h1>Build the evidence record</h1><p>Review the sequence, mark safe actions complete, and prepare for official reporting.</p></div></header>
      <div className="timeline-workspace-grid"><TimelineBuilder /><SafetyChecklist /></div>
      <div className="bottom-action-bar"><div><strong>Next: choose the appropriate official channels</strong><span>Reporting options vary by location and situation.</span></div><button className="primary-button" type="button" aria-label="Continue to safe reporting" onClick={() => setStep(4)}>Report and export <ArrowRight size={18} /></button></div>
    </div>
  )
}
