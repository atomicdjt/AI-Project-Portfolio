import type {
  BottleneckFinding,
  CascadeFinding,
  EdgeRuntimeState,
  EntityStatus,
  NodeRuntimeState,
  ScenarioTemplate,
  SimulationMetrics,
} from '../../types/simulation'

export const clamp = (value: number, min = 0, max = 100): number => Math.min(max, Math.max(min, value))

export const round = (value: number, digits = 1): number => {
  const scale = 10 ** digits
  return Math.round(value * scale) / scale
}

export const bandForScore = (score: number) => {
  if (score >= 85) return 'Strong'
  if (score >= 70) return 'Stable'
  if (score >= 50) return 'Strained'
  if (score >= 30) return 'Fragile'
  return 'Critical'
}

export const statusForUtilization = (utilization: number, health = 100): EntityStatus => {
  if (health <= 5) return 'failed'
  if (health < 45) return 'recovering'
  if (utilization >= 1.05) return 'overloaded'
  if (utilization >= 0.82) return 'strained'
  return 'normal'
}

export const emptyMetrics = (): SimulationMetrics => ({
  totalThroughput: 0,
  averageUtilization: 0,
  bottleneckCount: 0,
  unmetDemand: 0,
  congestionLevel: 0,
  systemEfficiency: 0,
  resilienceScore: 0,
  biodiversityScore: 0,
  stabilityScore: 0,
  populationBalance: 0,
  resourcePressure: 0,
  collapseRisk: 0,
  ecosystemHealth: 0,
  activeCases: 0,
  recoveredCount: 0,
  peakLoad: 0,
  healthcarePressure: 0,
  spreadVelocity: 0,
  containmentScore: 0,
  cascadeDepth: 0,
  affectedNodes: 0,
  recoveryTime: 0,
  redundancyScore: 0,
  resilienceIndex: 0,
})

export const buildCascadeFinding = (
  scenario: ScenarioTemplate,
  nodeStates: Record<string, NodeRuntimeState>,
  edgeStates: Record<string, EdgeRuntimeState>,
): CascadeFinding => {
  const inbound = new Map<string, number>()
  const outbound = new Map<string, number>()
  scenario.nodes.forEach((node) => {
    inbound.set(node.id, 0)
    outbound.set(node.id, 0)
  })
  scenario.edges.forEach((edge) => {
    inbound.set(edge.target, (inbound.get(edge.target) ?? 0) + 1)
    outbound.set(edge.source, (outbound.get(edge.source) ?? 0) + 1)
  })

  const criticalNodes = scenario.nodes
    .filter((node) => (node.properties.priority >= 8 || (nodeStates[node.id]?.utilization ?? 0) > 0.9))
    .map((node) => node.id)
  const singlePointsOfFailure = scenario.nodes
    .filter((node) => (inbound.get(node.id) ?? 0) <= 1 && (outbound.get(node.id) ?? 0) >= 1 && node.properties.priority >= 7)
    .map((node) => node.id)
  const highDependencyEdges = scenario.edges
    .filter((edge) => edge.properties.dependencyStrength > 0.78 || (edgeStates[edge.id]?.utilization ?? 0) > 0.9)
    .map((edge) => edge.id)
  const weakRecoveryZones = scenario.nodes
    .filter((node) => node.properties.recoveryTime > 3 || node.properties.resilience < 50)
    .map((node) => node.id)
  const cascadeProneClusters = criticalNodes.slice(0, 3).map((id) => [
    id,
    ...scenario.edges.filter((edge) => edge.source === id).slice(0, 2).map((edge) => edge.target),
  ])

  return {
    criticalNodes,
    highDependencyEdges,
    singlePointsOfFailure,
    weakRecoveryZones,
    cascadeProneClusters,
  }
}

export const detectBottlenecks = (
  scenario: ScenarioTemplate,
  nodeStates: Record<string, NodeRuntimeState>,
  edgeStates: Record<string, EdgeRuntimeState>,
): BottleneckFinding[] => {
  const nodeFindings = scenario.nodes
    .map((node): BottleneckFinding | undefined => {
      const state = nodeStates[node.id]
      if (!state || state.utilization < 0.82) return undefined
      const severity = state.utilization > 1.02 ? 'high' : state.utilization > 0.92 ? 'medium' : 'low'
      return {
        id: `node-${node.id}`,
        nodeId: node.id,
        severity,
        reason: `${node.label} is operating at ${round(state.utilization * 100, 0)}% utilization with queue pressure of ${round(state.queue, 0)} units.`,
        recommendation: node.properties.resilience < 55 ? 'Invest in recovery and redundancy before adding more demand.' : 'Rebalance demand or add an alternate path.',
        impact: round((state.utilization - 0.78) * 100 + state.queue * 0.25, 1),
      }
    })
    .filter(Boolean) as BottleneckFinding[]

  const edgeFindings = scenario.edges
    .map((edge): BottleneckFinding | undefined => {
      const state = edgeStates[edge.id]
      if (!state || state.utilization < 0.86) return undefined
      return {
        id: `edge-${edge.id}`,
        edgeId: edge.id,
        severity: state.utilization > 1 ? 'high' : 'medium',
        reason: `${edge.label} is carrying ${round(state.utilization * 100, 0)}% of available edge capacity.`,
        recommendation: edge.properties.reliability < 0.86 ? 'Add a backup route or reliability upgrade.' : 'Shift part of the flow to a less utilized edge.',
        impact: round((state.utilization - 0.8) * 90, 1),
      }
    })
    .filter(Boolean) as BottleneckFinding[]

  return [...nodeFindings, ...edgeFindings].sort((a, b) => b.impact - a.impact)
}
