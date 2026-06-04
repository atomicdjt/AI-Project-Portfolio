import { useEffect, useMemo, useRef, useState } from 'react'
import { BrushTool } from '../engine/tools/BrushTool'
import { EraserTool } from '../engine/tools/EraserTool'
import { MoveTool } from '../engine/tools/MoveTool'
import { SelectionTool } from '../engine/tools/SelectionTool'
import { Canvas2DRenderer } from '../engine/render/Canvas2DRenderer'
import type { ToolRuntime } from '../engine/tools/ToolController'
import { createToolPointerEvent, ToolController } from '../engine/tools/ToolController'
import { useEditorStore } from '../state/editorStore'

export function CanvasViewport() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rendererRef = useRef(new Canvas2DRenderer())
  const pointerDownRef = useRef(false)
  const fittedDocumentIdRef = useRef<string | null>(null)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  const document = useEditorStore((state) => state.document)
  const viewport = useEditorStore((state) => state.viewport)
  const activeTool = useEditorStore((state) => state.activeTool)
  const brushPreset = useEditorStore((state) => state.brushPreset)
  const color = useEditorStore((state) => state.color)
  const selectionDraft = useEditorStore((state) => state.selectionDraft)
  const beginStroke = useEditorStore((state) => state.beginStroke)
  const continueStroke = useEditorStore((state) => state.continueStroke)
  const endStroke = useEditorStore((state) => state.endStroke)
  const beginSelection = useEditorStore((state) => state.beginSelection)
  const updateSelection = useEditorStore((state) => state.updateSelection)
  const commitSelection = useEditorStore((state) => state.commitSelection)
  const panBy = useEditorStore((state) => state.panBy)
  const zoomAt = useEditorStore((state) => state.zoomAt)
  const fitToScreen = useEditorStore((state) => state.fitToScreen)

  const runtime = useMemo<ToolRuntime>(
    () => ({
      brushPreset,
      color,
      beginStroke,
      continueStroke,
      endStroke,
      beginSelection,
      updateSelection,
      commitSelection,
      panBy,
      setZoomAt(point, direction) {
        zoomAt(point, direction)
      },
    }),
    [
      beginSelection,
      beginStroke,
      brushPreset,
      color,
      commitSelection,
      continueStroke,
      endStroke,
      panBy,
      updateSelection,
      zoomAt,
    ],
  )
  const controller = useMemo(() => {
    const nextController = new ToolController()
    nextController.register(new BrushTool(runtime))
    nextController.register(new EraserTool(runtime))
    nextController.register(new SelectionTool(runtime))
    nextController.register(new MoveTool(runtime))
    return nextController
  }, [runtime])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      setViewportSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    resizeObserver.observe(canvas)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas || !document) {
      return
    }

    let frame = 0
    let active = true

    const draw = () => {
      rendererRef.current.render(
        document,
        {
          ...viewport,
          devicePixelRatio: window.devicePixelRatio || 1,
        },
        canvas,
        selectionDraft,
      )

      if (active && (document.selection || selectionDraft)) {
        frame = window.requestAnimationFrame(draw)
      }
    }

    draw()

    return () => {
      active = false
      window.cancelAnimationFrame(frame)
    }
  }, [document, selectionDraft, viewport, viewportSize])

  useEffect(() => {
    if (document && document.id !== fittedDocumentIdRef.current && viewportSize.width > 0 && viewportSize.height > 0) {
      fitToScreen(viewportSize.width, viewportSize.height)
      fittedDocumentIdRef.current = document.id
    }
  }, [document, fitToScreen, viewportSize.height, viewportSize.width])

  const cursor = controller.getTool(activeTool)?.cursor ?? 'default'

  return (
    <section className="canvas-stage" aria-label="Canvas workspace">
      {!document && (
        <div className="canvas-empty">
          <span>Canvas workspace</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="viewport-canvas"
        style={{ cursor }}
        onPointerDown={(event) => {
          if (!document) {
            return
          }

          pointerDownRef.current = true
          event.currentTarget.setPointerCapture(event.pointerId)
          const tool = controller.getTool(activeTool)
          tool?.onPointerDown(createToolPointerEvent(event.nativeEvent, screenToDocumentPoint(event.clientX, event.clientY)))
        }}
        onPointerMove={(event) => {
          if (!document || !pointerDownRef.current) {
            return
          }

          const tool = controller.getTool(activeTool)
          tool?.onPointerMove(createToolPointerEvent(event.nativeEvent, screenToDocumentPoint(event.clientX, event.clientY)))
        }}
        onPointerUp={(event) => {
          pointerDownRef.current = false
          event.currentTarget.releasePointerCapture(event.pointerId)
          controller.getTool(activeTool)?.onPointerUp(
            createToolPointerEvent(event.nativeEvent, screenToDocumentPoint(event.clientX, event.clientY)),
          )
        }}
        onWheel={(event) => {
          if (!document) {
            return
          }

          event.preventDefault()
          const rect = event.currentTarget.getBoundingClientRect()
          zoomAt({ x: event.clientX - rect.left, y: event.clientY - rect.top }, event.deltaY < 0 ? 1 : -1)
        }}
      />
    </section>
  )

  function screenToDocumentPoint(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()

    if (!rect) {
      return { x: 0, y: 0 }
    }

    return {
      x: (clientX - rect.left - viewport.panX) / viewport.zoom,
      y: (clientY - rect.top - viewport.panY) / viewport.zoom,
    }
  }
}
