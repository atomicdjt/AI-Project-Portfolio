import type { ImageFilter } from './ImageFilter'
import { cloneImageData } from './filterUtils'

export const curvesPlaceholderFilter: ImageFilter = {
  id: 'curves-placeholder',
  name: 'Curves',
  apply(input) {
    return cloneImageData(input)
  },
}
