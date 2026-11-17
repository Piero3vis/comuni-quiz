## Why

Un giocatore ha chiesto un traguardo per "I Borghi più belli d’Italia": è un elenco famoso (circa 380 comuni a luglio 2026), sparso in tutte le regioni e fatto di paesi piccoli e poco noti, quindi spinge a esplorare. La categoria "Borghi" esistente conta solo gli abitanti (sotto 1.000), non la bellezza.

## What Changes

- **Nuovo file `data/borghi.json`**: l’elenco dei comuni aderenti all’associazione, raggruppato per regione, con la data di aggiornamento e la fonte (sito ufficiale dell’associazione).
- **Nuova categoria di traguardi "Borghi più belli d’Italia"** nel gruppo Città e borghi:
  - passi nazionali (10, 50, 100, 200, tutti);
  - un traguardo per regione (tutti i borghi della regione), con trovati/totale;
  - un elenco a scomparsa dei borghi trovati, come per Laghi e Tesori.
- **Controlli in `tests/smoke.js`**: nomi risolti, fonte https, data presente, ogni regione con almeno un borgo, sblocco di un traguardo regionale.

## Capabilities

### New Capabilities
- `borghi-belli`: l’elenco dei Borghi più belli d’Italia e i traguardi relativi.

### Modified Capabilities
Nessuna.

## Non-goals

- San Marino (membro dell’associazione, ma non è un comune italiano).
- Altri marchi (Bandiere arancioni, Borghi autentici, Borgo dei Borghi): eventualmente in un cambiamento successivo.
- Aggiornamento automatico dell’elenco: si aggiorna a mano, con la data.

## Impact

- `data/borghi.json` (nuovo), `scripts/build_single_file.py` (lo incorpora), `app.js` (`loadData()`, `achInit()`, `achCheck()`, `achCats()`, `ACHG`), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`; `dist/quiz.html` rigenerato.
