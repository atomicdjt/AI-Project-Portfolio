import { create } from 'zustand'
import { BrushEngine, type PaintMode } from '../engine/brush/BrushEngine'
import { defaultBrushPreset, type BrushPreset, type StrokePoint } from '../engine/brush/BrushPreset'
import {
  createDocument,
  createRasterLayer,
  duplicateLayer,
  getActiveRasterLayer,
  removeLayerById,
  reorderLayer as reorderDocumentLayer,
  setActiveLayer as setDocumentActiveLayer,
  touchDocument,
  updateLayerById,
  withSelection,
  type CreateDocumentOptions,
  type ImageDocument,
} from '../engine/document/DocumentModel'
import type { BlendMode, Rect } from '../engine/document/LayerModel'
import { clampRect, getCanvasContext, isRasterLayer, rectFromPoints } from '../engine/document/LayerModel'
import { getFilter, type FilterId } from '../engine/filters'
import {
  AddLayerCommand,
  ApplyFilterCommand,
  BrushStrokeCommand,
  DeleteLayerCommand,
  DocumentSnapshotCommand,
  DuplicateLayerCommand,
  EraseStrokeCommand,
  ReorderLayerCommand,
  SelectionCommand,
  SetBlendModeCommand,
  SetOpacityCommand,
} from '../engine/history/Commands'
import { HistoryStack } from '../engine/history/HistoryStack'
import { downloadBlob, exportFlattenedImage, type ExportOptions } from '../engine/io/exportImage'
import { importImageAsLayer } from '../engine/io/importImage'
import { loadProject } from '../engine/io/loadProject'
import { listRecentProjects, saveProject as persistProject } from '../engine/io/saveProject'
import type { RecentProject } from '../engine/io/projectDb'
import type { ViewportState } from '../engine/render/Renderer'
import {
  createRectangularSelection,
  invertSelection as invertSelectionMask,
  maskImageDataToSelection,
} from '../engine/selection/SelectionMask'
import type { ToolId } from '../engine/tools/ToolController'
import { extractPatch, getChangedBounds, imageDataEquals } from '../utils/imageData'

type SaveStatus = 'saved' | 'unsaved' | 'saving' | 'failed'

type StrokeSession = {
  layerId: string
  mode: PaintMode
  before: ImageData
}

type EditorState = {
  document: ImageDocument | null
  viewport: ViewportState
  activeTool: ToolId
  brushPreset: BrushPreset
  color: string
  history: HistoryStack
  saveStatus: SaveStatus
  recentProjects: RecentProject[]
  selectionDraft: Rect | null
  selectionAnchor: StrokePoint | null
  error: string | null
  currentStroke: StrokeSession | null
  createNewDocument(options: CreateDocumentOptions): void
  importImage(file: File): Promise<void>
  addLayer(): void
  deleteActiveLayer(): void
  duplicateActiveLayer(): void
  renameLayer(layerId: string, name: string): void
  selectLayer(layerId: string): void
  reorderLayer(layerId: string, targetIndex: number): void
  toggleLayerVisibility(layerId: string): void
  toggleLayerLock(layerId: string): void
  setLayerOpacity(layerId: string, opacity: number): void
  setLayerBlendMode(layerId: string, blendMode: BlendMode): void
  setActiveTool(tool: ToolId): void
  setBrushPreset(preset: Partial<BrushPreset>): void
  setColor(color: string): void
  beginStroke(mode: PaintMode, point: StrokePoint): void
  continueStroke(point: StrokePoint): void
  endStroke(): void
  beginSelection(point: StrokePoint): void
  updateSelection(point: StrokePoint): void
  commitSelection(): void
  clearSelection(): void
  invertSelection(): void
  applyFilter(filterId: FilterId, settings?: unknown): void
  undo(): void
  redo(): void
  setViewport(viewport: Partial<ViewportState>): void
  panBy(dx: number, dy: number): void
  zoomAt(point: { x: number; y: number }, direction: 1 | -1): void
  fitToScreen(width: number, height: number): void
  zoomActual(): void
  saveCurrentProject(): Promise<void>
  loadProject(projectId: string): Promise<void>
  refreshRecentProjects(): Promise<void>
  exportCurrentImage(options: ExportOptions): Promise<void>
  dismissError(): void
}

