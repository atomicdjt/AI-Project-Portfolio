import { Pipette } from 'lucide-react'
import { useEditorStore } from '../state/editorStore'

const swatches = ['#f2c166', '#65d6ff', '#f47c9d', '#75e0a7', '#f7f1e8', '#111827', '#ff8a3d', '#9c7cff']

export function ColorPanel() {
  const color = useEditorStore((state) => state.color)
  const setColor = useEditorStore((state) => state.setColor)

  return (
    <section className="panel-block color-panel">
      <div className="panel-heading">
        <Pipette size={16} />
        <h2>Color</h2>
      </div>
      <label className="color-picker-row">
        <span>Active</span>
        <input type="color" value={color} onChange={(event) => setColor(event.target.value)} aria-label="Brush color" />
      </label>
      <div className="swatch-grid" aria-label="Color swatches">
        {swatches.map((swatch) => (
          <button
            key={swatch}
            type="button"
            className={color.toLowerCase() === swatch ? 'active' : undefined}
            style={{ background: swatch }}
            onClick={() => setColor(swatch)}
            title={swatch}
            aria-label={`Use ${swatch}`}
          />
        ))}
      </div>
    </section>
  )
}
