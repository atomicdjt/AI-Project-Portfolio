import type { BrightnessContrastSettings, ImageFilter } from './ImageFilter'
import { clampChannel, cloneImageData } from './filterUtils'

export const brightnessContrastFilter: ImageFilter<BrightnessContrastSettings> = {
  id: 'brightness-contrast',
  name: 'Brightness / Contrast',
  apply(input, settings) {
    const output = cloneImageData(input)
    const brightness = settings.brightness
    const contrast = settings.contrast
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast))

    for (let index = 0; index < output.data.length; index += 4) {
      output.data[index] = clampChannel(factor * (input.data[index] - 128) + 128 + brightness)
      output.data[index + 1] = clampChannel(factor * (input.data[index + 1] - 128) + 128 + brightness)
      output.data[index + 2] = clampChannel(factor * (input.data[index + 2] - 128) + 128 + brightness)
    }

    return output
  },
}
