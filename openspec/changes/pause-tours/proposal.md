## Why

A guess is accepted as soon as the typed text matches a comune, so while typing "Castrocaro Terme" the quiz takes "Castro" first (if it is not found yet) and clears the field. 471 names are the start of a longer name (Torino → Torino di Sangro, Bra → Brandizzo, Castro → Castrocaro Terme…), 1,061 comuni are affected.
For most achievements this is harmless (Castro is a real comune, it just gets found early), but the "Giro d’Italia a tappe" and the "Giro delle province a tappe" depend on the order of guesses: an unwanted Castro (Lecce or Bergamo) in the middle of a run is a jump, and breaks it.
Until this is solved, both tours are paused.

## What Changes

- The two tours ("Giro d’Italia a tappe", "Giro delle province a tappe") are switched off by one constant, `TOURS_ON = false` in `app.js`: no rows in the Sfide category, no toasts, no steps counted.
- The code stays, ready to be switched back on. A run saved in `comuniQuizV1.tr` (or the old `gr`) and the ids `giro` / `giroP` in `a` are kept unchanged in the save, so nothing is lost.
- The other challenges (Raffica, Italia a piedi, Da costa a costa) are unchanged: they do not depend on the order, or tolerate an extra comune.
- README, DEVELOPMENT.md, CLAUDE.md: the tours are marked as paused; CLAUDE.md "Ideas" lists the prefix problem with the options to think about.
- Tests: the tour tests run only when `TOURS_ON` is true; new checks that the rows are hidden and the saved run survives.

## Capabilities

### New Capabilities
None.

### Modified Capabilities
- `giro-challenge`: paused (also covers the province tour, which follows the same rule).

## Non-goals

- Solving the prefix problem itself (see design: options to think about).

## Impact

`app.js`, `tests/smoke.js`, README.md, DEVELOPMENT.md, CLAUDE.md, rebuilt `dist/quiz.html`. No data or storage format change.
