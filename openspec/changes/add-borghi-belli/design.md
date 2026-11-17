## Context

L’associazione "I Borghi più belli d’Italia" pubblica sul suo sito l’elenco dei borghi per regione; l’elenco cambia ogni anno (nuove adesioni, qualche uscita). Un "borgo" a volte è una frazione o un centro storico (es. Tellaro, frazione di Lerici), non un comune. Il gioco ragiona solo per comuni.

## Goals / Non-Goals

**Goals:** un elenco verificabile e datato, traguardi nazionali e regionali, nessuna nuova dipendenza.

**Non-Goals:** San Marino, altri marchi, scraping automatico.

## Decisions

1. **File a parte `data/borghi.json`** invece di una lista in `groups.json`: `{ "agg": "2026-07-17", "fonte": "https://borghipiubelliditalia.it/…", "reg": { "Liguria": ["Apricale", …], … } }`. Motivo: è un elenco esterno con una data e una fonte unica, che si aggiorna tutto insieme; in `groups.json` i gruppi hanno ciascuno la sua nota. `loadData()` lo risolve con `withGroups()` (stesso controllo su nomi mancanti o non univoci, `"Nome (SIGLA)"` per gli omonimi) e lo incorpora `build_single_file.py`.
2. **Frazioni → comune**: se il borgo è una frazione o un nome diverso dal comune, si scrive il comune (Tellaro → Lerici) e si annota l’associazione in un campo `fraz` `{ "Lerici": "Tellaro" }`, usato nell’elenco dei trovati ("Lerici (Tellaro)"). Due borghi nello stesso comune contano una volta.
3. **Regione dal dato**: la regione di ogni comune viene da `map.json`; il test verifica che coincida con la chiave in `borghi.json`.
4. **Traguardi** (id `bb:<n>` nazionali, `bb:r<k>` regionali, categoria `bb`):
   - passi `[10, 50, 100, 200]` filtrati `< tot` più `tot` ("Tutti i borghi più belli");
   - un traguardo per regione con trovati/totale, sbloccato a regione completa;
   - toast come le altre categorie; nulla di salvato, tutto derivato da `found`.
   La categoria va in `ACHG` sotto Città e borghi, dopo "Tesori di provincia".
5. **Nome**: "Borghi più belli d’Italia" è il nome dell’associazione; si usa solo come riferimento, con la fonte nella nota della categoria, senza logo.

## Risks / Trade-offs

- [L’elenco invecchia] → la data `agg` è mostrata nell’`info` della categoria ("elenco al 17 luglio 2026").
- [Regioni con pochi borghi (es. 1–2)] → traguardo regionale comunque presente: è facile ma insegna qualcosa.
- [Fusioni di comuni] → `withGroups()` fallisce sui nomi spariti, quindi emergono al test.

## Open Questions

- Pagina esatta della fonte (elenco completo o pagine per regione).
