import clsx from 'clsx'
import { Copy, Eye, EyeOff, GripVertical, Lock, Plus, Trash2, Unlock } from 'lucide-react'
import { useState } from 'react'
import { supportedBlendModes } from '../engine/document/LayerModel'
import { useEditorStore } from '../state/editorStore'

export function LayersPanel() {
  const document = useEditorStore((state) => state.document)
  const addLayer = useEditorStore((state) => state.addLayer)
  const deleteActiveLayer = useEditorStore((state) => state.deleteActiveLayer)
  const duplicateActiveLayer = useEditorStore((state) => state.duplicateActiveLayer)
  const renameLayer = useEditorStore((state) => state.renameLayer)
  const selectLayer = useEditorStore((state) => state.selectLayer)
  const reorderLayer = useEditorStore((state) => state.reorderLayer)
  const toggleLayerVisibility = useEditorStore((state) => state.toggleLayerVisibility)
  const toggleLayerLock = useEditorStore((state) => state.toggleLayerLock)
  const setLayerOpacity = useEditorStore((state) => state.setLayerOpacity)
  const setLayerBlendMode = useEditorStore((state) => state.setLayerBlendMode)
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null)
  const layers = document?.layers ?? []
  const activeLayer = layers.find((layer) => layer.id === document?.activeLayerId)

  return (
    <section className="panel-block layer-panel">
      <div className="panel-heading layer-heading">
        <h2>Layers</h2>
        <div className="icon-row">
          <button type="button" onClick={addLayer} disabled={!document} title="Add raster layer">
            <Plus size={15} />
          </button>
          <button type="button" onClick={duplicateActiveLayer} disabled={!activeLayer} title="Duplicate layer">
            <Copy size={15} />
          </button>
          <button type="button" onClick={deleteActiveLayer} disabled={!activeLayer || layers.length <= 1} title="Delete layer">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {!document ? (
        <p className="panel-note">Create or import a document to begin stacking raster layers.</p>
      ) : (
        <>
          <div className="layer-list" aria-label="Layer stack">
            {[...layers].reverse().map((layer) => {
              const actualIndex = layers.findIndex((item) => item.id === layer.id)
              return (
                <article
                  key={layer.id}
                  className={clsx('layer-row', layer.id === document.activeLayerId && 'active')}
                  draggable
                  onDragStart={() => setDraggingLayerId(layer.id)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggingLayerId && draggingLayerId !== layer.id) {
                      reorderLayer(draggingLayerId, actualIndex)
                    }
                    setDraggingLayerId(null)
                  }}
                  onClick={() => selectLayer(layer.id)}
                >
                  <GripVertical size={15} className="drag-handle" />
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleLayerVisibility(layer.id)
                    }}
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    {layer.visible ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleLayerLock(layer.id)
                    }}
                    title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                  >
                    {layer.locked ? <Lock size={15} /> : <Unlock size={15} />}
                  </button>
                  <input
                    value={layer.name}
                    onChange={(event) => renameLayer(layer.id, event.target.value)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label={`Rename ${layer.name}`}
                  />
                </article>
              )
            })}
          </div>

          {activeLayer && (
            <div className="layer-details">
              <label className="range-control">
                <span>
                  Opacity
                  <strong>{Math.round(activeLayer.opacity * 100)}%</strong>
                </span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={activeLayer.opacity}
                  onChange={(event) => setLayerOpacity(activeLayer.id, Number(event.target.value))}
                />
              </label>
              <label className="select-control">
                <span>Blend</span>
                <select
                  value={activeLayer.blendMode}
                  onChange={(event) => setLayerBlendMode(activeLayer.id, event.target.value as typeof activeLayer.blendMode)}
                >
                  {supportedBlendModes.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </label>
              <div className="button-row">
                <button
                  type="button"
                  disabled={layers.findIndex((layer) => layer.id === activeLayer.id) >= layers.length - 1}
                  onClick={() => reorderLayer(activeLayer.id, layers.findIndex((layer) => layer.id === activeLayer.id) + 1)}
                >
                  Move up
                </button>
                <button
                  type="button"
                  disabled={layers.findIndex((layer) => layer.id === activeLayer.id) <= 0}
                  onClick={() => reorderLayer(activeLayer.id, layers.findIndex((layer) => layer.id === activeLayer.id) - 1)}
                >
                  Move down
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
