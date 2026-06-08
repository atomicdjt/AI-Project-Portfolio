# Security Policy

## Supported Version

This repository currently supports the latest `main` branch of RedactReady.

## Privacy and Security Model

RedactReady is designed as a local-first browser application. Core document processing runs in the client:

- No document upload API is included in the MVP.
- No analytics or telemetry are included.
- No raw document content is written to the redaction report.
- PDF and image exports apply approved redactions into pixels.
- TXT and CSV exports replace approved values with category labels.

## Reporting Issues

If you find a security or privacy issue, open a private report with the repository owner instead of posting sensitive examples publicly. Use synthetic fixtures whenever possible.

## Non-Goals

RedactReady does not claim legal, HIPAA, GDPR, FERPA, SOC 2, medical, or compliance certification. It helps reduce accidental disclosure, but users must review output before sharing.
