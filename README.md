# Tulay sa Pag-Asenso (3 in 1 V2.0)

Website for Tulay sa Pag-Asenso 3 in 1 V2.0 of Bayan ng Magsaysay, Davao del Sur: "Bringing employment opportunities closer to the people." Intended domain: tulaysapag-asenso.adfirm.net. Lists programs grouped by office: Tech4ED services (from the center's flyer), PESO programs with their focal persons, and MPTVI (Maximino Pellerin Sr. Technical and Vocational Institute) training programs with their contact details. Keeps the official PESO Facebook news feed and the original developer credit.

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
- Latest posts from the official Facebook page via Facebook's Page Plugin embed (loads content and cookies from facebook.com), with a fallback link.
- "Ask a question" chat helper with scripted, keyword-matched replies (English and common Tagalog words). It says it is automated, answers only from the program directory and FAQ, and hands off to the official Facebook page. Edit replies in `public/chat.js`.
- No invented news, application submissions, login, or eligibility decisions.

## Deployment later

The `public` directory is a static website suitable for any static host. No secrets, database, or build step is required. The included server is for local preview only. Google Fonts is optional; system fallbacks work offline. Review program names, focal persons, branding permissions, and current contact destinations with PESO before publishing. The Facebook embed is third-party content subject to Facebook's privacy policy; if posts don't appear for a visitor (blocked cookies or trackers), the fallback link opens the page. Application processing and a managed news backend are not implemented.
