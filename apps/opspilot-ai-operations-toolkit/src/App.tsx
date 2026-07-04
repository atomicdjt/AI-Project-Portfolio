import {
  AlertTriangle,
  Archive,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  Download,
  FileArchive,
  FileClock,
  FileText,
  Gauge,
  History,
  KeyRound,
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
import type {
  AuditEvent,
  ExportBundle,
  FeatureKey,
  IntakeState,
  OpsDocument,
  Organization,
  WorkspaceMode,
  WorkspaceRole,
  WorkspaceSession,
} from './types'

const legacyDocumentStorageKey = 'opspilot.documents.v1'
const workspaceStorageKey = 'opspilot.pro.workspace.v1'

const demoOrganization: Organization = {
  id: 'org-brightline-demo',
  name: 'Brightline Demo Operations',
  plan: 'pro',
  createdAt: '2026-06-05T00:00:00.000Z',
}

const demoSession: WorkspaceSession = {
  userId: 'demo-admin',
  organizationId: demoOrganization.id,
  name: 'Avery Morgan',
  email: 'avery@example.com',
  role: 'admin',
  authenticated: true,
}

interface WorkspaceState {
  organization: Organization
  session: WorkspaceSession
  mode: WorkspaceMode
  documents: OpsDocument[]
  auditEvents: AuditEvent[]
}

const featureNav: Array<{ key: FeatureKey; label: string; icon: typeof FileText }> = [
  { key: 'admin', label: 'Admin Dashboard', icon: LayoutDashboard },
  { key: 'sop', label: 'SOP Builder', icon: FileText },
  { key: 'training', label: 'Training Checklist', icon: ClipboardCheck },
  { key: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { key: 'gaps', label: 'Gap Detector', icon: Gauge },
  { key: 'versions', label: 'Version Tracker', icon: History },
]

function App() {
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>(() => loadWorkspace())
  const [selectedId, setSelectedId] = useState(() => workspaceState.documents[0]?.id ?? '')
  const [activeFeature, setActiveFeature] = useState<FeatureKey>('sop')
  const [intake, setIntake] = useState<IntakeState>(initialIntake)
  const [sampleIndex, setSampleIndex] = useState(0)
  const [libraryQuery, setLibraryQuery] = useState('')
  const [toast, setToast] = useState('Workspace ready')

  const { auditEvents, documents, mode, organization, session } = workspaceState
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
    window.localStorage.setItem(workspaceStorageKey, JSON.stringify(workspaceState))
    window.localStorage.setItem(legacyDocumentStorageKey, JSON.stringify(workspaceState.documents))
  }, [workspaceState])

  function upsertDocument(nextDocument: OpsDocument, audit: Omit<AuditEvent, 'id' | 'createdAt'>) {
    setWorkspaceState((current) => {
      const exists = current.documents.some((document) => document.id === nextDocument.id)
      const nextDocuments = exists
        ? current.documents.map((document) => (document.id === nextDocument.id ? nextDocument : document))
        : [nextDocument, ...current.documents]
      return {
        ...current,
        documents: nextDocuments,
        auditEvents: [completeAudit(audit), ...current.auditEvents],
      }
    })
    setSelectedId(nextDocument.id)
  }

  function handleGenerate() {
    const nextDocument = stampWorkspaceDocument(generateDocument(intake, selectedDocument), session)
    upsertDocument(
      nextDocument,
      createAudit('document.generated', 'document', nextDocument.id, `Generated ${nextDocument.title}.`, {
        mode,
        score: nextDocument.score,
      }),
    )
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
    const nextDocument = stampWorkspaceDocument(generateDocument({ ...intake, business: intake.business || 'New Client' }), session)
    upsertDocument(
      nextDocument,
      createAudit('document.created', 'document', nextDocument.id, `Created ${nextDocument.title}.`, {
        mode,
        type: nextDocument.type,
      }),
    )
    setToast('Created a new operations document')
  }

  function handleUpdateDocument(nextDocument: OpsDocument, message: string, action: string) {
    const stamped = stampWorkspaceDocument(nextDocument, session)
    upsertDocument(
      stamped,
      createAudit(action, 'document', stamped.id, `${message}: ${stamped.title}.`, {
        score: stamped.score,
        openGaps: stamped.gaps.filter((gap) => gap.status === 'Open').length,
      }),
    )
    setToast(message)
  }

  function handleExportMarkdown() {
    if (!selectedDocument) return
    downloadText(`${selectedDocument.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`, toMarkdown(selectedDocument), 'text/markdown')
    recordAudit(
      createAudit('document.exported_markdown', 'export', selectedDocument.id, `Exported Markdown for ${selectedDocument.title}.`, {
        mode,
      }),
    )
    setToast('Exported Markdown document')
  }

  function handleExportWorkspace() {
    const exportAudit = completeAudit(
      createAudit('workspace.exported', 'export', organization.id, `Exported ${documents.length} documents and ${auditEvents.length + 1} audit events.`, {
        documents: documents.length,
        auditEvents: auditEvents.length + 1,
      }),
    )
    const bundle: ExportBundle = {
      organization,
      exportedAt: new Date().toISOString(),
      exportedBy: {
        userId: session.userId,
        name: session.name,
        role: session.role,
      },
      documents,
      auditEvents: [exportAudit, ...auditEvents],
    }
    downloadText('opspilot-workspace-export.json', JSON.stringify(bundle, null, 2), 'application/json')
    setWorkspaceState((current) => ({
      ...current,
      auditEvents: [exportAudit, ...current.auditEvents],
    }))
    setToast('Exported workspace bundle')
  }

  function handlePrint() {
    recordAudit(createAudit('document.print_export', 'export', selectedDocument?.id ?? organization.id, 'Opened PDF print export flow.', { mode }))
    setToast('Opening browser print dialog')
    window.setTimeout(() => window.print(), 120)
  }

  function recordAudit(audit: Omit<AuditEvent, 'id' | 'createdAt'>) {
    setWorkspaceState((current) => ({
      ...current,
      auditEvents: [completeAudit(audit), ...current.auditEvents],
    }))
  }

  function handleModeChange(nextMode: WorkspaceMode) {
    setWorkspaceState((current) => ({
      ...current,
      mode: nextMode,
      session: { ...current.session, authenticated: nextMode === 'authenticated' },
      auditEvents: [
        completeAudit(
          createAudit('workspace.mode_changed', 'workspace', organization.id, `Switched workspace mode to ${nextMode}.`, { mode: nextMode }),
        ),
        ...current.auditEvents,
      ],
    }))
    setToast(nextMode === 'authenticated' ? 'Authenticated workspace mode simulated' : 'Local deterministic demo mode restored')
  }

  function handleRoleChange(role: WorkspaceRole) {
    setWorkspaceState((current) => ({
      ...current,
      session: { ...current.session, role },
      auditEvents: [completeAudit(createAudit('workspace.role_changed', 'workspace', organization.id, `Changed demo role to ${role}.`)), ...current.auditEvents],
    }))
    setToast(`Demo role changed to ${role}`)
  }

  function createAudit(
    action: string,
    targetType: AuditEvent['targetType'],
    targetId: string,
    summary: string,
    metadata?: AuditEvent['metadata'],
  ): Omit<AuditEvent, 'id' | 'createdAt'> {
    return {
      organizationId: organization.id,
      actorId: session.userId,
      actorName: session.name,
      action,
      targetType,
      targetId,
      summary,
      metadata,
    }
  }

  function completeAudit(audit: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
    return {
      ...audit,
      id: `audit-${Math.random().toString(36).slice(2, 10)}`,
      createdAt: new Date().toISOString(),
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="OpsPilot navigation">
        <div className="brand-block">
          <div className="brand-mark">OP</div>
          <div>
            <strong>OpsPilot Pro</strong>
            <span>AI Operations Toolkit</span>
          </div>
        </div>

        <nav className="feature-nav" aria-label="Feature navigation">
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
          <strong>{mode === 'authenticated' ? 'Authenticated demo' : 'Local demo mode'}</strong>
          <span>{session.role} access for {organization.name}</span>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h1>OpsPilot Pro Operations Workspace</h1>
            <p>Saved documents, version history, training checklists, knowledge articles, gap reports, audit logs, and exports.</p>
          </div>
          <div className="topbar-actions">
            <button type="button" onClick={handleNewDocument}>
              <Plus size={17} aria-hidden="true" />
              New document
            </button>
            <button className="primary-action" type="button" onClick={handleGenerate}>
              <Sparkles size={17} aria-hidden="true" />
              Generate from intake
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
            <DocumentWorkspace
              activeFeature={activeFeature}
              auditEvents={auditEvents}
              document={selectedDocument}
              documents={documents}
              mode={mode}
              organization={organization}
              session={session}
              onBodyChange={(body) => selectedDocument && handleUpdateDocument(updateBodyScore(selectedDocument, body), 'Updated draft and recalculated score', 'document.updated')}
              onExportWorkspace={handleExportWorkspace}
              onFixGap={(gapId) => selectedDocument && handleUpdateDocument(markGapFixed(selectedDocument, gapId), 'Marked gap fixed', 'gap.fixed')}
              onModeChange={handleModeChange}
              onRoleChange={handleRoleChange}
              onSaveVersion={() => selectedDocument && handleUpdateDocument(createManualVersion(selectedDocument), 'Saved version snapshot', 'version.created')}
              onToggleTraining={(itemId) =>
                selectedDocument && handleUpdateDocument(toggleTrainingItem(selectedDocument, itemId), 'Updated training checklist', 'training.updated')
              }
            />
          </section>

          {selectedDocument ? (
            <InsightsPanel
              auditCount={auditEvents.length}
              document={selectedDocument}
              mode={mode}
              session={session}
              toast={toast}
              onExportMarkdown={handleExportMarkdown}
              onExportWorkspace={handleExportWorkspace}
              onPrint={handlePrint}
              onPublish={() => handleUpdateDocument(publishDocument(selectedDocument), 'Published to team', 'document.published')}
              onSaveVersion={() => handleUpdateDocument(createManualVersion(selectedDocument), 'Saved version snapshot', 'version.created')}
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
          Generate from intake
        </button>
      </div>
    </section>
  )
}

interface DocumentWorkspaceProps {
  activeFeature: FeatureKey
  auditEvents: AuditEvent[]
  document?: OpsDocument
  documents: OpsDocument[]
  mode: WorkspaceMode
  organization: Organization
  session: WorkspaceSession
  onBodyChange: (body: string) => void
  onExportWorkspace: () => void
  onFixGap: (gapId: string) => void
  onModeChange: (mode: WorkspaceMode) => void
  onRoleChange: (role: WorkspaceRole) => void
  onSaveVersion: () => void
  onToggleTraining: (itemId: string) => void
}

function DocumentWorkspace({
  activeFeature,
  auditEvents,
  document,
  documents,
  mode,
  organization,
  session,
  onBodyChange,
  onExportWorkspace,
  onFixGap,
  onModeChange,
  onRoleChange,
  onSaveVersion,
  onToggleTraining,
}: DocumentWorkspaceProps) {
  if (activeFeature === 'admin') {
    return (
      <AdminDashboard
        auditEvents={auditEvents}
        documents={documents}
        mode={mode}
        organization={organization}
        session={session}
        onExportWorkspace={onExportWorkspace}
        onModeChange={onModeChange}
        onRoleChange={onRoleChange}
      />
    )
  }

  if (!document) return <div className="empty-state">Generate a document to start.</div>

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

function AdminDashboard({
  auditEvents,
  documents,
  mode,
  organization,
  session,
  onExportWorkspace,
  onModeChange,
  onRoleChange,
}: {
  auditEvents: AuditEvent[]
  documents: OpsDocument[]
  mode: WorkspaceMode
  organization: Organization
  session: WorkspaceSession
  onExportWorkspace: () => void
  onModeChange: (mode: WorkspaceMode) => void
  onRoleChange: (role: WorkspaceRole) => void
}) {
  const published = documents.filter((document) => document.status === 'Published').length
  const openGaps = documents.reduce((sum, document) => sum + document.gaps.filter((gap) => gap.status === 'Open').length, 0)

  return (
    <section className="output-panel admin-dashboard" aria-label="Admin and export dashboard">
      <div className="document-title-row">
        <div>
          <span className="doc-type">OpsPilot Pro</span>
          <h2>Admin and export dashboard</h2>
          <p>Optional authenticated workspace mode, saved documents, audit events, and export readiness.</p>
        </div>
        <button className="primary-action" type="button" onClick={onExportWorkspace}>
          <FileArchive size={16} aria-hidden="true" />
          Export workspace
        </button>
      </div>

      <div className="admin-grid">
        <article className="admin-card">
          <Database size={20} aria-hidden="true" />
          <strong>{documents.length}</strong>
          <span>Saved documents</span>
        </article>
        <article className="admin-card">
          <CheckCircle2 size={20} aria-hidden="true" />
          <strong>{published}</strong>
          <span>Published docs</span>
        </article>
        <article className="admin-card">
          <AlertTriangle size={20} aria-hidden="true" />
          <strong>{openGaps}</strong>
          <span>Open gaps</span>
        </article>
        <article className="admin-card">
          <History size={20} aria-hidden="true" />
          <strong>{auditEvents.length}</strong>
          <span>Audit events</span>
        </article>
      </div>

      <div className="admin-controls">
        <label>
          Workspace mode
          <select value={mode} onChange={(event) => onModeChange(event.target.value as WorkspaceMode)}>
            <option value="demo">Local deterministic demo</option>
            <option value="authenticated">Authenticated workspace simulation</option>
          </select>
        </label>
        <label>
          Demo role
          <select value={session.role} onChange={(event) => onRoleChange(event.target.value as WorkspaceRole)}>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>
      </div>

      <div className="workspace-summary">
        <KeyRound size={18} aria-hidden="true" />
        <div>
          <strong>{organization.name}</strong>
          <span>
            {session.name} - {session.role} - {session.authenticated ? 'authenticated' : 'local demo'}
          </span>
        </div>
      </div>

      <AuditTable auditEvents={auditEvents} />
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
                {step.owner} - {step.timing}
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
                {item.owner} - {item.due}
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
              {version.label} - {version.date}
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

function AuditTable({ auditEvents }: { auditEvents: AuditEvent[] }) {
  return (
    <div className="audit-table" role="table" aria-label="Audit log">
      <div className="audit-head" role="row">
        <span>Time</span>
        <span>Actor</span>
        <span>Action</span>
        <span>Summary</span>
      </div>
      {auditEvents.slice(0, 8).map((event) => (
        <div className="audit-row" role="row" key={event.id}>
          <span>{new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span>{event.actorName}</span>
          <span>{event.action}</span>
          <span>{event.summary}</span>
        </div>
      ))}
    </div>
  )
}

interface InsightsPanelProps {
  auditCount: number
  document: OpsDocument
  mode: WorkspaceMode
  session: WorkspaceSession
  toast: string
  onPublish: () => void
  onExportMarkdown: () => void
  onExportWorkspace: () => void
  onPrint: () => void
  onSaveVersion: () => void
}

function InsightsPanel({
  auditCount,
  document,
  mode,
  session,
  toast,
  onPublish,
  onExportMarkdown,
  onExportWorkspace,
  onPrint,
  onSaveVersion,
}: InsightsPanelProps) {
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
          <span>Audit</span>
          <strong>{auditCount}</strong>
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
        <button type="button" onClick={onExportWorkspace}>
          <FileArchive size={16} aria-hidden="true" />
          Export workspace
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
            <span>{mode === 'authenticated' ? `${session.role} authenticated workspace` : 'Local deterministic demo'}</span>
          </div>
          <ListChecks size={18} aria-hidden="true" />
        </div>
        <p>{toast}</p>
      </section>
    </aside>
  )
}

function loadWorkspace(): WorkspaceState {
  try {
    const saved = window.localStorage.getItem(workspaceStorageKey)
    if (saved) {
      const parsed = JSON.parse(saved) as WorkspaceState
      if (Array.isArray(parsed.documents) && parsed.documents.length > 0) return parsed
    }
    const legacyDocuments = window.localStorage.getItem(legacyDocumentStorageKey)
    if (legacyDocuments) {
      const parsed = JSON.parse(legacyDocuments) as OpsDocument[]
      if (Array.isArray(parsed) && parsed.length > 0) return createInitialWorkspace(parsed)
    }
    return createInitialWorkspace(seedDocuments)
  } catch {
    return createInitialWorkspace(seedDocuments)
  }
}

function createInitialWorkspace(documents: OpsDocument[]): WorkspaceState {
  const stampedDocuments = documents.map((document) => stampWorkspaceDocument(document, demoSession))
  return {
    organization: demoOrganization,
    session: demoSession,
    mode: 'demo',
    documents: stampedDocuments,
    auditEvents: [
      {
        id: 'audit-seed',
        organizationId: demoOrganization.id,
        actorId: 'seed',
        actorName: 'OpsPilot Seed',
        action: 'workspace.seeded',
        targetType: 'workspace',
        targetId: demoOrganization.id,
        summary: 'Seeded demo workspace with operations documents, versions, training, articles, gaps, and audit log.',
        createdAt: new Date().toISOString(),
        metadata: { documents: stampedDocuments.length },
      },
    ],
  }
}

function stampWorkspaceDocument(document: OpsDocument, session: WorkspaceSession): OpsDocument {
  return {
    ...document,
    organizationId: session.organizationId,
    createdBy: document.createdBy ?? session.userId,
    updatedBy: session.userId,
  }
}

function downloadText(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default App
