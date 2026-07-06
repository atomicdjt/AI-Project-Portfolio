import { useState } from 'react'
import { Download, FileJson2, ShieldAlert, ShieldCheck, TriangleAlert } from 'lucide-react'
import { exportChecklistForKind } from '../lib/redaction/checklist'
import { downloadBlob } from '../lib/redaction/download'
import { useRedactionStore } from '../state/redactionStore'

function statusIcon(status: 'pass' | 'warning' | 'fail') {
  if (status === 'pass') return <ShieldCheck size={18} aria-hidden="true" />
  if (status === 'fail') return <ShieldAlert size={18} aria-hidden="true" />
  return <TriangleAlert size={18} aria-hidden="true" />
}

export function ExportPanel() {
  const {
    document,
    detections,
    boxes,
    exportRedactedFile,
    exportReport,
    lastVerification,
    lastExportSummary,
    ocrStatus,
  } = useRedactionStore()
  const [acknowledgements, setAcknowledgements] = useState<Record<string, boolean>>({})

  if (!document) return null

  const approvedDetections = detections.filter((detection) => detection.approved).length
  const approvedBoxes = boxes.filter((box) => box.approved).length
  const checklistItems = exportChecklistForKind(document.kind, ocrStatus)
  const exportAcknowledged = checklistItems.every((item) => acknowledgements[item.id])

  // Group checklist items
  const groupedChecklist = checklistItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = []
    acc[item.group].push(item)
    return acc
  }, {} as Record<string, typeof checklistItems>)

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
        {Object.entries(groupedChecklist).map(([groupName, items]) => (
          <div key={groupName} className="checklist-group">
            <h3 className="checklist-group-title">{groupName}</h3>
            {items.map((item) => (
              <label key={item.id}>
                <input
                  type="checkbox"
                  checked={Boolean(acknowledgements[item.id])}
                  onChange={(event) => {
                    const isChecked = event.currentTarget.checked
                    setAcknowledgements((current) => ({ ...current, [item.id]: isChecked }))
                  }}
                />
                {item.text}
              </label>
            ))}
          </div>
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
          : 'Complete the file-specific verification checklist before exporting a file.'}
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
      {lastExportSummary ? (
        <div className="export-summary">
          <strong>Last export summary</strong>
          <span>{lastExportSummary.fileName}</span>
          <span>
            {lastExportSummary.fileType.toUpperCase()} - {lastExportSummary.redactedCount} redaction action
            {lastExportSummary.redactedCount === 1 ? '' : 's'}
          </span>
          <span>{lastExportSummary.findingsReviewed} findings reviewed</span>
          <span>{lastExportSummary.rejectedOrIgnored} rejected or ignored</span>
          <span>{lastExportSummary.manualBoxes} manual box{lastExportSummary.manualBoxes === 1 ? '' : 'es'} approved</span>
          <span>OCR status: {lastExportSummary.ocrStatus}</span>
          <span>Metadata handling: {lastExportSummary.metadataHandling}</span>
          <p>Open the exported file and visually inspect every page or value before sharing.</p>
        </div>
      ) : null}
      <p className="disclaimer">
        RedactReady Local helps detect and remove potentially sensitive information, but automated detection may miss items or
        flag harmless content. Always review the output before sharing. This tool does not provide legal, medical,
        compliance, or security guarantees.
      </p>
    </aside>
  )
}
