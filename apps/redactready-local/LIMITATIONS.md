# Limitations of RedactReady Local

RedactReady Local is an **assistive privacy review tool**, not a guaranteed removal engine. Understanding its limitations is critical to safely reviewing files before sharing.

## Automated Detection Limitations

- **Suggestions, not guarantees**: The app uses regex and heuristics to suggest *possible* sensitive items (like "Possible SSN" or "Possible Email"). It will miss non-standard formats and context-specific sensitive data (e.g., a secret project name).
- **False positives**: It may flag harmless strings (like a public support phone number or a serial number) as sensitive. Human review is required to approve or reject every finding.
- **No medical or legal contextual awareness**: The tool does not understand HIPAA or legal definitions. It simply looks for string patterns.

## PDF and Image Limitations

- **OCR (Optical Character Recognition)**: If text is baked into an image (like a scanned document without a text layer), the current heuristic detectors will not see it. You must visually inspect the document and draw manual boxes.
- **Layout preservation**: PDFs exported from this tool are deliberately *flattened* into images to prevent hidden text layers from leaking. This means the resulting PDF is no longer text-searchable.
- **Metadata**: While flattening the PDF removes most original metadata, always manually verify the final exported file's properties and filename.

## Text and CSV Limitations

- **Structure breaking**: Replacing values in a strict CSV or JSON format might break the structural schema of the file if not careful.
- **Context leakage**: Redacting a name (e.g., "[REDACTED]") might still leave surrounding context that makes the person identifiable (e.g., "The CEO of Apple, [REDACTED]").

## Compliance Limitations

- **Not a compliance tool**: RedactReady Local does not certify compliance with HIPAA, FERPA, FOIA, GLBA, GDPR, or any other regulation.
- **No legal advice**: The application does not provide legal, regulatory, or privacy advice.

## Always Verify Manually

Redaction can fail if sensitive content remains in hidden text, OCR layers, metadata, comments, annotations, filenames, embedded objects, cached previews, or unreviewed attachments. **Always open and inspect the final exported file manually before sharing it.**
