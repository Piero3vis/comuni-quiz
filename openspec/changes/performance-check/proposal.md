> **Status:** the implementation of PR #15 was reverted on 2026-11-12 because the desktop browser got worse. The measurements stay valid; the fixes must be redone and checked on desktop too.

## Why

On phones the map is not smooth. Measured in Chromium with a phone profile (390×844, device pixel ratio 3, CPU slowed 4×; no GPU, so absolute numbers are pessimistic but comparisons hold): every drag or pinch frame and every guess redrew all 7,896 comuni plus the province and region outlines, about 520–610 ms each, and more when zoomed in (off-screen comuni were drawn too). The page also keeps growing (geo data, curiosità, challenges), so it needs a guard.

## What Changes

- **Gestures use the last image.** During drag, pinch, wheel zoom and the pan animation after a guess, the last full drawing (`snap`) is moved and scaled; the real map is redrawn 140 ms after the gesture stops (and on release).
- **Guesses redraw only around the new comuni.** `draw(list)` clears a pixel-aligned rectangle around the new comuni and repaints it from scratch (comuni touching it, outlines), on top of the saved image; the highlight is drawn on top and not saved, so removing it is a copy.
- **Only visible comuni** are drawn and hit-tested: a bounding box per comune (`BB`), also used by hover and tap.
- **Canvas resolution capped at 2×** device pixels (3× phones drew 2.25× more pixels for no visible gain).
- **Cheaper outlines:** province outline without round joins, region outline with bevel joins.
- **Guards in `tests/smoke.js`:** `dist/quiz.html` ≤ 1.3 MB and ≤ 450 KB gzip; 100 guesses (logic only, drawing stubbed) under 15 s in jsdom.
- **DEVELOPMENT.md:** the numbers and how to measure.

## Results (phone profile, CPU 4×)

| | before | after |
|---|---|---|
| drag / pinch frame | 520–610 ms | 16–17 ms (60 fps) |
| guess (median) | 530–580 ms | 70–90 ms |
| tap on a comune | 3–4 ms | under 1 ms |
| load | 1.7–1.8 s | 1.4 s |

Partial redraws match a full redraw except for a few anti-aliased pixels (9 of 944,640 after 10 guesses, 15 after 50); any drag or zoom redraws everything.

## Capabilities

### New Capabilities
- `performance`: size and speed budgets, and how the map is redrawn.

## Impact

`app.js` (render, draw, gestures, culling), `tests/smoke.js` (budgets; the fact-box click test now clicks the comune's real centre on an 800×600 map), DEVELOPMENT.md, CLAUDE.md, rebuilt `dist/quiz.html`. No data or save change.
