export type SystemType =
  | 'traffic'
  | 'supply-chain'
  | 'power-grid'
  | 'ecosystem'
  | 'factory'
  | 'epidemic'
  | 'resilience'
  | 'custom'

export type NodeType =
  | 'source'
  | 'sink'
  | 'hub'
  | 'processor'
  | 'storage'
  | 'consumer'
  | 'regulator'
  | 'sensor'
  | 'failure-point'
  | 'intersection'
  | 'road-segment'
  | 'residential-zone'
  | 'commercial-zone'
  | 'highway-entrance'
  | 'transit-hub'
  | 'supplier'
  | 'factory'
  | 'warehouse'
  | 'distribution-center'
  | 'retailer'
  | 'customer-demand'
  | 'generator'
  | 'substation'
  | 'transformer'
  | 'storage-battery'
  | 'load-center'
  | 'critical-facility'
  | 'producer'
  | 'herbivore'
  | 'predator'
  | 'water-source'
  | 'habitat'
  | 'invasive-species'
  | 'resource-pool'
  | 'population-group'
  | 'contact-hub'
  | 'healthcare-node'
  | 'quarantine-zone'
  | 'mobility-link'
  | 'input-dock'
  | 'machine'
  | 'conveyor'
  | 'buffer'
  | 'packing-station'
  | 'output-dock'

export type EdgeType = 'flow' | 'dependency' | 'mobility' | 'predation' | 'resource' | 'transmission'
export type SeverityBand = 'Strong' | 'Stable' | 'Strained' | 'Fragile' | 'Critical'
export type EntityStatus = 'normal' | 'strained' | 'overloaded' | 'failed' | 'recovering'
export type ExperimentType =
  | 'remove-node'
  | 'reduce-edge-capacity'
  | 'increase-demand'
  | 'power-loss'
  | 'supplier-failure'
  | 'population-spike'
  | 'resource-shortage'
  | 'recovery-investment'

export interface SimulationNodeProperties {
  capacity: number
  demand: number
  throughput: number
  failureProbability: number
  recoveryTime: number
  cost: number
  priority: number
  resilience: number
  stock: number
  growthRate?: number
  decayRate?: number
  infectionRate?: number
  contactRate?: number
  processingTime?: number
  population?: number
  infected?: number
  recovered?: number
}

export interface SimulationEdgeProperties {
  flowCapacity: number
  travelTime: number
  cost: number
  reliability: number
  direction: 'directed' | 'bidirectional'
  congestionSensitivity: number
  transferEfficiency: number
  dependencyStrength: number
}

export interface SimulationNode {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  properties: SimulationNodeProperties
  notes?: string
}

export interface SimulationEdge {
  id: string
  label: string
  source: string
  target: string
  type: EdgeType
  properties: SimulationEdgeProperties
}

export interface ScenarioTemplate {
  id: string
  name: string
  description: string
  systemType: SystemType
  goal: string
  suggestedExperiments: string[]
  visibleRisks: string[]
  baselineMetrics: Partial<SimulationMetrics>
  nodes: SimulationNode[]
  edges: SimulationEdge[]
}

export interface NodeRuntimeState {
  nodeId: string
  utilization: number
  queue: number
  health: number
  status: EntityStatus
  currentThroughput: number
  stock: number
  population?: number
  susceptible?: number
  infected?: number
  recovered?: number
}

export interface EdgeRuntimeState {
  edgeId: string
  flow: number
  utilization: number
  reliability: number
  status: EntityStatus
}

export interface SimulationMetrics {
  totalThroughput: number
  averageUtilization: number
  bottleneckCount: number
  unmetDemand: number
  congestionLevel: number
  systemEfficiency: number
  resilienceScore: number
  biodiversityScore: number
  stabilityScore: number
  populationBalance: number
  resourcePressure: number
  collapseRisk: number
  ecosystemHealth: number
  activeCases: number
  recoveredCount: number
  peakLoad: number
  healthcarePressure: number
  spreadVelocity: number
  containmentScore: number
  cascadeDepth: number
  affectedNodes: number
  recoveryTime: number
  redundancyScore: number
  resilienceIndex: number
}

export interface TimeSeriesPoint extends SimulationMetrics {
  timeStep: number
  ssi: number
}

export interface SimulationEvent {
  id: string
  timeStep: number
  severity: 'info' | 'warning' | 'critical'
  title: string
  detail: string
}

export interface BottleneckFinding {
  id: string
  nodeId?: string
  edgeId?: string
  severity: 'low' | 'medium' | 'high'
  reason: string
  recommendation: string
  impact: number
}

export interface CascadeFinding {
  criticalNodes: string[]
  highDependencyEdges: string[]
  singlePointsOfFailure: string[]
  weakRecoveryZones: string[]
  cascadeProneClusters: string[][]
}

export interface SSIComponent {
  name: string
  score: number
  severity: SeverityBand
  explanation: string
  contributingFactors: string[]
  suggestedImprovements: string[]
}

export interface SSIResult {
  overall: number
  severity: SeverityBand
  components: SSIComponent[]
  summary: string
}

export interface OptimizationSuggestion {
  id: string
  title: string
  expectedBenefit: string
  difficulty: 'Low' | 'Medium' | 'High'
  relatedMetric: string
  reasoning: string
  priority: number
}

export interface SimulationState {
  scenarioId: string
  timeStep: number
  nodeStates: Record<string, NodeRuntimeState>
  edgeStates: Record<string, EdgeRuntimeState>
  metrics: SimulationMetrics
  events: SimulationEvent[]
  warnings: string[]
  bottlenecks: BottleneckFinding[]
  cascade: CascadeFinding
  recommendations: OptimizationSuggestion[]
  history: TimeSeriesPoint[]
}

export interface ScenarioSnapshot {
  id: string
  name: string
  createdAt: string
  scenario: ScenarioTemplate
  state: SimulationState
  ssi: SSIResult
}

export interface ScenarioComparison {
  baseline: ScenarioSnapshot
  variant: ScenarioSnapshot
  ssiChange: number
  throughputChange: number
  bottleneckChange: number
  resilienceChange: number
  cascadeRiskChange: number
  recommendationSummary: string
}

export interface SimulationProject {
  id: string
  name: string
  activeScenario: ScenarioTemplate
  snapshots: ScenarioSnapshot[]
  updatedAt: string
}

export interface ProjectExport extends SimulationProject {
  schemaVersion: 1
  exportedAt: string
}

export interface SimulationOptions {
  seed?: number
}

export interface CascadeExperiment {
  type: ExperimentType
  targetId?: string
  label: string
  intensity?: number
}

export interface CascadeExperimentResult {
  experiment: CascadeExperiment
  before: SimulationState
  after: SimulationState
  affectedNodes: string[]
  cascadePath: string[]
  ssiBefore: SSIResult
  ssiAfter: SSIResult
  recommendations: OptimizationSuggestion[]
}

export interface InsightSummary {
  executiveSummary: string
  riskExplanation: string
  bottleneckSummary: string
  optimizationNarrative: string
  methodologyNote: string
}

export interface ReportData {
  scenario: ScenarioTemplate
  state: SimulationState
  insights: InsightSummary
}

export interface BuiltReport {
  markdown: string
  json: ReportData & { generatedAt: string; ssi: SSIResult }
}
