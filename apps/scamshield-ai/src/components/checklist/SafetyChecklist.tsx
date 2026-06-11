import { CheckCircle2, Circle, Printer, ShieldCheck } from 'lucide-react'
import { useCaseStore } from '../../store/useCaseStore'

export function SafetyChecklist() {
  const items = useCaseStore((state) => state.caseData.checklist)
  const toggleChecklistItem = useCaseStore((state) => state.toggleChecklistItem)
  const completed = items.filter((item) => item.completed).length

  return (
    <section className="section-card checklist-card" id="printable-checklist">
      <div className="section-heading-row">
        <div><p className="eyebrow">Situation-aware guidance</p><h2>Safe action checklist</h2><p>These general steps are based on the urgency and risk signals entered.</p></div>
        <button className="secondary-button print-hide" type="button" onClick={() => window.print()}><Printer size={17} /> Print checklist</button>
      </div>
      <div className="checklist-progress" aria-label={`${completed} of ${items.length} actions complete`}><span style={{ width: `${items.length ? (completed / items.length) * 100 : 0}%` }} /><p>{completed} of {items.length} complete</p></div>
      <div className="checklist-groups">
        {(['now', 'soon', 'preserve'] as const).map((priority) => {
          const group = items.filter((item) => item.priority === priority)
          if (group.length === 0) return null
          const labels = { now: 'Do now', soon: 'Do next', preserve: 'Preserve and document' }
          return (
            <div key={priority}>
              <h3>{priority === 'now' ? <ShieldCheck size={18} /> : null}{labels[priority]}</h3>
              {group.map((item) => (
                <label className={item.completed ? 'check-item complete' : 'check-item'} key={item.id}>
                  <input type="checkbox" checked={item.completed} onChange={() => toggleChecklistItem(item.id)} />
                  {item.completed ? <CheckCircle2 size={21} aria-hidden="true" /> : <Circle size={21} aria-hidden="true" />}
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          )
        })}
      </div>
      <p className="muted-note">This checklist is educational. Reporting and recovery options vary by situation and location.</p>
    </section>
  )
}
