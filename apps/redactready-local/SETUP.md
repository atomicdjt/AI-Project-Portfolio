# RedactReady Local Setup Guide

## Requirements

- Node.js (v18+)
- npm or pnpm
- Modern web browser (Chrome, Edge, Firefox, Safari)

## Install

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Test

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## End-to-End Smoke Test

```bash
npm run e2e
```

The Playwright smoke test starts the Vite development server and uploads the synthetic text fixture from `samples/`.

## Environment Variables

No environment variables are required to run the core app locally.

## Local-First Notes

RedactReady Local is designed to process document review workflows locally in the browser or local runtime. It does not intentionally send document contents to external servers. OCR worker, core, and English language assets are served from `public/ocr/` so the browser does not need a third-party OCR CDN. Review the implementation and deployment environment before using sensitive real-world files.

## Synthetic Samples

The local demo exposes sample buttons on the upload screen. The files live in `public/samples/`:

- `redactready-synthetic-contact.txt`
- `redactready-synthetic-invoice.csv`
- `redactready-synthetic-case-notes.txt`

They contain fake values only and should not be treated as real records.

## Safe Demo Usage

Use synthetic sample files first. Do not upload real sensitive documents to a public demo unless you have verified the deployment and privacy model.

## Known Limitations

- **OCR**: OCR is opt-in, experimental, local, and CPU-intensive. It may miss handwriting, low-contrast scans, rotated text, and poor images.
- **Metadata**: RedactReady Local attempts to avoid carrying obvious export metadata where supported, but manual verification is always required.
- **Browser limits**: Very large PDFs may exceed browser memory limits.
- **Verification**: Human verification is strictly required after every export.

## Troubleshooting

- **Build errors**: Ensure you're running a compatible version of Node.js.
- **PDF rendering issues**: Some complex vector PDFs may render differently when flattened to an image.
- **File upload issues**: Ensure files do not exceed the 50MB local-browser limit.
