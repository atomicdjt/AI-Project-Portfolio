export function cloneImageData(input: ImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(input.data), input.width, input.height)
}

export function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

export function applyConvolution(input: ImageData, kernel: number[], divisor = 1, offset = 0): ImageData {
  const output = cloneImageData(input)
  const side = Math.sqrt(kernel.length)
  const half = Math.floor(side / 2)

  for (let y = 0; y < input.height; y += 1) {
    for (let x = 0; x < input.width; x += 1) {
      let r = 0
      let g = 0
      let b = 0

      for (let ky = 0; ky < side; ky += 1) {
        for (let kx = 0; kx < side; kx += 1) {
          const sourceX = Math.max(0, Math.min(input.width - 1, x + kx - half))
          const sourceY = Math.max(0, Math.min(input.height - 1, y + ky - half))
          const sourceIndex = (sourceY * input.width + sourceX) * 4
          const weight = kernel[ky * side + kx]
          r += input.data[sourceIndex] * weight
          g += input.data[sourceIndex + 1] * weight
          b += input.data[sourceIndex + 2] * weight
        }
      }

      const targetIndex = (y * input.width + x) * 4
      output.data[targetIndex] = clampChannel(r / divisor + offset)
      output.data[targetIndex + 1] = clampChannel(g / divisor + offset)
      output.data[targetIndex + 2] = clampChannel(b / divisor + offset)
      output.data[targetIndex + 3] = input.data[targetIndex + 3]
    }
  }

  return output
}
