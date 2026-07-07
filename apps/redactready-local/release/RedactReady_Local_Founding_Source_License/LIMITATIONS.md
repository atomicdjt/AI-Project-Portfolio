# System Limitations & Caveats

- **Flattened PDF Tradeoffs:** PDF export converts visible reviewed pages into a redacted visual output (pixels). This can reduce hidden-layer risk, but it may remove selectable text, searchability, form fields, and accessibility/screen-reader structure.
- **OCR Status:** OCR is experimental, browser-dependent, and can miss text. It is an assistive feature only.
- **Metadata Handling:** The system attempts to remove EXIF/metadata on export, but it is best-effort and browser-dependent. We do not claim complete metadata removal.
- **Export Blockers:** By default, you must review or explicitly acknowledge all detections before exporting.
- **Self-Test Limits:** The self-test capability is a system check, not proof of complete sanitization. Manual review is still required.
- **Local State Cleanup:** "Start Over" clears the in-app workspace state, but does not definitively clear the browser downloads folder or system clipboard.
- **No Compliance Claims:** This software makes no guarantees of HIPAA, FERPA, FOIA, GLBA, or GDPR compliance.