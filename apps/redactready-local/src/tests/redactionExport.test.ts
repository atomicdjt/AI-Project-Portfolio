import { describe, expect, it } from 'vitest'
import { detectSensitiveText } from '../lib/detectors'
import { buildRedactionReport } from '../lib/redaction/report'
import { redactTextContent } from '../lib/redaction/textRedaction'
import { verifyRedactedText } from '../lib/redaction/verification'
import type { LoadedDocument, VerificationResult } from '../lib/redaction/types'

describe('text redaction export', () => {
  it('replaces approved sensitive values with category tokens', () => {
    const text = 'Email: alex@example.com\nPhone: 202-555-0188\nSSN: 123-45-6789'
    const detections = detectSensitiveText(text)
    const redacted = redactTextContent(text, detections)

    expect(redacted).toContain('[REDACTED_EMAIL]')
    expect(redacted).toContain('[REDACTED_PHONE]')
    expect(redacted).toContain('[REDACTED_SSN]')
    expect(redacted).not.toContain('alex@example.com')
    expect(redacted).not.toContain('123-45-6789')
  })

  it('fails verification if an approved raw value remains', () => {
    const text = 'Email: alex@example.com'
    const detections = detectSensitiveText(text)
    const verification = verifyRedactedText(text, detections)

    expect(verification.status).toBe('fail')
    expect(verification.leakedValues).toBe(1)
  })

  it('passes verification after text replacement', () => {
    const text = 'Email: alex@example.com'
    const detections = detectSensitiveText(text)
    const redacted = redactTextContent(text, detections)
    const verification = verifyRedactedText(redacted, detections)

    expect(verification.status).toBe('pass')
    expect(verification.leakedValues).toBe(0)
  })
})

describe('redaction report', () => {
  it('does not include raw sensitive values', () => {
    const text = 'Email: alex@example.com'
    const detections = detectSensitiveText(text)
    const document: LoadedDocument = {
      id: 'doc-1',
      name: 'sample.txt',
      kind: 'text',
      mimeType: 'text/plain',
      size: text.length,
      text,
      pages: [],
      createdAt: new Date().toISOString(),
      warnings: [],
    }
    const verification: VerificationResult = verifyRedactedText(redactTextContent(text, detections), detections)
    const report = buildRedactionReport(document, detections, [], verification)

    expect(JSON.stringify(report)).not.toContain('alex@example.com')
    expect(report.localOnly).toBe(true)
    expect(report.categories.email).toBe(1)
  })
})
