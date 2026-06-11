import { describe, expect, it } from 'vitest'
import { suggestTimelineEntries } from '../lib/timelineSuggestions'

describe('timeline suggestions', () => {
  it('creates editable evidence events from detected amounts, contacts, URLs, and deadlines', () => {
    const entries = suggestTimelineEntries({
      text: 'On June 20, 2026, pay $850 to helpdesk@example.test at https://pay.example.test within 24 hours.',
      sourceLabel: 'Pasted message',
    })
    const descriptions = entries.map((entry) => entry.description).join(' ')

    expect(entries.some((entry) => entry.eventType === 'Money requested' && entry.amount === '$850')).toBe(true)
    expect(descriptions).toContain('helpdesk@example.test')
    expect(descriptions).toContain('https://pay.example.test')
    expect(descriptions).toMatch(/within 24 hours/i)
    expect(entries.every((entry) => entry.source === 'suggested')).toBe(true)
  })
})
