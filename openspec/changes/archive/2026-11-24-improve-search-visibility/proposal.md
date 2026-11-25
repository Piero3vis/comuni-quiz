## Why

The quiz is live but hard to find on Google. The page has a title and `lang="it"`, but no description, no canonical address, no preview tags and almost no readable text: the map is a canvas, so search engines see little more than the heading and the footer. Links shared on WhatsApp, Facebook or Telegram show a bare URL.

## What Changes

- **Title**: "Quiz dei comuni d’Italia: indovina tutti i 7.896 comuni sulla mappa".
- **Description** (`<meta name="description">`): one Italian sentence used as the search snippet.
- **Canonical address** `https://piero3vis.github.io/comuni-quiz/` and **Open Graph / Twitter tags** (title, description, URL, `it_IT`) for link previews.
- **Structured data**: a JSON-LD `WebApplication` block (game, Italian, free).
- **Favicon**: an inline SVG data URI (Italian flag, rounded), so the page stays a single file with no external resources.
- **Visible text**: a short "Il quiz dei comuni italiani" section above the footer, describing the game with the phrases people search for.
- Smoke test assertions for all of the above.

## Capabilities

### New Capabilities
- `search-visibility`: what the page exposes to search engines and link previews.

### Modified Capabilities
None. `openspec/specs/` is empty.

## Non-goals

- **Preview image (`og:image`)**: it must be a separate, crawlable image file, and only `dist/quiz.html` is published. Left for a later change.
- **Google Search Console verification, sitemap, robots.txt**: need the owner's account or files outside the single page. `robots.txt` cannot be set for a project site on `github.io` anyway.
- **Custom domain**: would reset saved progress for existing players (progress is tied to the page address).

## Impact

`index.html` (head and a new section), `style.css` (`.about`), `tests/smoke.js`, `CLAUDE.md`. No change to `app.js` or the data.
