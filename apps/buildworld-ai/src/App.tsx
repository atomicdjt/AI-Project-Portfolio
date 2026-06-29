import { useEffect, useMemo, useRef, useState } from 'react'
import { cloneScenario, getScenarioById, scenarioTemplates } from './scenarios/templates'
import { runCascadeExperiment } from './modules/simulation/engines/cascadeEngine'
import { runSimulationTick } from './modules/simulation/engines/simulationRunner'
import { generateInsights } from './modules/simulation/insights/insightGenerator'
import { clearLocalProject, exportProject, importProject, loadProjectLocally, saveProjectLocally } from './modules/simulation/persistence/projectStorage'
import { buildSimulationReport } from './modules/simulation/reports/reportBuilder'
import { calculateSSI } from './modules/simulation/scoring/ssi'
import type { CascadeExperimentResult, ScenarioComparison, ScenarioSnapshot, ScenarioTemplate, SimulationEdge, SimulationNode, SimulationProject, SimulationState } from './types/simulation'

type Page = 'home' | 'studio' | 'library' | 'dashboard' | 'cascade' | 'optimization' | 'reports' | 'methodology'
type Selection = { kind: 'node'; id: string } | { kind: 'edge'; id: string } | undefined

const pageLabels: Record<Page, string> = {
  home: 'Home',
  studio: 'Studio',
  library: 'Library',
  dashboard: 'Dashboard',
  cascade: 'Cascade',
  optimization: 'Optimization',
  reports: 'Reports',
  methodology: 'Methodology',
}

const statusClass = (status?: string) => `status-${status ?? 'normal'}`

