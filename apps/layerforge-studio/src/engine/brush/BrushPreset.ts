export type BrushPreset = {
  id: string
  name: string
  size: number
  hardness: number
  opacity: number
  flow: number
  spacing: number
  smoothing: number
  shape: 'round' | 'square' | 'custom'
  pressureControlsSize: boolean
  pressureControlsOpacity: boolean
  scatter: number
  angleJitter: number
}

export type StrokePoint = {
  x: number
  y: number
  pressure: number
  time: number
}

export type StrokeSegment = {
  from: StrokePoint
  to: StrokePoint
}

export const defaultBrushPreset: BrushPreset = {
  id: 'soft-round',
  name: 'Soft Round',
  size: 28,
  hardness: 0.78,
  opacity: 0.9,
  flow: 0.72,
  spacing: 0.18,
  smoothing: 0.34,
  shape: 'round',
  pressureControlsSize: true,
  pressureControlsOpacity: false,
  scatter: 0,
  angleJitter: 0,
}
