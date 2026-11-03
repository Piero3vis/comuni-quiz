## 1. Fix

- [x] 1.1 `tick()`: update `elapsed` only while running
- [x] 1.2 `pause()` and `finish()`: call `tick()` before saving
- [x] 1.3 `pagehide` listener: `tick()` and `save()` while running

## 2. Tests

- [x] 2.1 Smoke test: 0:00:00 on fresh load (both variants)
- [x] 2.2 Smoke test: saved 65 s → 0:01:05 on load, 0:01:06 after a second running, still while paused, saved value correct
- [x] 2.3 Confirm the new checks fail without the fix and pass with it (Node 22.23.4)
- [x] 2.4 `openspec validate fix-timer --strict`
