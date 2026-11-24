## 1. Score and achievements

- [x] 1.1 `RAR`, `rarFound`; "💎 punti rarità" next to "persone beccate"; inhabitants and rarity in the comune info
- [x] 1.2 `BG` (borghi, paesini, microcomuni) with `bgFound[]`; ids `b<limit>:<n>`
- [x] 1.3 "Comune raro" toast under 100 inhabitants
- [x] 1.4 `TES` (least populated comune per province), toasts, ids `t<n>`, section with the list of treasures

## 2. Tests and docs

- [x] 2.1 Smoke test: rarity total; borghi count and all microcomuni; all treasures
- [x] 2.2 `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`
- [x] 2.3 Rebuild `dist/quiz.html`, run `tests/smoke.js` on Node 22.23.4
- [x] 2.4 `openspec validate add-small-comuni-achievements --strict`
