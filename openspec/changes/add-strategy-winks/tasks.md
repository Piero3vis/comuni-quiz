## 1. Decide
- [ ] 1.1 Streak length per theme, what breaks a streak, texts for cervi, parole comuni, nomi parlanti, autostrade
- [ ] 1.2 Hand lists: parole comuni, nomi parlanti

## 2. App
- [ ] 2.1 Theme list with `fit` and `n`, streak counters updated on each correct new guess
- [ ] 2.2 Unlock once into `earned`, toast, ids `sw:*` in `CH` so they are saved and reloaded
- [ ] 2.3 Segreti items: "🔒 ???" until unlocked

## 3. Autostrade (can ship later)
- [ ] 3.1 Choose motorways and source; add groups to `data/groups.json`
- [ ] 3.2 Wink on the streak along one motorway

## 4. Docs and tests
- [ ] 4.1 CLAUDE.md (ids, patterns); README and DEVELOPMENT.md stay vague ("qualche obiettivo segreto")
- [ ] 4.2 `tests/smoke.js`: 3 gallo guesses in a row unlock and survive a reload; a non-gallo guess in between resets; a santi and a cervi streak
- [ ] 4.3 `npm test`, `openspec validate add-strategy-winks --strict`
