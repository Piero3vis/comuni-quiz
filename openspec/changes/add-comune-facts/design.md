## Context

A click on the map opens a small box (`clickAt()`): name, residents and rarity points for a found comune; region, province, first letter and a "Rivela nome" button otherwise.

## Decisions

- **Data by name, like the groups**: `data/facts.json` maps a comune name to its text and `withGroups()` resolves it with the same `lookup` (throws on missing or ambiguous names), giving `D.fact`, a `Map` from index to text. Adding a fact is one line of JSON.
- **One closed `<details>`** in both states, so the box stays as compact as before; the summary changes ("Indizio: una curiosità" / "Curiosità"). The text is set with `textContent`.
- **No spoilers**: a fact never contains the comune's name or a part of it (`/` names included); `tests/smoke.js` checks it with the quiz's own normalisation.
- **Facts checked on the web** (November 2026), mostly on it.wikipedia.org; comuni without a verifiable fact are left out.
- **Placement from the real size** (`placeInfo()`, also on `toggle`) instead of fixed 250×120 px.

## Risks / Trade-offs

- [A fact can go stale] → facts avoid yearly numbers such as population.
- [A clue can still be strong (e.g. a famous native)] → acceptable: it is opt-in, like "Rivela nome".
