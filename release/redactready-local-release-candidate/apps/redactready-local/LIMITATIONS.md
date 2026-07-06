# Limitations of RedactReady Local

RedactReady Local is an **assistive privacy review tool**, not a guaranteed removal engine. Understanding its limitations is critical to safely reviewing files before sharing.

## Automated Detection Limitations

- **Suggestions, not guarantees**: The app uses regex and heuristics to suggest *possible* sensitive items (like "Possible SSN" or "Possible Email"). It will miss non-standard formats and context-specific sensitive data (e.g., a secret project name).
- **False positives**: It may flag harmless strings (like a public support phone number or a serial number) as sensitive. Human review is required to approve or reject every finding.
- **No medical or legal contextual awareness**: The tool does not understand HIPAA or legal definitions. It looks for string patterns and optional OCR-derived text patterns.

## PDF and Image Limitations

- **OCR (Optical Character Recognition)**: OCR is opt-in and experimental. It runs locally with Tesseract.js, may be slow, and may miss handwriting, poor scans, low contrast, rotated text, and unusual layouts. OCR results require manual verification.
- **Layout preservation**: PDFs exported from this tool are deliberately *flattened* into images to prevent hidden text layers from leaking. This means the resulting PDF is no longer text-searchable.
- **PDF mapping**: Text-to-box mapping for selectable PDF text and OCR results can be approximate. Confirm every box visually before export.
- **Metadata**: PDF export creates a new image-backed PDF and sets basic export metadata. Image export redraws through canvas as PNG. These steps attempt to avoid carrying obvious source metadata, but they are not a complete metadata guarantee.
- **QR/barcode detection**: Browser barcode detection depends on the `BarcodeDetector` API and may be unavailable outside Chromium-based browsers. Manual review and manual boxes are still required.

## Text and CSV Limitations

- **Structure breaking**: Replacing values in a strict CSV or JSON format might break the structural schema of the file if not careful.
- **Context leakage**: Redacting a name (e.g., "[REDACTED]") might still leave surrounding context that makes the person identifiable (e.g., "The CEO of Apple, [REDACTED]").

## Browser and Large-File Limitations

- **Browser support**: PDF rendering, canvas export, OCR workers, and barcode detection depend on browser capabilities. Test the exact browser before using the workflow for important files.
- **Large files**: Files over 50MB are blocked, and smaller complex PDFs can still process slowly or fail in browser memory. Split large documents and verify each exported part manually.

## Compliance Limitations

- **Not a compliance tool**: RedactReady Local does not certify compliance with HIPAA, FERPA, FOIA, GLBA, GDPR, or any other regulation.
- **No legal advice**: The application does not provide legal, regulatory, or privacy advice.

## Always Verify Manually

Redaction can fail if sensitive content remains in hidden text, missed OCR text, metadata, comments, annotations, filenames, embedded objects, cached previews, or unreviewed attachments. **Always open and inspect the final exported file manually before sharing it.**
