import type { BrushPreset, StrokePoint } from './BrushPreset'

export function smoothPoint(previous: StrokePoint, next: StrokePoint, smoothing: number): StrokePoint {
  const amount = Math.max(0, Math.min(0.92, smoothing))

  return {
    x: previous.x + (next.x - previous.x) * (1 - amount),
    y: previous.y + (next.y - previous.y) * (1 - amount),
    pressure: previous.pressure + (next.pressure - previous.pressure) * (1 - amount),
    time: next.time,
  }
}

export function sampleStroke(from: StrokePoint, to: StrokePoint, preset: BrushPreset): StrokePoint[] {
  const spacing = Math.max(1, preset.size * preset.spacing)
  const dx = to.x - from.x
  const dy = to.y - from.y
  const distance = Math.hypot(dx, dy)
  const steps = Math.max(1, Math.ceil(distance / spacing))
  const points: StrokePoint[] = []

  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps
    points.push({
      x: from.x + dx * t,
      y: from.y + dy * t,
      pressure: from.pressure + (to.pressure - from.pressure) * t,
      time: from.time + (to.time - from.time) * t,
    })
  }

  return points
}
