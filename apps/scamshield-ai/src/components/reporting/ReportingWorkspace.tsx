import { ArrowLeft } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'
import { ExportReportPanel } from '../export/ExportReportPanel'
import { PrivacyPanel } from '../privacy/PrivacyPanel'
import { ReportingGuidance } from './ReportingGuidance'

export function ReportingWorkspace() {
  const setStep = useCaseStore((state) => state.setStep)
  return (
    <div className="workflow-page reporting-page">
      <header className="page-heading"><div><p className="eyebrow">Step 5 of 5 · Report safely</p><h1>Safe reporting guidance</h1><p>Choose the channels that fit the situation. Reporting options vary by location and circumstances.</p></div><button className="secondary-button" type="button" onClick={() => setStep(3)}><ArrowLeft size={17} /> Back to timeline</button></header>
      <ReportingGuidance />
      <ExportReportPanel />
      <PrivacyPanel />
    </div>
  )
}
