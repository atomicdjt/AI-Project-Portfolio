import { describe, expect, it } from 'vitest'
import { analyzeScam } from '../lib/analyzeScam'

describe('scam pattern analysis', () => {
  it('detects multiple high-risk categories and explains URL-text concerns without crawling', () => {
    const result = analyzeScam({
      text: 'URGENT final notice from the IRS. A warrant is active. Do not tell anyone. Buy Bitcoin now and send your verification code.',
      url: 'http://amaz0n.verify-login.example.top/account',
      claimedCompany: 'Amazon',
      paymentDestination: 'Bitcoin wallet',
    })

    const categories = new Set(result.findings.map((finding) => finding.category))

    expect(categories.has('Urgency and pressure')).toBe(true)
    expect(categories.has('Threats and fear')).toBe(true)
    expect(categories.has('Secrecy and isolation')).toBe(true)
    expect(categories.has('Payment red flags')).toBe(true)
    expect(categories.has('Credential or personal-data request')).toBe(true)
    expect(categories.has('Impersonation')).toBe(true)
    expect(categories.has('Suspicious URL')).toBe(true)
    expect(result.score).toBeGreaterThanOrEqual(70)
    expect(result.label).toBe('Severe risk')
    expect(result.disclaimer).toMatch(/risk assessment, not a final determination/i)
    expect(result.networkRequestsMade).toBe(0)
  })

  it('keeps a normal low-pressure message in the lowest visible-risk band', () => {
    const result = analyzeScam({
      text: 'The community library closes at 6 PM. Your reserved book is ready at the front desk.',
      url: '',
      claimedCompany: '',
      paymentDestination: '',
    })

    expect(result.score).toBeLessThan(20)
    expect(result.label).toBe('Low visible risk')
    expect(result.findings).toHaveLength(0)
    expect(result.notFound).toContain('Payment red flags')
  })
})
