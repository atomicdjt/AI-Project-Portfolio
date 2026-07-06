# RedactReady Local Feature Status

This document separates production-ready workflow pieces from experimental, browser-dependent, human-review, known-limitation, and roadmap items.

## Implemented

| Feature | Notes |
| :--- | :--- |
| Local-first document review workflow | Processing happens in the browser session. |
| Synthetic sample demo | Uses public fake sample data only. |
| Suggested sensitive-data findings | Regex and heuristic findings are suggestions and require human review. |
| Manual redaction boxes | Users can draw, move, resize, approve, reject, and delete boxes. |
| Export sanitized copy | Exports flattened PDFs, redacted images, or redacted text/CSV. |
| PDF flattening | Pages are rasterized into a new image-backed PDF. |
| Image exports | PNG/JPG inputs export as redacted PNG images with approved boxes painted into pixels. |
| TXT and CSV exports | Approved matched ranges are replaced with redaction tokens. |
| Raw-value-free report export | JSON reports exclude raw sensitive values and include counts, categories, verification status, OCR status, metadata handling, and warnings. |

## Experimental

| Feature | Notes |
| :--- | :--- |
| OCR text awareness | Opt-in local Tesseract.js OCR can run for PDF/image pages. It may be slow and incomplete; every OCR result requires manual verification. |
| OCR-derived placement boxes | OCR boxes are approximate and may need manual adjustment. |
| Metadata handling | PDF export sets basic RedactReady metadata; image export redraws through canvas. Users must inspect final metadata and filenames manually. |

## Browser-Dependent

| Feature | Notes |
| :--- | :--- |
| Barcode / QR detection | Uses the browser `BarcodeDetector` API when available and warns when unavailable. |
| PDF rendering and canvas export | Depends on browser memory, canvas behavior, and PDF.js rendering support. |
| OCR worker execution | Depends on browser worker support and availability of same-origin OCR assets. |

## Human Review Required

- Every detected finding must be approved, rejected, or manually adjusted.
- Every OCR-derived finding must be visually checked.
- Every export requires checklist acknowledgement.
- Every downloaded file must be opened and inspected before sharing.
- Filenames, comments, annotations, metadata, hidden text, OCR text, surrounding context, faces, signatures, barcodes, and QR codes require manual review.

## Known Limitations

- No guaranteed detection.
- No guaranteed redaction.
- No legal, medical, regulatory, security, or compliance advice.
- PDF text-to-box mapping can be approximate.
- Flattened PDFs are not text-searchable and may lose accessibility semantics.
- CSV replacement can affect formulas, quoting, strict schemas, or downstream imports.
- Files over 50MB are blocked; smaller complex files may still exceed browser limits.

## Not Implemented

- Compliance certification.
- Guaranteed redaction.
- Fully automatic sensitive-data removal.
- Face detection.
- Signature detection.
- Batch processing.
- Layout-preserving DOCX/XLSX/PPTX redaction.
- Complete metadata forensics or guaranteed metadata sanitization.

## Roadmap

- OCR quality controls and confidence review tooling.
- Richer visual detection with explicit browser support boundaries.
- Batch review workflow.
- Stronger metadata inspection and export validation.
- More sample fixtures and cross-browser QA evidence.
