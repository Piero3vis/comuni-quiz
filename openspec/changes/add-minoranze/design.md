## Context

I gruppi a tema (`confini`, `marinare`, `storia`) stanno in `data/groups.json`, sono risolti da `withGroups()` in `[nome, indici, nota]` e diventano traguardi tramite `TG` (`<pre>:<gi>`, sbloccato a gruppo completo); `tgOf` già gestisce un comune in più gruppi. Le minoranze sono 8 elenchi da poche unità a ~120 comuni, decisi per legge (delimitazioni provinciali ex art. 3 della legge 482/1999, statuti speciali, leggi regionali).

## Goals / Non-Goals

**Goals:** elenchi verificabili, uno per minoranza, con fonte; traguardi coerenti con quelli già esistenti; nessuna nuova dipendenza.

**Non-Goals:** sardo, friulano, germaniche, francese; parlate non tutelate dalla 482; uno script di generazione automatica (le fonti sono PDF e delibere eterogenee).

## Decisions

1. **Dati in `groups.json`, lista `minoranze`**, scritti a mano con un campo `fonte` per gruppo (più `fonti` se servono più atti, es. ladino tra Bolzano, Trento e Belluno). Alternativa scartata: script come `border_comuni.py`, perché non c’è una fonte unica leggibile da macchina.
2. **Criterio di inclusione: dove la lingua è tutelata** (delimitazione o norma equivalente), senza togliere la Valle d’Aosta al francoprovenzale né Alghero perché è un comune solo (scelta dell’utente: "lo parlano là, si tiene là").
   - Francoprovenzale: tutti i 74 comuni valdostani + comuni delimitati nelle province di Torino e Cuneo + Faeto e Celle di San Vito (FG).
   - Occitana: comuni delimitati in Piemonte (CN, TO), Liguria (IM, se delimitati) e Guardia Piemontese (CS).
   - Ladina: Val Gardena e Val Badia (BZ), Val di Fassa (TN), comuni delimitati in provincia di Belluno.
   - Albanese, Greca, Croata, Slovena, Catalana: delimitazioni provinciali; per lo sloveno la tabella dei 32 comuni (DPR 12 settembre 2007).
3. **Fusioni**: ogni nome va riportato al comune attuale di `map.json` (es. Pozza e Vigo di Fassa → San Giovanni di Fassa); un comune fuso entra se nella delimitazione c’era almeno uno dei comuni d’origine. Omonimi scritti come `"Nome (SIGLA)"`.
4. **Traguardi**: nuova voce `TG` `{ pre:'ml', ic:'🗣️', list: D.min }`, id `ml:<gi>`; categoria `ml` "Minoranze linguistiche" in `ACHG` sotto Cultura e storia; ogni riga mostra trovati/totale (come Isole e Cammini), più `ml:giro` "Giro delle minoranze" (un comune per minoranza, come `f:giro`). Nulla di salvato: tutto derivato da `found`.
5. **Nota**: una riga per gruppo (origine storica), nascosta finché il traguardo è bloccato, come per gli altri gruppi.

## Risks / Trade-offs

- [Delimitazioni discusse o larghe, che includono comuni dove la lingua non si parla più] → si segue l’atto ufficiale, che è verificabile; i casi dubbi si annotano in questo file.
- [Comuni in due minoranze (valli piemontesi francoprovenzali/occitane)] → ammesso: il comune conta per entrambi i gruppi.
- [Fusioni future] → i nomi non trovati fanno fallire `withGroups()`, quindi il problema emerge al test.
- [Gruppi grandi (francoprovenzale ~120) quasi uguali a "Valle d’Aosta completa"] → accettato per scelta esplicita.

## Open Questions

- Liguria occitana (Olivetta San Michele, Triora…): da includere solo se esiste una delimitazione.
- Ladino bellunese: la delimitazione provinciale è ampia; verificare l’elenco esatto.
