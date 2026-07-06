# RedactReady Local Verification Guide

This guide documents the release checks for RedactReady Local. Results must be refreshed before a public handoff because dependency, browser, and branch state can change.

## 1. Required Commands

Run from `apps/redactready-local`:

```bash
npm install
npm run lint
npm run test
npm run build
```

Recommended browser smoke checks:

```bash
npm run e2e
npm run preview
```

`npm run preview` rebuilds before starting Vite preview.

## 2. Route Verification

- **Homepage**: Loads with "Redact before you upload" positioning.
- **App/demo**: Loads with the correct demo banner and Start Here walkthrough.
- **Documentation**: About page has been fully repurposed into the Privacy and Limitations model view.
- **Navigation links**: All top navigation items route successfully without breaking the application state.

## 3. UI Workflow Verification

- **Demo banner**: Present at the top of the Redact Workspace.
- **Sample document onboarding**: The empty state presents a 6-step demo walkthrough and one-click synthetic sample buttons.
- **Findings panel**: Labels use safe language (e.g., "Possible Email"). Approximate PDF/OCR positions show review badges.
- **OCR control**: PDF/image workspaces expose an opt-in experimental local OCR button with running/completed/failed/unsupported status copy.
- **Browser capability warning**: QR/barcode warning appears when `BarcodeDetector` is unavailable.
- **Verification checklist**: Appears prominently in the Export panel, adapts by file type, and must be acknowledged before file export is enabled.
- **Export warning**: Explicit text warns users not to share the exported file until they have manually reviewed it.

## 4. Copy and Claims Audit

The app may mention regulated domains only to explain limitations or target review workflows. It must not claim:

- HIPAA compliance / HIPAA-compliant
- FERPA compliance / FERPA-compliant
- FOIA compliance / FOIA-compliant
- GDPR compliance / GDPR-compliant
- Legally compliant output
- Guaranteed security
- Guaranteed redaction
- Fully automatic sensitive-data removal
- Complete detection of all sensitive information

## 5. Local-First Claims Audit

The app copy accurately represents its architecture:
- Explicit disclaimer: "RedactReady Local is designed to process document review workflows locally in the browser or local runtime. RedactReady Local does not intentionally send document contents to external servers."
- Does not claim 100% security or use words like "zero risk."
 - Deployment CSP sets `connect-src 'self'` so OCR assets can load from the same deployed origin without allowing external document uploads.

## 6. Redaction Risk Education Audit

Risk education is deeply embedded in the UI:
- **Landing Page**: Contains a "Redaction is more than black boxes" section outlining OCR, metadata, annotations, filenames, and copied text risks.
- **Export Panel**: File-type-aware checklist forces users to verify relevant hidden risks manually.
- **Limitations**: Included directly on the Privacy workflow page (`/about`) and `LIMITATIONS.md`.

## 7. Release Notes

- Reports intentionally exclude raw sensitive values.
- Reports include OCR status and metadata handling notes.
- PDF export flattens pages into a new image-backed PDF, which reduces text-layer leakage but removes selectable text and accessibility tags.
- Text and CSV export replace approved matched ranges with redaction tokens; reviewers must still inspect context and formatting.
- OCR is opt-in and experimental; faces, signatures, missed OCR text, and unavailable barcode/QR detection require manual review boxes.
- PDF export attempts to avoid carrying obvious source metadata by creating a new PDF and setting basic metadata fields, but users must still inspect output properties.
