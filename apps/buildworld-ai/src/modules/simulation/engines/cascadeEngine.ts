import type { CascadeExperiment, CascadeExperimentResult, ScenarioTemplate } from '../../../types/simulation'
import { cloneScenario } from '../../../scenarios/templates'
import { generateOptimizationSuggestions } from '../optimization/optimizer'
import { calculateSSI } from '../scoring/ssi'
import { runSimulationTick } from './simulationRunner'

const mutateScenarioForExperiment = (scenario: ScenarioTemplate, experiment: CascadeExperiment): ScenarioTemplate => {
  const next = cloneScenario(scenario)
  const intensity = experiment.intensity ?? 0.35

  if (experiment.type === 'remove-node' || experiment.type === 'power-loss' || experiment.type === 'supplier-failure') {
    const target = next.nodes.find((node) => node.id === experiment.targetId) ?? next.nodes.find((node) => node.properties.priority >= 8) ?? next.nodes[0]
    target.properties.capacity = 0
    target.properties.throughput = 0
    target.properties.resilience = 0
    target.properties.failureProbability = 1
    next.edges
      .filter((edge) => edge.source === target.id || edge.target === target.id)
      .forEach((edge) => {
        edge.properties.reliability = 0.08
        edge.properties.flowCapacity *= 0.15
      })
    return next
  }

  if (experiment.type === 'reduce-edge-capacity') {
    const target = next.edges.find((edge) => edge.id === experiment.targetId) ?? next.edges[0]
    target.properties.flowCapacity *= Math.max(0.05, 1 - intensity)
    target.properties.reliability *= 0.78
    return next
  }

  if (experiment.type === 'increase-demand' || experiment.type === 'population-spike') {
    next.nodes.forEach((node) => {
      if (!experiment.targetId || node.id === experiment.targetId || node.properties.priority >= 7) {
        node.properties.demand *= 1 + intensity
        if (node.properties.population) node.properties.population *= 1 + intensity * 0.45
      }
    })
    return next
  }

  if (experiment.type === 'resource-shortage') {
    next.nodes.forEach((node) => {
      node.properties.stock *= 1 - intensity
      node.properties.capacity *= 1 - intensity * 0.25
    })
    return next
  }

  if (experiment.type === 'recovery-investment') {
    next.nodes.forEach((node) => {
      if (!experiment.targetId || node.id === experiment.targetId || node.properties.resilience < 55) {
        node.properties.resilience = Math.min(100, node.properties.resilience + 22)
        node.properties.recoveryTime = Math.max(1, node.properties.recoveryTime - 1)
      }
    })
  }

  return next
}

const traceCascade = (scenario: ScenarioTemplate, startId?: string): string[] => {
  const start = startId ?? scenario.nodes[0]?.id
  if (!start) return []
  const visited = new Set<string>()
  const queue = [start]
  while (queue.length > 0 && visited.size < 8) {
    const current = queue.shift()!
    if (visited.has(current)) continue
    visited.add(current)
    scenario.edges
      .filter((edge) => edge.source === current && edge.properties.dependencyStrength > 0.55)
      .sort((a, b) => b.properties.dependencyStrength - a.properties.dependencyStrength)
      .forEach((edge) => queue.push(edge.target))
  }
  return [...visited]
}

export const runCascadeExperiment = (
  scenario: ScenarioTemplate,
  experiment: CascadeExperiment,
): CascadeExperimentResult => {
  const before = runSimulationTick(scenario, undefined, { seed: 101 })
  const mutated = mutateScenarioForExperiment(scenario, experiment)
  const after = runSimulationTick(mutated, undefined, { seed: 101 })
  const cascadePath = traceCascade(scenario, experiment.targetId)
  const affectedNodes = Object.values(after.nodeStates)
    .filter((node) => node.status !== 'normal' || cascadePath.includes(node.nodeId))
    .map((node) => node.nodeId)

  return {
    experiment,
    before,
    after,
    affectedNodes,
    cascadePath,
    ssiBefore: calculateSSI(scenario, before),
    ssiAfter: calculateSSI(mutated, after),
    recommendations: generateOptimizationSuggestions(mutated, after),
  }
}
