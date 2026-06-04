import type { ImageDocument } from '../document/DocumentModel'
import { touchDocument } from '../document/DocumentModel'
import type { Rect } from '../document/LayerModel'
import { getCanvasContext, isRasterLayer } from '../document/LayerModel'
import { createCommandId, type Command } from './Command'

export class DocumentSnapshotCommand implements Command {
  readonly id: string
  readonly label: string
  readonly timestamp: number
  private readonly before: ImageDocument
  private readonly after: ImageDocument

  constructor(label: string, before: ImageDocument, after: ImageDocument) {
    this.id = createCommandId('document')
    this.label = label
    this.timestamp = Date.now()
    this.before = before
    this.after = after
  }

  execute(): ImageDocument {
    return this.after
  }

  undo(): ImageDocument {
    return this.before
  }

  redo(): ImageDocument {
    return this.after
  }
}

export class PixelPatchCommand implements Command {
  readonly id: string
  readonly label: string
  readonly timestamp: number
  readonly layerId: string
  readonly bounds: Rect
  private readonly before: ImageData
  private readonly after: ImageData

  constructor(label: string, layerId: string, bounds: Rect, before: ImageData, after: ImageData) {
    this.id = createCommandId('pixels')
    this.label = label
    this.timestamp = Date.now()
    this.layerId = layerId
    this.bounds = bounds
    this.before = before
    this.after = after
  }

  execute(document: ImageDocument): ImageDocument {
    return this.apply(document, this.after)
  }

  undo(document: ImageDocument): ImageDocument {
    return this.apply(document, this.before)
  }

  redo(document: ImageDocument): ImageDocument {
    return this.apply(document, this.after)
  }

  private apply(document: ImageDocument, patch: ImageData): ImageDocument {
    const layers = document.layers.map((layer) => {
      if (layer.id !== this.layerId || !isRasterLayer(layer)) {
        return layer
      }

      getCanvasContext(layer.canvas).putImageData(patch, this.bounds.x, this.bounds.y)
      return { ...layer }
    })

    return touchDocument({
      ...document,
      layers,
    })
  }
}

export class BrushStrokeCommand extends PixelPatchCommand {}

export class EraseStrokeCommand extends PixelPatchCommand {}

export class ApplyFilterCommand extends PixelPatchCommand {}

export class AddLayerCommand extends DocumentSnapshotCommand {}

export class DeleteLayerCommand extends DocumentSnapshotCommand {}

export class DuplicateLayerCommand extends DocumentSnapshotCommand {}

export class ReorderLayerCommand extends DocumentSnapshotCommand {}

export class SetOpacityCommand extends DocumentSnapshotCommand {}

export class SetBlendModeCommand extends DocumentSnapshotCommand {}

export class SelectionCommand extends DocumentSnapshotCommand {}
