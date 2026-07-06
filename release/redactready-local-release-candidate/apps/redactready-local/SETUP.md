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

The preview command runs a fresh build before starting Vite preview. Use the local URL shown in the terminal, usually `http://127.0.0.1:4173/`.

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
- **OCR does not start**: Confirm `public/ocr/worker.min.js`, `public/ocr/lang/eng.traineddata.gz`, and the Tesseract core assets are present in the deployed app.
- **OCR is slow**: Use smaller files or split large PDFs. OCR is CPU-intensive and runs in the browser.
- **Barcode warning appears**: This is expected in browsers without the `BarcodeDetector` API. Review QR codes and barcodes manually.
- **Preview port is busy**: Run `npm run preview -- --port 4174` or another open port.
