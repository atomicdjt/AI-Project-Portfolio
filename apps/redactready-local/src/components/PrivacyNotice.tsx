import { LockKeyhole, ServerOff, ShieldCheck } from 'lucide-react'

export function PrivacyNotice() {
  return (
    <section className="privacy-notice">
      <div>
        <ServerOff size={20} aria-hidden="true" />
        <strong>No upload endpoint</strong>
        <span>Core file processing runs in the browser. This MVP does not create a server route that receives documents.</span>
      </div>
      <div>
        <LockKeyhole size={20} aria-hidden="true" />
        <strong>True redaction exports</strong>
        <span>PDFs and images are flattened to pixels. Text and CSV values are replaced in the output.</span>
      </div>
      <div>
        <ShieldCheck size={20} aria-hidden="true" />
        <strong>Human review required</strong>
        <span>Detectors are explainable and editable, but users must review every sensitive area before sharing.</span>
      </div>
    </section>
  )
}
