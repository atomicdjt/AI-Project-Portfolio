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
            RedactReady is built for local-first document preparation. Its default architecture keeps documents in the
            browser session, makes automated detections reviewable, and exports safer flattened files where feasible.
          </p>
        </section>

        <section className="about-grid">
          <article>
            <ServerOff size={22} aria-hidden="true" />
            <h2>Local processing boundary</h2>
            <p>
              The app does not include a backend upload route for user documents. PDF rendering, image redaction, text
              replacement, and report generation run client-side.
            </p>
          </article>
          <article>
            <EyeOff size={22} aria-hidden="true" />
            <h2>True redaction strategy</h2>
            <p>
              PDF pages are rendered to canvas, approved boxes are painted into pixels, and a new image-backed PDF is
              generated. Images are overwritten at the pixel level. Text and CSV values are replaced.
            </p>
          </article>
          <article>
            <LockKeyhole size={22} aria-hidden="true" />
            <h2>Threat model</h2>
            <p>
              The MVP reduces accidental sharing of visible identifiers, text-layer identifiers, metadata inherited from
              source PDFs, and simple secrets. It does not defend against compromised browsers or malicious files.
            </p>
          </article>
          <article>
            <FileWarning size={22} aria-hidden="true" />
            <h2>Known limitations</h2>
            <p>
              OCR, face detection, signature detection, and layout-preserving Office exports are roadmap items. Name and
              address detection use conservative heuristics and require review.
            </p>
          </article>
        </section>

        <section className="disclaimer-panel">
          <AlertTriangle size={22} aria-hidden="true" />
          <div>
            <h2>Required safety disclaimer</h2>
            <p>
              RedactReady helps detect and remove potentially sensitive information, but automated detection may miss
              items or flag harmless content. Always review the output before sharing. This tool does not provide legal,
              medical, compliance, or security guarantees.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
