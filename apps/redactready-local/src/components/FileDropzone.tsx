import { useRef, useState, type ClipboardEvent } from 'react'
import { FileText, FileUp, LockKeyhole, UploadCloud, ClipboardPaste, Image as ImageIcon } from 'lucide-react'
import { SUPPORTED_EXTENSIONS, formatBytes } from '../lib/files/fileType'
import { useRedactionStore } from '../state/redactionStore'

const sampleFiles = [
  { label: 'Synthetic contact', path: '/samples/redactready-synthetic-contact.txt', fileName: 'redactready-synthetic-contact.txt', type: 'text/plain' },
  { label: 'Synthetic invoice CSV', path: '/samples/redactready-synthetic-invoice.csv', fileName: 'redactready-synthetic-invoice.csv', type: 'text/csv' },
  { label: 'Synthetic case notes', path: '/samples/redactready-synthetic-case-notes.txt', fileName: 'redactready-synthetic-case-notes.txt', type: 'text/plain' },
  { label: 'Synthetic resume', path: '/samples/redactready-synthetic-resume.txt', fileName: 'redactready-synthetic-resume.txt', type: 'text/plain' },
  { label: 'Synthetic HR note', path: '/samples/redactready-synthetic-hr-note.txt', fileName: 'redactready-synthetic-hr-note.txt', type: 'text/plain' },
  { label: 'Synthetic client email', path: '/samples/redactready-synthetic-client-email.txt', fileName: 'redactready-synthetic-client-email.txt', type: 'text/plain' },
  { label: 'Synthetic AI prompt', path: '/samples/redactready-synthetic-ai-prompt.txt', fileName: 'redactready-synthetic-ai-prompt.txt', type: 'text/plain' },
  { label: 'Synthetic invoice SVG', path: '/samples/redactready-synthetic-invoice.svg', fileName: 'redactready-synthetic-invoice.svg', type: 'image/svg+xml' },
  { label: 'Synthetic barcode warning', path: '/samples/redactready-synthetic-barcode-warning.svg', fileName: 'redactready-synthetic-barcode-warning.svg', type: 'image/svg+xml' },
]

type InputMode = 'upload' | 'samples' | 'paste'

export function FileDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [mode, setMode] = useState<InputMode>('upload')
  const [pasteText, setPasteText] = useState('')
  const { loadFile, status, progressMessage, error } = useRedactionStore()

  const handleFile = (file?: File) => {
    if (!file) return
    void loadFile(file)
  }

  const loadSample = async (sample: (typeof sampleFiles)[number]) => {
    const response = await fetch(sample.path)
    if (!response.ok) {
      throw new Error(`Could not load ${sample.fileName}.`)
    }
    const blob = await response.blob()
    await loadFile(new File([blob], sample.fileName, { type: sample.type }))
  }

  const handlePasteSubmit = () => {
    if (!pasteText.trim()) return
    const file = new File([pasteText], 'pasted-text.txt', { type: 'text/plain' })
    void loadFile(file)
  }

  const handlePasteEvent = (event: ClipboardEvent) => {
    // Check for images
    const items = event.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile()
        if (blob) {
          const extension = blob.type.split('/')[1] || 'png'
          const file = new File([blob], `pasted-screenshot.${extension}`, { type: blob.type })
          void loadFile(file)
          event.preventDefault()
          return
        }
      }
    }
  }

  return (
    <section className="dropzone-container">
      <div className="input-mode-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '16px', justifyContent: 'center' }}>
        <button className={mode === 'upload' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('upload')}>Upload File</button>
        <button className={mode === 'paste' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('paste')}>Paste Text / Image</button>
        <button className={mode === 'samples' ? 'primary-button' : 'secondary-button'} onClick={() => setMode('samples')}>Synthetic Samples</button>
      </div>

      <div
        className={`dropzone ${dragActive && mode === 'upload' ? 'active' : ''}`}
        style={{ minHeight: '300px' }}
        onDragOver={(event) => {
          if (mode !== 'upload') return
          event.preventDefault()
          setDragActive(true)
        }}
        onDragLeave={() => {
          if (mode !== 'upload') return
          setDragActive(false)
        }}
        onDrop={(event) => {
          if (mode !== 'upload') return
          event.preventDefault()
          setDragActive(false)
          handleFile(event.dataTransfer.files[0])
        }}
      >
        {mode === 'upload' && (
          <>
            <input
              ref={inputRef}
              data-testid="file-input"
              type="file"
              accept={SUPPORTED_EXTENSIONS.join(',')}
              onChange={(event) => handleFile(event.target.files?.[0])}
            />
            <div className="dropzone-icon">
              <UploadCloud size={34} aria-hidden="true" />
            </div>
            <div className="dropzone-copy">
              <h2>Add a file for local privacy review.</h2>
              <p>Upload a PDF, screenshot, scan, image, or document sample to review possible sensitive information before sharing.</p>
              <p className="helper-text">RedactReady Local is an assistive review tool. It does not guarantee detection or removal of every sensitive item.</p>
            </div>
            <button className="primary-button" onClick={() => inputRef.current?.click()} type="button">
              <FileUp size={18} aria-hidden="true" />
              Choose file
            </button>
            <div className="dropzone-meta" style={{ marginTop: '16px' }}>
              <span>{SUPPORTED_EXTENSIONS.join(' ')}</span>
              <span>Max local MVP size: {formatBytes(50 * 1024 * 1024)}</span>
            </div>
          </>
        )}

        {mode === 'paste' && (
          <div className="paste-mode" style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
            <div className="dropzone-icon">
              <ClipboardPaste size={34} aria-hidden="true" />
            </div>
            <h2>Paste Text or Image</h2>
            <p>Paste plain text below, or paste a screenshot (Ctrl+V) directly into this panel.</p>
            <textarea
              style={{ width: '100%', minHeight: '150px', padding: '12px', margin: '16px 0', border: '1px solid var(--border)', borderRadius: '6px', background: 'var(--background)', color: 'var(--text)' }}
              placeholder="Paste plain text here..."
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              onPaste={handlePasteEvent}
            />
            <button className="primary-button" onClick={handlePasteSubmit} disabled={!pasteText.trim()} type="button">
              Review Pasted Text
            </button>
            <p className="privacy-inline" style={{ marginTop: '16px' }}>
              <LockKeyhole size={16} aria-hidden="true" />
              Pasted content is processed locally in this browser session.
            </p>
          </div>
        )}

        {mode === 'samples' && (
          <div className="samples-mode" style={{ width: '100%' }}>
            <h2>Try synthetic privacy-review samples</h2>
            <p className="helper-text" style={{ marginBottom: '16px' }}>These samples are entirely fake. Use them to test the workflow before uploading real documents. Note that visual samples require OCR (which may miss text) and barcode detection depends on your browser's support (e.g., iOS Safari lacks native barcode support).</p>
            <div className="sample-actions" aria-label="Synthetic sample files" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
              {sampleFiles.map((sample) => (
                <button key={sample.fileName} className="secondary-button" onClick={() => void loadSample(sample)} type="button">
                  {sample.type.includes('image') ? <ImageIcon size={16} aria-hidden="true" /> : <FileText size={16} aria-hidden="true" />}
                  {sample.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {mode === 'upload' && (
        <p className="privacy-inline" style={{ marginTop: '16px' }}>
          <LockKeyhole size={16} aria-hidden="true" />
          Files remain in memory for this session unless you export or clear them.
        </p>
      )}
      {status === 'loading' ? <p className="status-line">{progressMessage}</p> : null}
      {error ? <p className="error-line">{error}</p> : null}
    </section>
  )
}

