## 1. Counter
- [x] 1.1 Tag at the end of `index.html` (`async`, `https:`), after `app.js`
- [x] 1.2 Footer, README, DEVELOPMENT.md, CLAUDE.md

## 2. Checks
- [x] 2.1 `tests/smoke.js`: one external script only, async, no cookies; GoatCounter never contacted by the tests
- [x] 2.2 Real browser (Chromium): no cookies after load and after a few guesses; load time and first drawing with and without the tag
- [x] 2.3 `npm test`, `openspec validate add-goatcounter --strict`
- [ ] 2.4 After deploy: the visit shows up in the dashboard; own visits ignored in the settings
