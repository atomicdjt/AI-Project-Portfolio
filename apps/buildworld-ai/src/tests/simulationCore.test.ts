import { describe, expect, it } from 'vitest'
import { runCascadeExperiment } from '../modules/simulation/engines/cascadeEngine'
import { runSimulationTick } from '../modules/simulation/engines/simulationRunner'
import { generateInsights } from '../modules/simulation/insights/insightGenerator'
import { generateOptimizationSuggestions } from '../modules/simulation/optimization/optimizer'
import { buildSimulationReport } from '../modules/simulation/reports/reportBuilder'
import { calculateSSI } from '../modules/simulation/scoring/ssi'
import { exportProject, importProject } from '../modules/simulation/persistence/projectStorage'
import { scenarioTemplates } from '../scenarios/templates'

describe('BuildWorld AI simulation core', () => {
  it('runs a deterministic flow tick and detects overloaded bottlenecks', () => {
    const scenario = scenarioTemplates.find((item) => item.id === 'regional-supply-chain-disruption')
    expect(scenario).toBeDefined()

    const state = runSimulationTick(scenario!, undefined, { seed: 42 })

    expect(state.timeStep).toBe(1)
    expect(state.metrics.totalThroughput).toBeGreaterThan(0)
    expect(state.metrics.bottleneckCount).toBeGreaterThan(0)
    expect(state.bottlenecks.some((finding) => finding.severity === 'high')).toBe(true)
    expect(state.history).toHaveLength(1)
  })

  it('scores SSI components with severity bands and improvement advice', () => {
    const scenario = scenarioTemplates.find((item) => item.id === 'small-city-traffic-bottleneck')
    const state = runSimulationTick(scenario!, undefined, { seed: 7 })
    const ssi = calculateSSI(scenario!, state)

    expect(ssi.overall).toBeGreaterThanOrEqual(0)
    expect(ssi.overall).toBeLessThanOrEqual(100)
    expect(ssi.components).toHaveLength(8)
    expect(ssi.components.every((component) => component.explanation.length > 12)).toBe(true)
    expect(ssi.components.some((component) => component.suggestedImprovements.length > 0)).toBe(true)
  })

  it('simulates cascade experiments and returns before/after metric deltas', () => {
    const scenario = scenarioTemplates.find((item) => item.id === 'neighborhood-power-grid-failure')
    const targetNode = scenario!.nodes.find((node) => node.type === 'substation')!
    const result = runCascadeExperiment(scenario!, {
      type: 'remove-node',
      targetId: targetNode.id,
      label: 'Substation outage',
    })

    expect(result.affectedNodes.length).toBeGreaterThan(0)
    expect(result.cascadePath[0]).toBe(targetNode.id)
    expect(result.after.metrics.resilienceScore).toBeLessThanOrEqual(result.before.metrics.resilienceScore)
    expect(result.recommendations.length).toBeGreaterThan(0)
  })

  it('generates ranked optimization suggestions from live simulation output', () => {
    const scenario = scenarioTemplates.find((item) => item.id === 'warehouse-throughput-optimization')
    const state = runSimulationTick(scenario!, undefined, { seed: 11 })
    const suggestions = generateOptimizationSuggestions(scenario!, state)

    expect(suggestions.length).toBeGreaterThanOrEqual(3)
    expect(suggestions[0].priority).toBeGreaterThanOrEqual(suggestions.at(-1)!.priority)
    expect(suggestions.every((item) => item.reasoning && item.expectedBenefit)).toBe(true)
  })

  it('builds exportable reports and deterministic natural-language insights', () => {
    const scenario = scenarioTemplates.find((item) => item.id === 'disease-spread-connected-communities')
    const state = runSimulationTick(scenario!, undefined, { seed: 19 })
    const insights = generateInsights(scenario!, state)
    const report = buildSimulationReport({ scenario: scenario!, state, insights })

    expect(insights.executiveSummary).toContain(scenario!.name)
    expect(report.markdown).toContain('BuildWorld AI System Simulation Report')
    expect(report.markdown).toContain('Limitations')
    expect(report.json.scenario.id).toBe(scenario!.id)
  })

  it('round-trips project export and import validation', () => {
    const scenario = scenarioTemplates.find((item) => item.id === 'forest-ecosystem-balance')!
    const exported = exportProject({
      id: 'project-1',
      name: 'Forest resilience study',
      activeScenario: scenario,
      snapshots: [],
      updatedAt: '2026-06-28T12:00:00.000Z',
    })
    const imported = importProject(exported)

    expect(imported.activeScenario.id).toBe(scenario.id)
    expect(imported.name).toBe('Forest resilience study')
    expect(imported.activeScenario.nodes.length).toBeGreaterThan(4)
  })
})
