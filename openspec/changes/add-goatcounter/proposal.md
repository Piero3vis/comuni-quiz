## Why

The author wants to know how many people play and where they come from, without giving up the promises that matter: no cookies, no personal data, no slower page. GoatCounter is free for non-commercial sites, open source, sets no cookies and stores no personal data, so no consent banner is needed.

## What Changes

- One tag at the end of `index.html`, after `app.js`: `<script data-goatcounter="https://dio-castoro.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>`. `build_single_file.py` copies it unchanged into `dist/quiz.html`. Written with `https:` so the downloaded single file does not look for it on `file://`.
- One count per page view (path, referrer, country, browser, screen size). No events: guesses, progress and achievements are never sent.
- Privacy texts: footer "Nessun cookie. Le visite sono contate in forma anonima con GoatCounter; …"; README "Privacy" says what is counted; README support section drops "non traccia nessuno"; DEVELOPMENT.md and CLAUDE.md replace "no analytics, nothing is sent".
- Tests: exactly one external script (`https://gc.zgo.at/count.js`, `async`, code `dio-castoro`), no stylesheet or iframe, `document.cookie` empty; the jsdom tests never contact GoatCounter (the request is answered locally with an empty script).

## Non-goals

- Events (game started, achievement unlocked): possible later with `goatcounter.count()`, not now.
- Any other tracker, cookie or consent banner.

## Capabilities

### New Capabilities
- `visit-count`: anonymous, cookieless visit counter that does not affect performance.

### Modified Capabilities
- `support-link`: "no request when the page is loaded" now allows the visit count.

## Impact

`index.html`, `README.md`, `DEVELOPMENT.md`, `CLAUDE.md`, `tests/smoke.js`. On goatcounter.com: ignore your own visits in the site settings.
