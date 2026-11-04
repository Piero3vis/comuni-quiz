## Context

`map.json` comes from openpolis borders through `build_data.py`, which needs shapely and mapshaper and re-simplifies the geometry. Population is published by ISTAT in POSAS (one row per comune and age, plus a total row with age 999), keyed by ISTAT code. The ISTAT list of comuni in force has the capoluogo flag and, per comune, the code valid 2017-2025 (the one POSAS 2025 uses). openpolis features carry the catasto and ISTAT codes and are in the same order as `map.json`.

## Decisions

- **Separate `data/extra.json` instead of new fields in `map.json`**: regenerating `map.json` would re-download and re-simplify the borders (large diff, new tools). The extra file is small, stdlib-only to build, and checked for alignment at load.
- **POSAS 2025 (1 January 2025, final) rather than 2026 (estimate)**: 2026 already reflects the 2026 mergers, which `map.json` does not have yet.
- **Match through the catasto code**: (name, sigla) → openpolis catasto code → ISTAT list → 2017-2025 code → POSAS. Codes survive homonyms (two Castro) and the Sardinian province reform. The three comuni merged in 2026 (Castegnero, Nanto, Lirio), absent from the list in force, use openpolis' ISTAT code. The script fails if any comune has no population.
- **Records computed at build time from unsimplified borders**: the 4%-simplified paths are too coarse for areas of tiny comuni (Atrani, 0.10 km²). Areas use a local equal-area approximation per ring, enough to rank comuni.
- **`popFound` kept incrementally in `addFound()`**, like `coastFound`; never stored, so old saves get their score on load.
- **Population milestones as percentages (`PPS`, ids `pp<q>`)**, visible like the quarter/half milestones of comuni, rather than secrets: the score is on screen all the time, so its goals should be too. Thresholds are `ceil(total × q%)`, computed from `pop`.
- **Badge as an overlay in the top-left of the map** (the zoom buttons are top-right), not in the top bar, which is already full on phones.

## Risks / Trade-offs

- [Roma alone is 4,7% of the population] → it unlocks the 1% milestone at once; the rest need many comuni.
- [`extra.json` gets stale when `map.json` changes] → the load-time length check and the documented rerun.
