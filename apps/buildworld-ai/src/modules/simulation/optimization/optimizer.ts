import type { OptimizationSuggestion, ScenarioTemplate, SimulationState } from '../../../types/simulation'

const systemPlaybooks: Record<string, string[]> = {
  traffic: ['add an alternate route', 'increase intersection capacity', 'add transit diversion'],
  'supply-chain': ['add backup supplier', 'increase warehouse buffer', 'reduce single-factory dependency'],
  'power-grid': ['add storage capacity', 'protect critical facility feed', 'improve substation redundancy'],
  ecosystem: ['reduce invasive pressure', 'restore habitat node', 'increase resource availability'],
  factory: ['add buffer capacity', 'upgrade the bottleneck station', 'rebalance station flow'],
  epidemic: ['increase mitigation capacity', 'reduce contact hub pressure', 'expand healthcare buffer'],
  resilience: ['add redundant resource route', 'invest in weak recovery zone', 'protect critical aid node'],
  custom: ['add backup edge', 'increase constrained node capacity', 'rebalance demand'],
}

export const generateOptimizationSuggestions = (
  scenario: ScenarioTemplate,
  state: SimulationState,
): OptimizationSuggestion[] => {
  const playbook = systemPlaybooks[scenario.systemType] ?? systemPlaybooks.custom
  const bottleneckSuggestions = state.bottlenecks.slice(0, 4).map((finding, index) => {
    const target = scenario.nodes.find((node) => node.id === finding.nodeId)?.label ?? scenario.edges.find((edge) => edge.id === finding.edgeId)?.label ?? 'constraint'
    return {
      id: `opt-${finding.id}`,
      title: `${playbook[index % playbook.length]} near ${target}`,
      expectedBenefit: finding.severity === 'high' ? 'High reduction in queue pressure and cascade exposure' : 'Moderate improvement to utilization balance',
      difficulty: finding.severity === 'high' ? ('High' as const) : ('Medium' as const),
      relatedMetric: finding.nodeId ? 'Node utilization' : 'Edge saturation',
      reasoning: finding.recommendation,
      priority: Math.round(90 - index * 8 + finding.impact * 0.2),
    }
  })

  const structuralSuggestions: OptimizationSuggestion[] = [
    {
      id: 'opt-redundancy',
      title: playbook[0],
      expectedBenefit: 'Improves failover options and lowers single-point-of-failure risk',
      difficulty: 'Medium',
      relatedMetric: 'Redundancy score',
      reasoning: `${state.cascade.singlePointsOfFailure.length} single points of failure were detected in the graph topology.`,
      priority: 72 + state.cascade.singlePointsOfFailure.length * 3,
    },
    {
      id: 'opt-recovery',
      title: playbook[1],
      expectedBenefit: 'Shortens recovery time and improves SSI recovery capacity',
      difficulty: 'Low',
      relatedMetric: 'Recovery capacity',
      reasoning: `${state.cascade.weakRecoveryZones.length} weak recovery zones have low resilience or slow recovery assumptions.`,
      priority: 66 + state.cascade.weakRecoveryZones.length * 2,
    },
    {
      id: 'opt-snapshot',
      title: 'save a baseline and compare after one intervention',
      expectedBenefit: 'Creates an auditable before/after trail for the report builder',
      difficulty: 'Low',
      relatedMetric: 'Scenario comparison',
      reasoning: 'Snapshot comparison makes optimization claims visible without implying formal engineering accuracy.',
      priority: 58,
    },
  ]

  return [...bottleneckSuggestions, ...structuralSuggestions]
    .filter((item, index, list) => list.findIndex((candidate) => candidate.title === item.title) === index)
    .sort((a, b) => b.priority - a.priority)
}
