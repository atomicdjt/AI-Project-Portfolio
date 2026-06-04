# Astra

Astra is a local AI chat application backed by the Google Gemini API.

## Run

```bash
npm install
npm run dev
```

Open:

```text
http://127.0.0.1:5174/
```

The Express API runs on `http://127.0.0.1:3002/`.

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
