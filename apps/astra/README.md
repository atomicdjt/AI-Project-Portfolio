# Astra

Astra is a local AI chat workspace backed by the Google Gemini API. It demonstrates a practical AI application pattern: React frontend, Express API layer, streaming response workflow, Markdown rendering, model configuration, transcript export, and clear handling of missing API credentials.

## Project Type

**Runnable MVP**

## Problem

Many AI chat demos are thin wrappers around an API call. Astra is designed as a more complete workspace: it gives the user a polished chat interface, persistent-feeling session flow, configuration visibility, and practical export behavior.

## Solution

Astra separates the user interface from the model/API layer. The React app handles the chat workspace and settings experience, while the Express server handles API configuration and model requests.

## Key Features

- React chat workspace
- Express API layer
- Google Gemini configuration
- Markdown response rendering
- Transcript export
- Settings/configuration panel
- Clear API-key status handling
- Local development workflow

## Tech Stack

- React
- TypeScript
- Vite
- Express
- Google Gemini API
- React Markdown
- remark-gfm
- Zod
- dotenv

## Architecture

```text
apps/astra/
  server/              Express API and model request handling
  src/                 React application source
  package.json         App scripts and dependencies
  .env.local.example   API-key configuration example
```

The frontend should remain focused on interaction and presentation. The backend should own model-provider configuration, request validation, streaming behavior, and API-related errors.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5174/
```

The Express API runs on:

```text
http://127.0.0.1:3002/
```

## Configure Gemini

Copy `.env.local.example` to `.env.local` and set:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Restart the dev server after changing `.env.local`.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Known Limitations

- Requires a Gemini API key for live model responses.
- Does not yet include long-term conversation storage.
- Does not yet include retrieval over uploaded files or notes.
- Provider support is currently focused on Gemini rather than multiple model vendors.

## Roadmap

1. Add saved conversation history.
2. Add provider abstraction for multiple model APIs.
3. Add retrieval over uploaded Markdown/text documents.
4. Add structured prompt templates.
5. Add stronger loading, retry, and error states.
6. Add tests for API validation and core chat behavior.

## Portfolio Value

Astra shows practical AI-app implementation: API configuration, frontend interaction design, local development setup, and a realistic path toward a more advanced AI workspace.
