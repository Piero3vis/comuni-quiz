## Why

Small or curious comuni are just names on a map: a short story makes them memorable, and before the answer it can work as a clue for the comuni the player cannot place.

## What Changes

- New `data/facts.json`: `{ "Nome": "curiosità" }` for a selection of small or interesting comuni (record comuni, microcomuni, famous villages), each checked on a web source. Names follow `groups.json` (`"Nome (SIGLA)"` for duplicated names).
- The comune box opened by a click on the map gets a closed `<details>` when the comune has a fact:
  - not found yet: "💡 Indizio: una curiosità", the fact as a clue (the text never contains the name);
  - found (or after giving up): "💡 Curiosità", under the residents and rarity points line.
- The box is placed from its real size, so an opened fact stays inside the map.
- `scripts/build_single_file.py` embeds `facts.json`.

## Capabilities

### New Capabilities
- `comune-facts`: curiosità per comune nel riquadro della mappa.

### Modified Capabilities
None.

## Non-goals

- Facts for every comune, toasts on discovery or a list in the side panel: the fact only lives in the box, closed by default.

## Impact

`data/facts.json` (new), `app.js` (`loadData`, `withGroups`, `clickAt`, `placeInfo`), `style.css`, `scripts/build_single_file.py`, `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
