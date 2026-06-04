import { brightnessContrastFilter } from './BrightnessContrast'
import { gaussianBlurFilter } from './Blur'
import { desaturateFilter } from './HueSaturation'
import type { FilterId, ImageFilter } from './ImageFilter'
import { invertFilter } from './Invert'
import { sharpenFilter } from './Sharpen'

export const mvpFilters = [
  brightnessContrastFilter,
  invertFilter,
  desaturateFilter,
  gaussianBlurFilter,
  sharpenFilter,
] as const

export function getFilter(filterId: FilterId): ImageFilter {
  const filter = mvpFilters.find((item) => item.id === filterId)

  if (!filter) {
    throw new Error(`Unknown filter: ${filterId}`)
  }

  return filter
}

export type { FilterId }
