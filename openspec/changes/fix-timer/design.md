## Context

`elapsed` is the saved play time; while running, `t0 = Date.now() - elapsed` and `tick()` (every 500 ms) recomputes `elapsed`. `tick()` is also called once on load to show the saved time, before `t0` is set.

## Decisions

- **Guard in `tick()`** (`if(running)`), not a special case at the load call: every caller can use `tick()` to refresh the display safely.
- **`pagehide`** rather than `beforeunload` or `visibilitychange`: it fires on tab close and navigation, including on mobile and with the back-forward cache, and the timer keeps running while the tab is merely hidden (it is a wall-clock stopwatch, as before).

## Risks / Trade-offs

- [Already corrupted saves (a time of decades)] → not repaired automatically; the player can reset progress. A heuristic cap could hide real long sessions, so none is added.
