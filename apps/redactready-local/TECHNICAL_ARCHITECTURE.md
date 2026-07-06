# RedactReady Local Technical Architecture

## Application Model

RedactReady Local is a Vite, React, TypeScript, and Tailwind app. It runs as a static browser application and keeps the review workflow in client-side memory during the session.

Core scripts:

```bash
npm run dev
npm run lint
npm run test
npm run build
npm run e2e
npm run preview
```

## Source Layout

```text
src/
  components/      Header, upload, workspace, detection, preview, export UI
  pages/           Landing, redact workspace, privacy/limitations page
  state/           Zustand session store and workflow actions
  lib/files/       Local file detection and loading
  lib/pdf/         PDF.js rendering and text geometry mapping
  lib/detectors/   Regex, heuristic, custom, and browser visual detectors
  lib/redaction/   Canvas redaction, PDF/image/text export, verification, reports
  tests/           Vitest coverage for detectors and export/report behavior
```

## Data Flow

1. The user selects a PDF, PNG, JPG, JPEG, TXT, or CSV file.
2. `loadLocalDocument` validates the file type and 50MB local-browser limit.
3. PDFs are rendered to page canvases and text-layer items. Images are drawn to canvas. TXT and CSV files are read as text.
4. Text detectors suggest possible sensitive findings. PDF text findings are mapped to approximate visual boxes when geometry is available.
5. Browser barcode detection runs only when the `BarcodeDetector` API exists.
6. The user approves, rejects, filters, or adds findings and can draw manual redaction boxes.
7. Export creates a redacted copy and updates verification status.
8. Report export writes a JSON summary that excludes raw sensitive values.

## Privacy Boundary

The app does not intentionally send document contents to a backend. The Netlify configuration publishes static assets and sets `connect-src 'none'` for the demo. Users should still verify the deployment environment before using sensitive real-world files.

Session data is held in browser memory. Exported files and downloaded reports are user-controlled artifacts outside the app session.

## Export Behavior

- PDF: page images are rasterized, approved boxes are painted into pixels, and a new image-backed PDF is generated with `pdf-lib`.
- Image: approved boxes are painted into a PNG export.
- TXT/CSV: approved matched ranges are replaced with category redaction tokens.
- Report: JSON includes counts, categories, verification status, and warnings, but not raw matched sensitive values.

## Known Technical Boundaries

- OCR is not implemented.
- Face and signature detection are not implemented.
- Barcode and QR detection depends on browser support.
- PDF text-to-geometry mapping is approximate.
- Flattened PDF output is not text-searchable and may lose accessibility semantics.
- CSV replacement can affect downstream parsing when rows contain formulas, strict quoting, or schema-specific expectations.
- Very large or complex files can exceed browser memory even under the 50MB guardrail.

## Deployment Notes

The app is Netlify-ready as a static Vite project:

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`
- SPA fallback: `/* -> /index.html`
- Security headers and `connect-src 'none'` are defined in `netlify.toml`.

