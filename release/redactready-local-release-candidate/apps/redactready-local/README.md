# RedactReady Local

Local-first privacy review before sharing documents externally.

## Overview

RedactReady Local helps users spot, review, redact, and verify potentially sensitive information before sharing files with AI tools, email, clients, vendors, or public platforms.

## Live Demo

- Live demo: https://redactready-local.netlify.app/
- Use the included synthetic samples first. Do not upload real sensitive files to a public demo unless the deployment and privacy model have been independently verified.

## Positioning

"Redact before you upload."

## Who It Is For

- Security and privacy teams
- Knowledge workers using AI tools
- HR and people operations
- Legal and litigation support
- Healthcare operations
- Education and research coordinators

## What It Helps Review

- PII
- PHI-related content
- Financial identifiers
- Credentials and tokens
- HR and employee data
- Student identifiers
- Case details
- Confidential business information

## What It Does

- Supports local-first pre-share review
- Suggests potentially sensitive findings
- Allows human review and manual redaction
- Provides opt-in experimental OCR for PDFs/images
- Supports verification before export
- Provides risk reminders for metadata, OCR, and hidden layers

## Supported Files

- PDF
- PNG
- JPG / JPEG
- TXT
- CSV

## What It Does Not Do

- Does not guarantee detection of all sensitive information
- Does not guarantee complete redaction
- Does not provide legal advice
- Does not certify HIPAA, FERPA, FOIA, GLBA, GDPR, or other compliance
- Does not replace human review
- Does not guarantee OCR coverage or metadata sanitization

## Demo Workflow

1. Load a supported local file or synthetic sample.
2. Review possible sensitive-data findings.
3. Approve, reject, or add manual redaction boxes.
4. Optionally run experimental local OCR for PDF/image pages.
5. Complete the file-specific verification checklist.
6. Export a redacted copy and optional JSON report.
7. Open and manually inspect the exported file before sharing.

## OCR, Metadata, and Browser Support

- OCR status: implemented as opt-in experimental local OCR for rendered PDF/image pages using same-origin Tesseract.js assets.
- Metadata status: attempted where feasible. PDF export creates a new image-backed PDF and sets basic RedactReady export metadata. Image export redraws through canvas as PNG. Users must still inspect final file properties and filenames.
- Barcode/browser status: QR/barcode detection depends on the browser `BarcodeDetector` API. The app warns when unavailable, and users must add manual boxes for missed visual content.

## Local-First Privacy Model

RedactReady Local is designed to process document review workflows locally in the browser or local runtime. It does not intentionally send document contents to external servers. OCR runtime assets and English language data are served from this app's own `public/ocr/` assets. Review the implementation and deployment environment before using sensitive real-world files.

## Common Redaction Risks

- Visual-only black boxes
- OCR layers
- Metadata
- Comments
- Annotations
- Bookmarks
- Filenames
- Embedded objects
- Copy-paste leaks
- Unreviewed attachments

## Feature Status

See [FEATURE_STATUS.md](./FEATURE_STATUS.md) for details on implemented, demo-only, roadmap, and explicitly excluded features.

## Technical Architecture

See [TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md) for the app structure, data flow, privacy boundary, export behavior, and deployment notes.

## Setup

See [SETUP.md](./SETUP.md) for installation and local execution instructions.

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
npm run e2e
npm run preview
```

## Synthetic Samples

The demo includes public synthetic samples under `public/samples/`, and the upload screen exposes one-click sample buttons. These files are fake and intended only for workflow testing.

## Verification

See [VERIFICATION.md](./VERIFICATION.md) for details on build validation and claims auditing.

## Limitations

See [LIMITATIONS.md](./LIMITATIONS.md) for details on the boundaries of automated detection and visual redaction.

## Manual QA

See [MANUAL_QA_CHECKLIST.md](./MANUAL_QA_CHECKLIST.md) for the browser checklist used before public review.

## Portfolio Case Study

See [PORTFOLIO_CASE_STUDY.md](./PORTFOLIO_CASE_STUDY.md) for the release-ready portfolio narrative.

### Problem
Professionals increasingly share PDFs, screenshots, records, logs, and forms with AI tools, vendors, clients, and public platforms. These files often contain personal identifiers, credentials, financial details, health-related content, employee data, student information, or confidential business context.

### Challenge
Redaction is frequently misunderstood. Visual cover-ups may leave hidden text, OCR layers, metadata, comments, annotations, filenames, or copied text exposed. A useful tool must support human review rather than pretending to guarantee automated safety.

### Solution
RedactReady Local provides an assistive pre-share review workflow:
1. Inspect the file locally.
2. Surface possible sensitive findings.
3. Let the user review and manually decide.
4. Optionally run experimental local OCR for PDF/image pages.
5. Apply redactions.
6. Complete the file-specific export checklist.
7. Verify before export and manually inspect the downloaded file.

### Product Judgment
The product deliberately avoids overclaiming. It does not claim HIPAA, FERPA, FOIA, GDPR, or legal compliance. It positions itself as a local-first workflow support tool with human verification.

### Why This Is Strong for Portfolio Credibility
This project shows privacy-aware product strategy, safety-conscious UX writing, human-in-the-loop design, local-first architecture thinking, regulated-domain sensitivity, documentation discipline, demo clarity, and trust-building limitations language.

## License

See LICENSE file in the repository.
