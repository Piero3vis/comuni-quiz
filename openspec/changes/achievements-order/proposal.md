## Why

The achievement categories grew one feature at a time, so their order in the panel is historical: Traguardi, Segreti, Persone beccate, Esplorazione, A tempo, Sfide, Da costa a costa, Capoluoghi, Record d'Italia, Borghi (×3), Tesori, Costa italiana, Coste regionali, Isole, Cammini, Storia, Repubbliche marinare, Confini, and the 110-row province/region lists at the end. Related categories are far apart (Costa italiana and Da costa a costa, Capoluoghi and Province completate), and Segreti sits second.

## What Changes

- Order the categories by theme, with a small heading per group:
  1. **Progressi**: Traguardi, Persone beccate, Esplorazione, Capoluoghi, Regioni completate, Province completate, quarters and halves
  2. **Sfide**: A tempo, Italia a piedi, Da costa a costa
  3. **Geografia**: Costa italiana, Coste regionali, Isole, Confini, Record d'Italia
  4. **Cultura e storia**: Cammini, Storia, Repubbliche marinare, Tesori di provincia, Borghi
  5. **Segreti** last
- Within a category, keep the current order (increasing difficulty).
- The "Sfide" category (Italia a piedi, tours) becomes "Percorsi", so it no longer repeats the group title.
- Two new Progressi categories right after Capoluoghi: **Grandi città** (all comuni with at least 100.000 and 50.000 residents, with the count; ids `big:100000`, `big:50000`) and **I più estesi** (the 10, 25, 50 and 100 largest comuni by area; ids `ext:<n>`). `scripts/build_extra.py` writes `ext`, the 100 largest comuni, from the same unsimplified borders as the "Il più grande" record.
- Ids do not change, so saves are unaffected.

## Decisions

- Theme order (not easiest-first), with a small uppercase title per group; a group whose categories are all hidden by the filter has no title.
- The group of each category is listed in one table (`ACHG`); a category missing from it is an error, so new categories cannot fall to a random place.

## Capabilities

### New Capabilities
- `achievements-panel`: order and grouping of the categories.

## Impact

`app.js` (`achCats()` order, optional group headings in `renderAch()`), `style.css`, `tests/smoke.js`, CLAUDE.md, README.
