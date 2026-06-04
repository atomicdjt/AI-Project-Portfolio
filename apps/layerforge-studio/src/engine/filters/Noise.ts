import type { ImageFilter } from './ImageFilter'
import { clampChannel, cloneImageData } from './filterUtils'

export const noiseFilter: ImageFilter<{ amount: number }> = {
  id: 'noise',
  name: 'Noise',
  apply(input, settings) {
    const output = cloneImageData(input)
    const amount = Math.max(0, Math.min(255, settings.amount))

    for (let index = 0; index < output.data.length; index += 4) {
      const noise = (Math.random() - 0.5) * amount
      output.data[index] = clampChannel(output.data[index] + noise)
      output.data[index + 1] = clampChannel(output.data[index + 1] + noise)
      output.data[index + 2] = clampChannel(output.data[index + 2] + noise)
    }

    return output
  },
}
