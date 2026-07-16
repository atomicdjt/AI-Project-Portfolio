import { ChartNoAxesColumnIncreasing, Grid3X3, Sprout } from 'lucide-react'
import { useGardenStore } from '../store/useGardenStore'

export function MobileTabs() {
  const active = useGardenStore((state) => state.mobilePanel)
  const setActive = useGardenStore((state) => state.setMobilePanel)
  const items = [
    { id: 'library' as const, label: 'Plants', icon: Sprout },
    { id: 'bed' as const, label: 'Bed', icon: Grid3X3 },
    { id: 'summary' as const, label: 'Summary', icon: ChartNoAxesColumnIncreasing },
  ]
  return (
    <nav className="mobile-tabs" aria-label="Planner sections">
      {items.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" className={active === id ? 'active' : ''} onClick={() => setActive(id)}>
          <Icon size={18} /> {label}
        </button>
      ))}
    </nav>
  )
}
