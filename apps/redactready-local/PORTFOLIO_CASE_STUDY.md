# RedactReady Local Portfolio Case Study

## Summary

RedactReady Local is a local-first assistive privacy review tool for reviewing files before they are shared with AI tools, email recipients, vendors, clients, or public platforms.

The product focuses on a practical risk: visual cover-ups are often mistaken for complete removal. RedactReady Local guides users through detection, human review, manual redaction, export, and verification reminders without claiming compliance or guaranteed removal.

## Problem

Professionals frequently share PDFs, screenshots, forms, logs, HR files, research notes, and CSV exports outside their original system of record. Those files can contain personal identifiers, financial details, case references, credentials, health-related identifiers, student information, or confidential business context.

## Users

- Knowledge workers preparing files for AI tools, email, vendors, or public uploads.
- Privacy, security, HR, education, healthcare operations, legal operations, and research support teams.
- Portfolio reviewers evaluating responsible frontend engineering and privacy-product judgment.

## Solution

RedactReady Local provides a browser-based workflow that keeps the review surface local-first, makes uncertainty visible, and requires users to verify exports before sharing.

## Workflow

1. Load a supported local file or synthetic sample.
2. Review possible sensitive-data findings.
3. Approve, reject, filter, or add custom terms.
4. Draw manual redaction boxes for visual or missed content.
5. Optionally run experimental local OCR for PDF/image pages.
6. Acknowledge file-specific export limitations.
7. Export a redacted copy and a raw-value-free JSON report.
8. Manually inspect the output before sharing.

## Technical Approach

- Vite, React, TypeScript, Tailwind, and Zustand.
- PDF.js rendering with text-layer extraction.
- `pdf-lib` flattened PDF generation.
- Opt-in local OCR with Tesseract.js for PDF/image pages, clearly marked experimental.
- Canvas-based redaction for PDFs and images.
- Deterministic regex and heuristic detectors with Vitest coverage.
- Playwright upload smoke test using synthetic fixtures.
- Netlify static deployment configuration with restrictive security headers.

## Responsible Privacy Design

RedactReady Local is intentionally positioned as an assistive privacy review workflow. It does not provide legal, medical, regulatory, security, or compliance advice. It does not guarantee complete detection or complete redaction.

The product uses limitation-first copy, raw-value-free reporting, synthetic demo fixtures, local-first processing boundaries, and visible reminders about OCR, metadata, filenames, hidden text, and surrounding context.

## Human-in-the-Loop Design

- Findings are labeled as possible, not certain.
- Export is blocked until the adaptive checklist is acknowledged.
- OCR and PDF placement are marked as approximate when relevant.
- Users can manually adjust boxes and add manual redactions for missed visual content.
- The app repeatedly instructs users to open and inspect the downloaded output before sharing.

## Hardening Sprint Improvements

- Opt-in local OCR with status UI and same-origin OCR assets.
- OCR limitation copy and OCR-derived finding review states.
- Adaptive export checklist for PDF, image, TXT, CSV, and unknown file types.
- Barcode/QR fallback warning when browser support is unavailable.
- Metadata handling notes in workflow UI and reports.
- Approximate PDF/OCR placement badges.
- Large-file warning.
- Synthetic public samples and one-click sample UI.
- Post-export success summary with OCR and metadata status.
- Expanded documentation, verification, and manual QA guidance.

## Limitations

Human review is required for OCR text, scans, screenshots, signatures, faces, barcodes, QR codes, metadata, filenames, comments, annotations, embedded objects, and surrounding context.

Not currently implemented:

- Guaranteed OCR coverage.
- Face detection.
- Signature detection.
- Batch processing.
- Compliance certification.
- Guaranteed redaction.

## Future Roadmap

- OCR quality controls and confidence triage.
- Richer visual detectors with clear browser support boundaries.
- Stronger metadata inspection and export validation.
- Batch workflow support.
- More cross-browser QA evidence and sample fixtures.

## Target Roles This Demonstrates

- Frontend product engineer.
- Privacy-product engineer.
- Technical documentation owner.
- QA/release engineer.
- Trust-and-safety UX engineer.
- Product-minded full-stack engineer.
