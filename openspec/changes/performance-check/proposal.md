## Why

The page keeps growing (geo data, curiosità, challenges) and must stay light, also on phones. Today: `dist/quiz.html` 1,102 KB (376 KB gzip), of which `map.json` 882 KB, `geo.json` 113 KB, `extra.json` 39 KB, `facts.json` 19 KB, `app.js` 53 KB. Every guess re-renders the whole achievements list (about 520 rows) and redraws the map.

## What Changes

- **Measure** in a real browser (desktop and a mid-range phone profile): load to first map, memory, time per guess (`achCheck`, `renderAch`, `draw`), pan/zoom frame time with many comuni found. Write the numbers in DEVELOPMENT.md.
- **Budgets**, checked by `tests/smoke.js`: `dist/quiz.html` ≤ 1.3 MB (≤ 450 KB gzip); time for 100 guesses in jsdom under a fixed limit, as a regression guard.
- **Fix only what the numbers show**. Likely candidates:
  - `renderAch()` on every guess → render only the open categories, or batch to one per frame;
  - `geo.json` `nb` deltas could be packed further;
  - avoid redrawing everything on hover.
- No new dependencies, no build step for the app.

## Capabilities

### New Capabilities
- `performance`: size and speed budgets.

## Impact

`tests/smoke.js` (budgets), DEVELOPMENT.md (numbers, how to measure), possibly `app.js`/`scripts/build_geo.py` if a budget is exceeded.
