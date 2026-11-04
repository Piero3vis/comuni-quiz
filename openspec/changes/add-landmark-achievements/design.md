## Context

`D.cap` lists capoluogo indices and `D.rec` maps record keys to indices (`data/extra.json`, from the previous change).

## Decisions

- **Ids `cap` and `x:<key>`** (`x:nord`, `x:grande`, ...): records are keyed by name, not by comune, because Roma holds two.
- **Record names hidden until found** ("?"): the label already says what to look for; showing the answer would give it away.
- **Capoluoghi counted with `D.cap.filter(i=>found[i]).length`**, only when the found comune is a capoluogo: 119 items, cheap.
- **Records derived from the data, not hard-coded**: if ISTAT data or borders change, `build_extra.py` recomputes them.

## Risks / Trade-offs

- [Some co-capoluoghi are little known (Tortolì, Villacidro)] → the counter shows how many are missing; the ISTAT list is the reference.
