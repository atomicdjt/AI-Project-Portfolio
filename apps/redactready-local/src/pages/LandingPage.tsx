import { ArrowRight, CheckCircle2, FileText, ScanSearch, ShieldCheck } from 'lucide-react'
import type { Navigate } from '../App'
import { AppHeader } from '../components/AppHeader'
import { PrivacyNotice } from '../components/PrivacyNotice'

interface LandingPageProps {
  navigate: Navigate
}

export function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="site-shell">
      <AppHeader navigate={navigate} current="home" />
      <main className="landing-main">
        <section className="landing-hero">
          <div className="hero-copy">
            <h1>Redact sensitive files before sharing them.</h1>
            <p>
              RedactReady is a local-first redaction workspace for PDFs, screenshots, images, text, and CSV files. Detect
              private identifiers, review every finding, draw manual boxes, then export a flattened sanitized copy.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('/redact')} type="button">
                Start Redacting
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="secondary-button" onClick={() => navigate('/about')} type="button">
                Privacy model
              </button>
            </div>
          </div>
          <div className="product-preview" aria-label="RedactReady workflow preview">
            <div className="preview-toolbar">
              <span />
              <strong>insurance-intake.pdf</strong>
              <em>Local only</em>
            </div>
            <div className="preview-grid">
              <div className="preview-document">
                <span className="preview-line long" />
                <span className="preview-line" />
                <span className="preview-redaction redaction-a" />
                <span className="preview-line medium" />
                <span className="preview-redaction redaction-b" />
                <span className="preview-line short" />
              </div>
              <div className="preview-side">
                <strong>Detected items</strong>
                <span>Email · 98%</span>
                <span>SSN · 97%</span>
                <span>Case ID · 78%</span>
                <button type="button">Export flattened PDF</button>
              </div>
            </div>
          </div>
        </section>

        <PrivacyNotice />

        <section className="feature-band">
          <article>
            <ShieldCheck size={24} aria-hidden="true" />
            <h2>Local-first processing</h2>
            <p>No document upload service, no analytics, and no file-content telemetry in the MVP.</p>
          </article>
          <article>
            <ScanSearch size={24} aria-hidden="true" />
            <h2>Hybrid detection</h2>
            <p>Regex and heuristics catch structured identifiers, while custom search and manual boxes cover context.</p>
          </article>
          <article>
            <FileText size={24} aria-hidden="true" />
            <h2>Verification report</h2>
            <p>Export a redaction log with category counts, warnings, and verification status without raw sensitive values.</p>
          </article>
        </section>

        <section className="workflow-section">
          <h2>Upload, review, export</h2>
          <div className="workflow-steps">
            {[
              'Import PDF, PNG, JPG, TXT, or CSV',
              'Approve, reject, edit, or draw redactions',
              'Export flattened output and a redaction log',
            ].map((step) => (
              <div key={step}>
                <CheckCircle2 size={20} aria-hidden="true" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
