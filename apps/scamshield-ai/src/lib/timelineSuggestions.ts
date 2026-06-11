import type { TimelineEntry } from '../types/case'
import { extractEntities } from './extractEntities'

interface SuggestionInput {
  text: string
  sourceLabel: string
}

export function suggestTimelineEntries(input: SuggestionInput): TimelineEntry[] {
  const entities = extractEntities(input.text)
  const dateTime = entities.dates[0] ?? new Date().toISOString()
  const entries: TimelineEntry[] = []
  const add = (entry: Omit<TimelineEntry, 'id' | 'source'>) => {
    entries.push({ ...entry, id: `suggested-${entries.length + 1}`, source: 'suggested' })
  }

  add({
    dateTime,
    eventType: 'Message received',
    description: `${input.sourceLabel} was added as evidence.`,
    amount: '',
    contact: entities.emails[0] ?? entities.phones[0] ?? '',
    reference: input.sourceLabel,
  })

  entities.amounts.forEach((amount) => {
    add({
      dateTime,
      eventType: 'Money requested',
      description: `The evidence included a request involving ${amount}.`,
      amount,
      contact: entities.emails[0] ?? entities.phones[0] ?? '',
      reference: input.sourceLabel,
    })
  })

  const contactEvidence = [...entities.emails, ...entities.phones, ...entities.urls]
  if (contactEvidence.length > 0) {
    add({
      dateTime,
      eventType: 'Other',
      description: `Contact or link evidence detected: ${contactEvidence.join(', ')}`,
      amount: '',
      contact: contactEvidence[0],
      reference: input.sourceLabel,
    })
  }

  entities.deadlines.forEach((deadline) => {
    add({
      dateTime,
      eventType: 'Other',
      description: `Pressure or deadline language detected: ${deadline}.`,
      amount: '',
      contact: '',
      reference: input.sourceLabel,
    })
  })

  return entries
}
