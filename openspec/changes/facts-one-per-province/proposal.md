## Why

The 80 curiosità are unevenly spread (Piemonte 17, Veneto 0, Molise, Umbria and Trentino-Alto Adige 1) and none records where it comes from, so they cannot be re-checked. The goal is at least one curiosità per province, each with a source, written as a clue for comuni that are neither tiny nor famous. This change sets the format and the rules, adds sources to the existing 80 and does the first region, Veneto; the other regions follow in later batches with the same rules.

## What Changes

- **Format of `data/facts.json`**: `{ "Nome": { "testo": "…", "fonte": "https://…" } }` instead of `{ "Nome": "testo" }`. **BREAKING** for the file format only; the app reads the new one.
- **Rules checked by `tests/smoke.js`**: every curiosità has a `fonte` (an `https://` URL); no capoluogo has a curiosità; the existing checks stay (name never in the text, at most 200 characters, typographic apostrophe).
- **Sources for the existing 80**, each checked against its page; texts corrected where the source says otherwise.
- **Veneto**: one curiosità for each of its 7 provinces, none in a capoluogo: Pieve di Cadore (BL), Montagnana (PD), Adria (RO), Possagno (TV), Stra (VE), Valeggio sul Mincio (VR), Marostica (VI).
- A coverage report in the test output: provinces with and without a curiosità.

## Capabilities

### New Capabilities
- `comune-facts`: the curiosità data, its format and its rules.

### Modified Capabilities
None.

## Non-goals

- The other regions (next batches).
- Showing the source in the game.

## Impact

- `data/facts.json`, `app.js` (`withGroups()` reads `testo`), `tests/smoke.js`, docs.
