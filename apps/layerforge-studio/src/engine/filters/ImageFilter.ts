export interface ImageFilter<TSettings = unknown> {
  id: string
  name: string
  apply(input: ImageData, settings: TSettings): ImageData
}

export type FilterId = 'brightness-contrast' | 'invert' | 'desaturate' | 'gaussian-blur' | 'sharpen'

export type BrightnessContrastSettings = {
  brightness: number
  contrast: number
}

export type BlurSettings = {
  radius: number
}

export type SharpenSettings = {
  amount: number
}
