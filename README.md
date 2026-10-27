# PESO Magsaysay — local rebuild

A responsive rebuild of the provided Bubble PESO directory. Preserves all nine programs, their focal persons, the mission and vision, the official Facebook news destination, and original developer credit.

## Run locally

Requires Node.js 20 or newer. No dependencies or installation required.

```sh
npm run dev
```

Open http://127.0.0.1:4173. Run `npm run check` for JavaScript syntax checks.

## Features

- Responsive layout and accessible program detail dialogs.
- Search by program, service name, or focal person; category filters and empty-state reset.
- Official Facebook links for news and inquiries; the PEIS focal person's verified reference link is preserved.
- Other focal persons use the official PESO contact page because individual URLs were not verified.
- No invented news, application submissions, login, or eligibility decisions.

## Deployment later

The `public` directory is a static website suitable for any static host. No secrets, database, or build step is required. The included server is for local preview only. Google Fonts is optional; system fallbacks work offline. Review program names, focal persons, branding permissions, and current contact destinations with PESO before publishing. News opens the official Facebook page instead of embedding a third-party tracking feed. Application processing and a managed news backend are not implemented.
