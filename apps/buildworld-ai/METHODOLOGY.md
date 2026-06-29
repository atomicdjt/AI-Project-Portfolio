# BuildWorld AI Methodology

BuildWorld AI models systems as graph networks. Nodes represent assets, populations, resources, facilities, or process steps. Edges represent flow, dependency, mobility, predation, resource transfer, or transmission relationships.

## Tick Loop

Each simulation tick:

1. Reads the active scenario graph.
2. Calculates edge flow from capacity, reliability, transfer efficiency, demand pull, and congestion sensitivity.
3. Updates node utilization, queue pressure, stock/resource levels, health, and status.
4. Detects overloaded nodes and saturated edges.
5. Estimates cascade-prone structures from dependency strength and graph topology.
6. Calculates metrics and appends bounded time-series history.
7. Generates deterministic insights and optimization suggestions.

## Simulation Modes

Flow networks model capacity, demand, throughput, congestion, queue buildup, utilization, unmet demand, and resilience.

Ecosystem scenarios model resource stock, growth, decay, invasive pressure, biodiversity, stability, and collapse risk.

Epidemic/population scenarios model educational spread dynamics using susceptible, infected, recovered, contact pressure, mitigation, healthcare pressure, and containment scores.

Cascade analysis models triggering stress, affected nodes, dependency paths, redundancy, weak recovery zones, and before/after SSI changes.

## SSI

SSI is an original educational heuristic, not a certification. Severity bands:

- 85-100: Strong
- 70-84: Stable
- 50-69: Strained
- 30-49: Fragile
- 0-29: Critical

## Appropriate Uses

- Classroom discussion
- Systems thinking exercises
- Product strategy exploration
- Portfolio and technical demonstration
- Scenario comparison and communication

## Not Appropriate For

- Certified engineering analysis
- Public-health guidance
- Safety-critical infrastructure design
- Ecological forecasting
- Financial or operational commitments without expert validation
