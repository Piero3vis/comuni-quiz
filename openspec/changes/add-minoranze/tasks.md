## 1. Elenchi e fonti

- [x] 1.1 Croata e Catalana (3 + 1 comuni), con fonte
- [x] 1.2 Slovena: 32 comuni dal DPR 12 settembre 2007, con fonte
- [x] 1.3 Greca: delimitazioni di Lecce e Reggio Calabria, con fonte
- [x] 1.4 Albanese (arbëreshë): delimitazioni provinciali, con fonte
- [x] 1.5 Ladina: Bolzano, Trento, Belluno, con fonti
- [x] 1.6 Occitana: Piemonte, Liguria (se delimitata), Guardia Piemontese, con fonti
- [x] 1.7 Francoprovenzale: Valle d’Aosta, Piemonte, Faeto e Celle di San Vito, con fonti
- [x] 1.8 Riportare ogni nome al comune attuale di `map.json` (fusioni, omonimi) e annotare i casi dubbi in `design.md`

## 2. Dati e app

- [x] 2.1 Aggiungere `minoranze` a `data/groups.json` (name, comuni, nota, fonte)
- [x] 2.2 `loadData()`: risolvere `groups.minoranze` in `D.min`
- [x] 2.3 `TG`: voce `ml`; `achInit()`/`achCheck()` per `ml:giro`
- [x] 2.4 `achCats()`: categoria `ml` "Minoranze linguistiche" con trovati/totale e "Giro delle minoranze"; chiave `ml` in `ACHG` sotto Cultura e storia

## 3. Test e documentazione

- [x] 3.1 `tests/smoke.js`: 8 gruppi, fonti https, Alghero da solo, Valle d’Aosta intera, sblocco del gruppo croato e di `ml:giro`
- [x] 3.2 `npm test` (Node 22.23.4) verde, `dist/quiz.html` rigenerato
- [x] 3.3 Aggiornare `CLAUDE.md`, `DEVELOPMENT.md` e README se elencano le categorie
