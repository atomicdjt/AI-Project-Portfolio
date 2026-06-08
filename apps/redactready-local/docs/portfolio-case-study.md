# RedactReady Portfolio Case Study

## Product Summary

RedactReady is a local-first privacy-preserving document redaction engine for people who need to sanitize files before sharing them with AI tools, employers, vendors, agencies, clients, insurers, or the public.

The product focuses on a practical safety problem: drawing a black rectangle over a PDF is often not true redaction. RedactReady renders PDFs and images to canvas, applies redactions into pixels, and exports a flattened copy with a verification report.

## What This Demonstrates

- Product engineering judgment around privacy, safety, and user review.
- A production-oriented React and TypeScript architecture.
- PDF.js rendering and `pdf-lib` flattened export.
- Deterministic sensitive-data detectors with test coverage.
- Manual canvas redaction controls with move, resize, delete, zoom, and page navigation.
- A professional SaaS-style interface tuned for a dense document workflow.
- A testable local-first app with CI, Netlify config, and synthetic fixtures.

## Core Workflow

1. Upload a local PDF, PNG/JPG, TXT, or CSV file.
2. Run local detectors for emails, phones, SSNs, dates, financial IDs, case IDs, medical IDs, secrets, names, addresses, and custom terms.
3. Review every finding in a sidebar with category filters, confidence, approve/reject controls, and masked previews.
4. Draw manual redaction boxes for visual content such as signatures, faces, scanned text, or detector misses.
5. Export a redacted file and a JSON report that omits raw sensitive values.

## Architecture Highlights

```text
src/
  components/          Product UI surfaces and document workspace
  pages/               Landing, redaction workspace, privacy page
  state/               Zustand session store
  lib/detectors/       Regex, heuristic, custom, and browser visual detectors
  lib/files/           Local file type detection and loading
  lib/pdf/             PDF.js rendering and text-layer extraction
  lib/redaction/       Canvas export, flattened PDF generation, verification, reports
  tests/               Vitest detector, export, report, and verification tests
```

## Privacy Decisions

- Browser-only core processing.
- No server-side file upload.
- No file-content logs.
- Reports count categories but exclude sensitive raw values.
- PDF export intentionally sacrifices selectable text for safer flattened output.

## Engineering Tradeoffs

- OCR is intentionally excluded from V1 to keep the MVP performant and dependable.
- PDF text-to-geometry mapping is approximate because many PDF text layers are fragmented.
- Flattened PDFs are safer for redaction but lose selectable text and accessibility tags.
- Name and address detection use conservative heuristics and require human review.

## Validation

```bash
npm run lint
npm run test
npm run build
npm run e2e
```

Current test coverage includes detector behavior, text replacement export, verification logic, redaction report generation, and a Playwright upload smoke test.
