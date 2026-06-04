import type { ImageDocument } from '../document/DocumentModel'
import { createCanvas, getCanvasContext } from '../document/LayerModel'
import type { RasterLayer } from '../document/LayerModel'
import type { SelectionMask } from '../selection/SelectionMask'
import { getStoredProject, type StoredLayer } from './projectDb'

export async function loadProject(projectId: string): Promise<ImageDocument> {
  const project = await getStoredProject(projectId)

  if (!project) {
    throw new Error('That project is not available in local storage.')
  }

  const layers = await Promise.all(project.layers.map((layer) => restoreLayer(layer, project.width, project.height)))
  const selection: SelectionMask | null = project.selection
    ? {
        width: project.selection.width,
        height: project.selection.height,
        bounds: project.selection.bounds,
        alpha: new Uint8ClampedArray(project.selection.alpha),
      }
    : null

  return {
    id: project.id,
    name: project.name,
    width: project.width,
    height: project.height,
    dpi: project.dpi,
    colorMode: project.colorMode,
    backgroundColor: project.backgroundColor,
    layers,
    activeLayerId: project.activeLayerId,
    selection,
    history: {
      undoCount: 0,
      redoCount: 0,
    },
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  }
}

async function restoreLayer(layer: StoredLayer, width: number, height: number): Promise<RasterLayer> {
  const bitmap = await createImageBitmap(layer.blob)
  const canvas = createCanvas(width, height)
  getCanvasContext(canvas).drawImage(bitmap, 0, 0)
  bitmap.close()

  return {
    id: layer.id,
    type: 'raster',
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    opacity: layer.opacity,
    blendMode: layer.blendMode,
    transform: layer.transform,
    canvas,
  }
}
