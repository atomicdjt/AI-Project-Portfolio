import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Beaker,
  BookOpen,
  CheckCircle2,
  ClipboardCopy,
  Database,
  Dna,
  Download,
  FileJson,
  FileText,
  FlaskConical,
  Gauge,
  Library,
  Microscope,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { defaultCase, variantCases } from '../data/cases'
import { buildDossier } from '../modules/evidence/buildDossier'
import { generateMarkdownReport } from '../modules/reports/generateReport'
import type { EvidenceStatus, SourceKind, VariantCase, VariantInput } from '../types/variant'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
type TabId = 'overview' | 'sources' | 'report' | 'method'

const tabs: Array<{ id: TabId; label: string; icon: IconComponent }> = [
  { id: 'overview', label: 'Dossier', icon: Gauge },
  { id: 'sources', label: 'Sources', icon: Database },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'method', label: 'Method', icon: ShieldAlert },
]

const sourceKinds: Array<SourceKind | 'All'> = ['All', 'Normalization', 'Population', 'Curated database', 'Protein', 'Structure', 'Literature']

function formatFrequency(value: number) {
  if (value === 0) return '0%'
  return `${(value * 100).toFixed(value < 0.001 ? 4 : 3)}%`
}

function downloadText(filename: string, content: string, type = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function fieldInputFromCase(variantCase: VariantCase): VariantInput {
  return {
    gene: variantCase.gene,
    variant: variantCase.variant,
    hgvs: variantCase.hgvs,
    gnomadId: variantCase.gnomadId,
    build: variantCase.build,
    condition: variantCase.condition,
  }
}

export function App() {
  const [activeCaseId, setActiveCaseId] = useState(defaultCase.id)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [sourceFilter, setSourceFilter] = useState<SourceKind | 'All'>('All')
  const [query, setQuery] = useState('')
  const [fields, setFields] = useState<VariantInput>(fieldInputFromCase(defaultCase))
  const [copied, setCopied] = useState(false)

  const activeCase = variantCases.find((variantCase) => variantCase.id === activeCaseId) ?? defaultCase
  const dossier = useMemo(() => buildDossier(activeCase, fields), [activeCase, fields])
  const report = useMemo(() => generateMarkdownReport(activeCase, dossier), [activeCase, dossier])
  const jsonBundle = useMemo(() => JSON.stringify({ case: activeCase, dossier }, null, 2), [activeCase, dossier])

  const filteredCases = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return variantCases
    return variantCases.filter((variantCase) =>
      `${variantCase.title} ${variantCase.gene} ${variantCase.variant} ${variantCase.condition}`.toLowerCase().includes(needle),
    )
  }, [query])

  const visibleSources = dossier.sourceRecords.filter((record) => sourceFilter === 'All' || record.kind === sourceFilter)

  function selectCase(variantCase: VariantCase) {
    setActiveCaseId(variantCase.id)
    setFields(fieldInputFromCase(variantCase))
    setActiveTab('overview')
    setCopied(false)
  }

  async function copyReport() {
    await navigator.clipboard.writeText(report)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="vv-shell">
      <aside className="case-rail" aria-label="Variant case library">
        <div className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            VV
          </div>
          <div>
            <strong>VariantVision Pro</strong>
            <span>Evidence workbench</span>
          </div>
        </div>

        <label className="search-box">
          <Search size={16} aria-hidden="true" />
          <span className="sr-only">Search case library</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search variants" />
        </label>

        <nav className="case-list" aria-label="Curated cases">
          {filteredCases.map((variantCase) => (
            <button
              className={variantCase.id === activeCase.id ? 'active' : ''}
              key={variantCase.id}
              onClick={() => selectCase(variantCase)}
              type="button"
            >
              <span>
                <strong>{variantCase.gene}</strong>
                <small>{variantCase.variant}</small>
              </span>
              <em>{variantCase.condition}</em>
            </button>
          ))}
        </nav>

        <section className="rail-note" aria-label="Responsible scope">
          <ShieldAlert size={18} aria-hidden="true" />
          <strong>Educational review only</strong>
          <p>No diagnosis, treatment guidance, risk prediction, genetic counseling, or automated ACMG/AMP classification.</p>
        </section>
      </aside>

      <main className="workbench">
        <header className="topbar">
          <div>
            <h1>{dossier.headline}</h1>
            <p>{activeCase.summary}</p>
          </div>
          <div className="topbar-actions">
            <button type="button" onClick={() => setFields(fieldInputFromCase(activeCase))}>
              <RotateCcw size={16} /> Reset case
            </button>
            <button className="primary-command" type="button" onClick={() => downloadText('variantvision-dossier.md', report)}>
              <Download size={16} /> Export dossier
            </button>
          </div>
        </header>

        <section className="input-deck" aria-label="Variant input controls">
          <label>
            Gene
            <input value={fields.gene} onChange={(event) => setFields((current) => ({ ...current, gene: event.target.value }))} />
          </label>
          <label>
            Protein change
            <input value={fields.variant} onChange={(event) => setFields((current) => ({ ...current, variant: event.target.value }))} />
          </label>
          <label>
            Genomic HGVS
            <input value={fields.hgvs} onChange={(event) => setFields((current) => ({ ...current, hgvs: event.target.value }))} />
          </label>
          <label>
            gnomAD-style ID
            <input value={fields.gnomadId} onChange={(event) => setFields((current) => ({ ...current, gnomadId: event.target.value }))} />
          </label>
          <label>
            Build
            <select value={fields.build} onChange={(event) => setFields((current) => ({ ...current, build: event.target.value as VariantInput['build'] }))}>
              <option>GRCh38</option>
              <option>GRCh37</option>
            </select>
          </label>
        </section>

        <section className="metric-strip" aria-label="Evidence summary metrics">
          <MetricCard icon={Gauge} label="Evidence score" value={`${dossier.evidenceScore}/100`} detail={dossier.confidenceBand} tone={dossier.evidenceScore >= 80 ? 'good' : 'warn'} />
          <MetricCard icon={Dna} label="Normalized ID" value={dossier.normalized.vcfId ?? 'Review'} detail={dossier.normalized.parsedFrom} />
          <MetricCard icon={Activity} label="Fixture AF" value={formatFrequency(dossier.populationSummary.estimatedFrequency)} detail={dossier.populationSummary.highestGroup} />
          <MetricCard icon={Library} label="Source records" value={dossier.sourceRecords.length.toString()} detail={`${dossier.literature.length} literature leads`} />
        </section>

        <div className="tabbar" role="tablist" aria-label="Workbench sections">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                aria-selected={activeTab === tab.id}
                className={activeTab === tab.id ? 'active' : ''}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                role="tab"
                type="button"
              >
                <Icon aria-hidden="true" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <section className="workspace-grid">
          <div className="workspace-primary">
            {activeTab === 'overview' && (
              <div className="page-stack">
                <Panel icon={Sparkles} title="Evidence Quality Model">
                  <div className="score-list">
                    {dossier.metrics.map((metric) => (
                      <article className="score-row" key={metric.label}>
                        <div>
                          <strong>{metric.label}</strong>
                          <span>{metric.explanation}</span>
                        </div>
                        <div className="score-meter" aria-label={`${metric.label} score ${metric.score}`}>
                          <i style={{ width: `${metric.score}%` }} />
                        </div>
                        <StatusChip status={metric.status} />
                      </article>
                    ))}
                  </div>
                </Panel>

                <div className="two-column">
                  <Panel icon={Beaker} title="Amino Acid Substitution">
                    <div className="aa-grid">
                      <AminoCard label="Original" code={dossier.aminoAcid.original.code} name={dossier.aminoAcid.original.name} detail={`${dossier.aminoAcid.original.charge}; ${dossier.aminoAcid.original.polarity}`} />
                      <AminoCard label="Replacement" code={dossier.aminoAcid.replacement.code} name={dossier.aminoAcid.replacement.name} detail={`${dossier.aminoAcid.replacement.charge}; ${dossier.aminoAcid.replacement.polarity}`} />
                    </div>
                    <dl className="compact-facts">
                      <div>
                        <dt>Charge shift</dt>
                        <dd>{dossier.aminoAcid.chargeShift}</dd>
                      </div>
                      <div>
                        <dt>Polarity shift</dt>
                        <dd>{dossier.aminoAcid.polarityShift}</dd>
                      </div>
                      <div>
                        <dt>Hydropathy delta</dt>
                        <dd>{dossier.aminoAcid.hydropathyDelta}</dd>
                      </div>
                    </dl>
                    <p className="analysis-note">{dossier.aminoAcid.interpretation}</p>
                  </Panel>

                  <Panel icon={Microscope} title="Protein + Structure Context">
                    <dl className="compact-facts">
                      <div>
                        <dt>Protein</dt>
                        <dd>{activeCase.protein}</dd>
                      </div>
                      <div>
                        <dt>UniProt</dt>
                        <dd>{activeCase.uniprot}</dd>
                      </div>
                      <div>
                        <dt>Transcript</dt>
                        <dd>{activeCase.transcript}</dd>
                      </div>
                      <div>
                        <dt>Position</dt>
                        <dd>{activeCase.position}</dd>
                      </div>
                    </dl>
                    <p className="analysis-note">{activeCase.structuralContext}</p>
                  </Panel>
                </div>

                <Panel icon={Activity} title="Population Frequency Fixture">
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Source</th>
                          <th>Group</th>
                          <th>AC</th>
                          <th>AN</th>
                          <th>Homozygotes</th>
                          <th>AF</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeCase.population.map((row) => (
                          <tr key={`${row.source}-${row.group}`}>
                            <td>{row.source}</td>
                            <td>{row.group}</td>
                            <td>{row.alleleCount.toLocaleString()}</td>
                            <td>{row.alleleNumber.toLocaleString()}</td>
                            <td>{row.homozygotes.toLocaleString()}</td>
                            <td>{formatFrequency(row.alleleCount / row.alleleNumber)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="muted">Population frequency is one evidence stream only. It does not determine clinical significance by itself.</p>
                </Panel>
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="page-stack">
                <Panel icon={Database} title="Source Transparency">
                  <div className="filter-row" aria-label="Source filters">
                    {sourceKinds.map((kind) => (
                      <button className={sourceFilter === kind ? 'active' : ''} key={kind} onClick={() => setSourceFilter(kind)} type="button">
                        {kind}
                      </button>
                    ))}
                  </div>
                  <div className="source-list">
                    {visibleSources.map((record) => (
                      <article className="source-card" key={record.id}>
                        <div>
                          <span>{record.kind}</span>
                          <h3>{record.label}</h3>
                        </div>
                        <StatusChip status={record.status} />
                        <p>{record.detail}</p>
                        <footer>
                          <small>{record.source} - {record.lastReviewed}</small>
                          {record.url && (
                            <a href={record.url} target="_blank" rel="noreferrer">
                              Open source <ArrowUpRight size={14} aria-hidden="true" />
                            </a>
                          )}
                        </footer>
                      </article>
                    ))}
                  </div>
                </Panel>

                <Panel icon={BookOpen} title="Literature Handoff">
                  <div className="literature-list">
                    {dossier.literature.map((item) => (
                      <article key={item.id}>
                        <strong>{item.title}</strong>
                        <span>
                          {item.journal}, {item.year} - {item.role}
                        </span>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          PubMed lead <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
            )}

            {activeTab === 'report' && (
              <div className="page-stack">
                <section className="report-actions" aria-label="Report actions">
                  <button type="button" onClick={copyReport}>
                    <ClipboardCopy size={16} /> {copied ? 'Copied' : 'Copy Markdown'}
                  </button>
                  <button type="button" onClick={() => downloadText('variantvision-dossier.md', report)}>
                    <FileText size={16} /> Download .md
                  </button>
                  <button type="button" onClick={() => downloadText('variantvision-bundle.json', jsonBundle, 'application/json;charset=utf-8')}>
                    <FileJson size={16} /> Download JSON
                  </button>
                </section>
                <article className="report-preview">
                  <pre>{report}</pre>
                </article>
              </div>
            )}

            {activeTab === 'method' && (
              <div className="page-stack readable">
                <Panel icon={ShieldAlert} title="Responsible Scope">
                  <p>{dossier.responsibleBoundary}</p>
                  <p>
                    VariantVision Pro is intentionally designed as an evidence organization tool. It does not compute ACMG/AMP classifications, does not infer diagnosis, and does not replace source review by qualified humans.
                  </p>
                </Panel>
                <Panel icon={FlaskConical} title="How This MVP Works">
                  <ol className="method-list">
                    <li>Parse gnomAD-style IDs and simple genomic HGVS coordinates locally.</li>
                    <li>Route genome builds to explicit gnomAD dataset labels.</li>
                    <li>Compare amino acid properties for explainable protein-impact context.</li>
                    <li>Summarize curated source fixtures with review status, provenance, and limitations.</li>
                    <li>Generate Markdown and JSON dossiers without a backend or external runtime dependency.</li>
                  </ol>
                </Panel>
                <Panel icon={AlertTriangle} title="Known Limitations">
                  <p>
                    The demo fixtures are not live database calls. They prove the workflow, data model, UX, and source-transparency pattern. Real research use would need live API refresh, versioned transcripts, reference validation, liftover handling, and auditable source timestamps.
                  </p>
                </Panel>
              </div>
            )}
          </div>

          <aside className="inspector" aria-label="Evidence inspector">
            <Panel icon={Dna} title="Normalized Representation">
              <dl className="inspector-facts">
                <div>
                  <dt>Dataset</dt>
                  <dd>{dossier.normalized.dataset}</dd>
                </div>
                <div>
                  <dt>VCF / gnomAD ID</dt>
                  <dd>{dossier.normalized.vcfId ?? 'Needs review'}</dd>
                </div>
                <div>
                  <dt>SPDI</dt>
                  <dd>{dossier.normalized.spdi ?? 'Needs review'}</dd>
                </div>
                <div>
                  <dt>rsID</dt>
                  <dd>{activeCase.rsid}</dd>
                </div>
              </dl>
              <p className="muted">{dossier.normalized.note}</p>
              {dossier.normalized.browserUrl && (
                <a className="source-link" href={dossier.normalized.browserUrl} target="_blank" rel="noreferrer">
                  Open in gnomAD <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </Panel>

            <Panel icon={CheckCircle2} title="Review Checklist">
              <ul className="checklist">
                <li>Confirm genome build and transcript.</li>
                <li>Review population frequency in phenotype context.</li>
                <li>Separate germline and somatic evidence tracks.</li>
                <li>Check ClinVar assertion criteria and review status.</li>
                <li>Read primary literature before summarizing.</li>
              </ul>
            </Panel>

            <Panel icon={AlertTriangle} title="Clinical Boundary">
              <p className="boundary-text">{dossier.responsibleBoundary}</p>
            </Panel>
          </aside>
        </section>
      </main>
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, detail, tone }: { icon: IconComponent; label: string; value: string; detail: string; tone?: 'good' | 'warn' }) {
  return (
    <article className={`metric-card ${tone ?? ''}`}>
      <Icon aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  )
}

function Panel({ icon: Icon, title, children }: { icon: IconComponent; title: string; children: React.ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <Icon aria-hidden="true" />
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function StatusChip({ status }: { status: EvidenceStatus }) {
  return <span className={`status-chip ${status}`}>{status}</span>
}

function AminoCard({ label, code, name, detail }: { label: string; code: string; name: string; detail: string }) {
  return (
    <article className="amino-card">
      <span>{label}</span>
      <strong>{code}</strong>
      <p>{name}</p>
      <small>{detail}</small>
    </article>
  )
}
