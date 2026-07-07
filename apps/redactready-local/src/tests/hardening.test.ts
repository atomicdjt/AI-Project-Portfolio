import { describe, expect, it, vi } from 'vitest'
import { exportChecklistForKind } from '../lib/redaction/checklist'
import { metadataSummaryForKind } from '../lib/redaction/metadata'
import { isBarcodeDetectorAvailable } from '../lib/detectors/visualDetectors'
import { detectSensitiveText } from '../lib/detectors'

describe('adaptive export checklist', () => {
  it('uses PDF-specific language for mapping, flattening, OCR, and manual review', () => {
    const checklist = exportChecklistForKind('pdf', 'idle').map((item) => item.text).join(' ')

    expect(checklist).toContain('PDF text-to-box mapping can be approximate')
    expect(checklist).toContain('OCR is experimental')
    expect(checklist).toContain('flattened PDF export loses selectable text')
    expect(checklist).toContain('limited/best-effort')
  })

  it('uses CSV-specific language for replacement verification', () => {
    const checklist = exportChecklistForKind('csv', 'completed').map((item) => item.text).join(' ')

    expect(checklist).toContain('manually reviewed all visible content')
    expect(checklist).toContain('columns, quoting, or formulas')
  })
})

describe('metadata summaries', () => {
  it('documents attempted PDF metadata handling without claiming completeness', () => {
    const metadata = metadataSummaryForKind('pdf')

    expect(metadata.status).toBe('attempted')
    expect(metadata.notes.join(' ')).toContain('does not guarantee')
  })
})

describe('barcode feature detection', () => {
  it('returns false when BarcodeDetector is unavailable', () => {
    vi.stubGlobal('BarcodeDetector', undefined)

    expect(isBarcodeDetectorAvailable()).toBe(false)

    vi.unstubAllGlobals()
  })
})

describe('safe finding labels', () => {
  it('keeps detector labels qualified as possible findings', () => {
    const detections = detectSensitiveText('Email: alex@example.com\nSSN: 123-45-6789')

    expect(detections.map((detection) => detection.label)).toContain('Possible email address')
    expect(detections.map((detection) => detection.label)).toContain('Possible SSN-like identifier')
  })
})

import { buildRedactionReport } from '../lib/redaction/report'
import type { LoadedDocument, DetectionResult, VerificationResult } from '../lib/redaction/types'

describe('zero-leak reporting', () => {
  it('does not leak sensitive values into the JSON report', () => {
    const document: LoadedDocument = {
      id: 'test-1',
      name: 'super-secret-report.pdf',
      kind: 'pdf',
      mimeType: 'application/pdf',
      size: 1024,
      text: '',
      pages: [],
      createdAt: new Date().toISOString(),
      warnings: [],
      metadataNotes: []
    }

    const detections: DetectionResult[] = [
      {
        id: 'd1',
        category: 'email',
        label: 'Possible email',
        valuePreview: 'jane.example@test.local',
        rawValue: 'jane.example@test.local',
        confidence: 0.9,
        source: 'regex',
        placement: 'exact-text',
        reviewStatus: 'unverified',
        approved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'd2',
        category: 'phone',
        label: 'Possible phone',
        valuePreview: '555-123-4567',
        rawValue: '555-123-4567',
        confidence: 0.9,
        source: 'regex',
        placement: 'exact-text',
        reviewStatus: 'unverified',
        approved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'd3',
        category: 'ssn',
        label: 'Possible SSN',
        valuePreview: '123-45-6789',
        rawValue: '123-45-6789',
        confidence: 0.9,
        source: 'regex',
        placement: 'exact-text',
        reviewStatus: 'unverified',
        approved: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'd4',
        category: 'financial',
        label: 'Possible credit card',
        valuePreview: '4111 1111 1111 1111',
        rawValue: '4111 1111 1111 1111',
        confidence: 0.9,
        source: 'regex',
        placement: 'exact-text',
        reviewStatus: 'unverified',
        approved: true,
        createdAt: new Date().toISOString(),
      }
    ]

    const verification: VerificationResult = {
      status: 'pass',
      title: 'Test',
      checkedAt: new Date().toISOString(),
      checkedValues: 4,
      leakedValues: 0,
      messages: []
    }

    const report = buildRedactionReport(document, detections, [], verification)
    const jsonStr = JSON.stringify(report)

    expect(jsonStr).not.toContain('jane.example@test.local')
    expect(jsonStr).not.toContain('555-123-4567')
    expect(jsonStr).not.toContain('123-45-6789')
    expect(jsonStr).not.toContain('4111 1111 1111 1111')
  })
})
