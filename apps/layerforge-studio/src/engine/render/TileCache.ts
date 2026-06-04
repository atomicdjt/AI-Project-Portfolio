import type { Rect } from '../document/LayerModel'

export type TileState = {
  key: string
  bounds: Rect
  dirty: boolean
}

export class TileCache {
  private readonly tileSize: number
  private readonly tiles = new Map<string, TileState>()

  constructor(tileSize = 256) {
    this.tileSize = tileSize
  }

  markDirty(bounds: Rect): void {
    const startX = Math.floor(bounds.x / this.tileSize)
    const startY = Math.floor(bounds.y / this.tileSize)
    const endX = Math.floor((bounds.x + bounds.width) / this.tileSize)
    const endY = Math.floor((bounds.y + bounds.height) / this.tileSize)

    for (let y = startY; y <= endY; y += 1) {
      for (let x = startX; x <= endX; x += 1) {
        const key = `${x}:${y}`
        this.tiles.set(key, {
          key,
          bounds: {
            x: x * this.tileSize,
            y: y * this.tileSize,
            width: this.tileSize,
            height: this.tileSize,
          },
          dirty: true,
        })
      }
    }
  }

  getDirtyTiles(): TileState[] {
    return Array.from(this.tiles.values()).filter((tile) => tile.dirty)
  }

  clear(): void {
    this.tiles.clear()
  }
}
