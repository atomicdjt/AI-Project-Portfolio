import type { SelectionMask } from '../selection/SelectionMask'
import type { BlendMode, Layer, RasterLayer } from './LayerModel'
import { cloneRasterCanvas, createCanvas, createTransform, getCanvasContext, isRasterLayer } from './LayerModel'

export type HistoryMetadata = {
  undoCount: number
  redoCount: number
}

export type ImageDocument = {
  id: string
  name: string
  width: number
  height: number
  dpi: number
  colorMode: 'rgba8' | 'rgba16' | 'float32'
  backgroundColor: string
  layers: Layer[]
  activeLayerId: string | null
  selection: SelectionMask | null
  history: HistoryMetadata
  createdAt: string
  updatedAt: string
}

export type CreateDocumentOptions = {
  name?: string
  width: number
  height: number
  backgroundColor: string
  dpi?: number
}

export type CreateRasterLayerOptions = {
  name?: string
  width: number
  height: number
  opacity?: number
  blendMode?: BlendMode
  fill?: string
  canvas?: HTMLCanvasElement
}

export function createDocument(options: CreateDocumentOptions): ImageDocument {
  const now = new Date().toISOString()
  const baseLayer = createRasterLayer({
    width: options.width,
    height: options.height,
    name: 'Background',
    fill: options.backgroundColor,
  })

  return {
    id: crypto.randomUUID(),
    name: options.name?.trim() || 'Untitled LayerForge Document',
    width: Math.max(1, Math.round(options.width)),
    height: Math.max(1, Math.round(options.height)),
    dpi: options.dpi ?? 144,
    colorMode: 'rgba8',
    backgroundColor: options.backgroundColor,
    layers: [baseLayer],
    activeLayerId: baseLayer.id,
    selection: null,
    history: { undoCount: 0, redoCount: 0 },
    createdAt: now,
    updatedAt: now,
  }
}

export function createRasterLayer(options: CreateRasterLayerOptions): RasterLayer {
  return {
    id: crypto.randomUUID(),
    type: 'raster',
    name: options.name?.trim() || 'Raster Layer',
    visible: true,
    locked: false,
    opacity: options.opacity ?? 1,
    blendMode: options.blendMode ?? 'normal',
    transform: createTransform(),
    canvas: options.canvas ?? createCanvas(options.width, options.height, options.fill),
  }
}

export function duplicateLayer(document: ImageDocument, layerId: string): ImageDocument {
  const layer = document.layers.find((item) => item.id === layerId)

  if (!layer || !isRasterLayer(layer)) {
    return document
  }

  const index = document.layers.findIndex((item) => item.id === layerId)
  const duplicate: RasterLayer = {
    ...layer,
    id: crypto.randomUUID(),
    name: `${layer.name} Copy`,
    canvas: cloneRasterCanvas(layer),
    locked: false,
  }
  const layers = [...document.layers]
  layers.splice(index + 1, 0, duplicate)

  return touchDocument({
    ...document,
    layers,
    activeLayerId: duplicate.id,
  })
}

export function flattenVisibleLayers(document: ImageDocument, transparentBackground = false): HTMLCanvasElement {
  const output = createCanvas(document.width, document.height)
  const ctx = getCanvasContext(output)

  if (!transparentBackground) {
    ctx.fillStyle = document.backgroundColor
    ctx.fillRect(0, 0, document.width, document.height)
  }

  for (const layer of document.layers) {
    if (!isRasterLayer(layer) || !layer.visible || layer.opacity <= 0) {
      continue
    }

    ctx.save()
    ctx.globalAlpha = layer.opacity
    ctx.globalCompositeOperation = layer.blendMode === 'normal' ? 'source-over' : layer.blendMode
    ctx.translate(layer.transform.x, layer.transform.y)
    ctx.rotate(layer.transform.rotation)
    ctx.transform(1, Math.tan(layer.transform.skewY), Math.tan(layer.transform.skewX), 1, 0, 0)
    ctx.scale(layer.transform.scaleX, layer.transform.scaleY)
    ctx.drawImage(layer.canvas, 0, 0)
    ctx.restore()
  }

  return output
}

export function getActiveLayer(document: ImageDocument | null): Layer | null {
  if (!document?.activeLayerId) {
    return null
  }

  return document.layers.find((layer) => layer.id === document.activeLayerId) ?? null
}

export function getActiveRasterLayer(document: ImageDocument | null): RasterLayer | null {
  const layer = getActiveLayer(document)
  return isRasterLayer(layer) ? layer : null
}

export function updateLayerById(
  document: ImageDocument,
  layerId: string,
  updater: (layer: Layer) => Layer,
): ImageDocument {
  return touchDocument({
    ...document,
    layers: document.layers.map((layer) => (layer.id === layerId ? updater(layer) : layer)),
  })
}

export function removeLayerById(document: ImageDocument, layerId: string): ImageDocument {
  if (document.layers.length <= 1) {
    return document
  }

  const index = document.layers.findIndex((layer) => layer.id === layerId)

  if (index < 0) {
    return document
  }

  const layers = document.layers.filter((layer) => layer.id !== layerId)
  const nextActiveLayerId =
    document.activeLayerId === layerId ? layers[Math.max(0, Math.min(index, layers.length - 1))]?.id ?? null : document.activeLayerId

  return touchDocument({
    ...document,
    layers,
    activeLayerId: nextActiveLayerId,
  })
}

export function reorderLayer(document: ImageDocument, layerId: string, targetIndex: number): ImageDocument {
  const index = document.layers.findIndex((layer) => layer.id === layerId)

  if (index < 0) {
    return document
  }

  const layers = [...document.layers]
  const [layer] = layers.splice(index, 1)
  layers.splice(Math.max(0, Math.min(targetIndex, layers.length)), 0, layer)

  return touchDocument({
    ...document,
    layers,
  })
}

export function setActiveLayer(document: ImageDocument, layerId: string): ImageDocument {
  if (!document.layers.some((layer) => layer.id === layerId)) {
    return document
  }

  return {
    ...document,
    activeLayerId: layerId,
  }
}

export function withSelection(document: ImageDocument, selection: SelectionMask | null): ImageDocument {
  return touchDocument({
    ...document,
    selection,
  })
}

export function touchDocument(document: ImageDocument): ImageDocument {
  return {
    ...document,
    updatedAt: new Date().toISOString(),
  }
}
