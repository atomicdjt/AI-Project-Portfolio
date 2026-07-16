import { Check, ChevronDown, Copy, Download, FileJson, Menu, Plus, Printer, Sprout, Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { exportPlanCsv } from '../domain/export'
import { useGardenStore } from '../store/useGardenStore'

export function AppHeader() {
  const plans = useGardenStore((state) => state.plans)
  const activePlan = useGardenStore((state) => state.activePlan())
  const saveStatus = useGardenStore((state) => state.saveStatus)
  const setActivePlan = useGardenStore((state) => state.setActivePlan)
  const createPlan = useGardenStore((state) => state.createPlan)
  const duplicatePlan = useGardenStore((state) => state.duplicatePlan)
  const deletePlan = useGardenStore((state) => state.deletePlan)
  const renamePlan = useGardenStore((state) => state.renamePlan)
  const setUnitSystem = useGardenStore((state) => state.setUnitSystem)
  const exportData = useGardenStore((state) => state.exportData)
  const importData = useGardenStore((state) => state.importData)
  const inputRef = useRef<HTMLInputElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [message, setMessage] = useState('')

  function download(content: string, filename: string, type: string) {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
    setMenuOpen(false)
    setMessage(`${filename} prepared.`)
  }

  async function importFile(file?: File) {
    if (!file) return
    try {
      importData(await file.text())
      setMessage('GardenGrid backup imported.')
    } catch {
      setMessage('That file is not a valid GardenGrid backup.')
    }
  }

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <span className="brand-mark"><Sprout size={22} /></span>
        <div><strong>GardenGrid</strong><small>Bed spacing planner</small></div>
      </div>

      <div className="plan-identity">
        <label>
          <span>Plan</span>
          <input aria-label="Plan name" value={activePlan.name} onChange={(event) => renamePlan(activePlan.id, event.target.value)} />
        </label>
        <label className="plan-select-wrap">
          <span className="sr-only">Open plan</span>
          <select aria-label="Open plan" value={activePlan.id} onChange={(event) => setActivePlan(event.target.value)}>
            {plans.map((plan) => <option value={plan.id} key={plan.id}>{plan.name}</option>)}
          </select>
          <ChevronDown size={14} />
        </label>
        <div className="plan-quick-actions">
          <button type="button" className="icon-button" aria-label="Create new plan" onClick={() => createPlan()}><Plus size={17} /></button>
          <button type="button" className="icon-button" aria-label="Duplicate plan" onClick={() => duplicatePlan()}><Copy size={16} /></button>
          <button type="button" className="icon-button" aria-label="Delete plan" onClick={() => deletePlan(activePlan.id)} disabled={plans.length === 1}><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="save-indicator"><Check size={15} /><span>{saveStatus === 'saving' ? 'Saving…' : 'Saved locally'}</span></div>

      <div className="header-actions">
        <div className="unit-toggle" aria-label="Measurement units">
          <button type="button" className={activePlan.unitSystem === 'imperial' ? 'active' : ''} onClick={() => setUnitSystem('imperial')}>Imperial</button>
          <button type="button" className={activePlan.unitSystem === 'metric' ? 'active' : ''} onClick={() => setUnitSystem('metric')}>Metric</button>
        </div>
        <button type="button" className="header-button" onClick={() => window.print()}><Printer size={17} /> Print</button>
        <div className="export-menu">
          <button type="button" className="header-button" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><Download size={17} /> Export <ChevronDown size={14} /></button>
          {menuOpen ? (
            <div className="export-popover">
              <button type="button" onClick={() => download(exportPlanCsv(activePlan), `${slug(activePlan.name)}.csv`, 'text/csv')}><Download size={16} /><span><strong>Plant list CSV</strong><small>Quantities and coordinates</small></span></button>
              <button type="button" onClick={() => download(exportData(), 'gardengrid-backup.json', 'application/json')}><FileJson size={16} /><span><strong>JSON backup</strong><small>All saved plans</small></span></button>
              <button type="button" onClick={() => inputRef.current?.click()}><Upload size={16} /><span><strong>Import backup</strong><small>Restore a GardenGrid file</small></span></button>
            </div>
          ) : null}
        </div>
        <button type="button" className="mobile-menu-button" aria-label="Open mobile navigation"><Menu size={20} /></button>
      </div>
      <input ref={inputRef} className="sr-only" type="file" accept="application/json,.json" onChange={(event) => void importFile(event.target.files?.[0])} />
      <span className="sr-only" aria-live="polite">{message}</span>
    </header>
  )
}

function slug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'garden-plan'
}
