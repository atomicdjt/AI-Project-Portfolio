import type { CSSProperties } from 'react'
import { ShieldAlert } from 'lucide-react'
import type { AnalysisResult } from '../../types/analysis'

export function RiskScoreCard({ analysis }: { analysis: AnalysisResult }) {
  return (
    <section className={`risk-score-card risk-${analysis.label.toLowerCase().replaceAll(' ', '-')}`} aria-label={`Risk score ${analysis.score} out of 100`}>
      <div className="risk-gauge" style={{ '--score': `${analysis.score * 3.6}deg` } as CSSProperties}>
        <div><strong>{analysis.score}</strong><span>out of 100</span></div>
      </div>
      <div className="risk-copy">
        <p className="eyebrow"><ShieldAlert size={16} aria-hidden="true" /> Local rule-based assessment</p>
        <strong className="risk-label">{analysis.label}</strong>
        <p>{analysis.summary}</p>
        <small>{analysis.disclaimer}</small>
      </div>
    </section>
  )
}
