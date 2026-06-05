# OpenAI Integration Plan

OpsPilot currently uses a local deterministic drafting engine so the project is easy to run, review, and deploy without secrets. A production version can swap that engine for an OpenAI-backed service while preserving the existing frontend document schema.

## Recommended Production Shape

```text
React app
  -> POST /api/generate-document
      -> validates intake
      -> calls OpenAI model
      -> returns OpsDocument JSON
  -> database stores document, versions, gaps, and audit events
```

## API Contract

Input should match the existing `IntakeState` type:

- business
- role
- department
- documentType
- priority
- sourceNotes

Output should match the existing `OpsDocument` type:

- generated document body
- SOP steps
- training checklist
- knowledge base articles
- gap findings
- quality score
- risk level
- version entry

## Security Notes

- Never expose API keys in the browser.
- Keep model calls in a serverless function or backend API route.
- Validate and bound input length before sending to the model.
- Store audit logs for publish and version events.
- Keep organization data isolated by tenant.

## Prompting Notes

The model should be instructed to return strict JSON matching the app schema. The server should validate the response before saving or returning it to the client.
