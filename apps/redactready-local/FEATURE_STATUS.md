# Feature Status

This document outlines the current status of features in RedactReady Local, separating what is implemented from what is demo-only, planned, or explicitly excluded.

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Local-first document review workflow** | Implemented | Processing happens in the browser session. |
| **Sample document demo** | Implemented | Uses synthetic sample data only for the demo workflow. |
| **Suggested sensitive-data findings** | Implemented | Findings are suggestions and require human review. |
| **Manual redaction** | Implemented | Users can draw custom redaction boxes. |
| **Export sanitized copy** | Implemented | Exports flattened PDFs, redacted images, or redacted text. Manual verification required. |
| **OCR text awareness** | Experimental opt-in | Local Tesseract.js OCR can be run for PDF/image pages. It may be slow and incomplete; all OCR results require manual verification. |
| **Metadata awareness** | Attempted where feasible | PDF export sets basic RedactReady metadata; image export redraws through canvas. Users must manually verify final metadata and filenames. |
| **PDF flattening** | Implemented | PDF pages are rasterized and exported into a new image-backed PDF. The output is not text-searchable and still requires manual review. |
| **Image exports** | Implemented | PNG/JPG inputs export as redacted PNG images with approved boxes painted into pixels. OCR is opt-in; face/signature detection is not included. |
| **TXT export** | Implemented | Approved text findings are replaced with redaction tokens. Surrounding context can still reveal sensitive meaning. |
| **CSV export** | Implemented | Approved values are replaced in place. Strict schemas, formulas, quoting, or downstream parsing should be manually verified. |
| **Comments / annotations awareness** | Risk Reminder | Mentioned as a verification item. |
| **Faces** | Not currently implemented | Users must add manual boxes for faces in screenshots, scans, or images. |
| **Signatures** | Not currently implemented | Users must add manual boxes for signatures and handwriting. |
| **Barcodes / QR codes** | Browser-dependent | Uses the browser `BarcodeDetector` API when available and shows a warning when unavailable; otherwise users must review manually. |
| **Browser memory limits** | Known limitation | Files over 50MB are blocked, and complex PDFs may still hit local browser limits. |
| **Large files** | Known limitation | Single-file local review only; very large or complex files require manual pre-splitting. |
| **Sensitive values in reports** | Implemented | JSON reports intentionally exclude raw sensitive values and include counts, categories, verification status, and warnings. |
| **Batch processing** | Roadmap | Only single-file processing is supported currently. |
| **Audit report export** | Implemented | JSON export of the verification log is available and includes OCR status plus metadata handling notes without raw sensitive values. |
| **Human review** | Required | Every export requires checklist acknowledgement, and final output must be manually opened and inspected before sharing. |
| **Planned improvements** | Roadmap | OCR quality controls, richer visual detection, batch processing, stronger metadata inspection, and layout-aware export validation. |
| **Compliance certification** | Not included | Explicitly not a compliance certification tool. |
| **Guaranteed redaction** | Not included | Explicitly not guaranteed. |
| **Fully automated sensitive-data removal** | Not included | Human review is strictly required. |
