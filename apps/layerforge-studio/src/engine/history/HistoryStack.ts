import type { ImageDocument } from '../document/DocumentModel'
import type { Command } from './Command'

export type HistoryResult = {
  document: ImageDocument
  history: HistoryStack
}

export class HistoryStack {
  readonly undoStack: Command[]
  readonly redoStack: Command[]

  constructor(undoStack: Command[] = [], redoStack: Command[] = []) {
    this.undoStack = undoStack
    this.redoStack = redoStack
  }

  push(command: Command, document: ImageDocument): HistoryResult {
    const nextDocument = command.execute(document)
    return {
      document: this.withCounts(nextDocument, this.undoStack.length + 1, 0),
      history: new HistoryStack([...this.undoStack, command], []),
    }
  }

  pushExecuted(command: Command, document: ImageDocument): HistoryResult {
    return {
      document: this.withCounts(document, this.undoStack.length + 1, 0),
      history: new HistoryStack([...this.undoStack, command], []),
    }
  }

  undo(document: ImageDocument): HistoryResult {
    const command = this.undoStack[this.undoStack.length - 1]

    if (!command) {
      return { document, history: this }
    }

    const undoStack = this.undoStack.slice(0, -1)
    const redoStack = [...this.redoStack, command]
    const nextDocument = command.undo(document)

    return {
      document: this.withCounts(nextDocument, undoStack.length, redoStack.length),
      history: new HistoryStack(undoStack, redoStack),
    }
  }

  redo(document: ImageDocument): HistoryResult {
    const command = this.redoStack[this.redoStack.length - 1]

    if (!command) {
      return { document, history: this }
    }

    const redoStack = this.redoStack.slice(0, -1)
    const undoStack = [...this.undoStack, command]
    const nextDocument = command.redo(document)

    return {
      document: this.withCounts(nextDocument, undoStack.length, redoStack.length),
      history: new HistoryStack(undoStack, redoStack),
    }
  }

  private withCounts(document: ImageDocument, undoCount: number, redoCount: number): ImageDocument {
    return {
      ...document,
      history: {
        undoCount,
        redoCount,
      },
    }
  }
}
