## Why

Today every province and region achievement rewards depth (a quarter, half or all of one area). Nothing rewards breadth: a player who wanders the whole country, finding a comune here and there, gets no recognition. Two achievements for finding at least one comune in every region and in every province reward exactly that, and their counters (e.g. 18/20, 97/110) give a clear goal for the last few areas.

## What Changes

- New achievement "Giro d’Italia" (🇮🇹): at least one comune found in every region. Toast: "🇮🇹 Giro d’Italia: almeno un comune in ogni regione!".
- New achievement "Giro delle province" (🧭): at least one comune found in every province. Toast: "🧭 Giro delle province: almeno un comune in ogni provincia!".
- The achievements panel gets an "Esplorazione" section after "Segreti", with one row per achievement showing the number of regions/provinces with at least one comune found out of the total (locked rows show 🔒).
- Both count towards the overall achievements total.
- Smoke test covers counters and unlocks; `CLAUDE.md`, `DEVELOPMENT.md` and `README.md` mention them.

## Capabilities

### New Capabilities
- `exploration-achievements`: achievements for finding at least one comune in every region and every province.

### Modified Capabilities
None.

## Non-goals

- Persisting achievements: like all others, they are derived from the found comuni on load.

## Impact

`app.js` (`achInit`, `achCheck`, `renderAch`), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
