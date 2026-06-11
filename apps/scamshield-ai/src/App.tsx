import { AnalysisResults } from './components/analysis/AnalysisResults'
import { CaseIntakeForm } from './components/intake/CaseIntakeForm'
import { LandingDashboard } from './components/landing/LandingDashboard'
import { Header } from './components/layout/Header'
import { Stepper } from './components/layout/Stepper'
import { ReportingWorkspace } from './components/reporting/ReportingWorkspace'
import { TimelineWorkspace } from './components/timeline/TimelineWorkspace'
import { useCaseStore } from './store/useCaseStore'

export default function App() {
  const currentStep = useCaseStore((state) => state.currentStep)

  return (
    <div className="app-shell">
      <Header />
      <Stepper />
      <main id="main-content" className="app-main">
        {currentStep === 0 && <LandingDashboard />}
        {currentStep === 1 && <CaseIntakeForm />}
        {currentStep === 2 && <AnalysisResults />}
        {currentStep === 3 && <TimelineWorkspace />}
        {currentStep === 4 && <ReportingWorkspace />}
      </main>
      <footer className="app-footer">
        <p><strong>ScamShield AI</strong> · Defensive consumer-protection prototype</p>
        <p>Never send passwords, authentication codes, private keys, or full financial account numbers.</p>
      </footer>
    </div>
  )
}
