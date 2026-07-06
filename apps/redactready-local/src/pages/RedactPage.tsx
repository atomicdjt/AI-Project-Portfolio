import type { Navigate } from '../App'
import { AppHeader } from '../components/AppHeader'
import { DetectionSidebar } from '../components/DetectionSidebar'
import { ExportPanel } from '../components/ExportPanel'
import { FileDropzone } from '../components/FileDropzone'
import { RedactionCanvas } from '../components/RedactionCanvas'
import { TextPreview } from '../components/TextPreview'
import { WorkspaceToolbar } from '../components/WorkspaceToolbar'
import { WorkflowNotices } from '../components/WorkflowNotices'
import { useRedactionStore } from '../state/redactionStore'

interface RedactPageProps {
  navigate: Navigate
}

export function RedactPage({ navigate }: RedactPageProps) {
  const { document, status, progressMessage } = useRedactionStore()

  return (
    <div className="app-workspace-shell">
      <AppHeader navigate={navigate} current="redact" />
      <div className="demo-banner">
        Demo Mode: This workspace uses sample files and simulated findings to show the review workflow. Always manually verify real documents before sharing.
      </div>
      <WorkspaceToolbar />
      {!document ? (
        <main className="upload-screen">
          <FileDropzone />
          <section className="startup-panel">
            <h1>Start Here: Run a Local Privacy Review</h1>
            <div className="startup-grid">
              <div>
                <strong>Step 1 - Load the sample</strong>
                <p>Open a synthetic sample or your own local file to see common sensitive-data risks, including names, emails, account-style numbers, internal references, and possible credentials.</p>
              </div>
              <div>
                <strong>Step 2 - Review suggested findings</strong>
                <p>RedactReady Local highlights potential sensitive information. These findings are suggestions, not guarantees.</p>
              </div>
              <div>
                <strong>Step 3 - Add manual redactions</strong>
                <p>Use manual redaction for anything the tool did not flag, including images, signatures, headers, footers, filenames, screenshots, or context-specific details.</p>
              </div>
              <div>
                <strong>Step 4 - Use OCR carefully</strong>
                <p>For PDFs or images, optional local OCR may surface additional text. OCR is experimental and still requires manual verification.</p>
              </div>
              <div>
                <strong>Step 5 - Export a reviewed copy</strong>
                <p>Complete the file-specific checklist and export a redacted copy for review. Do not share it until you manually open and inspect the output.</p>
              </div>
              <div>
                <strong>Step 6 - Verify before sharing</strong>
                <p>Confirm the reviewed file meets your requirements. RedactReady Local supports the workflow, but final responsibility stays with the user.</p>
              </div>
            </div>
            <p className="status-line">{status === 'loading' ? progressMessage : 'Ready for a local document.'}</p>
            <p className="demo-footer-note">
              Demo data is synthetic. Do not upload real sensitive documents to a public demo unless you have verified the deployment and privacy model.
            </p>
          </section>
        </main>
      ) : (
        <>
          <WorkflowNotices />
          <main className="redaction-workspace">
            <section className="document-stage">{document.kind === 'text' || document.kind === 'csv' ? <TextPreview /> : <RedactionCanvas />}</section>
            <DetectionSidebar />
            <ExportPanel />
          </main>
        </>
      )}
    </div>
  )
}
