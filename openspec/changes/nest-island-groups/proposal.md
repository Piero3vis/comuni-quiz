## Why

In `data/groups.json` "Isole campane" already contains the comuni of Ischia, and "Arcipelago toscano" those of the Isola d'Elba (the same for Isole Eolie inside Isole minori siciliane), but in the panel they are separate, flat rows: Ischia sits beside Isole campane as if it were another archipelago, and the Elba beside the Arcipelago toscano. The island is part of the archipelago and should be shown that way.

## What Changes

- An island group can belong to an archipelago: `"parte": "Isole campane"` on Ischia, `"parte": "Arcipelago toscano"` on Isola d'Elba (and `"Isole minori siciliane"` on Isole Eolie).
- In the "Isole" category, the archipelago row shows its islands as sub-rows (indented): Isole campane → Ischia; Arcipelago toscano → Isola d'Elba.
- The archipelago stays the union of its comuni; the island keeps its own achievement and id, so saves are unaffected.
- `withGroups()` checks that a `parte` names an existing group in the same list and that the island's comuni are all in it.
- Optional (to confirm): sub-rows for the other single islands (Capri, Procida, Giglio, Capraia).

## Capabilities

### New Capabilities
- `island-groups`: islands nested in their archipelago.

## Impact

`data/groups.json`, `app.js` (`withGroups()`, "Isole" category), `style.css` (indent), `tests/smoke.js`, CLAUDE.md (groups format), README. Ids `i:<gi>` are positional: keep the list order, or the change becomes a save migration.
