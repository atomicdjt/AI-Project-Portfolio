import type { DocumentPage, RedactionBox } from './types'

async function imageFromUrl(url: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.decoding = 'async'
  image.src = url
  await image.decode()
  return image
}

export async function renderRedactedPageToCanvas(page: DocumentPage, boxes: RedactionBox[]): Promise<HTMLCanvasElement> {
  const image = await imageFromUrl(page.imageUrl)
  const canvas = document.createElement('canvas')
  canvas.width = page.width
  canvas.height = page.height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not create a redaction canvas.')
  }

  context.drawImage(image, 0, 0, page.width, page.height)
  context.fillStyle = '#050505'
  for (const box of boxes) {
    if (!box.approved || box.pageIndex !== page.pageIndex) continue
    const { x, y, width, height } = box.bbox
    context.fillRect(Math.max(0, x), Math.max(0, y), Math.max(1, width), Math.max(1, height))
  }

  return canvas
}

export async function exportRedactedImage(page: DocumentPage, boxes: RedactionBox[]): Promise<Blob> {
  const canvas = await renderRedactedPageToCanvas(page, boxes)
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) {
    throw new Error('Could not export the redacted image.')
  }
  return blob
}
