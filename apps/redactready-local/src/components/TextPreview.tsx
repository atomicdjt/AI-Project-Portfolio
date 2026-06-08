import { redactTextContent } from '../lib/redaction/textRedaction'
import { useRedactionStore } from '../state/redactionStore'

export function TextPreview() {
  const { document, detections } = useRedactionStore()
  if (!document) return null
  const redacted = redactTextContent(document.text, detections)

  return (
    <div className="text-preview-grid">
      <section className="text-pane">
        <header>
          <strong>Original preview</strong>
          <span>Local memory only</span>
        </header>
        <pre>{document.text || 'No text content found.'}</pre>
      </section>
      <section className="text-pane redacted">
        <header>
          <strong>Redacted output preview</strong>
          <span>Approved items replaced</span>
        </header>
        <pre data-testid="redacted-text-preview">{redacted || 'No text content found.'}</pre>
      </section>
    </div>
  )
}
