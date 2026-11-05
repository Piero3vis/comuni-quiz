## 1. Achievements

- [x] 1.1 `app.js`: `achInit()` unlocks `e:r` and `e:p` silently; `achCheck()` unlocks them with their toasts when the first comune of the last region/province is found
- [x] 1.2 `renderAch()`: "Esplorazione" section after "Segreti" with both rows and their counters; include them in the total

## 2. Tests and docs

- [x] 2.1 Smoke test: counters after the first answers, locked; one comune per province unlocks both
- [x] 2.2 `CLAUDE.md` (ids `e:r`, `e:p`), `DEVELOPMENT.md`, `README.md`
- [x] 2.3 Rebuild `dist/quiz.html` and run `npm test`
- [x] 2.4 `openspec validate add-exploration-achievements --strict`
