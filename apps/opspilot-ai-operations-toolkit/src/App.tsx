import {
  AlertTriangle,
  Archive,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Download,
  FileClock,
  FileText,
  Gauge,
  History,
  LayoutDashboard,
  ListChecks,
  Plus,
  Printer,
  RefreshCcw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { initialIntake, sampleIntakes, seedDocuments } from './data'
import {
  createManualVersion,
  generateDocument,
  markGapFixed,
  publishDocument,
  toMarkdown,
  toggleTrainingItem,
  updateBodyScore,
} from './opsEngine'
import type { FeatureKey, IntakeState, OpsDocument } from './types'

const storageKey = 'opspilot.documents.v1'

const featureNav: Array<{ key: FeatureKey; label: string; icon: typeof FileText }> = [
  { key: 'sop', label: 'SOP Builder', icon: FileText },
  { key: 'training', label: 'Training Checklist', icon: ClipboardCheck },
  { key: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { key: 'gaps', label: 'Gap Detector', icon: Gauge },
  { key: 'versions', label: 'Version Tracker', icon: History },
]

function App() {
  const [documents, setDocuments] = useState<OpsDocument[]>(() => loadDocuments())
  const [selectedId, setSelectedId] = useState(() => documents[0]?.id ?? '')
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('sop')
  const [intake, setIntake] = useState<IntakeState>(initialIntake)
  const [sampleIndex, setSampleIndex] = useState(0)
  const [libraryQuery, setLibraryQuery] = useState('')
  const [toast, setToast] = useState('Workspace ready')

  const selectedDocument = documents.find((document) => document.id === selectedId) ?? documents[0]
  const filteredDocuments = useMemo(
    () =>
      documents.filter((document) =>
        `${document.title} ${document.business} ${document.department} ${document.owner}`
          .toLowerCase()
          .includes(libraryQuery.toLowerCase()),
      ),
    [documents, libraryQuery],
  )

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(documents))
  }, [documents])

  function upsertDocument(nextDocument: OpsDocument) {
    setDocuments((current) => {
      const exists = current.some((document) => document.id === nextDocument.id)
      return exists
        ? current.map((document) => (document.id === nextDocument.id ? nextDocument : document))
        : [nextDocument, ...current]
    })
    setSelectedId(nextDocument.id)
  }

  function handleGenerate() {
    const nextDocument = generateDocument(intake, selectedDocument)
    upsertDocument(nextDocument)
    setActiveFeature(nextDocument.type === 'Training Checklist' ? 'training' : nextDocument.type === 'Knowledge Base' ? 'knowledge' : 'sop')
    setToast('Generated document, checklist, knowledge base, gaps, and version snapshot')
  }

  function handleLoadSample() {
    const nextIndex = (sampleIndex + 1) % sampleIntakes.length
    setSampleIndex(nextIndex)
    setIntake(sampleIntakes[nextIndex])
    setToast('Loaded sample operations notes')
  }

  function handleNewDocument() {
    const nextDocument = generateDocument({ ...intake, business: intake.business || 'New Client' })
    setDocuments((current) => [nextDocument, ...current])
    setSelectedId(nextDocument.id)
    setToast('Created a new operations document')
  }

  function handleUpdateDocument(nextDocument: OpsDocument, message: string) {
    upsertDocument(nextDocument)
    setToast(message)
  }

  function handleExportMarkdown() {
    if (!selectedDocument) return
    const blob = new Blob([toMarkdown(selectedDocument)], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedDocument.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`
    link.click()
    URL.revokeObjectURL(url)
    setToast('Exported Markdown document')
  }

  function handlePrint() {
    setToast('Opening browser print dialog')
    window.setTimeout(() => window.print(), 120)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="OpsPilot navigation">
        <div className="brand-block">
          <div className="brand-mark">OP</div>
          <div>
            <strong>OpsPilot</strong>
            <span>AI Operations Toolkit</span>
          </div>
        </div>

        <nav className="feature-nav" aria-label="Feature navigation">
          <button className="nav-overview" type="button">
            <LayoutDashboard size={18} aria-hidden="true" />
            Dashboard
          </button>
          {featureNav.map((item) => {
            const Icon = item.icon
            return (
              <button
                className={activeFeature === item.key ? 'active' : ''}
                key={item.key}
                type="button"
                onClick={() => setActiveFeature(item.key)}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-status">
          <ShieldCheck size={20} aria-hidden="true" />
          <strong>Local workspace</strong>
          <span>Saved in this browser. Ready for static deployment.</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h1>AI Documentation &amp; SOP Builder</h1>
            <p>Turn messy internal notes into procedures, onboarding tasks, support articles, gap reports, and tracked revisions.</p>
          </div>
          <div className="topbar-actions">
            <button type="button" onClick={handleNewDocument}>
              <Plus size={17} aria-hidden="true" />
              New document
            </button>
            <button className="primary-action" type="button" onClick={handleGenerate}>
              <Sparkles size={17} aria-hidden="true" />
              Generate document
            </button>
          </div>
        </header>

        <section className="dashboard-grid" aria-label="Operations document workspace">
          <DocumentLibrary
            documents={filteredDocuments}
            selectedId={selectedDocument?.id ?? ''}
            query={libraryQuery}
            onQueryChange={setLibraryQuery}
            onSelect={setSelectedId}
          />

          <section className="main-column" aria-label="Document generator">
            <IntakePanel intake={intake} onChange={setIntake} onGenerate={handleGenerate} onLoadSample={handleLoadSample} />
            {selectedDocument ? (
              <DocumentWorkspace
                activeFeature={activeFeature}
                document={selectedDocument}
                onBodyChange={(body) => handleUpdateDocument(updateBodyScore(selectedDocument, body), 'Updated draft and recalculated score')}
                onToggleTraining={(itemId) => handleUpdateDocument(toggleTrainingItem(selectedDocument, itemId), 'Updated training checklist')}
                onFixGap={(gapId) => handleUpdateDocument(markGapFixed(selectedDocument, gapId), 'Marked gap fixed')}
                onSaveVersion={() => handleUpdateDocument(createManualVersion(selectedDocument), 'Saved version snapshot')}
              />
            ) : (
              <div className="empty-state">Generate a document to start.</div>
            )}
          </section>

          {selectedDocument ? (
            <InsightsPanel
              document={selectedDocument}
              toast={toast}
              onPublish={() => handleUpdateDocument(publishDocument(selectedDocument), 'Published to team')}
              onExportMarkdown={handleExportMarkdown}
              onPrint={handlePrint}
              onSaveVersion={() => handleUpdateDocument(createManualVersion(selectedDocument), 'Saved version snapshot')}
            />
          ) : null}
        </section>
      </main>
    </div>
  )
}

interface DocumentLibraryProps {
  documents: OpsDocument[]
  selectedId: string
  query: string
  onQueryChange: (query: string) => void
  onSelect: (id: string) => void
}

function DocumentLibrary({ documents, selectedId, query, onQueryChange, onSelect }: DocumentLibraryProps) {
  return (
    <section className="library-panel" aria-label="Document library">
      <div className="section-heading">
        <div>
          <h2>Operations library</h2>
          <span>{documents.length} active documents</span>
        </div>
        <Archive size={18} aria-hidden="true" />
      </div>
      <label className="search-box">
        <Search size={16} aria-hidden="true" />
        <input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search documents" />
      </label>
      <div className="document-list">
        {documents.map((document) => (
          <button
            className={document.id === selectedId ? 'document-card active' : 'document-card'}
            key={document.id}
            type="button"
            onClick={() => onSelect(document.id)}
          >
            <span className={`status-dot ${document.risk.toLowerCase()}`} />
            <strong>{document.title}</strong>
            <small>{document.business}</small>
            <span className="card-meta">
              {document.status} <ChevronRight size={14} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

interface IntakePanelProps {
  intake: IntakeState
  onChange: (intake: IntakeState) => void
  onGenerate: () => void
  onLoadSample: () => void
}

function IntakePanel({ intake, onChange, onGenerate, onLoadSample }: IntakePanelProps) {
  return (
    <section className="intake-panel" aria-label="Operations intake">
      <div className="section-heading">
        <div>
          <h2>Operations intake</h2>
          <span>Source notes, policies, FAQs, tickets, and manager context</span>
        </div>
        <button className="text-button" type="button" onClick={onLoadSample}>
          <RefreshCcw size={15} aria-hidden="true" />
          Load sample
        </button>
      </div>

      <div className="field-grid">
        <label>
          Business
          <input value={intake.business} onChange={(event) => onChange({ ...intake, business: event.target.value })} />
        </label>
        <label>
          Role
          <input value={intake.role} onChange={(event) => onChange({ ...intake, role: event.target.value })} />
        </label>
        <label>
          Department
          <input value={intake.department} onChange={(event) => onChange({ ...intake, department: event.target.value })} />
        </label>
        <label>
          Output
          <select
            value={intake.documentType}
            onChange={(event) => onChange({ ...intake, documentType: event.target.value as IntakeState['documentType'] })}
          >
            <option>SOP</option>
            <option>Training Checklist</option>
            <option>Knowledge Base</option>
          </select>
        </label>
      </div>

      <label className="notes-field">
        Messy internal information
        <textarea value={intake.sourceNotes} onChange={(event) => onChange({ ...intake, sourceNotes: event.target.value })} />
      </label>

      <div className="intake-footer">
        <label>
          Priority
          <select value={intake.priority} onChange={(event) => onChange({ ...intake, priority: event.target.value })}>
            <option>Compliance sensitive</option>
            <option>Revenue critical</option>
            <option>Customer visible</option>
            <option>Internal efficiency</option>
          </select>
        </label>
        <button className="primary-action" type="button" onClick={onGenerate}>
          <Sparkles size={17} aria-hidden="true" />
          Generate document
        </button>
      </div>
    </section>
  )
}

interface DocumentWorkspaceProps {
  activeFeature: FeatureKey
  document: OpsDocument
  onBodyChange: (body: string) => void
  onToggleTraining: (itemId: string) => void
  onFixGap: (gapId: string) => void
  onSaveVersion: () => void
}

function DocumentWorkspace({
  activeFeature,
  document,
  onBodyChange,
  onToggleTraining,
  onFixGap,
  onSaveVersion,
}: DocumentWorkspaceProps) {
  return (
    <section className="output-panel" aria-label="Generated output">
      <div className="document-title-row">
        <div>
          <span className="doc-type">{document.type}</span>
          <h2>{document.title}</h2>
          <p>{document.summary}</p>
        </div>
        <div className="document-actions">
          <span className={`status-chip ${document.status.toLowerCase().replace(/\s+/g, '-')}`}>{document.status}</span>
          <button type="button" onClick={onSaveVersion}>
            <Save size={16} aria-hidden="true" />
            Save version
          </button>
        </div>
      </div>

      {activeFeature === 'sop' ? (
        <SopView document={document} onBodyChange={onBodyChange} />
      ) : activeFeature === 'training' ? (
        <TrainingView document={document} onToggleTraining={onToggleTraining} />
      ) : activeFeature === 'knowledge' ? (
        <KnowledgeView document={document} />
      ) : activeFeature === 'gaps' ? (
        <GapView document={document} onFixGap={onFixGap} />
      ) : (
        <VersionView document={document} />
      )}
    </section>
  )
}

function SopView({ document, onBodyChange }: { document: OpsDocument; onBodyChange: (body: string) => void }) {
  return (
    <div className="sop-layout">
      <div className="step-list">
        {document.steps.map((step, index) => (
          <article className="step-row" key={step.id}>
            <span>{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
              <small>
                {step.owner} · {step.timing}
              </small>
            </div>
          </article>
        ))}
      </div>
      <label className="draft-editor">
        Generated SOP
        <textarea value={document.body} onChange={(event) => onBodyChange(event.target.value)} />
      </label>
    </div>
  )
}

function TrainingView({ document, onToggleTraining }: { document: OpsDocument; onToggleTraining: (itemId: string) => void }) {
  const complete = document.checklist.filter((item) => item.done).length

  return (
    <div className="training-view">
      <div className="progress-strip">
        <Users size={20} aria-hidden="true" />
        <strong>
          {complete} of {document.checklist.length} onboarding tasks complete
        </strong>
        <span>{document.owner}</span>
      </div>
      <div className="checklist-list">
        {document.checklist.map((item) => (
          <label className={item.done ? 'check-row done' : 'check-row'} key={item.id}>
            <input type="checkbox" checked={item.done} onChange={() => onToggleTraining(item.id)} />
            <span>
              <strong>{item.task}</strong>
              <small>
                {item.owner} · {item.due}
              </small>
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

function KnowledgeView({ document }: { document: OpsDocument }) {
  return (
    <div className="article-list">
      {document.articles.map((article) => (
        <article className="article-row" key={article.id}>
          <BookOpen size={18} aria-hidden="true" />
          <div>
            <strong>{article.question}</strong>
            <p>{article.answer}</p>
            <small>{article.tags.join(' / ')}</small>
          </div>
        </article>
      ))}
    </div>
  )
}

function GapView({ document, onFixGap }: { document: OpsDocument; onFixGap: (gapId: string) => void }) {
  return (
    <div className="gap-table" role="table" aria-label="Documentation gap detector">
      <div className="gap-head" role="row">
        <span>Risk</span>
        <span>Finding</span>
        <span>Suggested fix</span>
        <span>Status</span>
      </div>
      {document.gaps.map((gap) => (
        <div className="gap-row" role="row" key={gap.id}>
          <span className={`severity ${gap.severity}`}>{gap.severity}</span>
          <span>
            <strong>{gap.title}</strong>
            <small>{gap.evidence}</small>
          </span>
          <span>{gap.fix}</span>
          <button type="button" onClick={() => onFixGap(gap.id)} disabled={gap.status === 'Fixed'}>
            {gap.status === 'Fixed' ? <CheckCircle2 size={15} aria-hidden="true" /> : <AlertTriangle size={15} aria-hidden="true" />}
            {gap.status}
          </button>
        </div>
      ))}
    </div>
  )
}

function VersionView({ document }: { document: OpsDocument }) {
  return (
    <div className="version-list">
      {document.versions.map((version) => (
        <article className="version-row" key={version.id}>
          <FileClock size={18} aria-hidden="true" />
          <div>
            <strong>
              {version.label} · {version.date}
            </strong>
            <small>{version.author}</small>
            <ul>
              {version.changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  )
}

interface InsightsPanelProps {
  document: OpsDocument
  toast: string
  onPublish: () => void
  onExportMarkdown: () => void
  onPrint: () => void
  onSaveVersion: () => void
}

function InsightsPanel({ document, toast, onPublish, onExportMarkdown, onPrint, onSaveVersion }: InsightsPanelProps) {
  const openGaps = document.gaps.filter((gap) => gap.status === 'Open')
  const completion = Math.round((document.checklist.filter((item) => item.done).length / Math.max(1, document.checklist.length)) * 100)

  return (
    <aside className="insights-panel" aria-label="Document insights">
      <section className="score-panel">
        <div className="score-ring" style={{ '--score': `${document.score * 3.6}deg` } as CSSProperties}>
          <strong>{document.score}</strong>
          <span>Score</span>
        </div>
        <div>
          <h2>Document quality</h2>
          <p>{document.risk} compliance risk</p>
          <small>Last revised {document.lastRevised}</small>
        </div>
      </section>

      <section className="metric-stack">
        <div>
          <span>Open gaps</span>
          <strong>{openGaps.length}</strong>
        </div>
        <div>
          <span>Training</span>
          <strong>{completion}%</strong>
        </div>
        <div>
          <span>Versions</span>
          <strong>{document.versions.length}</strong>
        </div>
      </section>

      <section className="review-panel">
        <div className="section-heading compact">
          <div>
            <h2>Review gaps</h2>
            <span>Highest priority fixes</span>
          </div>
          <AlertTriangle size={18} aria-hidden="true" />
        </div>
        {openGaps.slice(0, 3).map((gap) => (
          <div className="review-row" key={gap.id}>
            <span className={`severity ${gap.severity}`}>{gap.severity}</span>
            <strong>{gap.title}</strong>
            <small>{gap.fix}</small>
          </div>
        ))}
        {openGaps.length === 0 ? <p className="quiet-copy">No open findings.</p> : null}
      </section>

      <section className="action-panel">
        <button className="primary-action" type="button" onClick={onPublish}>
          <Send size={16} aria-hidden="true" />
          Publish to team
        </button>
        <button type="button" onClick={onPrint}>
          <Printer size={16} aria-hidden="true" />
          Export PDF
        </button>
        <button type="button" onClick={onExportMarkdown}>
          <Download size={16} aria-hidden="true" />
          Export Markdown
        </button>
        <button type="button" onClick={onSaveVersion}>
          <History size={16} aria-hidden="true" />
          Version Tracker
        </button>
      </section>

      <section className="activity-panel">
        <div className="section-heading compact">
          <div>
            <h2>Activity</h2>
            <span>Current workspace state</span>
          </div>
          <ListChecks size={18} aria-hidden="true" />
        </div>
        <p>{toast}</p>
      </section>
    </aside>
  )
}

function loadDocuments(): OpsDocument[] {
  try {
    const saved = window.localStorage.getItem(storageKey)
    if (!saved) return seedDocuments
    const parsed = JSON.parse(saved) as OpsDocument[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedDocuments
  } catch {
    return seedDocuments
  }
}

export default App
