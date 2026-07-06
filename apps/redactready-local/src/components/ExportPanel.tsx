import { useState } from 'react'
import { Download, FileJson2, ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react'
import { downloadBlob } from '../lib/redaction/download'
import { useRedactionStore } from '../state/redactionStore'

function statusIcon(status: 'pass' | 'warning' | 'fail') {
  if (status === 'pass') return <ShieldCheck size={18} aria-hidden="true" />
  if (status === 'fail') return <ShieldAlert size={18} aria-hidden="true" />
  return <TriangleAlert size={18} aria-hidden="true" />
}

export function ExportPanel() {
  const { document, detections, boxes, exportRedactedFile, exportReport, lastVerification } = useRedactionStore()
  const [acknowledgements, setAcknowledgements] = useState<boolean[]>(() => Array(5).fill(false))

  if (!document) return null

  const approvedDetections = detections.filter((detection) => detection.approved).length
  const approvedBoxes = boxes.filter((box) => box.approved).length
  const exportAcknowledged = acknowledgements.every(Boolean)
  const checklistItems = [
    'I reviewed all suggested findings.',
    'I checked for visible identifiers.',
    'I checked filenames and document title.',
    'I checked metadata and text-layer warnings.',
    'I understand this tool does not guarantee complete redaction.',
  ]

  const exportFile = async () => {
    const result = await exportRedactedFile()
    downloadBlob(result.blob, result.fileName)
  }

  const exportJsonReport = () => {
    const blob = exportReport()
    const base = document.name.replace(/\.[^.]+$/, '') || 'document'
    downloadBlob(blob, `${base}-redaction-report.json`)
  }

  return (
    <aside className="export-panel">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">Verification</span>
          <h2>Verify before sharing</h2>
        </div>
      </div>
      <div className="export-stats">
        <span>
          <strong>{approvedDetections}</strong>
          approved detections
        </span>
        <span>
          <strong>{approvedBoxes}</strong>
          pixel boxes
        </span>
      </div>
      
      <div className="verification-checklist">
        {checklistItems.map((item, index) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={acknowledgements[index]}
              onChange={(event) => {
                const next = [...acknowledgements]
                next[index] = event.currentTarget.checked
                setAcknowledgements(next)
              }}
            />
            {item}
          </label>
        ))}
      </div>

      <button
        className="primary-button wide"
        disabled={!exportAcknowledged}
        onClick={() => void exportFile()}
        title={exportAcknowledged ? 'Export redacted file' : 'Complete the verification checklist before exporting.'}
        type="button"
      >
        <Download size={18} aria-hidden="true" />
        {document.kind === 'pdf' ? 'Export flattened PDF' : document.kind === 'image' ? 'Export redacted PNG' : 'Export redacted text'}
      </button>
      <p className="pre-export-warning">
        {exportAcknowledged
          ? 'Do not share the exported file until you have manually opened and reviewed it.'
          : 'Complete the verification checklist before exporting a file.'}
      </p>
      
      <button className="secondary-button wide" onClick={exportJsonReport} type="button">
        <FileJson2 size={18} aria-hidden="true" />
        Export redaction log
      </button>
      <div className={`verification-card ${lastVerification?.status ?? 'warning'}`}>
        <div>
          {statusIcon(lastVerification?.status ?? 'warning')}
          <strong>{lastVerification?.title ?? 'Verification runs after export'}</strong>
        </div>
        {(lastVerification?.messages ?? ['PDF and image exports are flattened to pixels where possible.']).map((message) => (
          <p key={message}>{message}</p>
        ))}
      </div>
      <p className="disclaimer">
        RedactReady Local helps detect and remove potentially sensitive information, but automated detection may miss items or
        flag harmless content. Always review the output before sharing. This tool does not provide legal, medical,
        compliance, or security guarantees.
      </p>
    </aside>
  )
}
