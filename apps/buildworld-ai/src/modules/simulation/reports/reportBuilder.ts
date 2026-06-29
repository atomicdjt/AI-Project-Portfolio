import type { BuiltReport, ReportData } from '../../../types/simulation'
import { calculateSSI } from '../scoring/ssi'

export const buildSimulationReport = (data: ReportData): BuiltReport => {
  const ssi = calculateSSI(data.scenario, data.state)
  const criticalNodes = data.state.cascade.criticalNodes
    .map((id) => data.scenario.nodes.find((node) => node.id === id)?.label ?? id)
    .join(', ') || 'None detected'
  const recommendations = data.state.recommendations
    .slice(0, 5)
    .map((item, index) => `${index + 1}. ${item.title} - ${item.expectedBenefit} (${item.difficulty})`)
    .join('\n')
  const bottlenecks = data.state.bottlenecks
    .slice(0, 6)
    .map((item) => `- ${item.reason} Recommendation: ${item.recommendation}`)
    .join('\n') || '- No high-pressure bottleneck is currently dominant.'

  const markdown = `# BuildWorld AI System Simulation Report

Generated: ${new Date().toISOString()}

## 1. Executive Summary
${data.insights.executiveSummary}

## 2. Scenario Overview
${data.scenario.description}

Goal: ${data.scenario.goal}

## 3. System Type
${data.scenario.systemType}

## 4. Network Structure
- Nodes: ${data.scenario.nodes.length}
- Edges: ${data.scenario.edges.length}
- Critical nodes: ${criticalNodes}

## 5. SSI Score
Overall SSI: ${ssi.overall} (${ssi.severity})

${ssi.components.map((item) => `- ${item.name}: ${item.score} (${item.severity}) - ${item.explanation}`).join('\n')}

## 6. Simulation Metrics
- Total throughput: ${data.state.metrics.totalThroughput}
- Average utilization: ${Math.round(data.state.metrics.averageUtilization * 100)}%
- Bottleneck count: ${data.state.metrics.bottleneckCount}
- Unmet demand: ${data.state.metrics.unmetDemand}
- Resilience score: ${data.state.metrics.resilienceScore}

## 7. Bottleneck Analysis
${bottlenecks}

## 8. Cascade Risk Analysis
- Cascade depth: ${data.state.metrics.cascadeDepth}
- Affected nodes: ${data.state.metrics.affectedNodes}
- High dependency edges: ${data.state.cascade.highDependencyEdges.join(', ') || 'None detected'}
- Weak recovery zones: ${data.state.cascade.weakRecoveryZones.join(', ') || 'None detected'}

## 9. Critical Nodes
${criticalNodes}

## 10. Optimization Recommendations
${recommendations}

## 11. Scenario Comparison
Use Snapshot A and Snapshot B in the app to compare SSI, throughput, bottlenecks, cascade risk, and resilience after interventions.

## 12. Event Log Summary
${data.state.events.slice(-8).map((event) => `- Tick ${event.timeStep}: ${event.title} - ${event.detail}`).join('\n')}

## 13. Methodology
${data.insights.methodologyNote}

## 14. Limitations
BuildWorld AI is an exploratory educational simulation environment. It does not provide certified infrastructure design, medical or public-health guidance, ecological forecasting, financial advice, or safety-critical recommendations.
`

  return {
    markdown,
    json: {
      ...data,
      generatedAt: new Date().toISOString(),
      ssi,
    },
  }
}
