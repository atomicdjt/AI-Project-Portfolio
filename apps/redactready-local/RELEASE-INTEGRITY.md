# RedactReady Local Release Integrity

A storefront upload date, filename, or file size does not establish that the buyer receives the current application. A commercial package must be traceable to one clean source commit and verified after it passes through the buyer delivery path.

## Authoritative Source

- Repository: `atomicdjt/AI-Project-Portfolio`
- Source path: `apps/redactready-local`
- Authoritative branch: `main`
- Version source: `apps/redactready-local/package.json`
- Canonical demo: `https://ai-project-portfolio-redactready-lo.vercel.app/`

Older Netlify deployments and `release/redactready-local-release-candidate/` are legacy artifacts.

## Release Procedure

From `apps/redactready-local` in a clean checkout:

```bash
npm ci
npm run e2e
npm run package:commercial
```

The package command refuses to run from a dirty Git working tree and then:

1. runs lint;
2. runs unit tests;
3. runs the production build;
4. copies the application while excluding build output, dependencies, private environment files, logs, and test artifacts;
5. scans text files for common high-confidence secret formats;
6. adds buyer-oriented package and license-boundary documents;
7. records the source commit, branch, tag, version, generation time, and canonical demo in `RELEASE.json`;
8. writes per-file SHA-256 values to `FILES-SHA256.txt`;
9. creates the Payhip ZIP;
10. extracts the ZIP into a temporary directory; and
11. validates required files, release metadata, and per-file hashes.

## Generated Evidence

The release folder contains:

- `unzipped-review-copy/RedactReady-Local-Implementation-Kit-v<version>/`
- `upload-to-payhip/RedactReady-Local-Implementation-Kit-v<version>-Payhip.zip`
- `CHECKSUMS.txt`
- `RELEASE-INTEGRITY.json`

The buyer package contains:

- `START-HERE.md`
- `COMMERCIAL-PACKAGE.md`
- `README.md`
- `LICENSE`
- `RELEASE.json`
- `FILES-SHA256.txt`
- `source/`
- `synthetic-samples/` when sample files are present

## Buyer-Path Verification

After uploading the exact generated ZIP to Payhip:

1. Complete a controlled seller test or test purchase.
2. Download the file through the actual buyer delivery page.
3. Compute the downloaded archive's SHA-256.
4. Compare it with `CHECKSUMS.txt`.
5. Extract it and verify `RELEASE.json`, `FILES-SHA256.txt`, and `source/package.json`.
6. Preserve the result with the release record.

Do not call the Payhip upload current, demo-aligned, or buyer-path verified until these checks pass.

## Demo Alignment

A package is demo-aligned only when the canonical deployment and buyer package are traceable to the same source commit, or when all intervening changes have been deliberately reviewed and recorded.

## Claims Vocabulary

- **Generated:** package creation completed.
- **Automatically validated:** lint, tests, build, secret scan, extraction, required-file checks, and checksum verification passed as recorded.
- **E2E-verified:** a recorded Playwright run passed in the release environment.
- **Uploaded:** the archive was placed in Payhip.
- **Buyer-path verified:** the Payhip-delivered file matched the recorded archive SHA-256.
- **Demo-aligned:** deployment and package source revisions were reconciled.

These states are not interchangeable.
