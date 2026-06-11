import { ArrowRight, CheckCircle2, ClipboardList, FileSearch, Landmark, LockKeyhole, ShieldAlert } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'
import { DemoCaseSelector } from '../demo/DemoCaseSelector'

const workflow = [
  'Upload or paste suspicious content',
  'Review possible risk signals',
  'Build a clear evidence timeline',
  'Export a structured report',
  'Report through official channels',
]

export function LandingDashboard() {
  const setStep = useCaseStore((state) => state.setStep)

  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><LockKeyhole size={16} aria-hidden="true" /> Private by design. No account required.</p>
          <h1>ScamShield AI</h1>
          <p className="hero-lede">Understand the red flags. Preserve the evidence. Report safely.</p>
          <p className="hero-body">Turn suspicious messages, screenshots, invoices, and payment requests into an organized case record using analysis that stays in your browser.</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => setStep(1)}>
              Analyze suspicious content <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button type="button" className="secondary-button" onClick={() => setStep(4)} disabled>
              Build evidence packet
            </button>
          </div>
          <div className="trust-notice" role="note">
            <ShieldAlert size={21} aria-hidden="true" />
            <p><strong>This is a risk assessment, not a final determination.</strong> ScamShield AI helps organize evidence and identify risk signals. It does not replace legal, financial, or law-enforcement advice.</p>
          </div>
        </div>
        <aside className="hero-workflow" aria-label="How ScamShield AI works">
          <div className="workflow-topline">
            <span>How it works</span>
            <span>About 5-10 minutes</span>
          </div>
          <ol>
            {workflow.map((item, index) => (
              <li key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
                {index < workflow.length - 1 && <i aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <div className="local-badge"><CheckCircle2 size={18} aria-hidden="true" /> Evidence is not intentionally sent to a server.</div>
        </aside>
      </section>

      <section className="action-grid" aria-label="Primary actions">
        <button type="button" onClick={() => setStep(1)} aria-label="Open evidence intake">
          <FileSearch size={25} aria-hidden="true" />
          <span><strong>Analyze suspicious content</strong><small>Review messages, URL text, and payment details.</small></span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setStep(1)} aria-label="Open evidence packet workflow">
          <ClipboardList size={25} aria-hidden="true" />
          <span><strong>Build an evidence packet</strong><small>Organize a timeline, findings, and action list.</small></span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setStep(1)} aria-label="Open safe reporting workflow">
          <Landmark size={25} aria-hidden="true" />
          <span><strong>Get safe reporting steps</strong><small>Find official federal, state, and provider channels.</small></span>
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </section>

      <DemoCaseSelector />
    </div>
  )
}
