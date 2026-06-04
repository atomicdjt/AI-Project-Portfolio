import { createRasterLayer } from '../document/DocumentModel'
import type { RasterLayer } from '../document/LayerModel'
import { createCanvas, getCanvasContext } from '../document/LayerModel'

export async function importImageAsLayer(file: File, documentWidth: number, documentHeight: number): Promise<RasterLayer> {
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) {
    throw new Error('Import PNG, JPEG, or WebP images.')
  }

  const bitmap = await createBitmapFromFile(file)
  const canvas = createCanvas(documentWidth, documentHeight)
  const ctx = getCanvasContext(canvas)
  const scale = Math.min(1, documentWidth / bitmap.width, documentHeight / bitmap.height)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const x = Math.round((documentWidth - width) / 2)
  const y = Math.round((documentHeight - height) / 2)

  ctx.drawImage(bitmap, x, y, width, height)

  if ('close' in bitmap) {
    bitmap.close()
  }

  return createRasterLayer({
    width: documentWidth,
    height: documentHeight,
    name: file.name.replace(/\.[^.]+$/, '') || 'Imported Image',
    canvas,
  })
}

async function createBitmapFromFile(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file)
}
