import { Blend, SlidersHorizontal, SquareDashedMousePointer, ZoomIn } from 'lucide-react'
import { useState } from 'react'
import { mvpFilters } from '../engine/filters'
import type { FilterId } from '../engine/filters'
import { useEditorStore } from '../state/editorStore'

export function PropertiesPanel() {
  const document = useEditorStore((state) => state.document)
  const brushPreset = useEditorStore((state) => state.brushPreset)
  const setBrushPreset = useEditorStore((state) => state.setBrushPreset)
  const applyFilter = useEditorStore((state) => state.applyFilter)
  const clearSelection = useEditorStore((state) => state.clearSelection)
  const invertSelection = useEditorStore((state) => state.invertSelection)
  const zoomActual = useEditorStore((state) => state.zoomActual)
  const fitToScreen = useEditorStore((state) => state.fitToScreen)
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [blurRadius, setBlurRadius] = useState(1)
  const [sharpenAmount, setSharpenAmount] = useState(1)

  return (
    <section className="panel-stack">
      <section className="panel-block">
        <div className="panel-heading">
          <SlidersHorizontal size={16} />
          <h2>Brush Lab</h2>
        </div>
        <RangeControl
          label="Size"
          value={brushPreset.size}
          min={1}
          max={180}
          step={1}
          onChange={(value) => setBrushPreset({ size: value })}
        />
        <RangeControl
          label="Hardness"
          value={brushPreset.hardness}
          min={0.02}
          max={1}
          step={0.01}
          onChange={(value) => setBrushPreset({ hardness: value })}
          formatter={(value) => `${Math.round(value * 100)}%`}
        />
        <RangeControl
          label="Opacity"
          value={brushPreset.opacity}
          min={0.02}
          max={1}
          step={0.01}
          onChange={(value) => setBrushPreset({ opacity: value })}
          formatter={(value) => `${Math.round(value * 100)}%`}
        />
        <RangeControl
          label="Flow"
          value={brushPreset.flow}
          min={0.02}
          max={1}
          step={0.01}
          onChange={(value) => setBrushPreset({ flow: value })}
          formatter={(value) => `${Math.round(value * 100)}%`}
        />
      </section>

      <section className="panel-block">
        <div className="panel-heading">
          <SquareDashedMousePointer size={16} />
          <h2>Selection</h2>
        </div>
        <div className="button-row">
          <button type="button" onClick={clearSelection} disabled={!document?.selection}>
            Clear
          </button>
          <button type="button" onClick={invertSelection} disabled={!document}>
            Invert
          </button>
        </div>
        <p className="panel-note">
          {document?.selection
            ? `${Math.round(document.selection.bounds.width)} x ${Math.round(document.selection.bounds.height)} px active`
            : 'No active selection'}
        </p>
      </section>

      <section className="panel-block">
        <div className="panel-heading">
          <Blend size={16} />
          <h2>Filters</h2>
        </div>
        <RangeControl
          label="Brightness"
          value={brightness}
          min={-120}
          max={120}
          step={1}
          onChange={setBrightness}
        />
        <RangeControl label="Contrast" value={contrast} min={-120} max={120} step={1} onChange={setContrast} />
        <button
          type="button"
          className="wide-button"
          onClick={() => applyFilter('brightness-contrast', { brightness, contrast })}
          disabled={!document}
        >
          Apply brightness / contrast
        </button>
        <div className="filter-grid">
          {mvpFilters
            .filter((filter) => filter.id !== 'brightness-contrast')
            .map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => applyNamedFilter(filter.id as FilterId)}
                disabled={!document}
              >
                {filter.name}
              </button>
            ))}
        </div>
        <RangeControl label="Blur" value={blurRadius} min={1} max={4} step={1} onChange={setBlurRadius} />
        <RangeControl label="Sharpen" value={sharpenAmount} min={0.1} max={2} step={0.1} onChange={setSharpenAmount} />
      </section>

      <section className="panel-block">
        <div className="panel-heading">
          <ZoomIn size={16} />
          <h2>Viewport</h2>
        </div>
        <div className="button-row">
          <button type="button" onClick={zoomActual} disabled={!document}>
            100%
          </button>
          <button
            type="button"
            onClick={() => fitToScreen(window.innerWidth - 430, window.innerHeight - 120)}
            disabled={!document}
          >
            Fit
          </button>
        </div>
      </section>
    </section>
  )

  function applyNamedFilter(filterId: FilterId) {
    if (filterId === 'gaussian-blur') {
      applyFilter(filterId, { radius: blurRadius })
      return
    }

    if (filterId === 'sharpen') {
      applyFilter(filterId, { amount: sharpenAmount })
      return
    }

    applyFilter(filterId)
  }
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatter,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  formatter?: (value: number) => string
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <strong>{formatter ? formatter(value) : value}</strong>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  )
}
