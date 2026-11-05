## Context

`provFound` maps a province acronym to the number of comuni found there; a key exists only once a comune of that province is found. `provTot` has one key per province (110 in the current map data). `regCount[k]` counts found comuni per region (20).

## Decisions

- **Count with `Object.keys(provFound).length` and `regCount.filter(x=>x>0).length`** instead of new counters: both are already kept up to date by `addFound()`, and counting 110 keys or 20 numbers per guess and render is cheap.
- **Ids `e:r` and `e:p`** (`e` for "esplorazione"): one prefix for breadth achievements.
- **Own "Esplorazione" section with counters**, rather than rows in "Traguardi": the "Traguardi" rows are thresholds on the total count; these have their own progress, shown like the island and cammino rows.
- **Check only in `achCheck()` when the found comune is the first in its region/province** (`regCount[k] === 1`, `provFound[p] === 1`): the counts can only change then.

## Risks / Trade-offs

- [The number of provinces changes with ISTAT reforms] → the total comes from `provTot`, so it follows the map data automatically.
