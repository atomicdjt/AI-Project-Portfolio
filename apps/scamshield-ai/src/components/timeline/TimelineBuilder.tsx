import { CalendarClock, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useCaseStore } from '../../store/useCaseStore'
import type { TimelineEntry, TimelineEventType } from '../../types/case'

const eventTypes: TimelineEventType[] = ['Message received', 'Call received', 'Link clicked', 'Money requested', 'Money sent', 'Personal info shared', 'Account contacted', 'Report filed', 'Other']

export function TimelineBuilder() {
  const entries = useCaseStore((state) => state.caseData.timeline)
  const addTimelineEntry = useCaseStore((state) => state.addTimelineEntry)
  const updateTimelineEntry = useCaseStore((state) => state.updateTimelineEntry)
  const removeTimelineEntry = useCaseStore((state) => state.removeTimelineEntry)
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState({ dateTime: '', eventType: 'Other' as TimelineEventType, description: '', amount: '', contact: '', reference: '' })

  const addEntry = () => {
    if (!draft.description.trim()) return
    const entry: TimelineEntry = {
      id: globalThis.crypto?.randomUUID?.() ?? `event-${Date.now()}`,
      ...draft,
      dateTime: draft.dateTime || new Date().toISOString().slice(0, 16),
      source: 'user',
    }
    addTimelineEntry(entry)
    setDraft({ dateTime: '', eventType: 'Other', description: '', amount: '', contact: '', reference: '' })
    setShowForm(false)
  }

  return (
    <section className="section-card timeline-card">
      <div className="section-heading-row">
        <div><p className="eyebrow">Chronological record</p><h2>Evidence timeline</h2><p>Confirm suggested entries and add any actions that happened before or after the message.</p></div>
        <button className="secondary-button" type="button" onClick={() => setShowForm((value) => !value)}><Plus size={17} /> Add event</button>
      </div>
      {showForm && (
        <div className="timeline-form">
          <div className="form-grid">
            <label className="field"><span>Date and time</span><input type="datetime-local" value={draft.dateTime} onChange={(event) => setDraft({ ...draft, dateTime: event.target.value })} /></label>
            <label className="field"><span>Event type</span><select value={draft.eventType} onChange={(event) => setDraft({ ...draft, eventType: event.target.value as TimelineEventType })}>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
            <label className="field field-full"><span>Description</span><textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
            <label className="field"><span>Amount involved</span><input value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} /></label>
            <label className="field"><span>Contact or company</span><input value={draft.contact} onChange={(event) => setDraft({ ...draft, contact: event.target.value })} /></label>
            <label className="field field-full"><span>Attachment or reference label</span><input value={draft.reference} onChange={(event) => setDraft({ ...draft, reference: event.target.value })} /></label>
          </div>
          <div className="form-actions compact"><button type="button" className="text-button" onClick={() => setShowForm(false)}>Cancel</button><button type="button" className="primary-button" onClick={addEntry}>Add timeline event</button></div>
        </div>
      )}
      <div className="timeline-list">
        {entries.length === 0 ? <div className="empty-inline"><CalendarClock size={24} /><p>No events yet. Add the first known contact or payment request.</p></div> : entries.map((entry, index) => (
          <article className="timeline-entry" key={entry.id}>
            <div className="timeline-marker"><span>{index + 1}</span>{index < entries.length - 1 && <i />}</div>
            <div className="timeline-entry-body">
              <div className="timeline-entry-topline">
                <select aria-label={`Event type for timeline entry ${index + 1}`} value={entry.eventType} onChange={(event) => updateTimelineEntry(entry.id, { eventType: event.target.value as TimelineEventType })}>{eventTypes.map((type) => <option key={type}>{type}</option>)}</select>
                <input aria-label={`Date and time for timeline entry ${index + 1}`} type="text" value={entry.dateTime} onChange={(event) => updateTimelineEntry(entry.id, { dateTime: event.target.value })} />
                {entry.source === 'suggested' && <span className="suggested-pill">Suggested</span>}
              </div>
              <textarea aria-label={`Description for timeline entry ${index + 1}`} rows={2} value={entry.description} onChange={(event) => updateTimelineEntry(entry.id, { description: event.target.value })} />
              <div className="timeline-meta">
                <input aria-label={`Amount for timeline entry ${index + 1}`} value={entry.amount} onChange={(event) => updateTimelineEntry(entry.id, { amount: event.target.value })} placeholder="Amount" />
                <input aria-label={`Contact for timeline entry ${index + 1}`} value={entry.contact} onChange={(event) => updateTimelineEntry(entry.id, { contact: event.target.value })} placeholder="Contact or company" />
                <input aria-label={`Reference for timeline entry ${index + 1}`} value={entry.reference} onChange={(event) => updateTimelineEntry(entry.id, { reference: event.target.value })} placeholder="Evidence reference" />
              </div>
            </div>
            <button type="button" className="icon-button" onClick={() => removeTimelineEntry(entry.id)} aria-label={`Remove timeline entry ${index + 1}`}><Trash2 size={17} /></button>
          </article>
        ))}
      </div>
    </section>
  )
}
