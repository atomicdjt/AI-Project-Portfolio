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

## Environment Variables

No environment variables are required to run the core app locally.

## Local-First Notes

RedactReady Local is designed to process document review workflows locally in the browser or local runtime. It does not intentionally send document contents to external servers. Review the implementation and deployment environment before using sensitive real-world files.

## Safe Demo Usage

Use synthetic sample files first. Do not upload real sensitive documents to a public demo unless you have verified the deployment and privacy model.

## Known Limitations

- **OCR**: Text within flat images might not be detected if it's not present in the PDF text layer.
- **Metadata**: RedactReady Local removes many metadata artifacts by rendering to a new canvas, but manual verification is always required.
- **Browser limits**: Very large PDFs may exceed browser memory limits.
- **Verification**: Human verification is strictly required after every export.

## Troubleshooting

- **Build errors**: Ensure you're running a compatible version of Node.js.
- **PDF rendering issues**: Some complex vector PDFs may render differently when flattened to an image.
- **File upload issues**: Ensure files do not exceed the 50MB local-browser limit.
