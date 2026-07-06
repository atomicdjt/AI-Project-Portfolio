import { AlertTriangle, Info } from 'lucide-react'
import { useRedactionStore } from '../state/redactionStore'

export function WorkflowNotices() {
  const { document, barcodeStatus, ocrStatus } = useRedactionStore()
  if (!document) return null

  const notices = [
    ...document.warnings,
    ...document.metadataNotes,
    barcodeStatus === 'unavailable'
      ? 'QR/barcode detection may not be available in this browser. You can still review the file manually and draw redaction boxes.'
      : '',
    ocrStatus === 'completed'
      ? 'OCR is experimental and may miss text. OCR results require manual verification.'
      : '',
    ocrStatus === 'failed'
      ? 'OCR failed in this browser session. Continue with visual review and manual boxes.'
      : '',
  ].filter(Boolean)

  if (notices.length === 0) return null

  return (
    <section className="workflow-notices" aria-label="Review limitations and warnings">
      {notices.map((notice) => (
        <p key={notice}>
          {notice.includes('Large') || notice.includes('failed') || notice.includes('unavailable') ? (
            <AlertTriangle size={15} aria-hidden="true" />
          ) : (
            <Info size={15} aria-hidden="true" />
          )}
          <span>{notice}</span>
        </p>
      ))}
    </section>
  )
}
