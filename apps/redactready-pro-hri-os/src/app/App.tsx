import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  EyeOff,
  FileText,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  Lock,
  Map,
  Printer,
  Radar,
  RotateCcw,
  ShieldCheck,
  Upload,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { demoPackets } from '../data/demoPackets'
import { analyzePacket, type DocumentInput } from '../modules/analysis/analyzePacket'
import { generateMarkdownReport } from '../modules/reports/generateReport'
import { redactText } from '../modules/redaction/redactText'
import type { ChecklistItem, DetectionFinding, DocumentItem, RedactionRule, SeverityBand } from '../types/hri'

type PageId = 'dashboard' | 'intake' | 'analysis' | 'redaction' | 'evidence' | 'report' | 'demo' | 'methodology'

const navItems: Array<{ id: PageId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'intake', label: 'Intake', icon: Upload },
  { id: 'analysis', label: 'Analysis', icon: Gauge },
  { id: 'redaction', label: 'Redaction Studio', icon: EyeOff },
  { id: 'evidence', label: 'Evidence Map', icon: Map },
  { id: 'report', label: 'Report Builder', icon: FileText },
  { id: 'demo', label: 'Demo', icon: FolderOpen },
  { id: 'methodology', label: 'Methodology', icon: ShieldCheck },
]

const starterDocuments = demoPackets[0].documents

