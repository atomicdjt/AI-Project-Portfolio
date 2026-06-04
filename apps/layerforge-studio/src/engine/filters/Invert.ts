import type { ImageFilter } from './ImageFilter'
import { cloneImageData } from './filterUtils'

export const invertFilter: ImageFilter = {
  id: 'invert',
  name: 'Invert',
  apply(input) {
    const output = cloneImageData(input)

    for (let index = 0; index < output.data.length; index += 4) {
      output.data[index] = 255 - input.data[index]
      output.data[index + 1] = 255 - input.data[index + 1]
      output.data[index + 2] = 255 - input.data[index + 2]
    }

    return output
  },
}
