## 1. Measure
- [x] 1.1 Browser profile (phone, CPU 4×): load, per-guess cost, drag/pinch frames, tap; numbers in DEVELOPMENT.md

## 2. Guards
- [x] 2.1 `tests/smoke.js`: size budget (raw and gzip), 100-guess timing

## 3. Fixes (reverted on 2026-11-12: the desktop browser got worse; to redo)
- [ ] 3.1 Gestures move/scale the last image; full redraw after the gesture
- [ ] 3.2 Guesses redraw only around the new comuni; highlight not saved in the image
- [ ] 3.3 Culling and hit testing by bounding box; canvas capped at 2×; cheaper outline joins
- [ ] 3.4 Pixel comparison partial vs full redraw
- [x] 3.5 `npm test`, `openspec validate performance-check --strict`
- [ ] 3.6 Manual check on a real phone (drag, pinch, guesses, light and dark theme)

## 4. Revert
- [x] 4.1 Code, tests and docs of the fixes reverted (PR #15): the map felt worse in the desktop browser. Next attempt must be checked on desktop and on a real phone before merging.
