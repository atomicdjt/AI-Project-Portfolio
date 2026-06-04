import type { ImageFilter } from './ImageFilter'
import { clampChannel, cloneImageData } from './filterUtils'

export const desaturateFilter: ImageFilter = {
  id: 'desaturate',
  name: 'Desaturate',
  apply(input) {
    const output = cloneImageData(input)

    for (let index = 0; index < output.data.length; index += 4) {
      const luminance = input.data[index] * 0.2126 + input.data[index + 1] * 0.7152 + input.data[index + 2] * 0.0722
      const value = clampChannel(luminance)
      output.data[index] = value
      output.data[index + 1] = value
      output.data[index + 2] = value
    }

    return output
  },
}
