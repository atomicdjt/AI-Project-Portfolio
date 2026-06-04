import type { BlurSettings, ImageFilter } from './ImageFilter'
import { applyConvolution } from './filterUtils'

export const gaussianBlurFilter: ImageFilter<BlurSettings> = {
  id: 'gaussian-blur',
  name: 'Gaussian Blur',
  apply(input, settings) {
    const passes = Math.max(1, Math.min(4, Math.round(settings.radius || 1)))
    let output = input

    for (let pass = 0; pass < passes; pass += 1) {
      output = applyConvolution(output, [1, 2, 1, 2, 4, 2, 1, 2, 1], 16)
    }

    return output
  },
}
