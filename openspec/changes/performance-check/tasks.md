## 1. Measure
- [x] 1.1 Browser profile (phone, CPU 4×): load, per-guess cost, drag/pinch frames, tap; numbers in DEVELOPMENT.md

## 2. Guards
- [x] 2.1 `tests/smoke.js`: size budget (raw and gzip), 100-guess timing

## 3. Fixes
- [x] 3.1 Gestures move/scale the last image; full redraw after the gesture
- [x] 3.2 Guesses redraw only around the new comuni; highlight not saved in the image
- [x] 3.3 Culling and hit testing by bounding box; canvas capped at 2×; cheaper outline joins
- [x] 3.4 Pixel comparison partial vs full redraw
- [x] 3.5 `npm test`, `openspec validate performance-check --strict`
- [ ] 3.6 Manual check on a real phone (drag, pinch, guesses, light and dark theme)
