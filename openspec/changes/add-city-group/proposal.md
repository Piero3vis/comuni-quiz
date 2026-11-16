## Why

Achievements about how big a comune is were spread over Progressi (Grandi città) and Cultura e storia (Borghi, Paesini, Microcomuni, Tesori di provincia). The player asked to keep them together, from the largest cities to the smallest villages, and to add the most populous cities.

## What Changes

- New theme group **Città e borghi**, after Geografia, with the categories Grandi città, Borghi, Paesini, Microcomuni and Tesori di provincia (in this order). Progressi and Cultura e storia lose them.
- Grandi città gains **I 10, 25, 50, 100 comuni più popolosi** (ids `pop:<n>`, from `POPORD`, residents descending, ties by index). Its rows are sorted by size: 10, 25, sopra i 100.000 (44), 50, 100, sopra i 50.000 (137). Toast on unlock, silent on load.

## Capabilities

### New Capabilities
- `city-group`: the Città e borghi group and the most-populous achievements.

## Impact

`app.js` (`POPORD`, `POPS`, `achInit`, `achCheck`, `achCats`, `ACHG`), `tests/smoke.js`, `CLAUDE.md`, `README.md`. Nothing saved changes (achievements are derived).
