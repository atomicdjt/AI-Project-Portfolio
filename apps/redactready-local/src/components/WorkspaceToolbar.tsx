import { Brush, Eraser, Minus, Plus, RotateCcw, SearchCheck } from 'lucide-react'
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/redaction/types'
import { useRedactionStore } from '../state/redactionStore'
import type { RedactionCategory } from '../lib/redaction/types'

export function WorkspaceToolbar() {
  const {
    document,
    selectedPageIndex,
    setSelectedPage,
    zoom,
    setZoom,
    manualMode,
    setManualMode,
    manualCategory,
    setManualCategory,
    clearSession,
    detections,
    boxes,
  } = useRedactionStore()

  if (!document) return null
  const pageCount = Math.max(document.pages.length, 1)

  return (
    <div className="workspace-toolbar">
      <div className="toolbar-file">
        <strong>{document.name}</strong>
        <span>
          {document.kind.toUpperCase()} · {detections.length} detections · {boxes.filter((box) => box.approved).length} boxes
        </span>
      </div>
      {document.pages.length > 0 ? (
        <div className="toolbar-group" aria-label="Page navigation">
          <button onClick={() => setSelectedPage(selectedPageIndex - 1)} disabled={selectedPageIndex <= 0} type="button">
            Page -
          </button>
          <span className="toolbar-readout">
            {selectedPageIndex + 1} / {pageCount}
          </span>
          <button
            onClick={() => setSelectedPage(selectedPageIndex + 1)}
            disabled={selectedPageIndex >= pageCount - 1}
            type="button"
          >
            Page +
          </button>
        </div>
      ) : null}
      <div className="toolbar-group" aria-label="Zoom controls">
        <button onClick={() => setZoom(zoom - 0.1)} type="button" title="Zoom out">
          <Minus size={16} aria-hidden="true" />
        </button>
        <span className="toolbar-readout">{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(zoom + 0.1)} type="button" title="Zoom in">
          <Plus size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="toolbar-group manual-controls">
        <button className={manualMode ? 'active' : ''} onClick={() => setManualMode(!manualMode)} type="button">
          <Brush size={16} aria-hidden="true" />
          Manual box
        </button>
        <label>
          <span>Category</span>
          <select value={manualCategory} onChange={(event) => setManualCategory(event.target.value as RedactionCategory)}>
            {CATEGORY_ORDER.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button className="ghost-button" onClick={clearSession} type="button">
        <RotateCcw size={16} aria-hidden="true" />
        Clear session
      </button>
      <span className="scan-chip">
        <SearchCheck size={16} aria-hidden="true" />
        Review required
      </span>
      <span className="scan-chip">
        <Eraser size={16} aria-hidden="true" />
        True pixel export
      </span>
    </div>
  )
}
