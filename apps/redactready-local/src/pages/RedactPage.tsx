import type { Navigate } from '../App'
import { AppHeader } from '../components/AppHeader'
import { DetectionSidebar } from '../components/DetectionSidebar'
import { ExportPanel } from '../components/ExportPanel'
import { FileDropzone } from '../components/FileDropzone'
import { RedactionCanvas } from '../components/RedactionCanvas'
import { TextPreview } from '../components/TextPreview'
import { WorkspaceToolbar } from '../components/WorkspaceToolbar'
import { useRedactionStore } from '../state/redactionStore'

interface RedactPageProps {
  navigate: Navigate
}

export function RedactPage({ navigate }: RedactPageProps) {
  const { document, status, progressMessage } = useRedactionStore()

  return (
    <div className="app-workspace-shell">
      <AppHeader navigate={navigate} current="redact" />
      <WorkspaceToolbar />
      {!document ? (
        <main className="upload-screen">
          <FileDropzone />
          <section className="startup-panel">
            <h1>Private review before export</h1>
            <p>
              Start with a local file, then inspect detections before exporting. Redaction boxes are applied into pixels
              for PDFs/images, and text files are rewritten with redaction labels.
            </p>
            <div className="startup-grid">
              <span>PDF text-layer scan</span>
              <span>Manual box drawing</span>
              <span>TXT/CSV replacement</span>
              <span>JSON redaction log</span>
            </div>
            <p className="status-line">{status === 'loading' ? progressMessage : 'Ready for a local document.'}</p>
          </section>
        </main>
      ) : (
        <main className="redaction-workspace">
          <section className="document-stage">{document.kind === 'text' || document.kind === 'csv' ? <TextPreview /> : <RedactionCanvas />}</section>
          <DetectionSidebar />
          <ExportPanel />
        </main>
      )}
    </div>
  )
}
