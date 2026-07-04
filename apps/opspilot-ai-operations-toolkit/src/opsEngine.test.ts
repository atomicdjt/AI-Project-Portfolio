import { describe, expect, it } from 'vitest'
import { initialIntake } from './data'
import { generateDocument, toMarkdown, updateBodyScore } from './opsEngine'

const requiredSections = [
  'Purpose',
  'Trigger',
  'Owner',
  'Steps',
  'Quality checks',
  'Escalation path',
  'Review cadence',
  'Audit/version note',
]

describe('deterministic ProcessHarbor engine', () => {
  it('normalizes HTML and escaped break markup from source notes, body edits, and exports', () => {
    const document = generateDocument({
      ...initialIntake,
      sourceNotes: `${initialIntake.sourceNotes}&lt;br&gt;<br><p>Record completion in the schedule notes.</p>`,
    })
    const updated = updateBodyScore(document, `${document.body}<br>&lt;br&gt;<strong>Owner review complete.</strong>`)
    const markdown = toMarkdown(updated)

    expect(updated.body).not.toMatch(/<br|&lt;br|<strong/i)
    expect(markdown).not.toMatch(/<br|&lt;br|<strong/i)
    expect(updated.body).toContain('Owner review complete.')
  })

  it('creates required SOP sections for operations review', () => {
    const document = generateDocument(initialIntake)

    for (const section of requiredSections) {
      expect(document.body).toContain(section)
    }
  })

  it('uses imperative step titles instead of raw sentence fragments', () => {
    const document = generateDocument(initialIntake)
    const firstWords = document.steps.map((step) => step.title.split(' ')[0]?.toLowerCase())

    expect(firstWords).toEqual(expect.arrayContaining(['standardize', 'collect', 'escalate']))
    expect(document.steps[0]?.title).not.toMatch(/is inconsistent/i)
  })
})
