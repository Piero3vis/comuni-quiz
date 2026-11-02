## Why

The quiz should reflect Italy's administrative map as of 2026, accept every comune that shares a typed name, and let players switch between light and dark themes without changing their OS setting. Checking the data against ISTAT's list of comuni (`Elenco-comuni-italiani.xlsx`, reference date 21 February 2026) showed that the **province assignments are already up to date**. The Sardinian reorganisation that took effect on 1 January 2026 (Città metropolitana di Sassari; Gallura Nord-Est Sardegna `OT`; Ogliastra `OG`; Medio Campidano `VS`; Sulcis Iglesiente `CI`; Seulo moved to Nuoro and Seui to Ogliastra) matches `data/map.json` comune by comune: 110 sigle, with no mismatched (name, sigla) pairs. What is out of date is the list of comuni itself (two 2026 mergers), and nothing currently stops the province data from silently going stale again.

## What Changes

- **Province verification (no data change):** add `scripts/check_istat.py` (stdlib only). It downloads ISTAT's current list of comuni and reports any comune whose name or province sigla differs from `data/map.json`, plus any province display name in `app.js` that differs from ISTAT's.
- **2026 wording:** achievement toasts say "Città metropolitana di …" for the 15 metropolitan cities (including the new Città metropolitana di Sassari) instead of "Provincia di …".
- **Comuni that share a name:** this already works. Typing "Castro" fills both Castro (BG) and Castro (LE), and the same holds for Samone, Livo, Peglio and San Teodoro. The behaviour becomes a spec requirement with a smoke-test assertion, and `CLAUDE.md` is corrected to list all five names.
- **Light/dark toggle:** a button in the top bar cycles through Automatico → Chiaro → Scuro. The choice is saved in `localStorage` (`comuniQuizTheme`), and the canvas redraws right away, including when the OS theme changes during a session.
- **Docs:** README "Known limitations" names the two pending 2026 mergers. `CLAUDE.md` documents the toggle, the check script and the homonyms.

## Capabilities

### New Capabilities
- `province-data`: the province assignment of every comune and its display name follow ISTAT's current coding and can be checked against it.
- `name-matching`: how a typed name resolves to comuni, including names shared by several comuni.
- `theme-toggle`: a user-selectable light/dark/auto theme that is remembered between visits and applied to both the page and the map.

### Modified Capabilities
None. `openspec/specs/` is empty.

## Non-goals

- **Merging comuni in the map data.** ISTAT lists 7,894 comuni in 2026. Castegnero and Nanto (VI) merged into "Castegnero Nanto", and Lirio (PV) was absorbed by Montalto Pavese on 31 January 2026. Fixing this means merging boundaries in `scripts/build_data.py` and regenerating `data/map.json` (hand edits are not allowed). That is left for a later change.
- **Sigla for Sulcis Iglesiente:** ISTAT uses `CI`. A draft vehicle-plate regulation reported in the press proposes `SU`. We follow ISTAT.
- **Hover hit-testing performance:** unchanged, as requested.
- Accepting `"Castro (LE)"`-style names in `data/groups.json`.

## Impact

- `app.js`, `index.html`, `style.css`: theme button and its logic, metropolitan-city wording.
- `tests/smoke.js`: new assertions for homonyms and the theme toggle.
- `scripts/check_istat.py`: new script that needs network access when run. It is not part of `npm test`.
- `dist/quiz.html`: rebuilt by `npm test`.
- `README.md`, `CLAUDE.md`: updated documentation.
- No new runtime dependencies. `localStorage` gains one key (`comuniQuizTheme`). Saved progress (`comuniQuizV1`) is unaffected.
