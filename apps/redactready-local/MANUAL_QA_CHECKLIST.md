# RedactReady Local Manual QA Checklist

Use synthetic fixtures from `samples/` first. Do not use real sensitive documents in a public demo unless the deployment and privacy model have been independently verified.

## Browser Setup

- Run `npm install`.
- Run `npm run build`.
- Run `npm run preview`.
- Open the Vite preview URL shown in the terminal.
- Check desktop and mobile viewport widths.

## Required Checks

1. Landing page review
   - Confirms "Redact before you upload." is visible.
   - Confirms the copy says the tool assists review and does not guarantee detection, redaction, legal compliance, or security.
   - Confirms primary CTA opens `/redact` and secondary CTA opens `/about`.

2. Mobile layout check
   - Header, navigation, hero copy, preview panel, use-case cards, and CTA areas do not overlap.
   - Buttons remain tappable and text remains readable.

3. Redact page empty state
   - `/redact` loads without a file.
   - File chooser is visible.
   - Supported file extensions and 50MB local limit are visible.

4. Demo banner
   - Demo banner appears above the workspace.
   - Banner reminds users to manually verify real documents before sharing.

5. Start Here walkthrough
   - Empty state shows six steps.
   - The steps mention loading, reviewing, manual redaction, hidden-risk reminders, export, and verification.

6. File upload
   - Upload `samples/sample-sensitive.txt`.
   - Load each one-click synthetic sample from the upload screen.
   - App transitions from loading to ready.
   - Unsupported file types show an error.
   - Files over 50MB are rejected.

7. Detection labels
   - Findings use "Possible [Type]" style language.
   - Confidence labels are visible.
   - Value previews are masked where appropriate.

8. Detection sidebar no-findings state
   - Upload or create a file with no obvious sensitive values.
   - Sidebar states that no obvious findings does not mean the document is safe to share.

9. Manual redaction flow
   - Upload an image or PDF.
   - Enable Manual box.
   - Draw, move, resize, and double-click delete a box.
   - Confirm the selected manual category is applied.

10. Export verification checklist
   - Export file button is disabled before checklist acknowledgement.
   - Checklist wording changes for PDF, image, TXT, and CSV.
   - Check all acknowledgement boxes.
   - Export file button becomes enabled.
   - Warning still tells the user to manually open and inspect the export.

11. Export behavior
   - TXT export replaces approved findings with redaction tokens.
   - CSV export preserves a CSV-like file while replacing approved values.
   - Image export downloads a PNG with approved boxes painted into pixels.
   - PDF export downloads a flattened PDF with approved boxes painted into the page image.

12. Verification/report output
   - Exporting a file updates the verification card.
   - Export redaction log downloads JSON.
   - JSON report excludes raw sensitive values and includes categories, counts, OCR status, metadata handling, verification status, and warnings.

13. OCR and browser capability notices
   - Run OCR on a PDF or image and confirm experimental OCR status/progress appears.
   - Confirm OCR findings are marked as experimental and require manual verification.
   - In a browser without `BarcodeDetector`, confirm the QR/barcode warning appears.

14. About/privacy limitations page
   - `/about` loads.
   - Page explains local processing, flattened export strategy, assistive workflow, known limitations, and required safety disclaimer.

15. Documentation links
   - README links point to setup, limitations, verification, feature status, technical architecture, manual QA, and portfolio case study docs.

16. Broken route check
   - Navigate to an unknown path.
   - App falls back to the landing page instead of crashing.
   - Browser back/forward navigation keeps the correct route state.

## Release Blockers

- Any claim of guaranteed detection or complete redaction.
- Any claim of HIPAA, FERPA, FOIA, GDPR, legal, medical, security, or compliance certification.
- Export file enabled before checklist acknowledgement.
- Raw sensitive values included in the JSON report.
- Broken build, lint, tests, or e2e smoke test.
