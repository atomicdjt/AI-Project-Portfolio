import type { BrushPreset, StrokePoint } from './BrushPreset'
import { applyPressureCurve } from './PressureCurve'
import { sampleStroke, smoothPoint } from './StrokeSampler'

export type PaintMode = 'paint' | 'erase'

export class BrushEngine {
  private lastPoint: StrokePoint | null = null

  beginStroke(point: StrokePoint, preset: BrushPreset, ctx: CanvasRenderingContext2D, color: string, mode: PaintMode): void {
    this.lastPoint = point
    this.drawStamp(ctx, point, preset, color, mode)
  }

  continueStroke(point: StrokePoint, preset: BrushPreset, ctx: CanvasRenderingContext2D, color: string, mode: PaintMode): void {
    if (!this.lastPoint) {
      this.beginStroke(point, preset, ctx, color, mode)
      return
    }

    const smoothed = smoothPoint(this.lastPoint, point, preset.smoothing)
    const samples = sampleStroke(this.lastPoint, smoothed, preset)

    for (const sample of samples) {
      this.drawStamp(ctx, sample, preset, color, mode)
    }

    this.lastPoint = smoothed
  }

  endStroke(): void {
    this.lastPoint = null
  }

  private drawStamp(
    ctx: CanvasRenderingContext2D,
    point: StrokePoint,
    preset: BrushPreset,
    color: string,
    mode: PaintMode,
  ): void {
    const pressure = applyPressureCurve(point.pressure)
    const radius = Math.max(0.5, (preset.size * (preset.pressureControlsSize ? pressure : 1)) / 2)
    const alpha = Math.max(0, Math.min(1, preset.opacity * preset.flow * (preset.pressureControlsOpacity ? pressure : 1)))

    ctx.save()
    ctx.globalCompositeOperation = mode === 'erase' ? 'destination-out' : 'source-over'
    ctx.globalAlpha = alpha

    if (preset.shape === 'square') {
      ctx.fillStyle = color
      ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2)
    } else {
      const hardness = Math.max(0.02, Math.min(1, preset.hardness))
      const gradient = ctx.createRadialGradient(point.x, point.y, radius * hardness, point.x, point.y, radius)
      gradient.addColorStop(0, color)
      gradient.addColorStop(1, mode === 'erase' ? 'rgba(0, 0, 0, 0)' : hexToTransparent(color))
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }
}

function hexToTransparent(color: string): string {
  if (!color.startsWith('#')) {
    return 'rgba(0, 0, 0, 0)'
  }

  const hex = color.slice(1)
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((part) => part + part)
          .join('')
      : hex.padEnd(6, '0').slice(0, 6)
  const value = Number.parseInt(normalized, 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255

  return `rgba(${r}, ${g}, ${b}, 0)`
}
