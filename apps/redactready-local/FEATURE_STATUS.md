# Feature Status

This document outlines the current status of features in RedactReady Local, separating what is implemented from what is demo-only, planned, or explicitly excluded.

| Feature | Status | Notes |
| :--- | :--- | :--- |
| **Local-first document review workflow** | Implemented | Processing happens in the browser session. |
| **Sample document demo** | Implemented | Uses synthetic sample data only for the demo workflow. |
| **Suggested sensitive-data findings** | Implemented | Findings are suggestions and require human review. |
| **Manual redaction** | Implemented | Users can draw custom redaction boxes. |
| **Export sanitized copy** | Implemented | Exports flattened PDFs, redacted images, or redacted text. Manual verification required. |
| **OCR text awareness** | Risk Reminder | Not implemented. Users must manually review images for baked-in text. |
| **Metadata awareness** | Risk Reminder | PDF flattening mitigates some risks, but users must manually verify final metadata. |
| **Comments / annotations awareness** | Risk Reminder | Mentioned as a verification item. |
| **Batch processing** | Roadmap | Only single-file processing is supported currently. |
| **Audit report export** | Implemented | JSON export of the verification log is available. |
| **Compliance certification** | Not included | Explicitly not a compliance certification tool. |
| **Guaranteed redaction** | Not included | Explicitly not guaranteed. |
| **Fully automated sensitive-data removal** | Not included | Human review is strictly required. |
