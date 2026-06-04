import type { ImageFilter, SharpenSettings } from './ImageFilter'
import { applyConvolution, clampChannel } from './filterUtils'

export const sharpenFilter: ImageFilter<SharpenSettings> = {
  id: 'sharpen',
  name: 'Sharpen',
  apply(input, settings) {
    const amount = Math.max(0, Math.min(2, settings.amount || 1))
    const sharpened = applyConvolution(input, [0, -1, 0, -1, 5, -1, 0, -1, 0])

    for (let index = 0; index < sharpened.data.length; index += 4) {
      sharpened.data[index] = clampChannel(input.data[index] + (sharpened.data[index] - input.data[index]) * amount)
      sharpened.data[index + 1] = clampChannel(
        input.data[index + 1] + (sharpened.data[index + 1] - input.data[index + 1]) * amount,
      )
      sharpened.data[index + 2] = clampChannel(
        input.data[index + 2] + (sharpened.data[index + 2] - input.data[index + 2]) * amount,
      )
    }

    return sharpened
  },
}
