# RedactReady Local Payhip Publishing Checklist

This checklist covers seller-controlled product details. Generic text emitted by Payhip's renderer, logged-in library state, search parsers, or third-party crawlers is not a RedactReady source-code defect.

## Canonical Identity

- Recommended title: `RedactReady Local — Local-First Privacy Review Implementation Kit`
- Source version: read from `package.json`
- Canonical demo: `https://ai-project-portfolio-redactready-lo.vercel.app/`
- Download filename and SHA-256: read from `RELEASE-INTEGRITY.json`
- Source license: MIT

Do not use the old Netlify demo or an archive under `release/redactready-local-release-candidate/` as the current product.

## Description Review

Confirm the seller-authored listing:

- describes the product as a downloadable implementation kit, not managed SaaS;
- states that the application source is MIT-licensed;
- does not promise exclusive ownership of the existing source;
- lists only implemented file types and workflows;
- describes OCR as experimental and opt-in;
- describes QR/barcode support as browser-dependent;
- requires manual review of source and exported files;
- avoids claims of complete detection, complete redaction, compliance, legal adequacy, security guarantees, or complete metadata removal;
- tells users to test the public demo with synthetic files; and
- distinguishes included package materials from custom implementation or support.

Use `STORE-COPY.md` as the canonical seller-authored description.

## Download Replacement

1. Check out the intended release commit.
2. Confirm `git status --porcelain` is empty.
3. From `apps/redactready-local`, run:

```bash
npm ci
npm run e2e
npm run package:commercial
```

4. Upload the exact ZIP recorded in `RELEASE-INTEGRITY.json`.
5. Do not rename, edit, or recompress it after hashing.
6. Record the source commit, version, archive filename, size, and SHA-256.
7. Complete a controlled seller test or test purchase.
8. Download the file through Payhip and verify its SHA-256 against `CHECKSUMS.txt`.

## Logged-Out Visual Review

Review the listing in a private browser window at desktop and mobile widths:

- Product title and approved price display correctly.
- Images are current, sharp, and depict the canonical application.
- The demo link opens the canonical Vercel deployment.
- The description contains no legacy Netlify URL, stale version, unsupported feature, placeholder contact information, or contradictory license statement.
- The downloadable filename matches the current release.
- The contact, support, and refund policy match the seller's deliberately approved policy.

## Outreach Alignment

Before sending new outreach, confirm every template uses the canonical Vercel demo and current Payhip listing. Previously sent messages containing the legacy Netlify URL cannot be changed; future templates must not repeat it.
