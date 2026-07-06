import { AlertTriangle, EyeOff, FileWarning, LockKeyhole, ServerOff } from 'lucide-react'
import type { Navigate } from '../App'
import { AppHeader } from '../components/AppHeader'

interface AboutPageProps {
  navigate: Navigate
}

export function AboutPage({ navigate }: AboutPageProps) {
  return (
    <div className="site-shell">
      <AppHeader navigate={navigate} current="about" />
      <main className="about-main">
        <section className="about-intro">
          <h1>Privacy model and limitations</h1>
          <p>
            RedactReady Local is built for local-first document preparation. Its default architecture is designed to keep documents in the
              browser session, make automated detections reviewable, and export flattened review copies where feasible.
          </p>
        </section>

        <section className="about-grid">
          <article>
            <ServerOff size={22} aria-hidden="true" />
            <h2>Local processing boundary</h2>
            <p>
              RedactReady Local is designed to process document review workflows locally in the browser or local runtime. RedactReady Local does not intentionally send document contents to external servers.
            </p>
          </article>
          <article>
            <EyeOff size={22} aria-hidden="true" />
            <h2>Flattened export strategy</h2>
            <p>
              PDF pages are rendered to canvas, approved boxes are painted into pixels, and a new image-backed PDF is
              generated. Images are overwritten at the pixel level. Text and CSV values are replaced.
            </p>
          </article>
          <article>
            <LockKeyhole size={22} aria-hidden="true" />
            <h2>Assistive Workflow</h2>
            <p>
              The product helps surface risk. The user remains responsible for deciding what must be redacted. RedactReady Local provides privacy review assistance. You make the final decisions.
            </p>
          </article>
          <article>
            <FileWarning size={22} aria-hidden="true" />
            <h2>Known limitations</h2>
            <p>
              OCR, face detection, signature detection, and layout-preserving Office exports are roadmap items. Name and
              address detection use conservative heuristics and require review. Redaction can fail if sensitive content remains in hidden text, OCR layers, metadata, comments, annotations, filenames, embedded objects, cached previews, or unreviewed attachments. Always verify the final exported file.
            </p>
          </article>
        </section>

        <section className="disclaimer-panel">
          <AlertTriangle size={22} aria-hidden="true" />
          <div>
            <h2>Required safety disclaimer</h2>
            <p>
              RedactReady Local is designed to support local-first privacy review workflows. It can help users identify, review, mark, and verify potentially sensitive information in documents before sharing them externally. It does not provide legal advice, does not certify compliance with HIPAA, FERPA, FOIA, GLBA, GDPR, or any other regulation, and does not guarantee that all sensitive information will be detected or removed. Users are responsible for manually reviewing all files, exports, metadata, filenames, hidden text layers, OCR text, comments, annotations, and other document artifacts before sharing.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
