import { Accessibility, HeartHandshake, ShieldCheck } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'

export function Header() {
  const plainLanguage = useCaseStore((state) => state.plainLanguage)
  const caregiverMode = useCaseStore((state) => state.caregiverMode)
  const setPlainLanguage = useCaseStore((state) => state.setPlainLanguage)
  const setCaregiverMode = useCaseStore((state) => state.setCaregiverMode)
  const setStep = useCaseStore((state) => state.setStep)

  return (
    <header className="app-header">
      <button className="brand" type="button" onClick={() => setStep(0)} aria-label="Go to ScamShield AI home">
        <span className="brand-mark" aria-hidden="true"><ShieldCheck size={25} strokeWidth={2.2} /></span>
        <span>
          <strong>ScamShield AI</strong>
          <small>Local scam evidence assistant</small>
        </span>
      </button>
      <div className="header-actions">
        <span className="status-pill"><span aria-hidden="true" /> Defensive education tool</span>
        <label className="mode-toggle">
          <Accessibility size={17} aria-hidden="true" />
          <span>Plain-language mode</span>
          <input type="checkbox" checked={plainLanguage} onChange={(event) => setPlainLanguage(event.target.checked)} />
          <i aria-hidden="true" />
        </label>
        <label className="mode-toggle">
          <HeartHandshake size={17} aria-hidden="true" />
          <span>Caregiver mode</span>
          <input type="checkbox" checked={caregiverMode} onChange={(event) => setCaregiverMode(event.target.checked)} />
          <i aria-hidden="true" />
        </label>
      </div>
    </header>
  )
}
