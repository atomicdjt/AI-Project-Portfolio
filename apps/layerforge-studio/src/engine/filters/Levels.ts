import type { ImageFilter } from './ImageFilter'
import { cloneImageData } from './filterUtils'

export const levelsPlaceholderFilter: ImageFilter = {
  id: 'levels-placeholder',
  name: 'Levels',
  apply(input) {
    return cloneImageData(input)
  },
}
