## ADDED Requirements

### Requirement: ISTAT data aligned with the map
The project SHALL generate `data/extra.json` with `scripts/build_extra.py`, containing for every comune of `data/map.json`, by the same index, its residents on 1 January 2025 according to ISTAT (`pop`), the list of capoluoghi (`cap`) and the record comuni (`rec`). The page SHALL load it with the map (inline in the single file) and SHALL fail with an error if its length differs from the map.

#### Scenario: Script output
- **WHEN** `python3 scripts/build_extra.py` runs
- **THEN** every comune has a population, and the records are Predoi (nord), Lampedusa e Linosa (sud), Otranto (est), Bardonecchia (ovest), Roma (grande, popoloso), Atrani (piccolo) and Morterone (spopolato)

### Requirement: Persone beccate score
The map SHALL show in its top-left corner the sum of residents of the comuni found, formatted with Italian thousands separators, labelled "persone beccate". It SHALL update after every correct guess and on load.

#### Scenario: Finding Roma
- **WHEN** the player with no comuni found finds Roma
- **THEN** the score shows "2.747.290"

### Requirement: Population milestones
The quiz SHALL have visible milestones on the score at 1%, 10%, 25%, 50%, 75% and 100% of the total population: "Un italiano su cento", "Un italiano su dieci", "Un quarto degli italiani", "Metà degli italiani", "Tre quarti degli italiani", "Tutti gli italiani". The achievements panel SHALL list them in a "Persone beccate" section with the current score, each with its percentage and 🔒 while locked. Each SHALL unlock once with the toast "👥 <name> (<q>% della popolazione)" during play, or silently on load, and count in the totals. The "Segreti" section SHALL NOT contain population achievements.

#### Scenario: Roma unlocks the first milestone
- **WHEN** the player finds Roma early in the game
- **THEN** "Un italiano su cento" unlocks with its toast, and "Un italiano su dieci" stays locked
