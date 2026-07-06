import { ArrowRight, Search, ShieldCheck, Scale, Briefcase } from 'lucide-react'
import type { Navigate } from '../App'
import { AppHeader } from '../components/AppHeader'

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
            <h1>Redact before you upload.</h1>
            <p>
              RedactReady Local is an assistive privacy tool that helps you review and sanitize documents before sharing them. It runs locally in your browser to keep your sensitive files on your machine.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('/redact')} type="button">
                Start privacy review
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="secondary-button" onClick={() => navigate('/about')} type="button">
                View limitations
              </button>
            </div>
            <small className="trust-note">Assistive privacy review. Human decisions required. No compliance guarantees.</small>
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
                <strong>Suggested findings</strong>
                <span>Possible Email · 98%</span>
                <span>Possible SSN · 97%</span>
                <span>Possible Case ID · 78%</span>
                <button type="button">Export flattened PDF</button>
              </div>
            </div>
          </div>
        </section>

        <section className="workflow-section">
          <h2>How the local-first workflow works</h2>
          <div className="workflow-steps">
            <div>Upload locally</div>
            <div>Detect text</div>
            <div>Review findings</div>
            <div>Redact content</div>
            <div>Verify output</div>
            <div>Export file</div>
          </div>
        </section>

        <section className="use-case-strip">
          <h2>Who is RedactReady for?</h2>
          <div className="use-case-grid">
            <article>
              <Search size={24} aria-hidden="true" />
              <h3>AI Tool Users</h3>
              <p>People sharing files with AI tools who need to sanitize PDFs, screenshots, forms, or logs before upload.</p>
            </article>
            <article>
              <ShieldCheck size={24} aria-hidden="true" />
              <h3>Support Teams & Freelancers</h3>
              <p>Review incident reports, configuration snippets, or client documents for credentials and internal URLs.</p>
            </article>
            <article>
              <Briefcase size={24} aria-hidden="true" />
              <h3>HR, Admin & Small Businesses</h3>
              <p>Check resumes, salary files, performance notes, and business records before sharing them externally.</p>
            </article>
            <article>
              <Scale size={24} aria-hidden="true" />
              <h3>Legal Assistants & Educators</h3>
              <p>Assist with privacy review for discovery documents, case materials, or student-related identifiers.</p>
            </article>
          </div>
        </section>

        <section className="trust-limitations">
          <h2>Trust, File Support, and Limitations</h2>
          <div className="about-grid">
            <article>
              <h3>Local-First & Browser-First</h3>
              <p>Files are processed directly in your web browser. Nothing is uploaded to our servers, giving you control over where your data goes.</p>
            </article>
            <article>
              <h3>Supported Files</h3>
              <p>Works with PDFs, PNGs, JPEGs, and plaintext/CSV files. Large files may perform slowly depending on your device.</p>
            </article>
            <article>
              <h3>Human Review Required</h3>
              <p>Automated detection is approximate and can miss things. There is no guaranteed redaction or guaranteed security.</p>
            </article>
            <article>
              <h3>OCR & Metadata Limits</h3>
              <p>OCR may struggle with handwriting or rotated text. Metadata handling is best-effort and does not guarantee complete removal.</p>
            </article>
          </div>
        </section>

        <section className="final-cta">
          <h2>Run a pre-share privacy check before your next upload.</h2>
          <button className="primary-button" onClick={() => navigate('/redact')} type="button">
            Try the Demo
          </button>
          <p><small>Synthetic sample files are available to help you test safely.</small></p>
        </section>

      </main>
      <footer className="site-footer">
        <p>RedactReady Local is an assistive privacy review tool. It helps identify and review potentially sensitive information before sharing, but it does not guarantee complete detection, complete removal, legal compliance, or security.</p>
      </footer>
    </div>
  )
}
