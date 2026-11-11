## 1. App

- [x] 1.1 `TIMED` table, sliding windows on game time, `timedCheck(added)` replacing `burstCheck`
- [x] 1.2 Records in `rb` (save/load), `CH` from `TIMED`
- [x] 1.3 "A tempo" category with rule (`h`) and record (`s`) per row; Raffica moved out of "Sfide"

## 2. Docs

- [x] 2.1 README, DEVELOPMENT.md, CLAUDE.md

## 3. Tests

- [x] 3.1 Quick guesses unlock Raffica and Raffica doppia; same initial unlocks Stessa lettera, mixed initials do not; capoluoghi; record saved and restored; old `raffica` save
- [x] 3.2 `npm test`, `openspec validate timed-challenges --strict`, PR and green CI
