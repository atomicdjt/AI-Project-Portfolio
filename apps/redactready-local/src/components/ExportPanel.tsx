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

  if (!document) return null

  const approvedDetections = detections.filter((detection) => detection.approved).length
  const approvedBoxes = boxes.filter((box) => box.approved).length

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
          <h2>Export package</h2>
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
      <button className="primary-button wide" onClick={() => void exportFile()} type="button">
        <Download size={18} aria-hidden="true" />
        {document.kind === 'pdf' ? 'Export flattened PDF' : document.kind === 'image' ? 'Export redacted PNG' : 'Export redacted text'}
      </button>
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
        RedactReady helps detect and remove potentially sensitive information, but automated detection may miss items or
        flag harmless content. Always review the output before sharing. This tool does not provide legal, medical,
        compliance, or security guarantees.
      </p>
    </aside>
  )
}
