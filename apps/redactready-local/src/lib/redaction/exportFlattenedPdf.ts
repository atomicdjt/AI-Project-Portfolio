import { PDFDocument } from 'pdf-lib'
import { renderRedactedPageToCanvas } from './applyCanvasRedactions'
import type { DocumentPage, RedactionBox } from './types'

export async function exportFlattenedPdf(pages: DocumentPage[], boxes: RedactionBox[], sourceName: string): Promise<Blob> {
  if (pages.length === 0) {
    throw new Error('No PDF pages are available to export.')
  }

  const pdf = await PDFDocument.create()
  pdf.setTitle(`${sourceName} redacted`)
  pdf.setSubject('Flattened local redaction export')
  pdf.setCreator('RedactReady local browser export')
  pdf.setProducer('RedactReady')
  pdf.setCreationDate(new Date())
  pdf.setModificationDate(new Date())

  for (const page of pages) {
    const canvas = await renderRedactedPageToCanvas(page, boxes)
    const pngDataUrl = canvas.toDataURL('image/png')
    const png = await pdf.embedPng(pngDataUrl)
    const pdfPage = pdf.addPage([page.width, page.height])
    pdfPage.drawImage(png, {
      x: 0,
      y: 0,
      width: page.width,
      height: page.height,
    })
  }

  const bytes = await pdf.save({ useObjectStreams: true })
  const copy = new Uint8Array(bytes.length)
  copy.set(bytes)
  return new Blob([copy], { type: 'application/pdf' })
}
