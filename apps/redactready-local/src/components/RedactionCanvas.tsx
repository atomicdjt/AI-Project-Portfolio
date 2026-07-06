import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import type { BoundingBox, RedactionBox } from '../lib/redaction/types'
import { selectCurrentPage, useRedactionStore } from '../state/redactionStore'

interface DragState {
  id: string
  mode: 'move' | 'resize'
  startX: number
  startY: number
  initial: BoundingBox
}

export function RedactionCanvas() {
  const page = useRedactionStore(selectCurrentPage)
  const {
    boxes,
    zoom,
    manualMode,
    addManualBox,
    selectedBoxId,
    setSelectedBox,
    updateBox,
    deleteBox,
  } = useRedactionStore()
  const pageRef = useRef<HTMLDivElement | null>(null)
  const [draft, setDraft] = useState<BoundingBox | null>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)

  if (!page) {
    return (
      <div className="empty-preview">
        <strong>No page preview</strong>
        <span>Text and CSV files use the text preview panel.</span>
      </div>
    )
  }

  const pageBoxes = boxes.filter((box) => box.pageIndex === page.pageIndex)

  const pointFromEvent = (event: PointerEvent<HTMLElement>) => {
    const rect = pageRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: Math.max(0, Math.min(page.width, (event.clientX - rect.left) / zoom)),
      y: Math.max(0, Math.min(page.height, (event.clientY - rect.top) / zoom)),
    }
  }

  const beginDraw = (event: PointerEvent<HTMLDivElement>) => {
    if (!manualMode || event.target !== pageRef.current) return
    const point = pointFromEvent(event)
    setDrawStart(point)
    setDraft({ ...point, width: 1, height: 1, coordinateSpace: page.pageIndex === 0 ? 'image' : 'pdf-page' })
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    const point = pointFromEvent(event)
    if (drawStart && draft) {
      setDraft({
        x: drawStart.x,
        y: drawStart.y,
        width: point.x - drawStart.x,
        height: point.y - drawStart.y,
        coordinateSpace: draft.coordinateSpace,
      })
      return
    }

    if (dragState) {
      const deltaX = point.x - dragState.startX
      const deltaY = point.y - dragState.startY
      if (dragState.mode === 'move') {
        updateBox(dragState.id, {
          ...dragState.initial,
          x: Math.max(0, Math.min(page.width - dragState.initial.width, dragState.initial.x + deltaX)),
          y: Math.max(0, Math.min(page.height - dragState.initial.height, dragState.initial.y + deltaY)),
        })
      } else {
        updateBox(dragState.id, {
          ...dragState.initial,
          width: Math.max(8, Math.min(page.width - dragState.initial.x, dragState.initial.width + deltaX)),
          height: Math.max(8, Math.min(page.height - dragState.initial.y, dragState.initial.height + deltaY)),
        })
      }
    }
  }

  const finishPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (draft) {
      addManualBox(page.pageIndex, draft)
      setDraft(null)
      setDrawStart(null)
    }
    setDragState(null)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const startBoxDrag = (event: PointerEvent<HTMLElement>, box: RedactionBox, mode: 'move' | 'resize') => {
    event.stopPropagation()
    const point = pointFromEvent(event)
    setSelectedBox(box.id)
    setDragState({
      id: box.id,
      mode,
      startX: point.x,
      startY: point.y,
      initial: box.bbox,
    })
  }

  const renderBox = (box: RedactionBox) => {
    const selected = selectedBoxId === box.id
    const style = {
      left: box.bbox.x * zoom,
      top: box.bbox.y * zoom,
      width: box.bbox.width * zoom,
      height: box.bbox.height * zoom,
    }

    return (
      <button
        key={box.id}
        className={`redaction-box ${selected ? 'selected' : ''} ${box.approved ? '' : 'rejected'} ${box.note?.includes('approximate') ? 'approximate' : ''}`}
        style={style}
        type="button"
        onPointerDown={(event) => startBoxDrag(event, box, 'move')}
        onDoubleClick={(event) => {
          event.stopPropagation()
          deleteBox(box.id)
        }}
        title="Drag to move. Use the corner handle to resize. Double-click to delete."
      >
        <span>{box.createdBy === 'user' ? 'Manual' : box.note?.includes('approximate') ? 'Approximate' : 'Detected'}</span>
        <i onPointerDown={(event) => startBoxDrag(event, box, 'resize')} aria-hidden="true" />
      </button>
    )
  }

  return (
    <div className="canvas-scroll">
      <div
        ref={pageRef}
        className={`page-canvas ${manualMode ? 'drawing' : ''}`}
        style={{ width: page.width * zoom, height: page.height * zoom }}
        onPointerDown={beginDraw}
        onPointerMove={handleMove}
        onPointerUp={finishPointer}
        onPointerCancel={finishPointer}
      >
        <img src={page.imageUrl} alt={`Page ${page.pageIndex + 1} preview`} draggable={false} />
        {pageBoxes.map(renderBox)}
        {draft ? (
          <div
            className="draft-box"
            style={{
              left: Math.min(draft.x, draft.x + draft.width) * zoom,
              top: Math.min(draft.y, draft.y + draft.height) * zoom,
              width: Math.abs(draft.width) * zoom,
              height: Math.abs(draft.height) * zoom,
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
