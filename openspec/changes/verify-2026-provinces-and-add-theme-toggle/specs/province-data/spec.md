## ADDED Requirements

### Requirement: Province assignments follow ISTAT's current coding
Every comune in `data/map.json` SHALL carry the province sigla that ISTAT's current list of comuni gives it. As of the ISTAT list dated 21 February 2026, this includes the Sardinian layout in force since 1 January 2026: CA, SS, NU, OR, OT, OG, VS, CI (110 sigle nationally).

#### Scenario: Sardinian 2026 layout
- **WHEN** the province of Olbia, Tortolì, Sanluri, Carbonia, Seulo and Seui is read from `data/map.json`
- **THEN** they are OT, OG, VS, CI, NU and OG respectively

#### Scenario: Province count
- **WHEN** the distinct values of `p` in `data/map.json` are counted
- **THEN** there are 110

### Requirement: Data can be checked against ISTAT
The project SHALL provide `scripts/check_istat.py`, which uses only the Python standard library. It downloads ISTAT's current list of comuni and prints every comune whose (name, sigla) pair is in `data/map.json` but not in ISTAT, or the other way round, and every province display name in `app.js` (`PN`) that differs from ISTAT's name. It SHALL exit with a non-zero status when it finds a difference in (name, sigla) pairs.

#### Scenario: Pending 2026 mergers are reported
- **WHEN** `python3 scripts/check_istat.py` is run against the February 2026 ISTAT list
- **THEN** it reports Castegnero (VI), Nanto (VI) and Lirio (PV) as only in the data, reports Castegnero Nanto (VI) as only in ISTAT, and exits with a non-zero status

#### Scenario: Bilingual names are informational
- **WHEN** a `PN` display name equals the Italian part of ISTAT's bilingual name (e.g. "Bolzano" vs "Bolzano/Bozen")
- **THEN** the difference is listed as information only and does not affect the exit status

### Requirement: Metropolitan cities are named as such
Achievement toasts about a province SHALL say "Città metropolitana di <name>" for the ISTAT metropolitan cities (BA, BO, CA, CT, FI, GE, ME, MI, NA, PA, RC, RM, SS, TO, VE) and "Provincia di <name>" for every other province.

#### Scenario: Completing a metropolitan city
- **WHEN** the player finds the last remaining comune of the province SS
- **THEN** the toast reads "Città metropolitana di Sassari completata!"

#### Scenario: Completing an ordinary province
- **WHEN** the player finds the last remaining comune of the province OG
- **THEN** the toast reads "Provincia di Ogliastra completata!"
