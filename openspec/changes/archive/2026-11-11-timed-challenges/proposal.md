## Why

"Raffica" (10 comuni in a minute) is the only timed challenge. Timed challenges do not depend on which comune comes after which, so they are not affected by the prefix problem that paused the Giro a tappe (typing "Castrocaro Terme" takes "Castro" first), and they give players short goals in every session.

## What Changes

- A new achievements category "A tempo" (⏱️) with nine timed challenges, Raffica moved there (same id, so it stays unlocked):
  - Raffica: 10 comuni in 1 minute; Raffica doppia: 20 in 1 minute
  - Cinquanta in cinque: 50 in 5 minutes; Cento in cinque: 100 in 5 minutes
  - Mezza maratona: 250 in 15 minutes; Maratona: 500 in 30 minutes
  - Raffica di capoluoghi: 10 capoluoghi in 1 minute
  - Raffica di borghi: 10 comuni under 1,000 residents in 5 minutes
  - Stessa lettera: 10 comuni with the same initial in 1 minute
- Time is game time: a pause stops the clock for the challenges too.
- Each row shows the rule and the personal record ("Il tuo record: 14 in un minuto."), saved with the game.
- README, DEVELOPMENT.md, CLAUDE.md, tests.

## Capabilities

### New Capabilities
- `timed-challenges`: N comuni (optionally of a kind) within a time window, with a saved personal record.

### Modified Capabilities
None (Raffica keeps its id and rule).

## Impact

`app.js`, `tests/smoke.js`, README.md, DEVELOPMENT.md, CLAUDE.md, rebuilt `dist/quiz.html`. Save gains `rb` (records); old saves load unchanged.
