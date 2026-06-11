import { describe, expect, it } from 'vitest'
import { demoCases } from '../data/demoCases'
import { analyzeScam } from '../lib/analyzeScam'

describe('demo cases', () => {
  it('provides five clearly synthetic cases that trigger their expected categories', () => {
    expect(demoCases).toHaveLength(5)

    for (const demo of demoCases) {
      expect(demo.isSynthetic).toBe(true)
      expect(demo.case.name.toLowerCase()).toContain('demo')

      const analysis = analyzeScam({
        text: demo.case.evidenceText,
        url: demo.case.suspiciousUrl,
        claimedCompany: demo.case.claimedCompany,
        paymentDestination: demo.case.paymentDestination,
        contactDetails: demo.case.contactDetails,
        amountRequested: demo.case.amountRequested,
        pressureLanguage: demo.case.pressureLanguage,
      })
      const categories = new Set(analysis.findings.map((finding) => finding.category))

      for (const expected of demo.expectedCategories) {
        expect(categories.has(expected), `${demo.title} should trigger ${expected}`).toBe(true)
      }
    }
  })
})
