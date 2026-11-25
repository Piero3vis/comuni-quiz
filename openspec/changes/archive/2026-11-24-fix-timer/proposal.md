## Why

The timer is broken. On page load `tick()` runs while `t0` is still 0, so `elapsed` becomes `Date.now()` (about 56 years): the clock shows something like "498251:17:36", and the next save overwrites the real saved time with that value. Pause and finish also save a time that can be up to half a second stale, and closing the tab while playing loses the time since the last correct guess.

## What Changes

- `tick()` only advances `elapsed` while the quiz is running; otherwise it just shows the current value.
- `pause()` and `finish()` update `elapsed` before saving.
- On `pagehide` while running, the time is updated and saved.
- Smoke test: the clock shows 0:00:00 on a fresh load; with saved progress (65 s) it shows 0:01:05, resumes from there, stops on pause and saves the right value.

## Capabilities

### New Capabilities
- `timer`: the play-time clock and how it is saved.

### Modified Capabilities
None.

## Impact

`app.js` (`tick`, `pause`, `finish`, a `pagehide` listener), `tests/smoke.js`. Players whose saved time was already corrupted keep the wrong value; it cannot be told apart from a real one.
