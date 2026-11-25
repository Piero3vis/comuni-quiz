# achievements-panel Specification

## Purpose
TBD - created by archiving change achievements-order. Update Purpose after archive.
## Requirements
### Requirement: Categories ordered by theme
The achievements panel SHALL list the categories in five groups, in this order: Progressi, Sfide, Geografia, Cultura e storia, Segreti. Achievement ids MUST NOT change.

#### Scenario: Order
- **WHEN** the achievements tab is opened
- **THEN** "Traguardi" is the first category, "A tempo" comes before "Costa italiana", "Costa italiana" before "Cammini", and "Segreti" is the last

#### Scenario: Saves unaffected
- **WHEN** a save made before the change is loaded
- **THEN** the same achievements are unlocked and the total is the same

### Requirement: Big cities and largest comuni
The Progressi group SHALL have, right after Capoluoghi, a "Grandi città" category (all comuni with at least 100.000 residents, all with at least 50.000, each with found/total) and an "I più estesi" category (the 10, 25, 50 and 100 largest comuni by area, from `data/extra.json` `ext`). They SHALL unlock with a toast during play and silently on load.

#### Scenario: Last big city
- **WHEN** every comune with at least 100.000 residents except Roma is found and the player types "Roma"
- **THEN** "Tutti i comuni sopra i 100.000 abitanti" shows 44/44 and is unlocked, and so is "I 10 comuni più estesi" if the other nine were found

### Requirement: Percorsi category
The category with "Italia a piedi" and the tours SHALL be called "Percorsi", not "Sfide", inside the "Sfide" group.

#### Scenario: No repeated title
- **WHEN** the achievements tab is opened
- **THEN** the "Sfide" group contains "A tempo", "Percorsi" and "Da costa a costa"

