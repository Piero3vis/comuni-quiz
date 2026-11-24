## 1. Achievement

- [x] 1.1 `app.js`: `CH`, `earned`, `burst`; `burstCheck(n)` after each correct guess
- [x] 1.2 `save()`/`load()`: `a` list in `comuniQuizV1`, restored ids filtered by `CH`; `achInit()` adds them
- [x] 1.3 `renderAch()`: "Sfide" section; include `CH.length` in the total

## 2. Tests and docs

- [x] 2.1 Smoke test: the first quick answers unlock Raffica and save it; a save with `a: ['raffica', 'sconosciuta']` restores only Raffica
- [x] 2.2 `CLAUDE.md` (persistence, challenges), `DEVELOPMENT.md`, `README.md`
- [x] 2.3 Rebuild `dist/quiz.html`, run `tests/smoke.js` on Node 22.23.4
- [x] 2.4 `openspec validate add-raffica-achievement --strict`
