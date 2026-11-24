## Why

Finding Roma and finding Morterone count the same today. A second score, the number of people living in the comuni found ("persone beccate"), makes big cities feel big and gives a running number that grows differently from the comuni count. It also needs official ISTAT data next to the map, which later achievements (capoluoghi, records) reuse.

## What Changes

- New generated file `data/extra.json`, built by the new stdlib-only `scripts/build_extra.py` from ISTAT and openpolis sources: residents on 1 January 2025 for every comune (`pop`), capoluogo indices (`cap`) and record comuni (`rec`: northernmost, southernmost, easternmost, westernmost, largest, smallest, most and least populated). All aligned to `map.json` indices.
- `loadData()` loads it (or the inline copy in `dist/quiz.html`) and throws if it is not aligned with `map.json`.
- A "👥 N persone beccate" badge in the top-left corner of the map shows the sum of residents of the comuni found, formatted in Italian (e.g. 2.747.290).
- Visible milestones on that score, as percentages of the Italian population, in a "Persone beccate" section: 1% "Un italiano su cento", 10% "Un italiano su dieci", 25% "Un quarto degli italiani", 50% "Metà degli italiani", 75% "Tre quarti degli italiani", 100% "Tutti gli italiani" (👥). Toast e.g. "👥 Un quarto degli italiani (25% della popolazione)".
- Footer credits ISTAT population data (CC BY 4.0).

## Capabilities

### New Capabilities
- `population-score`: the "persone beccate" score, its data and its milestones.

### Modified Capabilities
None.

## Non-goals

- Using `cap` and `rec` in the game: they are generated here and used by the next change.
- Regenerating `map.json`: the new data lives in its own file, so the map geometry does not change.

## Impact

New `scripts/build_extra.py`, `data/extra.json` (~60 KB). `app.js` (`loadData`, `addFound`, `PPS`, `achInit`, `achCheck`, `renderAch`, `refreshStats`), `index.html` (badge, footer), `style.css`, `scripts/build_single_file.py`, `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
