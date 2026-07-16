import { Minus, Plus, Redo2, RotateCcw, Undo2 } from 'lucide-react'
import { centimetersToDisplay, displayToCentimeters } from '../domain/units'
import { useGardenStore } from '../store/useGardenStore'

const presets = [
  { id: '2x4', label: '2 x 4 ft', width: 2, length: 4 },
  { id: '3x6', label: '3 x 6 ft', width: 3, length: 6 },
  { id: '4x4', label: '4 x 4 ft', width: 4, length: 4 },
  { id: '4x8', label: '4 x 8 ft', width: 4, length: 8 },
  { id: '4x12', label: '4 x 12 ft', width: 4, length: 12 },
]

export function BedToolbar() {
  const plan = useGardenStore((state) => state.activePlan())
  const setBed = useGardenStore((state) => state.setBed)
  const setMode = useGardenStore((state) => state.setMode)
  const undo = useGardenStore((state) => state.undo)
  const redo = useGardenStore((state) => state.redo)
  const canUndo = useGardenStore((state) => state.past.length > 0)
  const canRedo = useGardenStore((state) => state.future.length > 0)
  const zoom = useGardenStore((state) => state.zoom)
  const setZoom = useGardenStore((state) => state.setZoom)
  const dimension = plan.unitSystem === 'imperial' ? 'feet' : 'meters'
  const width = centimetersToDisplay(plan.bed.widthCm, plan.unitSystem, dimension)
  const length = centimetersToDisplay(plan.bed.lengthCm, plan.unitSystem, dimension)

  function applyPreset(value: string) {
    const preset = presets.find((item) => item.id === value)
    if (!preset) return
    setBed({
      widthCm: displayToCentimeters(preset.width, 'imperial', 'feet'),
      lengthCm: displayToCentimeters(preset.length, 'imperial', 'feet'),
    })
  }

  function updateDimension(key: 'widthCm' | 'lengthCm', value: number) {
    if (!Number.isFinite(value) || value <= 0) return
    setBed({ ...plan.bed, [key]: displayToCentimeters(value, plan.unitSystem, dimension) })
  }

  return (
    <div className="bed-toolbar">
      <label className="preset-field">
        <span>Bed preset</span>
        <select aria-label="Bed preset" defaultValue="4x8" onChange={(event) => applyPreset(event.target.value)}>
          {presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.label}</option>)}
        </select>
      </label>

      <div className="dimension-fields" aria-label="Custom bed dimensions">
        <label>
          <span>Width</span>
          <span className="input-with-unit">
            <input type="number" min="0.3" max="20" step="0.1" value={Number(width.toFixed(2))} onChange={(event) => updateDimension('widthCm', Number(event.target.value))} />
            <small>{plan.unitSystem === 'imperial' ? 'ft' : 'm'}</small>
          </span>
        </label>
        <span className="dimension-times">x</span>
        <label>
          <span>Length</span>
          <span className="input-with-unit">
            <input type="number" min="0.3" max="50" step="0.1" value={Number(length.toFixed(2))} onChange={(event) => updateDimension('lengthCm', Number(event.target.value))} />
            <small>{plan.unitSystem === 'imperial' ? 'ft' : 'm'}</small>
          </span>
        </label>
      </div>

      <div className="mode-control" aria-label="Planning mode">
        <span>View</span>
        <div className="segmented-control">
          <button type="button" className={plan.mode === 'square-foot' ? 'active' : ''} aria-label="Square-foot mode" onClick={() => setMode('square-foot')}>Square foot</button>
          <button type="button" className={plan.mode === 'rows' ? 'active' : ''} aria-label="Row mode" onClick={() => setMode('rows')}>Rows</button>
        </div>
      </div>

      <div className="toolbar-actions">
        <div className="history-actions" aria-label="Edit history">
          <button type="button" className="icon-button" aria-label="Undo" disabled={!canUndo} onClick={undo}><Undo2 size={18} /></button>
          <button type="button" className="icon-button" aria-label="Redo" disabled={!canRedo} onClick={redo}><Redo2 size={18} /></button>
        </div>
        <div className="zoom-actions" aria-label="Zoom controls">
          <button type="button" className="icon-button" aria-label="Zoom out" onClick={() => setZoom(zoom - 0.1)}><Minus size={18} /></button>
          <span>{Math.round(zoom * 100)}%</span>
          <button type="button" className="icon-button" aria-label="Zoom in" onClick={() => setZoom(zoom + 0.1)}><Plus size={18} /></button>
          <button type="button" className="icon-button" aria-label="Reset zoom" onClick={() => setZoom(1)}><RotateCcw size={17} /></button>
        </div>
      </div>
    </div>
  )
}
