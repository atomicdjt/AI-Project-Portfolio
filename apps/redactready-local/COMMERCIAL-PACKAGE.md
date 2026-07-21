# RedactReady Local Commercial Package

## Offer Structure

RedactReady Local's existing application source is licensed under the MIT License. The accurate commercial offer is therefore a **curated implementation and deployment kit**, not exclusive ownership of the existing source.

A purchase can legitimately provide value through:

- a clean, versioned source snapshot;
- source-commit and release provenance;
- automated lint, unit-test, and production-build verification before packaging;
- buyer-oriented setup and deployment guidance;
- synthetic test files;
- manual QA and final-export inspection procedures;
- per-file and archive SHA-256 records;
- a ready-to-download package; and
- separately agreed implementation, customization, or support services.

## License Boundary

The included MIT License permits use, copying, modification, publication, distribution, sublicensing, and sale subject to its notice requirements.

The commercial listing and buyer documents must not claim that purchasing the kit:

- grants exclusive ownership of the current source;
- prevents lawful reuse or redistribution under MIT;
- creates restrictions that contradict the included MIT License;
- transfers a compliance certification or legal opinion; or
- guarantees detection, redaction, privacy, security, or metadata removal.

## Product Boundary

RedactReady Local is an assistive human-review workflow. It can help users identify possible sensitive information, approve or reject suggestions, add manual redaction boxes, export reviewed copies, and record a redaction workflow summary.

It does not replace professional judgment. It does not certify HIPAA, FERPA, FOIA, GLBA, GDPR, or any other legal or regulatory requirement. OCR, visual detection, metadata handling, and automated suggestions are incomplete and browser-dependent.

## Canonical Source and Demo

- Source: `apps/redactready-local`
- Authoritative branch: `main`
- Canonical demo: `https://ai-project-portfolio-redactready-lo.vercel.app/`
- Current version: read from `package.json`

Older Netlify links and files under `release/redactready-local-release-candidate/` are legacy artifacts and must not be used as the current product or download source.

## Package Command

From `apps/redactready-local` in a clean checkout:

```bash
npm ci
npm run e2e
npm run package:commercial
```

The packaging command runs lint, unit tests, and a production build before producing the Payhip archive. End-to-end results should be recorded separately because Playwright browser installation is environment-dependent.
