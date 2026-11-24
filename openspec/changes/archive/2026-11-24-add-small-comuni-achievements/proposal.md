## Why

"Persone beccate" rewards big cities: Roma alone is worth more than the 2.023 comuni under 1.000 inhabitants together. Knowing obscure, tiny comuni is the real skill in this quiz and deserves its own score and goals.

## What Changes

- **Rarity score ("💎 punti rarità")**: every comune is worth `max(1, round(10 · log10(pop of Roma / pop)))` points (Roma 1, Milano 3, half of the comuni 31 or more, Morterone 49). The total is shown next to "persone beccate" in the top-left of the map. Clicking a found comune shows its inhabitants and its rarity points.
- **Borghi achievements**, by population (ISTAT 2025): "Borghi" (under 1.000, 2.023 comuni) at 10, 100, 500 and all; "Paesini" (under 500, 916) at 10, 100, 500 and all; "Microcomuni" (under 100, 67) at 10 and all. Each section shows found/total.
- **"Comune raro" toast**: finding a comune with fewer than 100 inhabitants shows e.g. "🔍 Comune raro: Pedesina, 37 abitanti!".
- **Tesori di provincia**: the least populated comune of each province (110). Finding one shows a toast ("🗝️ Tesoro: Morterone è il comune meno popoloso della Provincia di Lecco"); achievements at 10, 50 and all; a collapsible list shows the treasures found.

## Capabilities

### New Capabilities
- `small-comuni-achievements`: rarity score, borghi achievements, rare comune toast and provincial treasures.

### Modified Capabilities
None.

## Non-goals

- Rarity milestones: the rarity total grows almost like the comuni count, so milestones on it would repeat the existing ones.
- New data: everything is derived from `pop` in `data/extra.json`.

## Impact

`app.js` (`RAR`, `rarFound`, `BG`, `TES`, `addFound`, `achInit`, `achCheck`, `renderAch`, `refreshStats`, info panel), `index.html` (score box), `style.css`, `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
