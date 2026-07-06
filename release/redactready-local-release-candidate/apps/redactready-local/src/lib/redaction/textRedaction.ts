import type { DetectionResult, RedactionCategory } from './types'

export function redactionToken(category: RedactionCategory): string {
  return `[REDACTED_${category.toUpperCase()}]`
}

export function redactTextContent(text: string, detections: DetectionResult[]): string {
  const ranges = detections
    .filter((detection) => detection.approved && detection.textRange)
    .map((detection) => ({
      start: detection.textRange!.start,
      end: detection.textRange!.end,
      replacement: redactionToken(detection.category),
    }))
    .sort((a, b) => b.start - a.start)

  let redacted = text
  for (const range of ranges) {
    redacted = `${redacted.slice(0, range.start)}${range.replacement}${redacted.slice(range.end)}`
  }

  return redacted
}

export function exportRedactedTextBlob(text: string, detections: DetectionResult[], mimeType: string): Blob {
  const redacted = redactTextContent(text, detections)
  return new Blob([redacted], { type: mimeType || 'text/plain' })
}
