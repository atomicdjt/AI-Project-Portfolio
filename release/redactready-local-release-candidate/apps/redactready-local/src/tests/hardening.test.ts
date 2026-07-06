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
    expect(checklist).toContain('does not guarantee detection or redaction')
  })

  it('uses CSV-specific language for replacement verification', () => {
    const checklist = exportChecklistForKind('csv', 'completed').map((item) => item.text).join(' ')

    expect(checklist).toContain('pattern-based CSV findings')
    expect(checklist).toContain('columns, quoting, formulas, or downstream imports')
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
