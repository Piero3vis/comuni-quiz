## Why

The README's "Cosa c'è nel gioco" is one very long bullet that lists every achievement in a single sentence; it grew with each feature and is hard to read. It must also reflect the latest changes: the "A tempo" challenges with records, the Giro a tappe paused, the curiosità toast, the Ko-fi link, and the new weight of Italia a piedi.

## What Changes

- Rewrite "Cosa c'è nel gioco" as short groups that follow the achievements panel order (see `achievements-order`): Progressi, Sfide, Geografia, Cultura, Segreti, one line each.
- A short "Sfide" table: name, goal, notes (A tempo, Italia a piedi, Da costa a costa; Giro a tappe "in pausa").
- Check every section against the current game: "Come si gioca", "Privacy", "Sostieni il progetto", "Dati", "Per chi sviluppa".
- Italian, typographic apostrophe; no screenshots or external images (the page stays free of external resources; the README itself may link out).

## Capabilities

### New Capabilities
- `readme`: what the player README must cover.

## Impact

`README.md` only (and DEVELOPMENT.md if a fact moves there). Best done after `walk-score-clarity`, `achievements-order` and `nest-island-groups`, so it describes the final state.
