## 1. Elenco

- [x] 1.1 Leggere l’elenco da https://borghipiubelliditalia.it/borghi/ e dalle pagine regionali collegate, annotando la data
- [x] 1.2 Riportare ogni borgo al comune di `map.json` (frazioni in `fraz`, omonimi come `"Nome (SIGLA)"`, fusioni), togliere San Marino
- [x] 1.3 Scrivere `data/borghi.json` (`agg`, `fonte`, `reg`, `fraz`)

## 2. App

- [x] 2.1 `loadData()`: caricare e risolvere `borghi.json`; `build_single_file.py`: incorporarlo
- [x] 2.2 `achInit()` e `achCheck()`: passi `bb:<n>` e regioni `bb:r<k>`, con toast
- [x] 2.3 `achCats()`: categoria `bb` con info (trovati/totale, data), righe nazionali e regionali, elenco dei trovati; chiave `bb` in `ACHG` sotto Città e borghi

## 3. Test e documentazione

- [x] 3.1 `tests/smoke.js`: nomi e regioni coerenti, fonte https, sblocco di `bb:10` e di una regione, ripristino al caricamento
- [x] 3.2 `npm test` (Node 22.23.4) verde, `dist/quiz.html` rigenerato
- [x] 3.3 Aggiornare `CLAUDE.md` (togliere l’idea dalla lista, descrivere `borghi.json`), `DEVELOPMENT.md`