const brushEngine = new BrushEngine()
const defaultViewport: ViewportState = {
  zoom: 1,
  rotation: 0,
  panX: 96,
  panY: 72,
  devicePixelRatio: 1,
  showGrid: true,
  showRulers: false,
  showGuides: true,
}

export const useEditorStore = create<EditorState>((set, get) => ({
  document: null,
  viewport: defaultViewport,
  activeTool: 'brush',
  brushPreset: defaultBrushPreset,
  color: '#f2c166',
  history: new HistoryStack(),
  saveStatus: 'saved',
  recentProjects: [],
  selectionDraft: null,
  selectionAnchor: null,
  error: null,
  currentStroke: null,

  createNewDocument(options) {
    set({
      document: createDocument(options),
      history: new HistoryStack(),
      saveStatus: 'unsaved',
      selectionDraft: null,
      selectionAnchor: null,
      error: null,
    })
  },

  async importImage(file) {
    const existingDocument = get().document

    try {
      let document = existingDocument

      if (!document) {
        const bitmap = await createImageBitmap(file)
        document = createDocument({
          name: file.name.replace(/\.[^.]+$/, '') || 'Imported Project',
          width: bitmap.width,
          height: bitmap.height,
          backgroundColor: 'rgba(0, 0, 0, 0)',
        })
        bitmap.close()
        set({ document, history: new HistoryStack(), saveStatus: 'unsaved' })
      }

      const layer = await importImageAsLayer(file, document.width, document.height)
      const before = get().document

      if (!before) {
        return
      }

      const after = touchDocument({
        ...before,
        layers: [...before.layers, layer],
        activeLayerId: layer.id,
      })
      pushCommand(new AddLayerCommand('Import image layer', before, after), set, get)
    } catch (caught) {
      set({ error: caught instanceof Error ? caught.message : 'The image could not be imported.' })
    }
  },

  addLayer() {
    const before = get().document

    if (!before) {
      return
    }

    const layer = createRasterLayer({
      width: before.width,
      height: before.height,
      name: `Layer ${before.layers.length + 1}`,
    })
    const after = touchDocument({
      ...before,
      layers: [...before.layers, layer],
      activeLayerId: layer.id,
    })
    pushCommand(new AddLayerCommand('Add raster layer', before, after), set, get)
  },

  deleteActiveLayer() {
    const before = get().document

    if (!before?.activeLayerId || before.layers.length <= 1) {
      return
    }

    const after = removeLayerById(before, before.activeLayerId)
    pushCommand(new DeleteLayerCommand('Delete layer', before, after), set, get)
  },

  duplicateActiveLayer() {
    const before = get().document

    if (!before?.activeLayerId) {
      return
    }

    const after = duplicateLayer(before, before.activeLayerId)
    pushCommand(new DuplicateLayerCommand('Duplicate layer', before, after), set, get)
  },

  renameLayer(layerId, name) {
    updateLayer('Rename layer', layerId, (layer) => ({ ...layer, name: name.trim() || layer.name }), set, get)
  },

  selectLayer(layerId) {
    const document = get().document

    if (!document) {
      return
    }

    set({
      document: setDocumentActiveLayer(document, layerId),
    })
  },

  reorderLayer(layerId, targetIndex) {
    const before = get().document

    if (!before) {
      return
    }

    const after = reorderDocumentLayer(before, layerId, targetIndex)
    pushCommand(new ReorderLayerCommand('Reorder layer', before, after), set, get)
  },

  toggleLayerVisibility(layerId) {
    updateLayer('Toggle layer visibility', layerId, (layer) => ({ ...layer, visible: !layer.visible }), set, get)
  },

  toggleLayerLock(layerId) {
    updateLayer('Toggle layer lock', layerId, (layer) => ({ ...layer, locked: !layer.locked }), set, get)
  },

  setLayerOpacity(layerId, opacity) {
    const before = get().document

    if (!before) {
      return
    }

    const after = updateLayerById(before, layerId, (layer) => ({
      ...layer,
      opacity: Math.max(0, Math.min(1, opacity)),
    }))
    pushCommand(new SetOpacityCommand('Change layer opacity', before, after), set, get)
  },

  setLayerBlendMode(layerId, blendMode) {
    const before = get().document

    if (!before) {
      return
    }

    const after = updateLayerById(before, layerId, (layer) => ({ ...layer, blendMode }))
    pushCommand(new SetBlendModeCommand('Change blend mode', before, after), set, get)
  },

  setActiveTool(tool) {
    set({ activeTool: tool })
  },

  setBrushPreset(preset) {
    set((state) => ({
      brushPreset: {
        ...state.brushPreset,
        ...preset,
      },
    }))
  },

  setColor(color) {
    set({ color })
  },

  beginStroke(mode, point) {
    const document = get().document
    const layer = getActiveRasterLayer(document)

    if (!document || !layer || layer.locked || !layer.visible) {
      set({ error: 'Choose a visible, unlocked raster layer before painting.' })
      return
    }

    const ctx = getCanvasContext(layer.canvas)
    const before = ctx.getImageData(0, 0, document.width, document.height)
    brushEngine.beginStroke(point, get().brushPreset, ctx, get().color, mode)
    restoreOutsideSelection(ctx, before, document)
    set({
      currentStroke: {
        layerId: layer.id,
        mode,
        before,
      },
      document: touchLayer(document, layer.id),
      saveStatus: 'unsaved',
      error: null,
    })
  },

  continueStroke(point) {
    const state = get()
    const document = state.document
    const stroke = state.currentStroke

    if (!document || !stroke) {
      return
    }

    const layer = document.layers.find((item) => item.id === stroke.layerId)

    if (!isRasterLayer(layer)) {
      return
    }

    const ctx = getCanvasContext(layer.canvas)
    brushEngine.continueStroke(point, state.brushPreset, ctx, state.color, stroke.mode)
    restoreOutsideSelection(ctx, stroke.before, document)
    set({
      document: touchLayer(document, layer.id),
      saveStatus: 'unsaved',
    })
  },

  endStroke() {
    const state = get()
    const document = state.document
    const stroke = state.currentStroke

    if (!document || !stroke) {
      return
    }

    const layer = document.layers.find((item) => item.id === stroke.layerId)

    if (!isRasterLayer(layer)) {
      set({ currentStroke: null })
      brushEngine.endStroke()
      return
    }

    const ctx = getCanvasContext(layer.canvas)
    const after = ctx.getImageData(0, 0, document.width, document.height)
    const bounds = getChangedBounds(stroke.before, after)
    brushEngine.endStroke()

    if (!bounds) {
      set({ currentStroke: null })
      return
    }

    const beforePatch = extractPatch(stroke.before, bounds)
    const afterPatch = extractPatch(after, bounds)
    const command =
      stroke.mode === 'erase'
        ? new EraseStrokeCommand('Erase stroke', stroke.layerId, bounds, beforePatch, afterPatch)
        : new BrushStrokeCommand('Brush stroke', stroke.layerId, bounds, beforePatch, afterPatch)
    const historyResult = state.history.pushExecuted(command, touchLayer(document, layer.id))

    set({
      document: historyResult.document,
      history: historyResult.history,
      saveStatus: 'unsaved',
      currentStroke: null,
    })
  },

  beginSelection(point) {
    set({
      selectionDraft: { x: point.x, y: point.y, width: 0, height: 0 },
      selectionAnchor: point,
      currentStroke: null,
    })
  },

  updateSelection(point) {
    const anchor = get().selectionAnchor

    if (!anchor) {
      return
    }

    set({
      selectionDraft: rectFromPoints(anchor, point),
    })
  },

  commitSelection() {
    const before = get().document
    const draft = get().selectionDraft

    if (!before || !draft) {
      set({ selectionDraft: null, selectionAnchor: null })
      return
    }

    const bounds = clampRect(draft, before.width, before.height)

    if (bounds.width < 2 || bounds.height < 2) {
      set({ selectionDraft: null, selectionAnchor: null })
      return
    }

    const selection = createRectangularSelection(before.width, before.height, bounds)
    const after = withSelection(before, selection)
    pushCommand(new SelectionCommand('Create rectangular selection', before, after), set, get)
    set({ selectionDraft: null, selectionAnchor: null })
  },

  clearSelection() {
    const before = get().document

    if (!before?.selection) {
      return
    }

    const after = withSelection(before, null)
    pushCommand(new SelectionCommand('Clear selection', before, after), set, get)
  },

  invertSelection() {
    const before = get().document

    if (!before) {
      return
    }

    const after = withSelection(before, invertSelectionMask(before.selection, before.width, before.height))
    pushCommand(new SelectionCommand('Invert selection', before, after), set, get)
  },

  applyFilter(filterId, settings) {
    const state = get()
    const document = state.document
    const layer = getActiveRasterLayer(document)

    if (!document || !layer || layer.locked || !layer.visible) {
      set({ error: 'Choose a visible, unlocked raster layer before applying filters.' })
      return
    }

    const boundsSource = document.selection?.bounds ?? { x: 0, y: 0, width: document.width, height: document.height }
    const bounds = clampRect(boundsSource, document.width, document.height)

    if (bounds.width <= 0 || bounds.height <= 0) {
      return
    }

    const ctx = getCanvasContext(layer.canvas)
    const beforePatch = ctx.getImageData(bounds.x, bounds.y, bounds.width, bounds.height)
    const filter = getFilter(filterId)
    const filteredPatch = filter.apply(beforePatch, settings ?? {})
    const afterPatch = maskImageDataToSelection(beforePatch, filteredPatch, document.selection, bounds)

    if (imageDataEquals(beforePatch, afterPatch)) {
      return
    }

    ctx.putImageData(afterPatch, bounds.x, bounds.y)
    const command = new ApplyFilterCommand(`Apply ${filter.name}`, layer.id, bounds, beforePatch, afterPatch)
    const historyResult = state.history.pushExecuted(command, touchLayer(document, layer.id))

    set({
      document: historyResult.document,
      history: historyResult.history,
      saveStatus: 'unsaved',
    })
  },

  undo() {
    const state = get()

    if (!state.document) {
      return
    }

    const result = state.history.undo(state.document)
    set({
      document: result.document,
      history: result.history,
      saveStatus: 'unsaved',
      currentStroke: null,
    })
  },

  redo() {
    const state = get()

    if (!state.document) {
      return
    }

    const result = state.history.redo(state.document)
    set({
      document: result.document,
      history: result.history,
      saveStatus: 'unsaved',
      currentStroke: null,
    })
  },

  setViewport(viewport) {
    set((state) => ({
      viewport: {
        ...state.viewport,
        ...viewport,
      },
    }))
  },

  panBy(dx, dy) {
    set((state) => ({
      viewport: {
        ...state.viewport,
        panX: state.viewport.panX + dx,
        panY: state.viewport.panY + dy,
      },
    }))
  },

  zoomAt(point, direction) {
    set((state) => {
      const currentZoom = state.viewport.zoom
      const nextZoom = Math.max(0.05, Math.min(16, currentZoom * (direction > 0 ? 1.12 : 0.88)))
      const docX = (point.x - state.viewport.panX) / currentZoom
      const docY = (point.y - state.viewport.panY) / currentZoom

      return {
        viewport: {
          ...state.viewport,
          zoom: nextZoom,
          panX: point.x - docX * nextZoom,
          panY: point.y - docY * nextZoom,
        },
      }
    })
  },

  fitToScreen(width, height) {
    const document = get().document

    if (!document) {
      return
    }

    const zoom = Math.max(0.05, Math.min(8, Math.min((width - 96) / document.width, (height - 96) / document.height)))
    set((state) => ({
      viewport: {
        ...state.viewport,
        zoom,
        panX: Math.round((width - document.width * zoom) / 2),
        panY: Math.round((height - document.height * zoom) / 2),
      },
    }))
  },

  zoomActual() {
    set((state) => ({
      viewport: {
        ...state.viewport,
        zoom: 1,
      },
    }))
  },

  async saveCurrentProject() {
    const document = get().document

    if (!document) {
      return
    }

    set({ saveStatus: 'saving' })

    try {
      const recent = await persistProject(document)
      set((state) => ({
        saveStatus: 'saved',
        recentProjects: [recent, ...state.recentProjects.filter((project) => project.id !== recent.id)],
      }))
    } catch (caught) {
      set({
        saveStatus: 'failed',
        error: caught instanceof Error ? caught.message : 'Project save failed.',
      })
    }
  },

  async loadProject(projectId) {
    set({ saveStatus: 'saving' })

    try {
      const document = await loadProject(projectId)
      set({
        document,
        history: new HistoryStack(),
        saveStatus: 'saved',
        selectionDraft: null,
        selectionAnchor: null,
        currentStroke: null,
        error: null,
      })
    } catch (caught) {
      set({
        saveStatus: 'failed',
        error: caught instanceof Error ? caught.message : 'Project load failed.',
      })
    }
  },

  async refreshRecentProjects() {
    try {
      set({
        recentProjects: await listRecentProjects(),
      })
    } catch {
      set({ recentProjects: [] })
    }
  },

  async exportCurrentImage(options) {
    const document = get().document

    if (!document) {
      return
    }

    try {
      const blob = await exportFlattenedImage(document, options)
      const extension = options.format === 'jpeg' ? 'jpg' : 'png'
      downloadBlob(blob, `${document.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'layerforge-export'}.${extension}`)
    } catch (caught) {
      set({ error: caught instanceof Error ? caught.message : 'Export failed.' })
    }
  },

  dismissError() {
    set({ error: null })
  },
}))

