import type { DocumentPage, LoadedDocument } from '../redaction/types'

async function imageFromFile(file: File): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  const image = new Image()
  image.decoding = 'async'
  image.src = url
  try {
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function loadImageDocument(file: File): Promise<LoadedDocument> {
  const image = await imageFromFile(file)
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Could not create an image canvas.')
  }
  context.drawImage(image, 0, 0)

  const page: DocumentPage = {
    pageIndex: 0,
    width: canvas.width,
    height: canvas.height,
    imageUrl: canvas.toDataURL('image/png'),
    textItems: [],
    text: '',
  }

  return {
    id: crypto.randomUUID(),
    name: file.name,
    kind: 'image',
    mimeType: file.type || 'image/png',
    size: file.size,
    text: '',
    pages: [page],
    createdAt: new Date().toISOString(),
    warnings: [
      'Image text OCR is not enabled in this MVP. Use manual boxes for visible names, signatures, faces, and IDs.',
    ],
  }
}
