# RedactReady Local

## Overview

RedactReady is a local-first privacy-preserving document redaction engine for PDFs, images, TXT files, and CSV files. It helps users detect sensitive identifiers, review each finding, draw manual redaction boxes, export a safer flattened file, and generate a redaction report that does not expose raw sensitive values.

The project is designed around a concrete privacy problem: many redaction workflows only hide visible content while leaving searchable PDF text, metadata, or pixels recoverable. RedactReady prioritizes true redaction and human review over fully automated claims.

## Portfolio Value

RedactReady is one of the strongest runnable projects in this portfolio because it combines product design, frontend engineering, document processing, privacy modeling, and testable safety logic.

It demonstrates:

- Local-first privacy architecture.
- React, TypeScript, Vite, Zustand, PDF.js, `pdf-lib`, and Canvas APIs.
- Deterministic sensitive-data detection with tests.
- Manual canvas editing interactions for redaction boxes.
- Flattened PDF/image export instead of cosmetic overlays.
- Verification and reporting workflows.
- Clear limitations and responsible-use framing.

## User Workflow

1. Import a PDF, PNG/JPG, TXT, or CSV file.
2. Run local detectors for structured sensitive data.
3. Review detections by category, confidence, source, and masked preview.
4. Approve or reject findings.
5. Add custom search terms for user-specific names, companies, or IDs.
6. Draw manual boxes for visual content such as signatures, faces, scanned text, or missed items.
7. Export a redacted file and a JSON report.

## Technical Architecture

```text
apps/redactready-local/
  src/components/        Upload, toolbar, canvas, review sidebar, export panel
  src/pages/             Landing, workspace, privacy/limitations page
  src/state/             Zustand redaction session store
  src/lib/detectors/     Regex, heuristic, custom, and browser visual detectors
  src/lib/files/         Local file loaders
  src/lib/pdf/           PDF.js rendering and text-layer extraction
  src/lib/redaction/     Canvas redaction, flattened PDF export, verification, reports
  src/tests/             Vitest unit coverage
  e2e/                   Playwright upload smoke test
  samples/               Synthetic fixtures
```

## Safety and Privacy Decisions

- No backend upload route is included.
- No telemetry or analytics are included.
- Reports intentionally omit raw sensitive values.
- PDF exports are image-backed flattened PDFs.
- Image exports overwrite pixels.
- Text and CSV exports replace values with category labels such as `[REDACTED_EMAIL]`.
- The UI avoids legal/compliance guarantees and requires human review.

## Detection Coverage

Implemented detector modules cover:

- Email addresses
- Phone numbers
- SSN-like identifiers
- Dates and date-of-birth-like values
- Payment-card-like values with Luhn validation
- Routing/account/policy/member-like values
- Case, claim, order, invoice, and reference IDs
- Employee, client, student, patient, and medical identifiers
- Secret/API-token-like values and private URLs
- Address-like and name-like values where feasible
- Custom user-entered terms
- Browser-native QR/barcode detection when available

## Screenshots

![RedactReady landing page](../../docs/images/redactready-landing.png)

![RedactReady review workspace](../../docs/images/redactready-review-workspace.png)

## Validation

Validation commands used:

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

Coverage includes detector behavior, text replacement export, verification logic, report generation, and a Playwright upload smoke test.

## Known Limitations

- OCR is not enabled in V1.
- Face/signature detection is roadmap scope.
- PDF text-to-visual-box mapping is approximate.
- Flattened PDFs lose selectable text and accessibility tags.
- DOCX/XLSX layout-preserving redaction is not implemented.

## Why This Matters to Employers

RedactReady shows the ability to build a credible tool around a real risk, scope hard problems honestly, design for nontechnical users, and package the result with tests, documentation, screenshots, and deployment-ready configuration.
