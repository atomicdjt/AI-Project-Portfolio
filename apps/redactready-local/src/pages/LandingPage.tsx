import { ArrowRight, Search, ShieldCheck, Scale, Heart, Briefcase } from 'lucide-react'
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
              RedactReady Local helps you spot, review, redact, and verify potentially sensitive information before sharing documents with AI tools, email, clients, vendors, or public platforms — with processing designed to stay on your device.
            </p>
            <ul className="hero-bullets">
              <li><strong>Local-first review:</strong> Review files before they leave your machine.</li>
              <li><strong>Sensitive-data detection hints:</strong> Surface possible names, emails, phone numbers, IDs, financial data, and other risky content.</li>
              <li><strong>Human-in-the-loop verification:</strong> Review every finding, choose what to redact, and verify before export.</li>
            </ul>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => navigate('/redact')} type="button">
                Try the Local Demo
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="secondary-button" onClick={() => navigate('/about')} type="button">
                View Privacy Workflow
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

        <section className="why-section">
          <h2>Redaction is more than black boxes.</h2>
          <p>
            Visual cover-ups can miss hidden text, OCR layers, metadata, comments, filenames, annotations, and copied text. 
            RedactReady Local is designed as a pre-share workflow that helps you inspect sensitive content before a document is sent outside your control.
          </p>
        </section>

        <section className="use-case-strip">
          <h2>Built for the files people actually share.</h2>
          <div className="use-case-grid">
            <article>
              <Search size={24} aria-hidden="true" />
              <h3>AI Uploads</h3>
              <p>Sanitize PDFs, screenshots, forms, notes, and logs before uploading them to external AI tools.</p>
            </article>
            <article>
              <ShieldCheck size={24} aria-hidden="true" />
              <h3>Security & Support</h3>
              <p>Review screenshots, logs, incident reports, and configuration snippets for credentials, tokens, hostnames, and internal URLs.</p>
            </article>
            <article>
              <Briefcase size={24} aria-hidden="true" />
              <h3>HR & Operations</h3>
              <p>Check resumes, salary files, performance notes, and employee records before sharing them externally.</p>
            </article>
            <article>
              <Scale size={24} aria-hidden="true" />
              <h3>Legal & Case Files</h3>
              <p>Review filings, exhibits, discovery documents, and case materials for personal identifiers and sensitive account details.</p>
            </article>
            <article>
              <Heart size={24} aria-hidden="true" />
              <h3>Healthcare & Education</h3>
              <p>Assist with privacy review for documents that may contain health, benefits, student, or research-related identifiers.</p>
              <small>Not a compliance certification tool.</small>
            </article>
          </div>
        </section>

        <section className="trust-limitations">
          <h2>What RedactReady Local does — and does not — do.</h2>
          <p>
            RedactReady Local supports privacy-aware workflows by helping you find and review potentially sensitive information. It does not provide legal advice, does not certify regulatory compliance, and does not guarantee complete removal of all sensitive data. Use it as one step in a broader review process.
          </p>
        </section>

        <section className="local-first-section">
          <h2>Keep sensitive content on your machine.</h2>
          <p>
            RedactReady Local is designed around local review: inspect the original file, mark risky content, apply redactions, and export a sanitized copy. The goal is to reduce unnecessary exposure before files are uploaded, emailed, or shared.
          </p>
        </section>

        <section className="final-cta">
          <h2>Run a pre-share privacy check before your next upload.</h2>
          <button className="primary-button" onClick={() => navigate('/redact')} type="button">
            Open the Demo
          </button>
          <p><small>Use sample documents first. Review all outputs manually before sharing real files.</small></p>
        </section>

      </main>
      <footer className="site-footer">
        <p>RedactReady Local is an assistive privacy review tool. It helps identify and review potentially sensitive information before sharing, but it does not guarantee complete detection, complete removal, legal compliance, or security.</p>
      </footer>
    </div>
  )
}
