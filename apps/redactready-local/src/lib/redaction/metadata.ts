import type { DocumentKind, MetadataHandlingStatus } from './types'

export interface MetadataSummary {
  status: MetadataHandlingStatus
  notes: string[]
}

export function metadataSummaryForKind(kind: DocumentKind): MetadataSummary {
  if (kind === 'pdf') {
    return {
      status: 'attempted',
      notes: [
        'PDF export creates a new image-backed PDF and sets basic document metadata fields to RedactReady export values.',
        'This does not guarantee every possible metadata, attachment, cached preview, or filename risk has been removed.',
      ],
    }
  }

  if (kind === 'image') {
    return {
      status: 'attempted',
      notes: [
        'Image export redraws the source through browser canvas and downloads a PNG, which normally avoids carrying source EXIF metadata.',
        'Users should still inspect the final file and filename before sharing.',
      ],
    }
  }

  return {
    status: 'not applicable',
    notes: [
      'TXT and CSV exports do not carry PDF/image metadata in the same way.',
      'Filenames, surrounding context, spreadsheet behavior, and downstream import settings still require manual review.',
    ],
  }
}
