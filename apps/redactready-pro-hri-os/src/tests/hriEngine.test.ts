import { describe, expect, it } from 'vitest'
import { analyzePacket } from '../modules/analysis/analyzePacket'
import { detectSensitiveInfo } from '../modules/detection/detectSensitiveInfo'
import { generateMarkdownReport } from '../modules/reports/generateReport'
import { redactText } from '../modules/redaction/redactText'

describe('sensitive information detection', () => {
  it('detects common sensitive fields with redaction labels', () => {
    const findings = detectSensitiveInfo(
      'Contact jordan@example.test at (312) 555-0198. SSN 123-45-6789. Case number BEN-204911. DOB: 07/14/1991.',
      'sample',
    )

    expect(findings.map((finding) => finding.type)).toEqual(expect.arrayContaining(['email', 'phone', 'ssn', 'case_number', 'date_of_birth']))
    expect(findings.find((finding) => finding.type === 'ssn')?.suggestedRedaction).toBe('[REDACTED SSN]')
  })
})

describe('redaction', () => {
  it('replaces enabled findings while preserving readable text', () => {
    const text = 'Email alex@example.test and call 555-244-9182.'
    const findings = detectSensitiveInfo(text, 'redact')
    const redacted = redactText(
      text,
      findings,
      findings.map((finding) => ({ findingId: finding.id, enabled: finding.type === 'email', label: finding.suggestedRedaction })),
    )

    expect(redacted).toContain('[REDACTED EMAIL]')
    expect(redacted).toContain('555-244-9182')
  })

  it('applies overlapping findings once and ignores invalid ranges', () => {
    const text = 'Account 1234567890123 is under review.'
    const findings = [
      {
        id: 'outer',
        type: 'financial_information' as const,
        label: 'Payment card pattern',
        match: '1234567890123',
        start: 8,
        end: 21,
        severity: 'Critical' as const,
        confidence: 0.72,
        explanation: 'Long digit sequence.',
        suggestedRedaction: '[REDACTED FINANCIAL ID]',
      },
      {
        id: 'inner',
        type: 'account_number' as const,
        label: 'Account number',
        match: '456789',
        start: 11,
        end: 17,
        severity: 'High' as const,
        confidence: 0.84,
        explanation: 'Nested identifier.',
        suggestedRedaction: '[REDACTED ACCOUNT]',
      },
      {
        id: 'invalid',
        type: 'account_number' as const,
        label: 'Invalid range',
        match: 'missing',
        start: -1,
        end: 200,
        severity: 'High' as const,
        confidence: 0.5,
        explanation: 'Invalid range.',
        suggestedRedaction: '[INVALID]',
      },
    ]

    const redacted = redactText(
      text,
      findings,
      findings.map((finding) => ({ findingId: finding.id, enabled: true, label: finding.suggestedRedaction })),
    )

    expect(redacted).toBe('Account [REDACTED FINANCIAL ID] is under review.')
  })
})

describe('HRI analysis pipeline', () => {
  it('classifies, scores, maps evidence, builds checklist, and generates a report', () => {
    const analysis = analyzePacket([
      {
        id: 'doc',
        title: 'Administrative packet note',
        source: 'pasted text',
        rawText:
          'Purpose: review benefits application packet before sharing with an agency. Case number BEN-204911. Member ID HZ-4471-0092. Documentation appointment date 03/02/2026. Email person@example.test.',
      },
    ])

    expect(analysis.documents[0]?.classification.type).toBe('Government / Benefits Document')
    expect(analysis.overallScore).toBeGreaterThan(0)
    expect(analysis.evidenceMap).toHaveLength(1)
    expect(analysis.checklist.length).toBeGreaterThan(0)
    expect(generateMarkdownReport(analysis.report)).toContain('Human Risk Intelligence Report')
  })
})
