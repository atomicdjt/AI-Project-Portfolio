import { Database, FileText, Gauge, ShieldAlert } from 'lucide-react'
import { useRef } from 'react'
import type { KeyboardEvent } from 'react'

export type TabId = 'overview' | 'sources' | 'report' | 'method'
const tabs = [
  { id: 'overview', label: 'Dossier', icon: Gauge },
  { id: 'sources', label: 'Sources', icon: Database },
  { id: 'report', label: 'Report', icon: FileText },
  { id: 'method', label: 'Method', icon: ShieldAlert },
] as const

export function WorkbenchTabs({ activeTab, onChange }: { activeTab: TabId; onChange: (tab: TabId) => void }) {
  const buttons = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({})
  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length
      : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null
    if (next === null) return
    event.preventDefault()
    onChange(tabs[next].id)
    buttons.current[tabs[next].id]?.focus()
  }
  return <div className="tabbar" role="tablist" aria-label="Workbench sections">
    {tabs.map(({ id, label, icon: Icon }, index) => <button
      key={id} id={`workbench-tab-${id}`} role="tab" type="button"
      ref={(element) => { buttons.current[id] = element }}
      aria-selected={activeTab === id} aria-controls={`workbench-panel-${id}`}
      tabIndex={activeTab === id ? 0 : -1} className={activeTab === id ? 'active' : ''}
      onClick={() => onChange(id)} onKeyDown={(event) => handleKey(event, index)}
    ><Icon aria-hidden="true" />{label}</button>)}
  </div>
}