const downloadText = (filename: string, content: string, mime = 'text/plain') => {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

const makeSnapshot = (name: string, scenario: ScenarioTemplate, state: SimulationState): ScenarioSnapshot => ({
  id: `snapshot-${Date.now()}`,
  name,
  createdAt: new Date().toISOString(),
  scenario: cloneScenario(scenario),
  state,
  ssi: calculateSSI(scenario, state),
})

const compareSnapshots = (baseline: ScenarioSnapshot, variant: ScenarioSnapshot): ScenarioComparison => ({
  baseline,
  variant,
  ssiChange: variant.ssi.overall - baseline.ssi.overall,
  throughputChange: variant.state.metrics.totalThroughput - baseline.state.metrics.totalThroughput,
  bottleneckChange: variant.state.metrics.bottleneckCount - baseline.state.metrics.bottleneckCount,
  resilienceChange: variant.state.metrics.resilienceScore - baseline.state.metrics.resilienceScore,
  cascadeRiskChange: variant.state.metrics.cascadeDepth - baseline.state.metrics.cascadeDepth,
  recommendationSummary:
    variant.ssi.overall >= baseline.ssi.overall
      ? 'Variant improved or preserved SSI. Review cost and difficulty before treating it as the preferred design.'
      : 'Variant reduced SSI. Use the event log and bottleneck panel to isolate the regression.',
})

function MetricCard({ label, value, sublabel }: { label: string; value: string | number; sublabel?: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {sublabel ? <small>{sublabel}</small> : null}
    </article>
  )
}

function Sparkline({ points, field }: { points: SimulationState['history']; field: keyof SimulationState['metrics'] | 'ssi' }) {
  const values = points.map((point) => Number(point[field] ?? 0))
  const max = Math.max(1, ...values)
  const d = values
    .map((value, index) => {
      const x = values.length <= 1 ? 0 : (index / (values.length - 1)) * 100
      const y = 42 - (value / max) * 36
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  return (
    <svg className="sparkline" viewBox="0 0 100 46" role="img" aria-label={`${String(field)} trend`}>
      <path d="M0 42 H100" className="sparkline-base" />
      <path d={d || 'M0 42 L100 42'} className="sparkline-line" />
    </svg>
  )
}

function Gauge({ score, label }: { score: number; label: string }) {
  const angle = Math.max(0, Math.min(100, score)) * 1.8
  return (
    <div className="gauge" aria-label={`${label}: ${score}`}>
      <div className="gauge-arc" style={{ '--angle': `${angle}deg` } as React.CSSProperties}>
        <div>
          <strong>{score}</strong>
          <span>{label}</span>
        </div>
      </div>
    </div>
  )
}

function SystemCanvas({
  scenario,
  state,
  selection,
  setSelection,
  setScenario,
}: {
  scenario: ScenarioTemplate
  state: SimulationState
  selection: Selection
  setSelection: (selection: Selection) => void
  setScenario: (scenario: ScenarioTemplate) => void
}) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<string>()

  const updateNodePosition = (id: string, clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.max(40, Math.min(920, ((clientX - rect.left) / rect.width) * 960))
    const y = Math.max(55, Math.min(470, ((clientY - rect.top) / rect.height) * 520))
    setScenario({
      ...scenario,
      nodes: scenario.nodes.map((node) => (node.id === id ? { ...node, x, y } : node)),
    })
  }

  return (
    <div
      className="system-canvas"
      ref={canvasRef}
      onPointerMove={(event) => {
        if (dragging) updateNodePosition(dragging, event.clientX, event.clientY)
      }}
      onPointerUp={() => setDragging(undefined)}
      onPointerLeave={() => setDragging(undefined)}
    >
      <div className="canvas-grid" />
      <svg className="edge-layer" viewBox="0 0 960 520" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="edgeFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#26d9b5" />
            <stop offset="55%" stopColor="#6ea8ff" />
            <stop offset="100%" stopColor="#f6c15f" />
          </linearGradient>
        </defs>
        {scenario.edges.map((edge) => {
          const source = scenario.nodes.find((node) => node.id === edge.source)
          const target = scenario.nodes.find((node) => node.id === edge.target)
          const edgeState = state.edgeStates[edge.id]
          if (!source || !target) return null
          return (
            <g key={edge.id} className={`edge ${statusClass(edgeState?.status)} ${selection?.kind === 'edge' && selection.id === edge.id ? 'selected' : ''}`}>
              <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
              <circle cx={source.x + (target.x - source.x) * 0.58} cy={source.y + (target.y - source.y) * 0.58} r="4" />
            </g>
          )
        })}
      </svg>
      {scenario.nodes.map((node) => {
        const nodeState = state.nodeStates[node.id]
        return (
          <button
            key={node.id}
            type="button"
            className={`node ${statusClass(nodeState?.status)} ${selection?.kind === 'node' && selection.id === node.id ? 'selected' : ''}`}
            style={{
              left: `clamp(74px, ${(node.x / 960) * 100}%, calc(100% - 74px))`,
              top: `clamp(44px, ${(node.y / 520) * 100}%, calc(100% - 44px))`,
            }}
            onClick={() => setSelection({ kind: 'node', id: node.id })}
            onPointerDown={(event) => {
              setDragging(node.id)
              event.currentTarget.setPointerCapture(event.pointerId)
            }}
          >
            <span className="node-type">{node.type.replaceAll('-', ' ')}</span>
            <strong>{node.label}</strong>
            <small>{Math.round((nodeState?.utilization ?? 0) * 100)}% util</small>
          </button>
        )
      })}
    </div>
  )
}

function Inspector({
  scenario,
  state,
  selection,
  setScenario,
}: {
  scenario: ScenarioTemplate
  state: SimulationState
  selection: Selection
  setScenario: (scenario: ScenarioTemplate) => void
}) {
  const selectedNode = selection?.kind === 'node' ? scenario.nodes.find((node) => node.id === selection.id) : undefined
  const selectedEdge = selection?.kind === 'edge' ? scenario.edges.find((edge) => edge.id === selection.id) : undefined

  const updateNode = (id: string, patch: Partial<SimulationNode['properties']>) => {
    setScenario({
      ...scenario,
      nodes: scenario.nodes.map((node) => (node.id === id ? { ...node, properties: { ...node.properties, ...patch } } : node)),
    })
  }

  const updateEdge = (id: string, patch: Partial<SimulationEdge['properties']>) => {
    setScenario({
      ...scenario,
      edges: scenario.edges.map((edge) => (edge.id === id ? { ...edge, properties: { ...edge.properties, ...patch } } : edge)),
    })
  }

  return (
    <aside className="inspector">
      <div className="panel-heading">
        <span>Inspector</span>
        <strong>{selectedNode?.label ?? selectedEdge?.label ?? 'System'}</strong>
      </div>
      {selectedNode ? (
        <div className="field-grid">
          {(['capacity', 'demand', 'throughput', 'resilience', 'stock', 'priority', 'recoveryTime'] as const).map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input type="number" value={selectedNode.properties[key]} onChange={(event) => updateNode(selectedNode.id, { [key]: Number(event.target.value) })} />
            </label>
          ))}
          <div className="state-summary">
            <span>Status</span>
            <strong>{state.nodeStates[selectedNode.id]?.status ?? 'normal'}</strong>
            <small>Queue {state.nodeStates[selectedNode.id]?.queue ?? 0}</small>
          </div>
        </div>
      ) : selectedEdge ? (
        <div className="field-grid">
          {(['flowCapacity', 'travelTime', 'reliability', 'congestionSensitivity', 'transferEfficiency', 'dependencyStrength'] as const).map((key) => (
            <label key={key}>
              <span>{key}</span>
              <input type="number" step={key === 'flowCapacity' || key === 'travelTime' ? 1 : 0.01} value={selectedEdge.properties[key]} onChange={(event) => updateEdge(selectedEdge.id, { [key]: Number(event.target.value) })} />
            </label>
          ))}
          <div className="state-summary">
            <span>Flow</span>
            <strong>{state.edgeStates[selectedEdge.id]?.flow ?? 0}</strong>
            <small>{Math.round((state.edgeStates[selectedEdge.id]?.utilization ?? 0) * 100)}% capacity</small>
          </div>
        </div>
      ) : (
        <div className="system-summary">
          <p>{scenario.description}</p>
          <ul>{scenario.visibleRisks.map((risk) => <li key={risk}>{risk}</li>)}</ul>
        </div>
      )}
    </aside>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')
  const [scenario, setScenario] = useState(() => cloneScenario(scenarioTemplates[0]))
  const [state, setState] = useState(() => runSimulationTick(scenarioTemplates[0], undefined, { seed: 3 }))
  const [running, setRunning] = useState(false)
  const [speed, setSpeed] = useState(650)
  const [selection, setSelection] = useState<Selection>()
  const [snapshots, setSnapshots] = useState<ScenarioSnapshot[]>([])
  const [cascadeResult, setCascadeResult] = useState<CascadeExperimentResult>()
  const [toast, setToast] = useState('Demo mode ready. No paid AI API required.')
  const [reportPreview, setReportPreview] = useState(false)

  const ssi = useMemo(() => calculateSSI(scenario, state), [scenario, state])
  const insights = useMemo(() => generateInsights(scenario, state), [scenario, state])
  const report = useMemo(() => buildSimulationReport({ scenario, state, insights }), [scenario, state, insights])
  const comparison = snapshots.length >= 2 ? compareSnapshots(snapshots[snapshots.length - 2], snapshots[snapshots.length - 1]) : undefined

  useEffect(() => {
    if (!running) return undefined
    const interval = window.setInterval(() => setState((current) => runSimulationTick(scenario, current, { seed: 5 })), speed)
    return () => window.clearInterval(interval)
  }, [running, scenario, speed])

  const loadScenario = (id: string) => {
    const nextScenario = cloneScenario(getScenarioById(id))
    setScenario(nextScenario)
    setState(runSimulationTick(nextScenario, undefined, { seed: 3 }))
    setSelection(undefined)
    setRunning(false)
    setToast(`${nextScenario.name} loaded.`)
  }

  const step = () => setState((current) => runSimulationTick(scenario, current, { seed: 5 }))
  const reset = () => {
    const nextScenario = cloneScenario(getScenarioById(scenario.id))
    setScenario(nextScenario)
    setState(runSimulationTick(nextScenario, undefined, { seed: 3 }))
    setRunning(false)
    setToast('Scenario reset to demo baseline.')
  }

  const addNode = () => {
    const id = `custom-${Date.now()}`
    const nextNode: SimulationNode = {
      id,
      label: `Custom Node ${scenario.nodes.length + 1}`,
      type: 'hub',
      x: 210 + scenario.nodes.length * 42,
      y: 150 + scenario.nodes.length * 28,
      properties: {
        capacity: 90,
        demand: 62,
        throughput: 70,
        failureProbability: 0.04,
        recoveryTime: 3,
        cost: 25,
        priority: 5,
        resilience: 62,
        stock: 45,
      },
    }
    setScenario({ ...scenario, nodes: [...scenario.nodes, nextNode] })
    setSelection({ kind: 'node', id })
  }

  const connectCriticalPair = () => {
    const sorted = [...scenario.nodes].sort((a, b) => b.properties.priority - a.properties.priority)
    const source = sorted[1] ?? scenario.nodes[0]
    const target = sorted[0] ?? scenario.nodes[1]
    if (!source || !target || source.id === target.id) return
    const id = `edge-${Date.now()}`
    const edge: SimulationEdge = {
      id,
      label: 'Redundant Link',
      source: source.id,
      target: target.id,
      type: 'dependency',
      properties: {
        flowCapacity: 60,
        travelTime: 1,
        cost: 18,
        reliability: 0.9,
        direction: 'directed',
        congestionSensitivity: 0.3,
        transferEfficiency: 0.86,
        dependencyStrength: 0.55,
      },
    }
    setScenario({ ...scenario, edges: [...scenario.edges, edge] })
    setSelection({ kind: 'edge', id })
  }

  const saveSnapshot = () => {
    const snapshot = makeSnapshot(`Snapshot ${snapshots.length + 1}`, scenario, state)
    setSnapshots((current) => [...current, snapshot].slice(-6))
    setToast(`${snapshot.name} saved for comparison.`)
  }

  const saveProject = () => {
    const project: SimulationProject = {
      id: 'buildworld-ai-local-project',
      name: scenario.name,
      activeScenario: scenario,
      snapshots,
      updatedAt: new Date().toISOString(),
    }
    saveProjectLocally(project)
    setToast('Project saved locally in this browser.')
  }

  const loadProject = () => {
    const project = loadProjectLocally()
    if (!project) {
      setToast('No saved local project found.')
      return
    }
    setScenario(project.activeScenario)
    setSnapshots(project.snapshots)
    setState(runSimulationTick(project.activeScenario, undefined, { seed: 9 }))
    setToast('Saved project loaded.')
  }

  const runCascade = () => {
    const targetId = selection?.kind === 'node' ? selection.id : scenario.nodes.find((node) => node.properties.priority >= 8)?.id ?? scenario.nodes[0]?.id
    const result = runCascadeExperiment(scenario, {
      type: scenario.systemType === 'epidemic' ? 'population-spike' : scenario.systemType === 'ecosystem' ? 'resource-shortage' : 'remove-node',
      targetId,
      label: 'Focused stress experiment',
      intensity: 0.38,
    })
    setCascadeResult(result)
    setToast('Cascade experiment completed.')
    setPage('cascade')
  }

  const importFromFile = async (file?: File) => {
    if (!file) return
    try {
      const text = await file.text()
      const project = importProject(text)
      setScenario(project.activeScenario)
      setSnapshots(project.snapshots)
      setState(runSimulationTick(project.activeScenario, undefined, { seed: 13 }))
      setToast('Project JSON imported.')
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Project import failed.')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button type="button" className="brand" onClick={() => setPage('home')}>
          <span className="brand-mark">BW</span>
          <span>
            <strong>BuildWorld AI</strong>
            <small>Visual systems simulation lab</small>
          </span>
        </button>
        <nav aria-label="Primary navigation">
          {(Object.keys(pageLabels) as Page[]).map((key) => (
            <button key={key} type="button" className={page === key ? 'active' : ''} onClick={() => setPage(key)}>
              {pageLabels[key]}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <button type="button" onClick={saveProject}>Save</button>
          <button type="button" onClick={loadProject}>Load</button>
          <button type="button" className="primary" onClick={() => setPage('studio')}>Open Studio</button>
        </div>
      </header>

      {page === 'home' ? (
        <main className="landing">
          <section className="hero-section">
            <div className="hero-copy">
              <h1>BuildWorld AI</h1>
              <p>A visual simulation lab for exploring bottlenecks, cascading failures, resilience, optimization, and emergent behavior in complex systems.</p>
              <div className="hero-actions">
                <button type="button" className="primary" onClick={() => setPage('studio')}>Run demo scenario</button>
                <button type="button" onClick={() => setPage('methodology')}>Read methodology</button>
              </div>
            </div>
            <div className="hero-console" aria-label="BuildWorld AI technical preview">
              <SystemCanvas scenario={scenario} state={state} selection={selection} setSelection={setSelection} setScenario={setScenario} />
            </div>
          </section>
          <section className="feature-band">
            {[
              ['Simulation Studio', 'Editable graph canvas, run controls, live metrics, and scenario snapshots.'],
              ['SSI Scoring', 'Original 0-100 System Stability Index with category explanations.'],
              ['Cascade Lab', 'Stress experiments that show affected nodes, paths, and before/after scores.'],
              ['Report Builder', 'Markdown, JSON, and print-friendly exports generated from simulation output.'],
            ].map(([title, body]) => (
              <article key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </article>
            ))}
          </section>
        </main>
      ) : (
        <main className="workspace">
          <aside className="left-rail">
            <div className="panel-heading">
              <span>Scenario Library</span>
              <strong>{scenario.name}</strong>
            </div>
            <select value={scenario.id} onChange={(event) => loadScenario(event.target.value)} aria-label="Choose scenario">
              {scenarioTemplates.map((template) => (
                <option key={template.id} value={template.id}>{template.name}</option>
              ))}
            </select>
            <div className="tool-stack">
              <button type="button" onClick={addNode}>Add node</button>
              <button type="button" onClick={connectCriticalPair}>Add redundancy</button>
              <button type="button" onClick={saveSnapshot}>Save snapshot</button>
              <button type="button" onClick={runCascade}>Run cascade test</button>
              <button type="button" onClick={() => downloadText('buildworld-project.json', exportProject({ id: 'buildworld-ai-local-project', name: scenario.name, activeScenario: scenario, snapshots, updatedAt: new Date().toISOString() }), 'application/json')}>Export JSON</button>
              <label className="file-button">
                Import JSON
                <input type="file" accept="application/json" onChange={(event) => void importFromFile(event.target.files?.[0])} />
              </label>
              <button type="button" onClick={() => { clearLocalProject(); setToast('Local save cleared.') }}>Clear save</button>
            </div>
            <div className="risk-list">
              <strong>Visible risks</strong>
              {scenario.visibleRisks.map((risk) => <span key={risk}>{risk}</span>)}
            </div>
          </aside>

          <section className="main-stage">
            <div className="stage-header">
              <div>
                <span>{scenario.systemType.replaceAll('-', ' ')}</span>
                <h2>{pageLabels[page]}</h2>
              </div>
              <div className="run-controls" aria-label="Simulation controls">
                <button type="button" className={running ? 'danger' : 'primary'} onClick={() => setRunning((value) => !value)}>{running ? 'Pause' : 'Run'}</button>
                <button type="button" onClick={step}>Step</button>
                <button type="button" onClick={reset}>Reset</button>
                <label>
                  Speed
                  <input type="range" min="220" max="1200" step="10" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
                </label>
              </div>
            </div>

            {page === 'studio' ? (
              <>
                <div className="metrics-row">
                  <MetricCard label="SSI" value={ssi.overall} sublabel={ssi.severity} />
                  <MetricCard label="Throughput" value={state.metrics.totalThroughput} sublabel="modeled units" />
                  <MetricCard label="Bottlenecks" value={state.metrics.bottleneckCount} sublabel="active findings" />
                  <MetricCard label="Resilience" value={state.metrics.resilienceScore} sublabel="0-100 score" />
                </div>
                <SystemCanvas scenario={scenario} state={state} selection={selection} setSelection={setSelection} setScenario={setScenario} />
              </>
            ) : null}

            {page === 'library' ? (
              <section className="library-grid">
                {scenarioTemplates.map((template) => (
                  <button key={template.id} type="button" className="scenario-card" onClick={() => loadScenario(template.id)}>
                    <span>{template.systemType.replaceAll('-', ' ')}</span>
                    <strong>{template.name}</strong>
                    <p>{template.description}</p>
                    <small>{template.goal}</small>
                  </button>
                ))}
              </section>
            ) : null}

            {page === 'dashboard' ? (
              <section className="dashboard-grid">
                <Gauge score={ssi.overall} label="SSI" />
                <article className="wide-panel">
                  <h3>Time-series history</h3>
                  <Sparkline points={state.history} field="ssi" />
                  <Sparkline points={state.history} field="totalThroughput" />
                </article>
                {ssi.components.map((component) => (
                  <article key={component.name} className="score-row">
                    <strong>{component.name}</strong>
                    <span>{component.score}</span>
                    <p>{component.explanation}</p>
                  </article>
                ))}
              </section>
            ) : null}

            {page === 'cascade' ? (
              <section className="analysis-grid">
                <article className="wide-panel">
                  <h3>Failure Cascade Analyzer</h3>
                  <p>{cascadeResult ? `${cascadeResult.experiment.label}: ${cascadeResult.affectedNodes.length} affected nodes across ${cascadeResult.cascadePath.length} traced dependencies.` : 'Run a cascade test from the tool rail or select a node first for a focused experiment.'}</p>
                  <div className="delta-row">
                    <MetricCard label="SSI before" value={cascadeResult?.ssiBefore.overall ?? ssi.overall} />
                    <MetricCard label="SSI after" value={cascadeResult?.ssiAfter.overall ?? '-'} />
                    <MetricCard label="Affected" value={cascadeResult?.affectedNodes.length ?? state.metrics.affectedNodes} />
                  </div>
                </article>
                <article>
                  <h3>Critical nodes</h3>
                  {state.cascade.criticalNodes.map((id) => <span className="pill" key={id}>{scenario.nodes.find((node) => node.id === id)?.label ?? id}</span>)}
                </article>
                <article>
                  <h3>Weak recovery zones</h3>
                  {state.cascade.weakRecoveryZones.map((id) => <span className="pill warning" key={id}>{scenario.nodes.find((node) => node.id === id)?.label ?? id}</span>)}
                </article>
              </section>
            ) : null}

            {page === 'optimization' ? (
              <section className="recommendation-list">
                {state.recommendations.map((item) => (
                  <article key={item.id}>
                    <span>Priority {item.priority}</span>
                    <strong>{item.title}</strong>
                    <p>{item.reasoning}</p>
                    <small>{item.expectedBenefit} / {item.difficulty} difficulty / {item.relatedMetric}</small>
                  </article>
                ))}
              </section>
            ) : null}

            {page === 'reports' ? (
              <section className="reports-view">
                <div className="report-actions">
                  <button type="button" onClick={() => setReportPreview((value) => !value)}>{reportPreview ? 'Hide preview' : 'Preview report'}</button>
                  <button type="button" onClick={() => void navigator.clipboard.writeText(report.markdown).then(() => setToast('Report copied as Markdown.'))}>Copy Markdown</button>
                  <button type="button" onClick={() => downloadText('buildworld-ai-report.md', report.markdown)}>Download MD</button>
                  <button type="button" onClick={() => downloadText('buildworld-ai-report.json', JSON.stringify(report.json, null, 2), 'application/json')}>Download JSON</button>
                  <button type="button" onClick={() => window.print()}>Print / PDF</button>
                </div>
                {comparison ? (
                  <article className="comparison-panel">
                    <h3>Snapshot comparison</h3>
                    <div className="delta-row">
                      <MetricCard label="SSI change" value={comparison.ssiChange} />
                      <MetricCard label="Throughput" value={comparison.throughputChange.toFixed(1)} />
                      <MetricCard label="Bottlenecks" value={comparison.bottleneckChange} />
                      <MetricCard label="Resilience" value={comparison.resilienceChange.toFixed(1)} />
                    </div>
                    <p>{comparison.recommendationSummary}</p>
                  </article>
                ) : (
                  <article className="empty-state">Save two snapshots to unlock before/after scenario comparison.</article>
                )}
                {reportPreview ? <pre className="report-preview">{report.markdown}</pre> : null}
              </section>
            ) : null}

            {page === 'methodology' ? (
              <section className="methodology">
                <h2>Methodology and Limits</h2>
                <p>BuildWorld AI represents systems as typed graph networks. Nodes hold capacity, demand, stock, resilience, recovery, population, or ecological assumptions. Edges hold flow capacity, reliability, transfer efficiency, congestion sensitivity, and dependency strength.</p>
                <p>Each deterministic tick calculates edge flows, node pressure, queue buildup, recovery posture, bottleneck findings, cascade risk, time-series metrics, and natural-language insight summaries. The SSI score is an original educational heuristic across throughput efficiency, bottleneck risk, resilience, redundancy, cascade resistance, resource balance, recovery capacity, and optimization potential.</p>
                <p>This is not a certified engineering model, public-health tool, infrastructure-design recommendation system, ecological forecast, safety-critical system, or financial decision product. It is designed for exploration, teaching, portfolio review, and scenario reasoning.</p>
              </section>
            ) : null}

            <div className="toast" role="status">{toast}</div>
          </section>

          <Inspector scenario={scenario} state={state} selection={selection} setScenario={setScenario} />
        </main>
      )}
    </div>
  )
}

export default App
