## 1. Data

- [x] 1.1 `scripts/build_extra.py`: population (POSAS 2025), capoluoghi (ISTAT flag), records (openpolis borders); fail on unmatched comuni
- [x] 1.2 Generate `data/extra.json`; check records and capoluoghi by eye
- [x] 1.3 `loadData()` and `scripts/build_single_file.py` load/embed it, with the length check

## 2. Score and secrets

- [x] 2.1 `popFound` in `addFound()`; "persone beccate" badge top-left on the map
- [x] 2.2 `PPS` (ids `pp<q>`, percentages of the population) in `achInit`, `achCheck`, `renderAch` and the total
- [x] 2.3 Footer: ISTAT population credit

## 3. Tests and docs

- [x] 3.1 Smoke test: score equals the sum of found comuni; Roma unlocks the 1% milestone; "Segreti" stays 0/2 → 1/2 → 2/2
- [x] 3.2 `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`
- [x] 3.3 Rebuild `dist/quiz.html`, run `tests/smoke.js` on Node 22.23.4
- [x] 3.4 `openspec validate add-population-score --strict`
