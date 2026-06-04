import type { BlendMode } from '../document/LayerModel'

const compositeModeMap: Record<BlendMode, GlobalCompositeOperation> = {
  normal: 'source-over',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  'soft-light': 'soft-light',
  'hard-light': 'hard-light',
  'color-dodge': 'color-dodge',
  'color-burn': 'color-burn',
  darken: 'darken',
  lighten: 'lighten',
  difference: 'difference',
  exclusion: 'exclusion',
  hue: 'hue',
  saturation: 'saturation',
  color: 'color',
  luminosity: 'luminosity',
}

export function toCanvasCompositeOperation(blendMode: BlendMode): GlobalCompositeOperation {
  return compositeModeMap[blendMode] ?? 'source-over'
}

export function compositeCanvasLayer(
  ctx: CanvasRenderingContext2D,
  source: CanvasImageSource,
  blendMode: BlendMode,
  opacity: number,
): void {
  ctx.save()
  ctx.globalAlpha = Math.max(0, Math.min(1, opacity))
  ctx.globalCompositeOperation = toCanvasCompositeOperation(blendMode)
  ctx.drawImage(source, 0, 0)
  ctx.restore()
}
