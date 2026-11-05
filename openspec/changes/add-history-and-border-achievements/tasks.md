## 1. Data

- [x] 1.1 `scripts/border_comuni.py`: border comuni from geometry plus `EXTRA`, checked against Wikipedia; `--write` into `data/groups.json`
- [x] 1.2 `marinare` and `storia` groups with `nota`, facts checked on Wikipedia

## 2. App

- [x] 2.1 `withGroups()`: "Nome (SIGLA)", `nota`, `conf`/`mar`/`sto`
- [x] 2.2 `TG` table, ids `f:`/`mr:`/`h:`, `f:giro`; `achInit`, `achCheck`, categories in `achCats`
- [x] 2.3 Anecdote under unlocked achievements; toast duration by length

## 3. Tests and docs

- [x] 3.1 Smoke test: maritime republics, Cospaia with anecdote, border counts, giro delle frontiere
- [x] 3.2 `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`
- [x] 3.3 Rebuild `dist/quiz.html`, run `tests/smoke.js` on Node 22.23.4
- [x] 3.4 `openspec validate add-history-and-border-achievements --strict`
