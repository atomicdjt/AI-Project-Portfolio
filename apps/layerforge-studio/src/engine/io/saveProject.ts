import type { ImageDocument } from '../document/DocumentModel'
import { isRasterLayer } from '../document/LayerModel'
import { canvasToBlob } from './exportImage'
import { getStoredProjects, putStoredProject, type RecentProject, type StoredProject } from './projectDb'

export async function saveProject(document: ImageDocument): Promise<RecentProject> {
  const layers = await Promise.all(
    document.layers.filter(isRasterLayer).map(async (layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.visible,
      locked: layer.locked,
      opacity: layer.opacity,
      blendMode: layer.blendMode,
      transform: layer.transform,
      blob: await canvasToBlob(layer.canvas, 'image/png'),
    })),
  )
  const savedAt = new Date().toISOString()
  const record: StoredProject = {
    format: 'layerforge-project',
    version: '1.0.0',
    id: document.id,
    name: document.name,
    width: document.width,
    height: document.height,
    dpi: document.dpi,
    colorMode: 'rgba8',
    backgroundColor: document.backgroundColor,
    activeLayerId: document.activeLayerId,
    selection: document.selection
      ? {
          width: document.selection.width,
          height: document.selection.height,
          bounds: document.selection.bounds,
          alpha: document.selection.alpha,
        }
      : null,
    layers,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    savedAt,
  }

  await putStoredProject(record)

  return toRecentProject(record)
}

export async function listRecentProjects(): Promise<RecentProject[]> {
  const projects = await getStoredProjects()
  return projects.map(toRecentProject).sort((left, right) => right.savedAt.localeCompare(left.savedAt))
}

function toRecentProject(project: StoredProject): RecentProject {
  return {
    id: project.id,
    name: project.name,
    width: project.width,
    height: project.height,
    updatedAt: project.updatedAt,
    savedAt: project.savedAt,
    layerCount: project.layers.length,
  }
}
