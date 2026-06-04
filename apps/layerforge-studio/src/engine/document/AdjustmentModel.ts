export type BrightnessContrastAdjustment = {
  type: 'brightness-contrast'
  brightness: number
  contrast: number
}

export type LevelsAdjustment = {
  type: 'levels'
  black: number
  midpoint: number
  white: number
}

export type CurvePoint = {
  x: number
  y: number
}

export type CurvesAdjustment = {
  type: 'curves'
  rgb: CurvePoint[]
  red: CurvePoint[]
  green: CurvePoint[]
  blue: CurvePoint[]
}

export type HueSaturationAdjustment = {
  type: 'hue-saturation'
  hue: number
  saturation: number
  lightness: number
}

export type ExposureAdjustment = {
  type: 'exposure'
  exposure: number
  gamma: number
}

export type GradientMapAdjustment = {
  type: 'gradient-map'
  stops: Array<{ color: string; offset: number }>
}

export type Adjustment =
  | BrightnessContrastAdjustment
  | LevelsAdjustment
  | CurvesAdjustment
  | HueSaturationAdjustment
  | ExposureAdjustment
  | GradientMapAdjustment
