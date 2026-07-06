# RedactReady Local Portfolio Case Study

## Summary

RedactReady Local is a local-first assistive privacy review tool for reviewing files before they are shared with AI tools, email recipients, vendors, clients, or public platforms.

The product focuses on a practical risk: visual cover-ups are often mistaken for complete removal. RedactReady Local guides users through detection, human review, manual redaction, export, and verification reminders without claiming compliance or guaranteed removal.

## Problem

Professionals frequently share PDFs, screenshots, forms, logs, HR files, research notes, and CSV exports outside their original system of record. Those files can contain personal identifiers, financial details, case references, credentials, health-related identifiers, student information, or confidential business context.

## Product Response

The app provides a browser-based workflow:

1. Load a supported local file.
2. Review possible sensitive-data findings.
3. Approve, reject, filter, or add custom terms.
4. Draw manual redaction boxes for visual or missed content.
5. Acknowledge export limitations.
6. Export a redacted copy and a raw-value-free JSON report.
7. Manually inspect the output before sharing.

## Engineering Highlights

- Vite, React, TypeScript, Tailwind, and Zustand.
- PDF.js rendering with text-layer extraction.
- `pdf-lib` flattened PDF generation.
- Opt-in local OCR with Tesseract.js for PDF/image pages, clearly marked experimental.
- Canvas-based redaction for PDFs and images.
- Deterministic regex and heuristic detectors with Vitest coverage.
- Playwright upload smoke test using synthetic fixtures.
- Netlify static deployment configuration with restrictive security headers.
- Explicit limitations language for compliance, OCR, metadata, and hidden layers.

## Safety and Product Judgment

RedactReady Local is intentionally positioned as an assistive privacy review workflow. It does not provide legal, medical, regulatory, security, or compliance advice. It does not guarantee complete detection or complete redaction.

That restraint is part of the product quality. The app makes uncertainty visible, requires export acknowledgement, and keeps human review in the loop.

## Current Feature Boundaries

Available in this demo:

- PDF, PNG, JPG, JPEG, TXT, and CSV loading.
- Suggested findings for common text patterns.
- Experimental OCR-derived findings for PDFs/images.
- Manual redaction boxes for visual content.
- Flattened PDF export, redacted PNG export, and redacted text/CSV export.
- JSON report export without raw sensitive values.

Human review required:

- OCR text, scans, screenshots, signatures, faces, barcodes, QR codes, metadata, filenames, comments, annotations, embedded objects, and surrounding context.

Not currently implemented:

- Guaranteed OCR coverage.
- Face detection.
- Signature detection.
- Batch processing.
- Compliance certification.
- Guaranteed redaction.

## Portfolio Value

This project demonstrates privacy-aware UX, credible regulated-domain copy, local-first architecture thinking, static deployment readiness, typed frontend engineering, deterministic testing, and a release process that treats claims safety as part of quality.
