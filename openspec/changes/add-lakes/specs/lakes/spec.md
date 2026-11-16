## ADDED Requirements

### Requirement: Laghi category
The achievements panel SHALL have a "Laghi" category in the Geografia group with steps at 5, 15 and all comuni whose name is exactly the name of a lake (a fixed list of 39). Comuni that only contain a lake's name (Castelnuovo del Garda) MUST NOT count. Steps SHALL unlock with a toast during play and silently on load.

#### Scenario: Five lakes
- **WHEN** the player finds Garda, Castelnuovo del Garda, Iseo, Como and Nemi
- **THEN** "5 laghi" is still locked and the category shows 4/39

#### Scenario: Fifth lake
- **WHEN** the player then finds Bracciano
- **THEN** "5 laghi" unlocks with the toast "5 comuni-lago trovati" and the list of found lakes has 5 names
