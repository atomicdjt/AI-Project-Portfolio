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
import { useMemo, useRef, useState } from 'react'
import type { ComponentType, SVGProps } from 'react'
import { defaultCase, variantCases } from '../data/cases'
import { buildDossier } from '../modules/evidence/buildDossier'
import { generateMarkdownReport } from '../modules/reports/generateReport'
import { changeInputBuild, inputFromCase, isCaseIdentityMatch } from '../modules/variant/caseIdentity'
import { parseRsId } from '../modules/variant/normalizeVariant'
import type { EvidenceStatus, SourceKind, VariantCase, VariantInput } from '../types/variant'
import { WorkbenchTabs } from '../components/WorkbenchTabs'
import type { TabId } from '../components/WorkbenchTabs'
import { ProteinContext } from '../components/ProteinContext'

import { ProviderStatusBar } from '../components/ProviderStatusBar'
import { fetchAllProviders } from '../providers/orchestrator'
import type { OrchestratorResult } from '../providers/types'

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>
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
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function App() {
  const [activeCaseId, setActiveCaseId] = useState(defaultCase.id)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [sourceFilter, setSourceFilter] = useState<SourceKind | 'All'>('All')
  const [query, setQuery] = useState('')
  const [fields, setFields] = useState<VariantInput>(inputFromCase(defaultCase))
  const [copied, setCopied] = useState(false)
  const [liveProviders, setLiveProviders] = useState<OrchestratorResult | null>(null)
  const [isFetchingLive, setIsFetchingLive] = useState(false)
  const requestGeneration = useRef(0)
  const [feedback, setFeedback] = useState('')
  const [buildNotice, setBuildNotice] = useState('')

  function invalidateLiveEvidence() {
    requestGeneration.current += 1
    setLiveProviders(null)
    setIsFetchingLive(false)
    setCopied(false)
    setFeedback('')
  }

  function updateIdentityField<K extends keyof VariantInput>(key: K, value: VariantInput[K]) {
    invalidateLiveEvidence()
    setBuildNotice('')
    setFields((current) => ({ ...current, [key]: value, condition: '' }))
  }

  const activeCase = variantCases.find((variantCase) => variantCase.id === activeCaseId) ?? defaultCase

  const dossier = useMemo(() => buildDossier(activeCase, fields, liveProviders ?? undefined), [activeCase, fields, liveProviders])
  const report = useMemo(() => generateMarkdownReport(activeCase, dossier), [activeCase, dossier])
  const jsonBundle = useMemo(() => JSON.stringify({ schemaVersion: 2, case: dossier.isCuratedCase ? activeCase : null, dossier, liveProviderResponses: liveProviders }, null, 2), [activeCase, dossier, liveProviders])

  async function handleFetchLive() {
    const generation = ++requestGeneration.current
    setIsFetchingLive(true)
    setFeedback('')
    try {
      const match = isCaseIdentityMatch(fields, activeCase)
      const results = await fetchAllProviders({
        gene: fields.gene,
        variant: fields.variant,
        rsId: match ? activeCase.rsid : '',
        clinvarExpected: match ? { gene: fields.gene, build: fields.build, gnomadId: fields.gnomadId } : undefined,
        uniprotAccession: match ? activeCase.uniprot : '',
      })
      if (generation === requestGeneration.current) setLiveProviders(results)
    } catch {
      if (generation === requestGeneration.current) setFeedback('Live retrieval could not complete. Review the attached source links or try again.')
    } finally {
      if (generation === requestGeneration.current) setIsFetchingLive(false)
    }
  }

  const filteredCases = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return variantCases
    return variantCases.filter((variantCase) =>
      `${variantCase.title} ${variantCase.gene} ${variantCase.variant} ${variantCase.condition}`.toLowerCase().includes(needle),
    )
  }, [query])

  const visibleSources = dossier.sourceRecords.filter((record) => sourceFilter === 'All' || record.kind === sourceFilter)

  function selectCase(variantCase: VariantCase) {
    invalidateLiveEvidence()
    setActiveCaseId(variantCase.id)
    setFields(inputFromCase(variantCase))
    setActiveTab('overview')
    setSourceFilter('All')
    setBuildNotice('')
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report)
      setCopied(true)
      setFeedback('Markdown report copied.')
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setFeedback('Clipboard access failed. Use Download .md to save the report.')
    }
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
              aria-pressed={variantCase.id === activeCase.id}
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
          {filteredCases.length === 0 && <p className="muted" role="status">No teaching cases match this search.</p>}
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
            <p>{dossier.isCuratedCase ? activeCase.summary : 'Custom input. The selected case’s population, protein and source fixtures have been detached.'}</p>
          </div>
          <div className="topbar-actions">
            <button type="button" onClick={() => {
              invalidateLiveEvidence()
              setFields(inputFromCase(activeCase))
              setBuildNotice('')
            }}>
              <RotateCcw size={16} /> Reset case
            </button>
            <button className="primary-command" type="button" onClick={() => downloadText('variantvision-dossier.md', report)}>
              <Download size={16} /> Export dossier
            </button>
          </div>
        </header>

        <ProviderStatusBar liveProviders={liveProviders} isLoading={isFetchingLive} onRefresh={handleFetchLive} hasCuratedCase={dossier.isCuratedCase} />
        {feedback && <p className="analysis-note" role="status">{feedback}</p>}

        <section className="input-deck" aria-label="Variant input controls">
          <label>
            Gene
            <input value={fields.gene} onChange={(event) => updateIdentityField('gene', event.target.value)} />
          </label>
          <label>
            Protein change
            <input value={fields.variant} onChange={(event) => updateIdentityField('variant', event.target.value)} />
          </label>
          <label>
            Genomic HGVS
            <input value={fields.hgvs} onChange={(event) => updateIdentityField('hgvs', event.target.value)} />
          </label>
          <label>
            gnomAD-style ID
            <input value={fields.gnomadId} onChange={(event) => updateIdentityField('gnomadId', event.target.value)} />
          </label>
          <label>
            Build
            <select value={fields.build} onChange={(event) => {
              invalidateLiveEvidence()
              const build = event.target.value as VariantInput['build']
              setBuildNotice(isCaseIdentityMatch(fields, activeCase) ? `Teaching coordinates updated for ${build}.` : 'Custom genomic coordinates cleared. Enter coordinates for the selected assembly; automatic liftover is unavailable.')
              setFields(changeInputBuild(fields, activeCase, build))
            }}>
              <option>GRCh38</option>
              <option>GRCh37</option>
            </select>
          </label>
        </section>
        {buildNotice && <p className="analysis-note" role="status">{buildNotice}</p>}

        <section className="metric-strip" aria-label="Evidence summary metrics">
          <MetricCard icon={Gauge} label="Workflow coverage" value={`${dossier.coverageScore}/100`} detail={dossier.coverageBand} tone={dossier.coverageScore >= 80 ? 'good' : 'warn'} />
          <MetricCard icon={Dna} label="Normalized ID" value={dossier.normalized.vcfId ?? 'Review'} detail={dossier.normalized.parsedFrom} />
          <MetricCard icon={Activity} label="Highest fixture row AF" value={dossier.populationSummary.highestFrequency === null ? 'Unavailable' : formatFrequency(dossier.populationSummary.highestFrequency)} detail={dossier.populationSummary.highestGroup ?? 'No fixture counts for this input'} />
          <MetricCard icon={Library} label="Source records" value={dossier.sourceRecords.length.toString()} detail={`${dossier.literature.length} literature leads`} />
        </section>

        <WorkbenchTabs activeTab={activeTab} onChange={setActiveTab} />

        <section className="workspace-grid">
          <div className="workspace-primary">
              <div className="page-stack" role="tabpanel" id="workbench-panel-overview" aria-labelledby="workbench-tab-overview" tabIndex={0} hidden={activeTab !== 'overview'}>
                <Panel icon={Sparkles} title="Evidence Coverage Model">
                  <p className="muted">{dossier.coverageMethodology}</p>
                  <div className="score-list">
                    {dossier.metrics.map((metric) => (
                      <article className="score-row" key={metric.label}>
                        <div>
                          <strong>{metric.label}</strong>
                          <span>{metric.explanation}</span>
                        </div>
                        <div
                          className="score-meter"
                          role="meter"
                          aria-label={`${metric.label} score`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={metric.score}
                          aria-valuetext={`${metric.score} out of 100`}
                        >
                          <i aria-hidden="true" style={{ width: `${metric.score}%` }} />
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
                    <ProteinContext variantCase={dossier.isCuratedCase ? activeCase : undefined} />
                  </Panel>
                </div>

                <Panel icon={Activity} title="Population Frequency Fixture">
                  <div className="table-wrap" tabIndex={0} aria-label="Population frequency fixture table">
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
                        {dossier.populationRecords.map((row) => (
                          <tr key={`${row.source}-${row.group}`}>
                            <td>{row.source}</td>
                            <td>{row.group}</td>
                            <td>{row.alleleCount.toLocaleString()}</td>
                            <td>{row.alleleNumber.toLocaleString()}</td>
                            <td>{row.homozygotes.toLocaleString()}</td>
                            <td>{formatFrequency(row.alleleCount / row.alleleNumber)}</td>
                          </tr>
                        ))}
                        {dossier.populationRecords.length === 0 && <tr><td colSpan={6}>No teaching population counts are attached to this custom input.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                  <p className="muted">Teaching fixtures only. Each row has its own denominator; cohorts are not pooled. Population frequency needs source and phenotype review.</p>
                </Panel>
              </div>
              <div className="page-stack" role="tabpanel" id="workbench-panel-sources" aria-labelledby="workbench-tab-sources" tabIndex={0} hidden={activeTab !== 'sources'}>
                <Panel icon={Database} title="Source Transparency">
                  <div className="filter-row" aria-label="Source filters">
                    {sourceKinds.map((kind) => (
                      <button aria-pressed={sourceFilter === kind} className={sourceFilter === kind ? 'active' : ''} key={kind} onClick={() => setSourceFilter(kind)} type="button">
                        {kind}
                      </button>
                    ))}
                    {visibleSources.length === 0 && <p className="muted">No sources match this filter.</p>}
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
                          <small>{record.source} - {record.retrievedAt ? `Retrieved ${record.retrievedAt}` : record.lastReviewed}</small>
                          {record.url && (
                            <a href={record.url} target="_blank" rel="noreferrer">
                              Open source <ArrowUpRight size={14} aria-hidden="true" />
                            </a>
                          )}
                        </footer>
                      </article>
                    ))}
                    {dossier.literature.length === 0 && <p className="muted">No literature leads are attached. Fetch live evidence or review PubMed manually.</p>}
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
                        <span>{item.origin ?? 'curated literature lead'} · {item.retrievedAt ? `Retrieved ${item.retrievedAt}` : `Metadata verified ${item.metadataVerifiedAt ?? 'date unavailable'}`}</span>
                        <a href={item.url} target="_blank" rel="noreferrer">
                          PubMed lead <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </article>
                    ))}
                  </div>
                </Panel>
              </div>
              <div className="page-stack" role="tabpanel" id="workbench-panel-report" aria-labelledby="workbench-tab-report" tabIndex={0} hidden={activeTab !== 'report'}>
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
              <div className="page-stack readable" role="tabpanel" id="workbench-panel-method" aria-labelledby="workbench-tab-method" tabIndex={0} hidden={activeTab !== 'method'}>
                <Panel icon={ShieldAlert} title="Responsible Scope">
                  <p>{dossier.responsibleBoundary}</p>
                  <p>
                    VariantVision Pro is intentionally designed as an evidence organization tool. It does not compute ACMG/AMP classifications, does not infer diagnosis, and does not replace source review by qualified humans.
                  </p>
                  <p>Live fetch sends gene and variant search terms to NCBI and protein identifiers to UniProt. Public PubMed IDs pass through this app’s metadata endpoint. The app does not persist inputs or retrieval results.</p>
                </Panel>
                <Panel icon={FlaskConical} title="How This MVP Works">
                  <ol className="method-list">
                    <li>Parse gnomAD-style IDs and simple genomic HGVS coordinates locally.</li>
                    <li>Use verified GRCh37/GRCh38 mappings for teaching cases; clear custom coordinates on a build change.</li>
                    <li>Compare amino acid properties for explainable protein-impact context.</li>
                    <li>Summarize curated source fixtures with review status, provenance, and limitations.</li>
                    <li>Retrieve public ClinVar, UniProt and PubMed leads on request, with timestamps and failures recorded in exports.</li>
                    <li>Generate Markdown and JSON dossiers in the browser.</li>
                  </ol>
                </Panel>
                <Panel icon={AlertTriangle} title="Known Limitations">
                  <p>
                    Population rows are teaching fixtures, not live gnomAD counts. Live retrieval is optional and can fail. Local parsing does not perform transcript-aware HGVS normalization, reference validation or liftover. Coverage is an uncalibrated workflow heuristic; all source assertions require human review.
                  </p>
                </Panel>
              </div>
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
                  <dt>VCF-like coordinate</dt>
                  <dd>{dossier.normalized.vcfLikeCoordinate ?? 'Needs review'}</dd>
                </div>
                <div>
                  <dt>rsID</dt>
                  <dd>{dossier.isCuratedCase ? activeCase.rsid : parseRsId(fields.gnomadId) ?? parseRsId(fields.variant) ?? 'Not resolved'}</dd>
                </div>
              </dl>
              <p className="muted">{dossier.normalized.note}</p>
              {dossier.normalized.browserUrl && (
                <a className="source-link" href={dossier.normalized.browserUrl} target="_blank" rel="noreferrer">
                  {dossier.normalized.vcfId ? 'Open in gnomAD' : 'Open source lookup'} <ArrowUpRight size={14} aria-hidden="true" />
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
