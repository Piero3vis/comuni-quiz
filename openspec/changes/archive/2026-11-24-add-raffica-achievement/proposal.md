## Why

All achievements reward what has been found, none rewards how. A speed challenge ("Raffica": 10 comuni in one minute) rewards a burst of quick answers and gives experienced players something to aim for in a single session.

## What Changes

- New achievement "Raffica" (⚡): 10 comuni found within 60 seconds of real time while playing. Toast: "⚡ Raffica: 10 comuni in un minuto!". A guess matching several comuni (homonyms) counts each of them.
- New "Sfide" section in the achievements panel, listing Raffica with its rule ("10 comuni in un minuto"), 🔒 while locked.
- **Persistence change**: this is the first achievement that cannot be derived from the found comuni, so its id is saved in `localStorage['comuniQuizV1'].a` (a list of ids). Older saves without `a` still load; unknown ids are ignored.
- Counts towards the overall achievements total.

## Capabilities

### New Capabilities
- `challenge-achievements`: achievements earned by how the player answers, saved with the progress.

### Modified Capabilities
None.

## Non-goals

- Other timed challenges (e.g. a whole province in N minutes): the `CH` list is ready for them.
- Showing the best burst so far.

## Impact

`app.js` (`CH`, `earned`, `burstCheck`, `save`, `load`, `achInit`, `renderAch`), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
