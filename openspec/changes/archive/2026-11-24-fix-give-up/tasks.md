## 1. Fix

- [x] 1.1 `save()`/`load()`: surrender as `g: 1`
- [x] 1.2 `showOver()`/`finish()`: end state with "Ricomincia", result toast on surrender; restore it on load
- [x] 1.3 `restart()`: confirm, remove `comuniQuizV1`, reload
- [x] 1.4 `updateReg()`: every comune after giving up, missing ones `.miss`; map opacity 50%

## 2. Tests and docs

- [x] 2.1 Smoke test: give up → all comuni listed and "Ricomincia"; reload keeps it; Ricomincia clears the save
- [x] 2.2 `CLAUDE.md`, `DEVELOPMENT.md`
- [x] 2.3 Rebuild `dist/quiz.html`, run `tests/smoke.js` on Node 22.23.4
- [x] 2.4 `openspec validate fix-give-up --strict`
