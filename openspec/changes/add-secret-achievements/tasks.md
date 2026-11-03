## 1. Secret achievements

- [x] 1.1 `app.js`: add `SEC` (69 "Nice.", 420 "Blaze it") with ids `s<n>`; remove 420 from `MS`
- [x] 1.2 `achInit()` unlocks secrets silently; `achCheck()` unlocks them with their own icon and toast text
- [x] 1.3 `renderAch()`: "Segreti" section after "Traguardi" (unlocked: icon, name, threshold; locked: "🔒 ???"); include `SEC.length` in the total

## 2. Tests and docs

- [x] 2.1 Smoke test: at 60 comuni "Segreti 0/2" with two "🔒 ???" and no names; at 69 "Nice."; at 420 "Blaze it" and no "Quattro e venti"
- [x] 2.2 `CLAUDE.md`: document the `s<n>` id
- [x] 2.3 Rebuild `dist/quiz.html` and run `tests/smoke.js` (both variants green on Node 22.23.4)
- [x] 2.4 `openspec validate add-secret-achievements --strict`
