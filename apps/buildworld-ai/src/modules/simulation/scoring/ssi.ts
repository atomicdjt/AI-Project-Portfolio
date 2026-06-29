import type { ScenarioTemplate, SimulationState, SSIComponent, SSIResult } from '../../../types/simulation'
import { bandForScore, clamp, round } from '../utils'

const component = (
  name: string,
  score: number,
  explanation: string,
  contributingFactors: string[],
  suggestedImprovements: string[],
): SSIComponent => {
  const cleanScore = clamp(round(score, 0))
  return {
    name,
    score: cleanScore,
    severity: bandForScore(cleanScore),
    explanation,
    contributingFactors,
    suggestedImprovements,
  }
}

export const calculateSSI = (scenario: ScenarioTemplate, state: SimulationState): SSIResult => {
  const metrics = state.metrics
  const highBottlenecks = state.bottlenecks.filter((item) => item.severity === 'high').length
  const redundancy = metrics.redundancyScore || clamp((scenario.edges.length / Math.max(1, scenario.nodes.length - 1)) * 48)
  const averageRecovery = scenario.nodes.reduce((sum, node) => sum + node.properties.recoveryTime, 0) / Math.max(1, scenario.nodes.length)
  const fragileNodes = scenario.nodes.filter((node) => node.properties.resilience < 50).length
  const resourceScore =
    scenario.systemType === 'ecosystem'
      ? metrics.ecosystemHealth || metrics.stabilityScore || 50
      : scenario.systemType === 'epidemic'
        ? metrics.containmentScore || 55
        : clamp(100 - metrics.unmetDemand * 0.22)

  const components = [
    component(
      'Throughput Efficiency',
      metrics.systemEfficiency,
      `The model compares completed flow against declared demand for ${scenario.name}.`,
      [`Total throughput ${round(metrics.totalThroughput, 0)}`, `Average utilization ${round(metrics.averageUtilization * 100, 0)}%`],
      metrics.systemEfficiency < 70 ? ['Increase capacity only at measured constraints', 'Shift demand toward underused paths'] : ['Maintain monitoring around high-demand nodes'],
    ),
    component(
      'Bottleneck Risk',
      100 - metrics.bottleneckCount * 12 - highBottlenecks * 10,
      'Bottleneck risk falls as overloaded nodes and saturated edges accumulate.',
      [`${metrics.bottleneckCount} active bottleneck findings`, `${highBottlenecks} high-severity findings`],
      metrics.bottleneckCount > 0 ? ['Resolve the top-ranked bottleneck before broad expansion', 'Add alternate paths around constrained components'] : ['Preserve current flow balance'],
    ),
    component(
      'Resilience',
      metrics.resilienceScore,
      'Resilience estimates node health under load, failure probability, and recovery posture.',
      [`${fragileNodes} low-resilience nodes`, `Average recovery delay ${round(averageRecovery, 1)} ticks`],
      fragileNodes > 0 ? ['Upgrade low-resilience nodes with high priority first', 'Reduce demand concentration on fragile assets'] : ['Continue monitoring recovery assumptions'],
    ),
    component(
      'Redundancy',
      redundancy,
      'Redundancy reflects whether demand can reroute when dependencies fail.',
      [`${scenario.edges.length} edges across ${scenario.nodes.length} nodes`, `${state.cascade.singlePointsOfFailure.length} single points of failure`],
      redundancy < 70 ? ['Add backup edges for critical flows', 'Avoid one-route dependency into high-priority nodes'] : ['Document which paths provide failover'],
    ),
    component(
      'Cascade Resistance',
      100 - metrics.cascadeDepth * 12 - state.cascade.highDependencyEdges.length * 4,
      'Cascade resistance estimates how deeply a triggered failure can propagate through dependencies.',
      [`Cascade depth ${metrics.cascadeDepth}`, `${state.cascade.highDependencyEdges.length} high-dependency edges`],
      metrics.cascadeDepth > 1 ? ['Reduce dependency strength around critical nodes', 'Increase isolation between fragile clusters'] : ['Retain low-coupling architecture'],
    ),
    component(
      'Resource Balance',
      resourceScore,
      'Resource balance uses queue pressure, stock levels, ecological balance, or containment pressure depending on scenario type.',
      [`Unmet demand ${round(metrics.unmetDemand, 0)}`, `Resource pressure ${round(metrics.resourcePressure, 0)}`],
      resourceScore < 70 ? ['Rebalance stock, capacity, or mitigation resources', 'Watch for accumulating queue pressure'] : ['Keep reserve buffers visible'],
    ),
    component(
      'Recovery Capacity',
      100 - averageRecovery * 8 - fragileNodes * 4,
      'Recovery capacity rewards faster restoration and stronger low-level resilience assumptions.',
      [`Average recovery time ${round(averageRecovery, 1)} ticks`, `${fragileNodes} fragile recovery zones`],
      averageRecovery > 3 ? ['Invest in recovery speed for priority nodes', 'Create manual response plans for weak zones'] : ['Keep recovery assumptions conservative'],
    ),
    component(
      'Optimization Potential',
      100 - Math.min(60, state.recommendations.length * 8 + metrics.unmetDemand * 0.08),
      'Optimization potential is lower when the model finds many high-benefit interventions still available.',
      [`${state.recommendations.length} generated recommendations`, `Top bottleneck impact ${round(state.bottlenecks[0]?.impact ?? 0, 0)}`],
      state.recommendations.length > 2 ? ['Prioritize the first recommendation and rerun comparison', 'Save before/after snapshots after each intervention'] : ['Use scenario comparison for incremental improvements'],
    ),
  ]

  const overall = clamp(round(components.reduce((sum, item) => sum + item.score, 0) / components.length, 0))
  return {
    overall,
    severity: bandForScore(overall),
    components,
    summary: `BuildWorld AI SSI is an exploratory 0-100 educational stability score. ${scenario.name} is currently ${bandForScore(overall).toLowerCase()} at ${overall}.`,
  }
}
