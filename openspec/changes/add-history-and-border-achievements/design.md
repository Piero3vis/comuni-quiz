## Context

Islands and cammini are groups of comuni by name in `data/groups.json`, resolved to indices by `withGroups()`; an achievement unlocks when the group is complete.

## Decisions

- **Same mechanism, three new lists** (`confini`, `marinare`, `storia`) handled by one table `TG` (`pre`, icon, list, label) instead of copying the island/cammino code three times. Ids `f:<gi>`, `mr:<gi>`, `h:<gi>`, plus `f:giro`. Derived from the state, never stored.
- **Anecdote in the data** (`nota`), not in `app.js`: one place per group. It is hidden while locked because "Non erano solo quattro" would otherwise list the answer.
- **Border comuni from geometry, checked by hand**: a comune borders a state if at least ~200 m of its boundary lies on Italy's outer edge (holes included, for San Marino and the Vatican) within 2 km of that state in Natural Earth. The list was compared with Wikipedia's "Comuni d'Italia confinanti con …" categories and the "Comuni confinanti" box: 7 comuni with a very short border (Airole, Dolceacqua, Livo, Prato allo Stelvio, Saint-Oyen, Trasquera, Torreano) are added through `EXTRA`; Sappada, in the Austrian category, does not border Austria according to its own box and the geometry.
- **Facts checked on Wikipedia** (November 2026): the seven maritime republics, Brindisi and Salerno as seats of government in 1943-44, Salemi proclaimed capital on 14 May 1860 (symbolic, one day), Cospaia 1441-1826 and its two streams called Rio, Seborga's principality founded in 1963.
- **Toast duration** grows with the text (45 ms per character, at least 2.8 s) so the anecdotes can be read.

## Risks / Trade-offs

- [Natural Earth is coarse] → the 2 km buffer only picks which state an outer edge belongs to; the outer edge itself comes from the precise openpolis borders.
- [Vatican is a single comune, already found by most players] → kept as a small joke next to the others.
