import { ArrowRight, Check, ListChecks, RotateCcw } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'
import { SectionCard } from '../layout/SectionCard'
import { RedFlagCard } from './RedFlagCard'
import { RiskScoreCard } from './RiskScoreCard'

export function AnalysisResults() {
  const caseData = useCaseStore((state) => state.caseData)
  const plainLanguage = useCaseStore((state) => state.plainLanguage)
  const setStep = useCaseStore((state) => state.setStep)
  const analysis = caseData.analysis

  if (!analysis) {
    return (
      <div className="empty-state"><h1>No assessment yet</h1><p>Add case evidence before reviewing risk signals.</p><button className="primary-button" type="button" onClick={() => setStep(1)}>Go to evidence intake</button></div>
    )
  }

  return (
    <div className="workflow-page results-page">
      <header className="page-heading">
        <div><p className="eyebrow">Step 3 of 5 · Review</p><h1>Risk assessment</h1><p>Review each possible indicator in context before deciding what to do next.</p></div>
        <button className="secondary-button" type="button" onClick={() => setStep(1)}><RotateCcw size={17} /> Edit evidence</button>
      </header>

      <RiskScoreCard analysis={analysis} />

      <div className="results-layout">
        <main className="findings-column">
          <div className="section-heading-row findings-heading">
            <div><p className="eyebrow">Possible scam indicators</p><h2>{analysis.findings.length} risk signal{analysis.findings.length === 1 ? '' : 's'} found</h2></div>
            <span className="analysis-method">No website was opened · {analysis.networkRequestsMade} network requests</span>
          </div>
          {analysis.findings.length > 0 ? analysis.findings.map((finding) => <RedFlagCard key={finding.id} finding={finding} plainLanguage={plainLanguage} />) : (
            <SectionCard><h2>No strong indicators found</h2><p>That does not prove the message is safe. Continue to verify unexpected requests independently.</p></SectionCard>
          )}
        </main>

        <aside className="results-aside">
          <SectionCard>
            <div className="aside-heading"><ListChecks size={20} aria-hidden="true" /><h2>Immediate next steps</h2></div>
            <ol className="next-step-list">
              {caseData.checklist.slice(0, 5).map((item, index) => <li key={item.id}><span>{index + 1}</span><p>{item.label}</p></li>)}
            </ol>
          </SectionCard>
          <SectionCard>
            <h2>Signals not found</h2>
            <ul className="not-found-list">{analysis.notFound.map((category) => <li key={category}><Check size={15} aria-hidden="true" /> {category}</li>)}</ul>
            <p className="muted-note">Not finding a signal does not establish that a request is legitimate.</p>
          </SectionCard>
          {analysis.sensitiveWarnings.length > 0 && <SectionCard className="sensitive-card"><h2>Sensitive data warning</h2>{analysis.sensitiveWarnings.map((warning) => <p key={warning.type}>{warning.message}</p>)}</SectionCard>}
        </aside>
      </div>

      <div className="bottom-action-bar">
        <div><strong>Next: organize what happened</strong><span>Review the suggested timeline and complete the safe-action checklist.</span></div>
        <button className="primary-button" type="button" aria-label="Continue to evidence organization" onClick={() => setStep(3)}>Timeline and actions <ArrowRight size={18} /></button>
      </div>
    </div>
  )
}
