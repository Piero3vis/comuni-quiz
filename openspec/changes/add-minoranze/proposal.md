## Why

Il quiz non dice nulla delle minoranze linguistiche storiche, eppure molte sono piccole e sparse (paesi arbëreshë, Grecìa salentina, croati del Molise, Alghero catalana): trovarle insegna qualcosa sulla storia d’Italia, come fanno già la Repubblica di Cospaia o le repubbliche marinare. La legge 482/1999 ne riconosce 12; ne teniamo 8, quelle che si giocano come gruppi a sé.

## What Changes

- **Nuova lista `minoranze` in `data/groups.json`**: 8 gruppi `{ name, comuni, nota, fonte }`: Francoprovenzale (Valle d’Aosta compresa, più valli piemontesi, Faeto e Celle di San Vito), Occitana, Ladina, Albanese (arbëreshë), Slovena, Greca (griko e grecanico), Croata (Molise), Catalana (solo Alghero: un comune solo va bene, come Cospaia).
- **Esclusi**: sardo, friulano, germaniche, francese (troppo grandi o quasi coincidenti con intere regioni o province).
- **Elenchi comune per comune** dalle delimitazioni ai sensi della legge 482/1999 (o dalla norma regionale/statutaria corrispondente), aggiornati alle fusioni presenti in `map.json`, ciascun gruppo con una `fonte` https.
- **Nuova categoria di traguardi "Minoranze linguistiche"** nel gruppo Cultura e storia: un traguardo per minoranza (gruppo completo, con conteggio trovati/totale) e "Giro delle minoranze" (almeno un comune di ogni minoranza).
- **Controlli in `tests/smoke.js`**: 8 gruppi, ognuno con `fonte` https, nomi risolti, categoria presente nel gruppo giusto.

## Capabilities

### New Capabilities
- `language-minorities`: i gruppi di comuni delle minoranze linguistiche, le loro regole sui dati e i traguardi relativi.

### Modified Capabilities
Nessuna.

## Non-goals

- Sardo, friulano, minoranze germaniche, francese.
- Parlate non tutelate dalla 482 (tabarchino, gallo-italici di Sicilia e Basilicata): eventualmente in un cambiamento successivo.
- Mostrare la fonte nel gioco.

## Impact

- `data/groups.json`, `app.js` (`loadData()`/`withGroups()`, `TG`, `achInit()`, `achCats()`, `ACHG`), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, README se elenca le categorie; `dist/quiz.html` rigenerato.
