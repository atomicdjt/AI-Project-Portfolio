import type { InsightSummary, ScenarioTemplate, SimulationState } from '../../../types/simulation'
import { calculateSSI } from '../scoring/ssi'
import { round } from '../utils'

export const generateInsights = (scenario: ScenarioTemplate, state: SimulationState): InsightSummary => {
  const ssi = calculateSSI(scenario, state)
  const topBottleneck = state.bottlenecks[0]
  const topRecommendation = state.recommendations[0]
  return {
    executiveSummary: `${scenario.name} currently has an exploratory SSI of ${ssi.overall} (${ssi.severity}). The simulation generated ${round(state.metrics.totalThroughput, 0)} units of modeled throughput with ${state.metrics.bottleneckCount} active bottleneck findings.`,
    riskExplanation:
      topBottleneck?.reason ??
      'The current graph does not show a high-severity bottleneck, but continued monitoring is recommended after each scenario edit.',
    bottleneckSummary: topBottleneck
      ? `${topBottleneck.recommendation} This finding is based on graph pressure, capacity, and dependency assumptions in the active scenario.`
      : 'No immediate bottleneck dominated this tick.',
    optimizationNarrative: topRecommendation
      ? `${topRecommendation.title} is the top generated intervention because it targets ${topRecommendation.relatedMetric.toLowerCase()} and is expected to deliver: ${topRecommendation.expectedBenefit}.`
      : 'Run additional ticks or add scenario complexity to generate optimization suggestions.',
    methodologyNote:
      'BuildWorld AI uses deterministic educational simulations and original scoring heuristics. It is not a certified engineering, public-health, ecological, financial, or safety-critical decision system.',
  }
}
