import type { EdgeRuntimeState, NodeRuntimeState, ScenarioTemplate, SimulationOptions, SimulationState, TimeSeriesPoint } from '../../../types/simulation'
import { buildCascadeFinding, clamp, detectBottlenecks, emptyMetrics, round, statusForUtilization } from '../utils'
import { calculateSSI } from '../scoring/ssi'
import { generateOptimizationSuggestions } from '../optimization/optimizer'

const seededNoise = (seed: number, step: number, salt: number): number => {
  const x = Math.sin(seed * 97.13 + step * 41.7 + salt * 12.9898) * 10000
  return x - Math.floor(x)
}

export const runSimulationTick = (
  scenario: ScenarioTemplate,
  previous?: SimulationState,
  options: SimulationOptions = {},
): SimulationState => {
  const timeStep = (previous?.timeStep ?? 0) + 1
  const seed = options.seed ?? 1

  const nodeStates: Record<string, NodeRuntimeState> = {}
  const edgeStates: Record<string, EdgeRuntimeState> = {}
  const inboundFlow = new Map<string, number>()
  const outboundFlow = new Map<string, number>()
  scenario.nodes.forEach((node) => {
    inboundFlow.set(node.id, 0)
    outboundFlow.set(node.id, 0)
  })

  scenario.edges.forEach((edge, index) => {
    const source = scenario.nodes.find((node) => node.id === edge.source)
    const target = scenario.nodes.find((node) => node.id === edge.target)
    if (!source || !target) return
    const sourceAvailable = Math.max(source.properties.throughput, source.properties.stock, source.properties.capacity * 0.55)
    const demandPull = Math.max(target.properties.demand, target.properties.capacity * 0.4)
    const congestionPenalty = 1 - Math.min(0.42, edge.properties.congestionSensitivity * Math.max(0, demandPull / Math.max(1, target.properties.capacity) - 0.75))
    const randomStress = 0.92 + seededNoise(seed, timeStep, index) * 0.12
    const flow = Math.max(
      0,
      Math.min(edge.properties.flowCapacity, sourceAvailable, demandPull) *
        edge.properties.reliability *
        edge.properties.transferEfficiency *
        congestionPenalty *
        randomStress,
    )
    const utilization = flow / Math.max(1, edge.properties.flowCapacity)
    edgeStates[edge.id] = {
      edgeId: edge.id,
      flow: round(flow, 1),
      utilization: round(utilization, 3),
      reliability: round(edge.properties.reliability * congestionPenalty, 3),
      status: statusForUtilization(utilization, edge.properties.reliability * 100),
    }
    inboundFlow.set(edge.target, (inboundFlow.get(edge.target) ?? 0) + flow)
    outboundFlow.set(edge.source, (outboundFlow.get(edge.source) ?? 0) + flow)
  })

  scenario.nodes.forEach((node, index) => {
    const inbound = inboundFlow.get(node.id) ?? 0
    const outbound = outboundFlow.get(node.id) ?? 0
    const basePressure = Math.max(node.properties.demand, inbound, outbound)
    const utilization = basePressure / Math.max(1, node.properties.capacity)
    const failureStress = node.properties.failureProbability * (utilization > 1 ? 2.3 : 1) * (1 - node.properties.resilience / 140)
    const noise = seededNoise(seed, timeStep, index + 100)
    const health = clamp(node.properties.resilience + 30 - utilization * 18 - (noise < failureStress ? 55 : 0))
    const queue = Math.max(0, basePressure - node.properties.capacity)
    const previousNode = previous?.nodeStates[node.id]
    const stock = clamp((previousNode?.stock ?? node.properties.stock) + inbound * 0.08 - node.properties.demand * 0.05, 0, node.properties.capacity * 1.8)

    if (scenario.systemType === 'epidemic' || node.type === 'population-group') {
      const population = node.properties.population ?? node.properties.capacity
      const previousInfected = previousNode?.infected ?? node.properties.infected ?? 0
      const previousRecovered = previousNode?.recovered ?? node.properties.recovered ?? 0
      const contacts = (node.properties.contactRate ?? 0.12) + inbound / Math.max(1, population) * 0.05
      const newCases = Math.min(population - previousRecovered - previousInfected, previousInfected * (node.properties.infectionRate ?? 0.06) * (1 + contacts))
      const recovered = Math.min(population, previousRecovered + previousInfected * 0.11 + (node.type === 'healthcare-node' ? 8 : 0))
      const infected = Math.max(0, previousInfected + newCases - previousInfected * 0.11)
      nodeStates[node.id] = {
        nodeId: node.id,
        utilization: round(utilization, 3),
        queue: round(queue, 1),
        health,
        status: statusForUtilization(utilization, health),
        currentThroughput: round(inbound + outbound, 1),
        stock,
        population,
        susceptible: round(Math.max(0, population - infected - recovered), 0),
        infected: round(infected, 0),
        recovered: round(recovered, 0),
      }
      return
    }

    if (scenario.systemType === 'ecosystem') {
      const growth = (node.properties.growthRate ?? 0.05) * stock
      const decay = (node.properties.decayRate ?? 0.03) * stock
      const pressure = node.type === 'invasive-species' ? 7 : inbound * 0.04 - outbound * 0.03
      nodeStates[node.id] = {
        nodeId: node.id,
        utilization: round(utilization, 3),
        queue: round(queue, 1),
        health,
        status: statusForUtilization(utilization, health),
        currentThroughput: round(inbound + outbound, 1),
        stock: clamp(stock + growth - decay + pressure, 0, node.properties.capacity * 1.9),
      }
      return
    }

    nodeStates[node.id] = {
      nodeId: node.id,
      utilization: round(utilization, 3),
      queue: round(queue, 1),
      health,
      status: statusForUtilization(utilization, health),
      currentThroughput: round(inbound + outbound, 1),
      stock,
    }
  })

  const bottlenecks = detectBottlenecks(scenario, nodeStates, edgeStates)
  const metrics = emptyMetrics()
  const nodeList = Object.values(nodeStates)
  const edgeList = Object.values(edgeStates)
  metrics.totalThroughput = round(edgeList.reduce((sum, edge) => sum + edge.flow, 0), 1)
  metrics.averageUtilization = round(nodeList.reduce((sum, node) => sum + node.utilization, 0) / Math.max(1, nodeList.length), 3)
  metrics.bottleneckCount = bottlenecks.length
  metrics.unmetDemand = round(nodeList.reduce((sum, node) => sum + node.queue, 0), 1)
  metrics.congestionLevel = clamp(round(metrics.averageUtilization * 92 + bottlenecks.length * 4, 1))
  metrics.systemEfficiency = clamp(round((metrics.totalThroughput / Math.max(1, scenario.nodes.reduce((sum, node) => sum + node.properties.demand, 0))) * 100 - bottlenecks.length * 2, 1))
  metrics.resilienceScore = clamp(round(nodeList.reduce((sum, node) => sum + node.health, 0) / Math.max(1, nodeList.length) - bottlenecks.length * 2, 1))
  metrics.redundancyScore = clamp(round((scenario.edges.length / Math.max(1, scenario.nodes.length - 1)) * 46, 1))
  metrics.cascadeDepth = Math.min(5, bottlenecks.filter((item) => item.severity === 'high').length + Math.max(0, 3 - Math.floor(metrics.redundancyScore / 25)))
  metrics.affectedNodes = nodeList.filter((node) => node.status !== 'normal').length
  metrics.recoveryTime = round(nodeList.reduce((sum, node) => sum + (node.status === 'failed' ? 5 : node.status === 'recovering' ? 3 : node.status === 'overloaded' ? 2 : 0), 0), 1)
  metrics.resilienceIndex = clamp(round((metrics.resilienceScore + metrics.redundancyScore + (100 - metrics.congestionLevel)) / 3, 1))

  if (scenario.systemType === 'ecosystem') {
    const stocks = nodeList.map((node) => node.stock)
    const averageStock = stocks.reduce((sum, value) => sum + value, 0) / Math.max(1, stocks.length)
    const variance = stocks.reduce((sum, value) => sum + Math.abs(value - averageStock), 0) / Math.max(1, stocks.length)
    metrics.biodiversityScore = clamp(round(100 - variance * 0.42, 1))
    metrics.resourcePressure = clamp(round(metrics.congestionLevel + (scenario.nodes.find((node) => node.type === 'invasive-species')?.properties.stock ?? 0) * 0.12, 1))
    metrics.collapseRisk = clamp(round(100 - metrics.resilienceScore + metrics.resourcePressure * 0.35, 1))
    metrics.stabilityScore = clamp(round((metrics.biodiversityScore + metrics.resilienceScore + (100 - metrics.collapseRisk)) / 3, 1))
    metrics.populationBalance = clamp(round(100 - variance * 0.35, 1))
    metrics.ecosystemHealth = metrics.stabilityScore
  }

  if (scenario.systemType === 'epidemic') {
    const activeCases = nodeList.reduce((sum, node) => sum + (node.infected ?? 0), 0)
    const recoveredCount = nodeList.reduce((sum, node) => sum + (node.recovered ?? 0), 0)
    const healthcareCapacity = scenario.nodes.filter((node) => node.type === 'healthcare-node').reduce((sum, node) => sum + node.properties.capacity, 0)
    metrics.activeCases = round(activeCases, 0)
    metrics.recoveredCount = round(recoveredCount, 0)
    metrics.peakLoad = Math.max(previous?.metrics.peakLoad ?? 0, metrics.activeCases)
    metrics.healthcarePressure = clamp(round((activeCases / Math.max(1, healthcareCapacity)) * 100, 1))
    metrics.spreadVelocity = round(metrics.activeCases - (previous?.metrics.activeCases ?? metrics.activeCases), 1)
    metrics.containmentScore = clamp(round(100 - metrics.healthcarePressure * 0.5 - Math.max(0, metrics.spreadVelocity) * 1.4, 1))
  }

  const events = [
    ...(previous?.events.slice(-8) ?? []),
    ...bottlenecks.slice(0, 2).map((finding, index) => ({
      id: `event-${timeStep}-${index}`,
      timeStep,
      severity: finding.severity === 'high' ? ('critical' as const) : ('warning' as const),
      title: finding.severity === 'high' ? 'Critical pressure detected' : 'Strained component detected',
      detail: finding.reason,
    })),
  ]
  if (events.length === 0) {
    events.push({
      id: `event-${timeStep}-stable`,
      timeStep,
      severity: 'info',
      title: 'Simulation tick completed',
      detail: 'No high-severity bottleneck detected in this tick.',
    })
  }

  const cascade = buildCascadeFinding(scenario, nodeStates, edgeStates)
  const tempState: SimulationState = {
    scenarioId: scenario.id,
    timeStep,
    nodeStates,
    edgeStates,
    metrics,
    events,
    warnings: bottlenecks.filter((item) => item.severity === 'high').map((item) => item.reason),
    bottlenecks,
    cascade,
    recommendations: [],
    history: [],
  }
  const ssi = calculateSSI(scenario, tempState)
  const point: TimeSeriesPoint = {
    ...metrics,
    timeStep,
    ssi: ssi.overall,
  }
  tempState.history = [...(previous?.history ?? []), point].slice(-240)
  tempState.recommendations = generateOptimizationSuggestions(scenario, tempState)
  return tempState
}
