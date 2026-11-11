## 1. App

- [x] 1.1 `app.js`: `TOURS_ON = false`, `TOURS` filtered by it
- [x] 1.2 `load()` keeps the raw `tr` / `gr` when the tours are off; `save()` writes it back

## 2. Docs

- [x] 2.1 README, DEVELOPMENT.md, CLAUDE.md: tours paused; CLAUDE.md "Ideas" lists the prefix problem

## 3. Tests

- [x] 3.1 Tour tests only when `TOURS_ON` is true; checks that the rows are hidden and `tr` / `a` survive a guess
- [x] 3.2 `npm test`, `openspec validate pause-tours --strict`
- [x] 3.3 PR and green CI
