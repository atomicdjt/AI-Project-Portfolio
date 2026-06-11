import { DatabaseZap, RotateCcw, ShieldCheck } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'

export function PrivacyPanel() {
  const clearAll = useCaseStore((state) => state.clearAll)
  const clear = () => {
    if (window.confirm('Clear the active case, analysis, timeline, and locally stored evidence? This cannot be undone.')) clearAll()
  }
  return (
    <section className="section-card privacy-panel">
      <div className="privacy-heading"><ShieldCheck size={22} /><div><p className="eyebrow">Privacy and safety</p><h2>Your evidence stays under your control</h2></div></div>
      <div className="privacy-grid">
        <div><DatabaseZap size={20} /><p><strong>Browser-based MVP</strong> Evidence is not intentionally sent to a ScamShield server. Case state may remain in localStorage on this device.</p></div>
        <div><RotateCcw size={20} /><p><strong>Clear when finished</strong> Remove the active case before using a shared or public computer.</p></div>
      </div>
      <button type="button" className="danger-secondary" onClick={clear}>Clear all case data</button>
    </section>
  )
}
