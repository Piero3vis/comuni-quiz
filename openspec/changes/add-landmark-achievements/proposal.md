## Why

Some comuni are special: provincial capitals, and the comuni that hold a national record (the four extremes of the country, the largest and smallest, the most and least populated). Finding them is a natural goal and teaches some geography trivia. The data is already in `data/extra.json` (`cap`, `rec`).

## What Changes

- New achievement "Tutti i capoluoghi" (🏛️): every capoluogo di provincia / città metropolitana / libero consorzio in the ISTAT list, co-capoluoghi included (119 today: Barletta, Andria and Trani; Pesaro and Urbino; Olbia and Tempio Pausania; ...). Section "Capoluoghi" shows found/total. Toast: "🏛️ Tutti i 119 capoluoghi trovati!".
- New section "Record d’Italia" with eight achievements, one per record comune: "Il più a nord" ⬆️ (Predoi), "Il più a sud" ⬇️ (Lampedusa e Linosa), "Il più a est" ➡️ (Otranto), "Il più a ovest" ⬅️ (Bardonecchia), "Il più grande" 🗺️ (Roma), "Il più piccolo" 🔎 (Atrani), "Il più popoloso" 🏙️ (Roma), "Il meno popoloso" 🏚️ (Morterone). The comune name stays hidden ("?") until found, so the row works as a riddle. Toast e.g. "⬆️ Record: Predoi è il comune più a nord d’Italia!".
- Both count towards the overall achievements total.

## Capabilities

### New Capabilities
- `landmark-achievements`: achievements for capoluoghi and record comuni.

### Modified Capabilities
None.

## Non-goals

- Partial capoluoghi milestones (per region, half): easy to add later.
- Records by altitude or coast length: no data for them yet.

## Impact

`app.js` (`CAPS`, `REC`, `achInit`, `achCheck`, `renderAch`), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
