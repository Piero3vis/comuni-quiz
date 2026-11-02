## ADDED Requirements

### Requirement: Municipal boundaries are credited under CC BY 4.0
The page footer SHALL credit ISTAT as the source of the municipal boundaries, link to openpolis/geojson-italy, link to the CC BY 4.0 licence (`https://creativecommons.org/licenses/by/4.0/deed.it`) and state that the boundaries were simplified and modified.

#### Scenario: Footer carries the full attribution
- **WHEN** either the multi-file page or `dist/quiz.html` is loaded
- **THEN** the footer contains "ISTAT", a link to `https://github.com/openpolis/geojson-italy`, a link to the CC BY 4.0 licence and the words "semplificati e modificati"

### Requirement: State borders are credited
The footer SHALL credit Natural Earth for the state borders used to compute the coast, noting they are in the public domain.

#### Scenario: Natural Earth credit
- **WHEN** the page is loaded
- **THEN** the footer contains "Natural Earth" and "pubblico dominio"
