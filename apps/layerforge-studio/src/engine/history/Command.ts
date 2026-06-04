import type { ImageDocument } from '../document/DocumentModel'

export interface Command {
  id: string
  label: string
  timestamp: number
  execute(document: ImageDocument): ImageDocument
  undo(document: ImageDocument): ImageDocument
  redo(document: ImageDocument): ImageDocument
}

export function createCommandId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`
}
