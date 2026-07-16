import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AppHeader } from './components/AppHeader'
import { BedToolbar } from './components/BedToolbar'
import { GardenBed } from './components/GardenBed'
import { Inspector } from './components/Inspector'
import { MobileTabs } from './components/MobileTabs'
import { PlantLibrary } from './components/PlantLibrary'
import { getPlant } from './domain/plants'
import { summarizePlan } from './domain/summary'
import { formatBedDimension } from './domain/units'
import { useGardenStore } from './store/useGardenStore'
import './styles.css'

export default function App() {
  const plan = useGardenStore((state) => state.activePlan())
  const selectedPlantId = useGardenStore((state) => state.selectedPlantId)
  const announcement = useGardenStore((state) => state.announcement)
  const mobilePanel = useGardenStore((state) => state.mobilePanel)
  const summary = summarizePlan(plan)
  const selectedPlant = getPlant(selectedPlantId)

  return (
    <ErrorBoundary>
      <div className="app-shell" data-mobile-panel={mobilePanel}>
        <AppHeader />
        <MobileTabs />
        <main className="planner-layout">
          <PlantLibrary />
          <section className="center-panel">
            <BedToolbar />
            <div className="placement-prompt">
              <span className="prompt-dot" style={{ background: selectedPlant?.color }} />
              Click inside the bed to add {selectedPlant?.name ?? 'a plant'}
              <span className="keyboard-hint"><kbd>Esc</kbd> clears selection</span>
            </div>
            <GardenBed />
          </section>
          <Inspector />
        </main>
        <footer className="status-bar">
          <div className="legend-scroll">
            <strong>Legend</strong>
            {summary.counts.map((item) => <span key={item.plantId}><i style={{ borderColor: item.color }} />{item.name}</span>)}
          </div>
          <div className="bed-status">
            <span>Bed <strong>{formatBedDimension(plan.bed.widthCm, plan.unitSystem)} x {formatBedDimension(plan.bed.lengthCm, plan.unitSystem)}</strong></span>
            <span>Used <strong>{summary.usedPercent}%</strong></span>
          </div>
        </footer>
        <span className="sr-only" aria-live="polite">{announcement}</span>
      </div>
    </ErrorBoundary>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('GardenGrid rendering error', error, info)
  }

  render() {
    if (this.state.failed) {
      return <main className="fatal-error"><h1>GardenGrid needs a refresh</h1><p>Your saved plans remain in this browser. Reload the page to continue.</p><button onClick={() => location.reload()}>Reload app</button></main>
    }
    return this.props.children
  }
}
