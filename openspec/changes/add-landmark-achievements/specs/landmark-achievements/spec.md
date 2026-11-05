## ADDED Requirements

### Requirement: Capoluoghi achievement
The quiz SHALL have an achievement "Tutti i capoluoghi" unlocked when every comune flagged as capoluogo in `data/extra.json` has been found. The achievements panel SHALL show a "Capoluoghi" section with the number found out of the total. It SHALL unlock once with the toast "🏛️ Tutti i N capoluoghi trovati!" during play, or silently on load.

#### Scenario: Last capoluogo
- **WHEN** the player has found 118 of the 119 capoluoghi and finds the last one
- **THEN** the toast appears and the row shows "🏛️ Tutti i capoluoghi" with "119/119"

### Requirement: Record achievements
The quiz SHALL have one achievement for each record comune in `data/extra.json`: più a nord, più a sud, più a est, più a ovest, più grande, più piccolo, più popoloso, meno popoloso. Each SHALL unlock when that comune is found, with a toast naming the comune and the record, or silently on load. The "Record d’Italia" section SHALL list all eight with their label; a locked row SHALL show 🔒 and "?" instead of the comune name.

#### Scenario: Finding Roma
- **WHEN** the player finds Roma
- **THEN** "Il più grande" and "Il più popoloso" unlock and show "Roma"

#### Scenario: Locked record
- **WHEN** the player has not found Predoi
- **THEN** the row shows "🔒 Il più a nord" and "?"
