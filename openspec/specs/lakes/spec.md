# lakes Specification

## Purpose
TBD - created by archiving change add-lakes. Update Purpose after archive.
## Requirements
### Requirement: Laghi category
The achievements panel SHALL have a "Laghi" category in the Geografia group with steps at 5, 15 and all comuni whose name is exactly the name of a lake (a fixed list of 39). Comuni that only contain a lake's name (Castelnuovo del Garda) MUST NOT count. Steps SHALL unlock with a toast during play and silently on load.

#### Scenario: Five lakes
- **WHEN** the player finds Garda, Castelnuovo del Garda, Iseo, Como and Nemi
- **THEN** "5 laghi" is still locked and the category shows 4/39

#### Scenario: Fifth lake
- **WHEN** the player then finds Bracciano
- **THEN** "5 laghi" unlocks with the toast "5 comuni-lago trovati" and the list of found lakes has 5 names

### Requirement: Found list for the largest comuni
The "I più estesi" category SHALL have a closed list "Più estesi trovati (n)" with the found comuni among the 100 largest, in order of area and with their rank.

#### Scenario: Roma first
- **WHEN** Roma and Ravenna are found and the list is opened
- **THEN** it starts with "1. Roma" and "2. Ravenna"

