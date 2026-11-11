## Why

The quiz is free, ad-free and tracker-free, and it keeps costing time to maintain (data updates, new achievements, hosting checks). The author would like a very simple, optional way for players to say thanks, "offrimi un caffè" style, without changing the character of the game. Finishing all 7,896 comuni is practically out of reach, so an end-of-game screen is not a useful place for it: the link has to live in places that are always there but never get in the way, the footer and the side panel.

The page promises "Nessun cookie, nessuna pubblicità, nessuna statistica" and the project rule is "no cookies, analytics or external resources". So this must be a plain outbound link, not an embedded Ko-fi button or widget (those load third-party scripts or iframes).

## What Changes

- **Footer:** a new line after the privacy note: "Il quiz è gratuito e senza pubblicità. Se ti diverte, puoi ☕ offrirmi un caffè (si apre Ko-fi, un sito esterno)." The link goes to the author's Ko-fi page.
- **Side panel:** one small muted line at the bottom of the panel, visible on both tabs: "☕ Ti piace il quiz? Offrimi un caffè". Its address is copied from the footer link, so the URL lives in one place.
- **Plain link only:** `<a target="_blank" rel="noopener noreferrer">`; no Ko-fi script, iframe, image or stylesheet; still no cookies.
- **Never intrusive:** no toast, popup, overlay or banner, nothing triggered by game events, nothing locked behind a donation.
- **Repository:** `.github/FUNDING.yml` (shows a Sponsor button on GitHub) and a short "Sostieni il progetto" section in the README.
- **Docs and tests:** CLAUDE.md states the one allowed kind of external link; `tests/smoke.js` checks the link, its attributes and that nothing external is loaded.

## Capabilities

### New Capabilities
- `support-link`: an optional, unobtrusive link to a Ko-fi page, in the footer and the side panel, that keeps the no-cookie / no-external-resources promise.

### Modified Capabilities
None. (The `publishing` requirement from `add-data-licence-and-privacy-note` says the only external URLs are footer links; this change adds one more place for an ordinary link. See design.)

## Non-goals

- Embedded Ko-fi / Buy Me a Coffee widgets or buttons, payment forms, or any analytics on clicks.
- An end-of-game message, a popup after N guesses, or "milestone" asks.
- Memberships, perks, supporter-only features or a paywall. The game stays free.
- Ads or affiliate links.
- Tax or legal set-up for receiving donations. The author should ask a commercialista how tips are treated in their situation.

## Impact

- `index.html` (footer line, side-panel line), `style.css` (one small rule), `app.js` (copy the footer URL into the side-panel link), `tests/smoke.js`, `README.md`, `CLAUDE.md`, new `.github/FUNDING.yml`, rebuilt `dist/quiz.html`.
- No change to game logic, data or storage keys. JSON-LD keeps `price: 0` (the game is still free).
