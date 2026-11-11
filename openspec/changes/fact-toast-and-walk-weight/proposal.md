## Why

The 80 curiosità are only visible by clicking a comune on the map, so most players never see them after a correct guess. And "Italia a piedi" (one chain of bordering comuni across all 18 regions of the peninsula) is by far the hardest achievement, yet it counts as 1 like "Primo passo".

## What Changes

- **Curiosità on screen**: when a guess finds a comune that has a curiosità, a toast shows it: "💡 Curiosità su Elva: …". Nothing changes in the click box.
- **Italia a piedi is worth 10**: in the achievements total (header count, bar, filter totals) it counts as 10 achievements; its rule says so. Other achievements keep weight 1.

## Capabilities

### New Capabilities
- `fact-toast`: toast with the curiosità of a newly found comune.

### Modified Capabilities
- `walk-challenge`: the achievement weighs 10 in the total.

## Non-goals

- A "Curiosità" category or milestones (the player asked for the toast only).
- Weights for other achievements.

## Impact

- `app.js` (toast in `achCheck()`, optional weight `w` on panel items, weighted totals in `renderAch()`), `tests/smoke.js`, docs.