function pushCommand(
  command: DocumentSnapshotCommand,
  set: (partial: Partial<EditorState> | ((state: EditorState) => Partial<EditorState>)) => void,
  get: () => EditorState,
): void {
  const state = get()

  if (!state.document) {
    return
  }

  const result = state.history.push(command, state.document)
  set({
    document: result.document,
    history: result.history,
    saveStatus: 'unsaved',
  })
}

function updateLayer(
  label: string,
  layerId: string,
  updater: Parameters<typeof updateLayerById>[2],
  set: (partial: Partial<EditorState> | ((state: EditorState) => Partial<EditorState>)) => void,
  get: () => EditorState,
): void {
  const before = get().document

  if (!before) {
    return
  }

  const after = updateLayerById(before, layerId, updater)
  pushCommand(new DocumentSnapshotCommand(label, before, after), set, get)
}

function touchLayer(document: ImageDocument, layerId: string): ImageDocument {
  return touchDocument({
    ...document,
    layers: document.layers.map((layer) => (layer.id === layerId ? { ...layer } : layer)),
  })
}

function restoreOutsideSelection(ctx: CanvasRenderingContext2D, before: ImageData, document: ImageDocument): void {
  if (!document.selection) {
    return
  }

  const bounds = { x: 0, y: 0, width: document.width, height: document.height }
  const after = ctx.getImageData(0, 0, document.width, document.height)
  ctx.putImageData(maskImageDataToSelection(before, after, document.selection, bounds), 0, 0)
}
