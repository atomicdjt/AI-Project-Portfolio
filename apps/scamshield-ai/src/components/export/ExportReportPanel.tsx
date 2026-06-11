import { Download, FileCheck2, LockKeyhole } from 'lucide-react'
import { downloadEvidencePacket } from '../../lib/pdfReport'
import { useCaseStore } from '../../store/useCaseStore'

export function ExportReportPanel() {
  const caseData = useCaseStore((state) => state.caseData)
  const caregiverMode = useCaseStore((state) => state.caregiverMode)
  const exportConsent = useCaseStore((state) => state.exportConsent)
  const setExportConsent = useCaseStore((state) => state.setExportConsent)

  return (
    <section className="section-card export-panel" role="region" aria-label="Evidence packet export">
      <div className="export-icon"><FileCheck2 size={25} aria-hidden="true" /></div>
      <div className="export-copy">
        <p className="eyebrow">Ready for trusted institutions</p>
        <h2>Export the evidence packet</h2>
        <p>The PDF includes the risk summary, submitted evidence, possible indicators, timeline, checklist, reporting guidance, notes, and privacy notice.</p>
        <ul><li>Professional cover and case summary</li><li>Chronological timeline</li><li>Plain-language safer next steps</li><li>Official reporting resource list</li></ul>
      </div>
      <div className="export-actions">
        <label className="export-consent"><input type="checkbox" checked={exportConsent} onChange={(event) => setExportConsent(event.target.checked)} /><span><strong>The report may contain sensitive information.</strong> Store and share it carefully.</span></label>
        <button type="button" className="primary-button" disabled={!exportConsent || !caseData.analysis} onClick={() => downloadEvidencePacket(caseData, caregiverMode)}><Download size={18} /> Download evidence packet PDF</button>
        <p><LockKeyhole size={15} /> PDF generation happens in this browser.</p>
      </div>
    </section>
  )
}
