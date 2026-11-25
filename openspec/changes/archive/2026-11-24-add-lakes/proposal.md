## Why

Lakes are a natural geography theme next to the coast and the islands, and many comuni share their lake's exact name (Garda, Iseo, Como, Bracciano…).

## What Changes

- New visible category **🏞️ Laghi** in Geografia, after Coste regionali: steps 5, 15 and all 39 comuni whose name is exactly a lake's (`LAGHI`, from the player's list; Monate is now a frazione and is left out). Ids `lg:5`, `lg:15`, `lg:39`; derived from the state, toast during play, silent on load.
- The category explains the rule ("Garda sì, Castelnuovo del Garda no"), shows the count and a closed list of the lakes found.
- **I più estesi** gets the same closed list: "Più estesi trovati (n)", each with its rank by area ("1. Roma", "2. Ravenna"…).
- CLAUDE.md ideas: rethink the "Percorsi" category (only "Italia a piedi" while the tours are paused, and very hard).

## Capabilities

### New Capabilities
- `lakes`: the Laghi category.

## Impact

`app.js` (`LAGHI`, `LG`, `achInit`, `achCheck`, `achCats`, `ACHG`), `tests/smoke.js`, `CLAUDE.md`, `README.md`.
