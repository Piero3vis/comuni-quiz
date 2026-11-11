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
- Ids do not change, so saves are unaffected.

## Open questions

- Theme order as above, or easiest-first (categories that unlock early on top)?
- Group headings visible, or only the order?

## Capabilities

### New Capabilities
- `achievements-panel`: order and grouping of the categories.

## Impact

`app.js` (`achCats()` order, optional group headings in `renderAch()`), `style.css`, `tests/smoke.js`, CLAUDE.md, README.
