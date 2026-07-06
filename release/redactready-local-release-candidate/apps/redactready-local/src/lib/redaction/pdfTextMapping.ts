import type { DetectionResult, DocumentPage, RedactionBox } from './types'

function unionBoxes(boxes: RedactionBox[]): RedactionBox['bbox'] | undefined {
  if (boxes.length === 0) return undefined
  const left = Math.min(...boxes.map((box) => box.bbox.x))
  const top = Math.min(...boxes.map((box) => box.bbox.y))
  const right = Math.max(...boxes.map((box) => box.bbox.x + box.bbox.width))
  const bottom = Math.max(...boxes.map((box) => box.bbox.y + box.bbox.height))
  return {
    x: Math.max(0, left - 2),
    y: Math.max(0, top - 2),
    width: right - left + 4,
    height: bottom - top + 4,
    coordinateSpace: 'pdf-page',
  }
}

export function attachPdfTextBoxes(detections: DetectionResult[], pages: DocumentPage[]): DetectionResult[] {
  const pageItems = pages.flatMap((page) => page.textItems)
  if (pageItems.length === 0) return detections

  return detections.map((detection) => {
    const range = detection.textRange
    if (!range) return detection

    const overlaps = pageItems.filter((item) => range.start < item.range.end && range.end > item.range.start)
    if (overlaps.length === 0) return detection

    const pageIndex = overlaps[0]?.pageIndex ?? detection.pageIndex ?? 0
    const samePage = overlaps.filter((item) => item.pageIndex === pageIndex)
    const bbox = unionBoxes(
      samePage.map((item) => ({
        id: `${detection.id}-${item.range.start}`,
        detectionId: detection.id,
        category: detection.category,
        pageIndex,
        bbox: item.bbox,
        approved: detection.approved,
        createdBy: 'detector',
      })),
    )

    return bbox ? { ...detection, pageIndex, bbox, placement: 'approximate-visual' } : detection
  })
}

export function boxesFromDetections(detections: DetectionResult[]): RedactionBox[] {
  return detections
    .filter((detection) => Boolean(detection.bbox))
    .map((detection) => ({
      id: `box-${detection.id}`,
      detectionId: detection.id,
      category: detection.category,
      pageIndex: detection.pageIndex ?? 0,
      bbox: {
        ...detection.bbox!,
        coordinateSpace: detection.bbox!.coordinateSpace,
      },
      approved: detection.approved,
      createdBy: 'detector',
      note: detection.placement === 'approximate-visual' ? `${detection.label} - approximate position` : detection.label,
    }))
}
