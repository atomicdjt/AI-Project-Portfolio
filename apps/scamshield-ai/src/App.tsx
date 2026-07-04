import { lazy, Suspense } from 'react'
import { Header } from './components/layout/Header'
import { Stepper } from './components/layout/Stepper'
import { useCaseStore } from './store/useCaseStore'

const LandingDashboard = lazy(() => import('./components/landing/LandingDashboard').then((module) => ({ default: module.LandingDashboard })))
const CaseIntakeForm = lazy(() => import('./components/intake/CaseIntakeForm').then((module) => ({ default: module.CaseIntakeForm })))
const AnalysisResults = lazy(() => import('./components/analysis/AnalysisResults').then((module) => ({ default: module.AnalysisResults })))
const TimelineWorkspace = lazy(() => import('./components/timeline/TimelineWorkspace').then((module) => ({ default: module.TimelineWorkspace })))
const ReportingWorkspace = lazy(() => import('./components/reporting/ReportingWorkspace').then((module) => ({ default: module.ReportingWorkspace })))

export default function App() {
  const currentStep = useCaseStore((state) => state.currentStep)

  return (
    <div className="app-shell">
      <Header />
      <Stepper />
      <main id="main-content" className="app-main">
        <Suspense fallback={<section className="section-card loading-panel" aria-live="polite">Loading workspace...</section>}>
          {currentStep === 0 && <LandingDashboard />}
          {currentStep === 1 && <CaseIntakeForm />}
          {currentStep === 2 && <AnalysisResults />}
          {currentStep === 3 && <TimelineWorkspace />}
          {currentStep === 4 && <ReportingWorkspace />}
        </Suspense>
      </main>
      <footer className="app-footer">
        <p><strong>ScamShield AI</strong> · Defensive consumer-protection prototype</p>
        <p>Never send passwords, authentication codes, private keys, or full financial account numbers.</p>
      </footer>
    </div>
  )
}
