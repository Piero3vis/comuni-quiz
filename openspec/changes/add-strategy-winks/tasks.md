## 1. Decide
- [x] 1.1 Streak lengths (gallo 3, santi 5, cervi 3, parole 3), what breaks a streak (only a correct guess outside the theme), texts for santi, gallo, cervi, parole comuni
- [x] 1.2 Hand list: parole comuni

## 2. App
- [x] 2.1 Theme list with `fit` and `n`, streak counters updated on each correct new guess
- [x] 2.2 Unlock once into `earned`, toast, ids `sw:*` in `CH` so they are saved and reloaded
- [x] 2.3 Segreti items: "🔒 ???" until unlocked

## 3. Nomi parlanti (later: list and text to decide)
- [ ] 3.1 Hand list of at least 10 names, text, streak length

## 4. Autostrade (later)
- [ ] 4.1 Choose motorways and source; add groups to `data/groups.json`
- [ ] 4.2 Wink on the streak along one motorway

## 5. Docs and tests
- [x] 5.1 CLAUDE.md (ids, patterns); README and DEVELOPMENT.md stay vague ("qualche obiettivo segreto")
- [x] 5.2 `tests/smoke.js`: 3 gallo guesses in a row unlock and survive a reload; a non-gallo guess in between resets; a santi and a cervi streak
- [ ] 5.3 `npm test`, `openspec validate add-strategy-winks --strict`
