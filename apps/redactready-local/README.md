# RedactReady Local

**Local-first privacy review before sharing documents externally.**

RedactReady Local helps users spot, review, redact, and verify potentially sensitive information before sharing files with AI tools, email, clients, vendors, or public platforms.

## Canonical Deployment

The canonical public demo is:

`https://ai-project-portfolio-redactready-lo.vercel.app/`

It is source-backed by `apps/redactready-local` in this repository and configured for Vercel. Older Netlify links and files under `release/redactready-local-release-candidate/` are legacy review artifacts and are not the current source of truth.

Use the included synthetic samples first. Do not upload real sensitive files to any public deployment unless its privacy model, runtime behavior, network activity, and export workflow have been independently reviewed for the intended use.

## Positioning

> Redact before you upload.

## Who It Is For

- Security and privacy teams
- Knowledge workers using AI tools
- HR and people operations
- Legal and litigation support
- Healthcare operations
- Education and research coordinators

## What It Helps Review

- Personally identifiable information
- Health-related content
- Financial identifiers
- Credentials and tokens
- HR and employee data
- Student identifiers
- Case details
- Confidential business information

## Implemented Workflow

- Local-first pre-share review
- Suggested sensitive-information findings
- Human approval, rejection, and manual redaction boxes
- Opt-in experimental OCR for PDF and image pages
- File-specific verification checklists
- Redacted file export and optional JSON report
- Risk reminders for metadata, OCR, hidden layers, filenames, and visual content

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
4. Optionally run experimental local OCR for PDF or image pages.
5. Complete the file-specific verification checklist.
6. Export a redacted copy and optional JSON report.
7. Open and manually inspect the exported file before sharing.

## OCR, Metadata, and Browser Support

- **OCR:** opt-in experimental local OCR for rendered PDF and image pages using same-origin Tesseract.js assets.
- **PDF metadata:** export creates a new image-backed PDF and sets basic RedactReady export metadata.
- **Image metadata:** image export redraws content through canvas as PNG.
- **QR and barcode detection:** depends on the browser `BarcodeDetector` API. The app warns when unavailable, and users must add manual boxes for missed visual content.

Users must still inspect final file properties, visible content, filenames, and exported text behavior.

## Local-First Privacy Model

RedactReady Local is designed to process review workflows in the browser. It does not intentionally send document contents to external servers. OCR runtime assets and English language data are served from the application's own `public/ocr/` assets.

A deployment should be checked for unexpected network requests, third-party asset loading, runtime errors, and export behavior before use with real information.

## Common Redaction Risks

- Visual-only black boxes
- OCR layers
- Metadata
- Comments and annotations
- Bookmarks
- Filenames
- Embedded objects
- Copy-paste leaks
- Unreviewed attachments

## Local Setup and Verification

See [SETUP.md](./SETUP.md) for installation details.

```bash
npm ci
npm run dev
npm run lint
npm run test
npm run build
npm run e2e
npm run preview
```

See [VERIFICATION.md](./VERIFICATION.md), [LIMITATIONS.md](./LIMITATIONS.md), and [MANUAL_QA_CHECKLIST.md](./MANUAL_QA_CHECKLIST.md) for claims auditing and browser review.

## Deploy to Vercel

Create a Vercel project from `atomicdjt/AI-Project-Portfolio` with:

```text
Project name: ai-project-portfolio-redactready-local
Root Directory: apps/redactready-local
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Production Branch: main
Node.js: 22
```

No server-side environment variables are required for the documented local-first workflow.

Use a preview deployment first and verify:

1. synthetic sample loading,
2. PDF, image, text, and CSV review,
3. finding confirmation and manual boxes,
4. experimental OCR behavior,
5. redacted file and JSON export,
6. direct-route refresh and static assets,
7. runtime network activity,
8. browser console and mobile layout,
9. manual inspection of every exported sample.

Promote only after Vercel reports `READY` and the complete manual QA checklist passes.

## Commercial Implementation Package

The application source is licensed under the MIT License. A paid RedactReady package must therefore be described accurately as a curated implementation and deployment kit, not as exclusive ownership of the existing source.

Generate a provenance-recorded package only from a clean Git working tree:

```bash
npm ci
npm run e2e
npm run package:commercial
```

The commercial packager runs lint, unit tests, and the production build; excludes generated folders, secrets, and private environment files; records the source commit and canonical demo; creates a per-file SHA-256 manifest; creates the Payhip archive; re-extracts it; and validates its contents.

See:

- [COMMERCIAL-PACKAGE.md](./COMMERCIAL-PACKAGE.md)
- [STORE-COPY.md](./STORE-COPY.md)
- [RELEASE-INTEGRITY.md](./RELEASE-INTEGRITY.md)
- [PAYHIP-PUBLISHING-CHECKLIST.md](./PAYHIP-PUBLISHING-CHECKLIST.md)

A generated or uploaded archive is not buyer-path verified until the file downloaded through Payhip matches the recorded SHA-256.

## Documentation

- [Feature Status](./FEATURE_STATUS.md)
- [Technical Architecture](./TECHNICAL_ARCHITECTURE.md)
- [Setup](./SETUP.md)
- [Verification](./VERIFICATION.md)
- [Limitations](./LIMITATIONS.md)
- [Manual QA Checklist](./MANUAL_QA_CHECKLIST.md)
- [Portfolio Case Study](./PORTFOLIO_CASE_STUDY.md)

## Product Judgment

The product deliberately avoids overclaiming. It does not claim legal or regulatory compliance. It is an assistive local-first review workflow with explicit human verification and export inspection.

## License

See [LICENSE](./LICENSE). The source is MIT-licensed; a commercial package may charge for curation, documentation, verification materials, delivery, and separately agreed services, but it does not make the existing source exclusive.