function severityClass(band: SeverityBand): string {
  return `severity severity-${band.toLowerCase()}`
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function uniqueFindings(findings: DetectionFinding[]): DetectionFinding[] {
  const seen = new Set<string>()
  return findings.filter((finding) => {
    const key = `${finding.type}:${finding.match}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export function App() {
  const [activePage, setActivePage] = useState<PageId>('dashboard')
  const [inputs, setInputs] = useState<DocumentInput[]>(starterDocuments)
  const [draftTitle, setDraftTitle] = useState('Manual intake note')
  const [draftText, setDraftText] = useState('')
  const [selectedDocumentId, setSelectedDocumentId] = useState(starterDocuments[0]?.id ?? 'doc-1')
  const [redactionOverrides, setRedactionOverrides] = useState<Record<string, boolean>>({})
  const [completedChecklist, setCompletedChecklist] = useState<Record<string, boolean>>({})

  const analysis = useMemo(() => analyzePacket(inputs), [inputs])
  const selectedDocument = analysis.documents.find((document) => document.id === selectedDocumentId) ?? analysis.documents[0]
  const markdownReport = useMemo(() => generateMarkdownReport(analysis.report), [analysis.report])
  const redactionRules = useMemo<RedactionRule[]>(() => {
    if (!selectedDocument) return []
    return selectedDocument.detectedEntities.map((finding) => ({
      findingId: finding.id,
      label: finding.suggestedRedaction,
      enabled: redactionOverrides[finding.id] ?? true,
    }))
  }, [redactionOverrides, selectedDocument])
  const redactedText = selectedDocument ? redactText(selectedDocument.rawText, selectedDocument.detectedEntities, redactionRules) : ''
  const highPriorityOpen = analysis.checklist.filter((item) => item.priority === 'High' && !completedChecklist[item.id]).length

  function addDraftDocument() {
    if (!draftText.trim()) return
    const id = `manual-${Date.now()}`
    setInputs((current) => [
      ...current,
      {
        id,
        title: draftTitle.trim() || 'Manual intake note',
        source: 'pasted text',
        rawText: draftText.trim(),
      },
    ])
    setSelectedDocumentId(id)
    setDraftText('')
    setDraftTitle('Manual intake note')
    setActivePage('analysis')
  }

  async function handleFileUpload(fileList: FileList | null) {
    const files = Array.from(fileList ?? [])
    const loaded = await Promise.all(
      files.map(async (file) => {
        if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
          return {
            id: `upload-${file.name}-${Date.now()}`,
            title: file.name,
            source: 'txt upload' as const,
            rawText: await file.text(),
          }
        }

        return {
          id: `upload-${file.name}-${Date.now()}`,
          title: file.name,
          source: 'manual note' as const,
          rawText: `Placeholder intake record for ${file.name}. Browser-only PDF and image parsing is documented as a roadmap item in this MVP. Add extracted text manually for full local analysis.`,
        }
      }),
    )
    setInputs((current) => [...current, ...loaded])
    if (loaded[0]) setSelectedDocumentId(loaded[0].id ?? selectedDocumentId)
  }

  function loadDemoPacket(packetId: string) {
    const packet = demoPackets.find((candidate) => candidate.id === packetId)
    if (!packet) return
    setInputs(packet.documents)
    setSelectedDocumentId(packet.documents[0]?.id ?? 'doc-1')
    setRedactionOverrides({})
    setCompletedChecklist({})
    setActivePage('dashboard')
  }

  function resetSession() {
    setInputs(starterDocuments)
    setSelectedDocumentId(starterDocuments[0]?.id ?? 'doc-1')
    setDraftText('')
    setRedactionOverrides({})
    setCompletedChecklist({})
  }

  function renderMetricCards() {
    return (
      <section className="metric-grid" aria-label="Packet summary">
        <MetricCard icon={Gauge} label="HRI Score" value={`${analysis.overallScore}/100`} detail={analysis.overallBand} band={analysis.overallBand} />
        <MetricCard icon={FileText} label="Documents" value={analysis.documents.length.toString()} detail="local session" />
        <MetricCard icon={AlertTriangle} label="Sensitive Findings" value={analysis.allFindings.length.toString()} detail={`${uniqueFindings(analysis.allFindings).length} unique`} />
        <MetricCard icon={ClipboardList} label="Open High Priority" value={highPriorityOpen.toString()} detail="checklist items" />
      </section>
    )
  }

  function renderDashboard() {
    return (
      <div className="page-stack">
        <section className="hero-panel">
          <div>
            <h1>Human Risk Intelligence OS</h1>
            <p>
              Local-first packet review for sensitive information, redaction readiness, evidence mapping, and professional shareable summaries.
            </p>
          </div>
          <div className="hero-actions">
            <button className="primary-command" onClick={() => setActivePage('intake')}>
              <Upload size={17} /> Add document
            </button>
            <button onClick={() => setActivePage('report')}>
              <FileText size={17} /> Generate Report
            </button>
          </div>
        </section>
        {renderMetricCards()}
        <section className="dashboard-grid">
          <Panel title="Risk Category Breakdown" icon={BarChart3}>
            <div className="score-list">
              {analysis.categoryScores.map((score) => (
                <div className="score-row" key={score.category}>
                  <div>
                    <strong>{score.category}</strong>
                    <span>{score.explanation}</span>
                  </div>
                  <div className="score-meter" aria-label={`${score.category}: ${score.score}`}>
                    <i style={{ width: `${score.score}%` }} />
                  </div>
                  <span className={severityClass(score.band)}>{score.band}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Redact Before Sharing" icon={EyeOff}>
            <FindingList findings={analysis.allFindings.slice(0, 7)} />
          </Panel>
          <Panel title="Evidence Map Preview" icon={Map}>
            <div className="evidence-list compact">
              {analysis.evidenceMap.slice(0, 3).map((item) => (
                <article key={item.id}>
                  <strong>{item.documentTitle}</strong>
                  <span>{item.claim}</span>
                  <small>{item.supportLevel} support</small>
                </article>
              ))}
            </div>
          </Panel>
          <Panel title="Action Checklist" icon={ClipboardList}>
            <Checklist items={analysis.checklist.slice(0, 6)} completed={completedChecklist} onToggle={setCompletedChecklist} />
          </Panel>
        </section>
      </div>
    )
  }

  function renderIntake() {
    return (
      <div className="page-stack">
        <PageHeading title="Intake Center" description="Paste text, upload .txt files, or load fictional demo packets. PDF and image files get graceful placeholder records for manual text extraction in this browser-only MVP." />
        <section className="intake-grid">
          <Panel title="Paste Text" icon={ClipboardList}>
            <label className="field-label">
              Document title
              <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} />
            </label>
            <label className="field-label">
              Document text
              <textarea value={draftText} onChange={(event) => setDraftText(event.target.value)} placeholder="Paste document text, notes, form fields, or screenshot OCR text here." />
            </label>
            <button className="primary-command" onClick={addDraftDocument} disabled={!draftText.trim()}>
              Analyze text
            </button>
          </Panel>
          <Panel title="Upload Files" icon={Upload}>
            <label className="dropzone">
              <Upload size={28} />
              <strong>Upload .txt files</strong>
              <span>PDF and image uploads are recorded with a clear fallback note.</span>
              <input type="file" multiple accept=".txt,.pdf,image/*" onChange={(event) => void handleFileUpload(event.target.files)} />
            </label>
          </Panel>
        </section>
        <DocumentTable documents={analysis.documents} onSelect={setSelectedDocumentId} selectedId={selectedDocument?.id} />
      </div>
    )
  }

  function renderAnalysis() {
    return (
      <div className="page-stack">
        <PageHeading title="Analysis" description="Classification, sensitive finding detection, and HRI category scoring are generated locally with deterministic rules." />
        {renderMetricCards()}
        <section className="analysis-grid">
          <DocumentTable documents={analysis.documents} onSelect={setSelectedDocumentId} selectedId={selectedDocument?.id} />
          <Panel title="Selected Document Findings" icon={Radar}>
            {selectedDocument ? (
              <>
                <div className="document-context">
                  <h3>{selectedDocument.title}</h3>
                  <p>{selectedDocument.classification.reasoning}</p>
                </div>
                <FindingList findings={selectedDocument.detectedEntities} />
              </>
            ) : (
              <EmptyState text="Add a document to inspect findings." />
            )}
          </Panel>
        </section>
      </div>
    )
  }

  function renderRedaction() {
    return (
      <div className="page-stack">
        <PageHeading title="Redaction Studio" description="Toggle detected entities, generate readable redacted text, then copy or download the result. Manual verification is still required before sharing." />
        {selectedDocument ? (
          <section className="redaction-grid">
            <Panel title="Detected Items" icon={EyeOff}>
              <div className="redaction-actions">
                <button onClick={() => setRedactionOverrides(Object.fromEntries(selectedDocument.detectedEntities.map((finding) => [finding.id, true])))}>
                  Maximum privacy mode
                </button>
                <button onClick={() => setRedactionOverrides(Object.fromEntries(selectedDocument.detectedEntities.map((finding) => [finding.id, false])))}>
                  Disable all
                </button>
              </div>
              <div className="toggle-list">
                {selectedDocument.detectedEntities.map((finding) => (
                  <label key={finding.id} className="toggle-row">
                    <input
                      type="checkbox"
                      checked={redactionOverrides[finding.id] ?? true}
                      onChange={(event) => setRedactionOverrides((current) => ({ ...current, [finding.id]: event.target.checked }))}
                    />
                    <span>
                      <strong>{finding.label}</strong>
                      <small>
                        {finding.match}
                        {' -> '}
                        {finding.suggestedRedaction}
                      </small>
                    </span>
                  </label>
                ))}
              </div>
            </Panel>
            <Panel title="Original Text" icon={FileText}>
              <pre className="text-preview">{selectedDocument.rawText}</pre>
            </Panel>
            <Panel title="Redacted Output" icon={Lock}>
              <div className="redaction-actions">
                <button onClick={() => void navigator.clipboard.writeText(redactedText)}>
                  <Copy size={16} /> Copy
                </button>
                <button onClick={() => downloadText(`${selectedDocument.title.replace(/\W+/g, '-').toLowerCase()}-redacted.txt`, redactedText)}>
                  <Download size={16} /> Download
                </button>
              </div>
              <pre className="text-preview redacted">{redactedText}</pre>
            </Panel>
          </section>
        ) : (
          <EmptyState text="Add a document before redaction." />
        )}
      </div>
    )
  }

  function renderEvidence() {
    return (
      <div className="page-stack">
        <PageHeading title="Evidence Map" description="Connects each document to support level, useful snippets, missing context, and possible contradictions." />
        <div className="evidence-list">
          {analysis.evidenceMap.map((item) => (
            <article key={item.id}>
              <div className="evidence-heading">
                <strong>{item.documentTitle}</strong>
                <span>{item.supportLevel}</span>
              </div>
              <p>{item.claim}</p>
              <ul>
                {item.snippets.map((snippet) => (
                  <li key={snippet}>{snippet}</li>
                ))}
              </ul>
              {item.missingInformation.length > 0 && <small>Missing: {item.missingInformation.join(' ')}</small>}
              {item.contradictions.length > 0 && <small>Contradictions: {item.contradictions.join(' ')}</small>}
            </article>
          ))}
        </div>
      </div>
    )
  }

  function renderReport() {
    return (
      <div className="page-stack">
        <PageHeading title="Report Builder" description="Preview, copy, download, or print a Human Risk Intelligence Report for the current local session." />
        <section className="report-actions">
          <button onClick={() => void navigator.clipboard.writeText(markdownReport)}>
            <Copy size={16} /> Copy report
          </button>
          <button onClick={() => downloadText('human-risk-intelligence-report.md', markdownReport)}>
            <Download size={16} /> Download .md
          </button>
          <button onClick={() => window.print()}>
            <Printer size={16} /> Print to PDF
          </button>
        </section>
        <article className="report-preview">
          <pre>{markdownReport}</pre>
        </article>
      </div>
    )
  }

  function renderDemo() {
    return (
      <div className="page-stack">
        <PageHeading title="Demo Mode" description="Load fictional packets that show the product without uploading anything. No real personal data is included." />
        <section className="demo-grid">
          {demoPackets.map((packet) => (
            <article className="demo-card" key={packet.id}>
              <h3>{packet.title}</h3>
              <p>{packet.summary}</p>
              <small>{packet.documents.length} demo documents</small>
              <button className="primary-command" onClick={() => loadDemoPacket(packet.id)}>
                Load packet
              </button>
            </article>
          ))}
        </section>
      </div>
    )
  }

  function renderMethodology() {
    return (
      <div className="page-stack readable">
        <PageHeading title="About / Methodology" description="RedactReady Pro is a deterministic, local-first MVP for organization, privacy review, and sharing readiness." />
        <Panel title="Privacy Posture" icon={ShieldCheck}>
          <p>
            Documents are processed in browser memory for this MVP. No document content is sent to a server, no paid external API is required, and users can reset the session at any time.
          </p>
        </Panel>
        <Panel title="How HRI Scoring Works" icon={Gauge}>
          <p>
            The Human Risk Intelligence Score combines privacy exposure, administrative risk, identity risk, context risk, sharing readiness, and evidence strength. It is an organization and readiness score, not an official decision.
          </p>
        </Panel>
        <Panel title="Limitations" icon={AlertTriangle}>
          <p>
            This product does not provide legal, medical, financial, government-benefits, accounting, or official agency advice. Pattern matching can miss context or overmatch text, so redactions and report conclusions must be manually verified.
          </p>
        </Panel>
      </div>
    )
  }

  const pageContent = {
    dashboard: renderDashboard,
    intake: renderIntake,
    analysis: renderAnalysis,
    redaction: renderRedaction,
    evidence: renderEvidence,
    report: renderReport,
    demo: renderDemo,
    methodology: renderMethodology,
  }[activePage]()

  return (
    <div className="hri-shell">
      <aside className="app-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">RR</div>
          <div>
            <strong>RedactReady Pro</strong>
            <span>Human Risk Intelligence OS</span>
          </div>
        </div>
        <nav aria-label="Primary">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button aria-label={item.label} className={activePage === item.id ? 'active' : ''} key={item.id} onClick={() => setActivePage(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>
      <main>
        <header className="topbar">
          <div className="session-status">
            <span>
              <Lock size={15} /> Local session
            </span>
            <span>No external API</span>
            <span>In-memory review</span>
          </div>
          <button onClick={resetSession}>
            <RotateCcw size={16} /> Reset
          </button>
        </header>
        <div className="content-scroll">{pageContent}</div>
      </main>
    </div>
  )
}

function PageHeading({ title, description }: { title: string; description: string }) {
  return (
    <section className="page-heading">
      <h1>{title}</h1>
      <p>{description}</p>
    </section>
  )
}

function Panel({ title, icon: Icon, children }: { title: string; icon: typeof LayoutDashboard; children: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Icon size={18} />
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function MetricCard({ icon: Icon, label, value, detail, band }: { icon: typeof LayoutDashboard; label: string; value: string; detail: string; band?: SeverityBand }) {
  return (
    <article className="metric-card">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small className={band ? severityClass(band) : undefined}>{detail}</small>
    </article>
  )
}

function FindingList({ findings }: { findings: DetectionFinding[] }) {
  if (findings.length === 0) return <EmptyState text="No sensitive findings detected by the deterministic engine." />
  return (
    <div className="finding-list">
      {findings.map((finding) => (
        <article key={finding.id}>
          <div>
            <strong>{finding.label}</strong>
            <span>{finding.explanation}</span>
          </div>
          <code>{finding.suggestedRedaction}</code>
          <small className={severityClass(finding.severity)}>{finding.severity}</small>
        </article>
      ))}
    </div>
  )
}

function Checklist({
  items,
  completed,
  onToggle,
}: {
  items: ChecklistItem[]
  completed: Record<string, boolean>
  onToggle: Dispatch<SetStateAction<Record<string, boolean>>>
}) {
  return (
    <div className="checklist">
      {items.map((item) => (
        <label key={item.id}>
          <input
            type="checkbox"
            checked={completed[item.id] ?? item.complete}
            onChange={(event) => onToggle((current) => ({ ...current, [item.id]: event.target.checked }))}
          />
          <span>
            <strong>{item.group}</strong>
            <small>
              {item.priority} priority - {item.explanation}
            </small>
          </span>
        </label>
      ))}
    </div>
  )
}

function DocumentTable({
  documents,
  selectedId,
  onSelect,
}: {
  documents: DocumentItem[]
  selectedId?: string
  onSelect: (id: string) => void
}) {
  return (
    <Panel title="Documents Reviewed" icon={FileText}>
      <div className="document-table">
        {documents.map((document) => (
          <button className={selectedId === document.id ? 'selected' : ''} key={document.id} onClick={() => onSelect(document.id)}>
            <span>
              <strong>{document.title}</strong>
              <small>{document.classification.type}</small>
            </span>
            <span>{document.detectedEntities.length} findings</span>
            <span>{Math.round(document.classification.confidence * 100)}%</span>
          </button>
        ))}
      </div>
    </Panel>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="empty-state">
      <CheckCircle2 size={20} />
      <span>{text}</span>
    </div>
  )
}
