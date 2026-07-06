import { useRef, useState } from 'react'
import { FileText, FileUp, LockKeyhole, UploadCloud } from 'lucide-react'
import { SUPPORTED_EXTENSIONS, formatBytes } from '../lib/files/fileType'
import { useRedactionStore } from '../state/redactionStore'

const sampleFiles = [
  {
    label: 'Synthetic contact',
    path: '/samples/redactready-synthetic-contact.txt',
    fileName: 'redactready-synthetic-contact.txt',
    type: 'text/plain',
  },
  {
    label: 'Synthetic invoice',
    path: '/samples/redactready-synthetic-invoice.csv',
    fileName: 'redactready-synthetic-invoice.csv',
    type: 'text/csv',
  },
  {
    label: 'Synthetic case notes',
    path: '/samples/redactready-synthetic-case-notes.txt',
    fileName: 'redactready-synthetic-case-notes.txt',
    type: 'text/plain',
  },
]

export function FileDropzone() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragActive, setDragActive] = useState(false)
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

  return (
    <section
      className={`dropzone ${dragActive ? 'active' : ''}`}
      onDragOver={(event) => {
        event.preventDefault()
        setDragActive(true)
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={(event) => {
        event.preventDefault()
        setDragActive(false)
        handleFile(event.dataTransfer.files[0])
      }}
    >
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
      <div className="dropzone-meta">
        <span>{SUPPORTED_EXTENSIONS.join(' ')}</span>
        <span>Max local MVP size: {formatBytes(50 * 1024 * 1024)}</span>
      </div>
      <div className="sample-actions" aria-label="Synthetic sample files">
        {sampleFiles.map((sample) => (
          <button key={sample.fileName} className="secondary-button" onClick={() => void loadSample(sample)} type="button">
            <FileText size={16} aria-hidden="true" />
            {sample.label}
          </button>
        ))}
      </div>
      <p className="privacy-inline">
        <LockKeyhole size={16} aria-hidden="true" />
        Files remain in memory for this session unless you export or clear them.
      </p>
      {status === 'loading' ? <p className="status-line">{progressMessage}</p> : null}
      {error ? <p className="error-line">{error}</p> : null}
    </section>
  )
}
