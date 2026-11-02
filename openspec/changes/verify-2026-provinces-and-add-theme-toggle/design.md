## Context

- `data/map.json` comes from openpolis/geojson-italy via `scripts/build_data.py`. A comune-by-comune comparison with ISTAT's list (21 February 2026) found the province sigla identical for every comune present in both. The only differences are the two 2026 mergers (see proposal, Non-goals).
- `style.css` already defines three theme states on `:root`: no attribute (follows `prefers-color-scheme`), `[data-theme="light"]` and `[data-theme="dark"]`. Nothing in the UI sets the attribute yet.
- `render()` in `app.js` reads `--unf`, `--stroke`, `--pline`, `--rhalo`, `--rline` via `getComputedStyle` on every frame. The map therefore picks up a new theme on the next `draw()`, but nothing currently triggers one when the theme changes.
- Matching: `keyMap` maps each normalised name to the list of all comuni with that name, and the input handler adds every hit. Homonyms already work.

## Goals / Non-Goals

**Goals:** a verifiable link between the data and ISTAT, correct 2026 wording for metropolitan cities, the homonym behaviour pinned by tests, a theme toggle that persists.

**Non-Goals:** regenerating map data or merging comuni geometry; hover performance; groups referring to homonyms.

## Decisions

- **Check script, not a data rebuild.** The provinces are already correct, so rebuilding (a ~50 MB download plus mapshaper) would only add risk: an upstream openpolis change could alter geometry. `scripts/check_istat.py` reads the `.xlsx` with `zipfile` + `xml.etree` (stdlib), because the project avoids dependencies and ISTAT no longer keeps the `.csv` at the permanent URL up to date (it still shows the 2025 "Sud Sardegna" layout). Alternative considered: `openpyxl`, rejected as an extra dependency for one script.
- **Metropolitan-city set hard-coded in `app.js`** (`CM = new Set([...15 sigle])`) next to `PN`, with a helper `provLabel(p)`. Alternative: carry the ISTAT type in `map.json`. Rejected because it needs a data rebuild for 15 constants.
- **Three-state cycling button** (auto → light → dark) in `.bar`, before "Inizia". It uses the existing button styles and shows a symbol icon ("◐" auto, "☀" light, "☾" dark). Alternative: a two-state toggle. Rejected because it loses "follow the OS", which is the current default.
- **Separate storage key `comuniQuizTheme`.** `save()` rewrites `comuniQuizV1` wholesale, so the theme must not live there. Reads and writes are wrapped in try/catch, as the project's conventions require.
- **Apply the saved theme early.** A small inline script in `<head>` sets `data-theme` before the first paint, avoiding a flash of the wrong theme. The logic in `app.js` owns the button. `build_single_file.py` copies `<head>` as is, so the single file behaves the same.
- **Redraw hooks:** after a button change, call `draw()`. Also add a `matchMedia('(prefers-color-scheme: dark)')` `change` listener that calls `draw()`.

## Risks / Trade-offs

- [ISTAT changes the xlsx layout or URL] → the script fails loudly with the column it could not find. It is a dev tool and not part of `npm test`, so the build does not break.
- [The 15-city list drifts] → `check_istat.py` also prints ISTAT's type-3 (metropolitan city) sigle and warns if they differ from the `CM` set in `app.js`.
- [jsdom lacks `matchMedia`] → guard with `window.matchMedia &&`. The smoke test does not depend on it.
