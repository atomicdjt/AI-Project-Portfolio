import { useState } from 'react'
import { redactTextContent } from '../lib/redaction/textRedaction'
import { useRedactionStore } from '../state/redactionStore'
import { LayoutPanelLeft } from 'lucide-react'

export function TextPreview() {
  const { document, detections } = useRedactionStore()
  const [showOriginal, setShowOriginal] = useState(true)
  if (!document) return null
  const redacted = redactTextContent(document.text, detections)

  return (
    <div className={`text-preview-grid ${!showOriginal ? 'collapsed-original' : ''}`}>
      {showOriginal && (
        <section className="text-pane">
          <header>
            <strong>Original preview</strong>
            <span>Local memory only</span>
          </header>
          <pre>{document.text || 'No text content found.'}</pre>
        </section>
      )}
      <section className="text-pane redacted">
        <header>
          <strong>Redacted output preview</strong>
          <span>Approved items replaced</span>
          <button 
            type="button" 
            className="ghost-button toggle-original" 
            onClick={() => setShowOriginal(!showOriginal)}
            title={showOriginal ? 'Hide original preview' : 'Show original preview'}
          >
            <LayoutPanelLeft size={16} />
            <span className="sr-only">{showOriginal ? 'Hide original preview' : 'Show original preview'}</span>
            <span className="desktop-only">{showOriginal ? 'Hide original' : 'Show original'}</span>
          </button>
        </header>
        <pre data-testid="redacted-text-preview">{redacted || 'No text content found.'}</pre>
      </section>
    </div>
  )
}
