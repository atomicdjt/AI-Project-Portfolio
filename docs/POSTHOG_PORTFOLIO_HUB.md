# Portfolio Hub PostHog instrumentation

Portfolio Hub sends a deliberately small set of behavioral events only when both of these Vercel environment variables are configured for the deployed application:

- `VITE_POSTHOG_KEY` — the browser ingestion project key.
- `VITE_POSTHOG_HOST` — the HTTPS PostHog ingestion host, for example `https://us.i.posthog.com`.

Missing or invalid configuration disables analytics without affecting rendering, navigation, or links. Do not place a personal API key in either value.

## Pageview strategy

Portfolio Hub uses normal document navigation, not a client-side router. The application disables PostHog automatic page and page-leave capture, then explicitly sends one `$pageview` per document load. This avoids duplicate events and does not install a SPA history listener.

## Events and privacy

Implemented events are `$pageview`, `project_viewed`, `demo_started`, `github_clicked`, and `cta_clicked`. `contact_clicked` is intentionally absent because Portfolio Hub has no present contact interaction.

Events may include the path, a referrer origin, allowlisted UTM values, and action-specific project/CTA metadata. They never intentionally include query strings, names, email addresses, session replay data, automatic interaction capture, person profiles, or persistent browser analytics storage.

Production ingestion must still be verified in PostHog against the deployed Portfolio Hub before Issue #115 is closed.
