# comune-facts Specification

## Purpose
TBD - created by archiving change facts-one-per-province. Update Purpose after archive.
## Requirements
### Requirement: Curiosità have a source
Every entry of `data/facts.json` SHALL be an object with `testo` (the curiosità) and `fonte` (an `https://` URL of a page that supports the whole text). The app SHALL show `testo` in the click box and in the toast as before.

#### Scenario: Missing source
- **WHEN** an entry has no `fonte` or it is not an `https://` URL
- **THEN** `npm test` fails naming the comune

#### Scenario: Text still shown
- **WHEN** the player finds Elva
- **THEN** the toast shows the `testo` of Elva

### Requirement: No curiosità for capoluoghi
No capoluogo (as listed in `extra.json` `cap`) SHALL have a curiosità.

#### Scenario: Capoluogo added by mistake
- **WHEN** `facts.json` contains a capoluogo
- **THEN** `npm test` fails naming it

### Requirement: Curiosità do not give the name away
The text SHALL NOT contain the comune's name or any `/` part of it (ignoring case, accents and punctuation), SHALL be at most 200 characters and SHALL use the typographic apostrophe.

#### Scenario: Word containing the name
- **WHEN** the text of Adria contains "Adriatico"
- **THEN** `npm test` fails

### Requirement: Veneto covered
Each of the 7 provinces of Veneto SHALL have at least one curiosità.

#### Scenario: Coverage
- **WHEN** the tests print the coverage report
- **THEN** Belluno, Padova, Rovigo, Treviso, Venezia, Verona and Vicenza each have a curiosità

### Requirement: Comune facts in the map box
The quiz SHALL load short facts from `data/facts.json`, keyed by comune name as in `data/groups.json`, and SHALL fail to load if a name is missing or ambiguous. When a comune with a fact is clicked on the map, the box SHALL contain a closed disclosure with the fact.

#### Scenario: Found comune
- **WHEN** the player clicks a found comune that has a fact
- **THEN** the box shows residents and rarity points and, under them, a closed "💡 Curiosità" that opens to the fact

#### Scenario: Comune not found yet
- **WHEN** the player clicks a comune not found yet that has a fact
- **THEN** the box shows a closed "💡 Indizio: una curiosità" next to "Rivela nome"

#### Scenario: No fact
- **WHEN** the clicked comune has no fact
- **THEN** the box is unchanged

### Requirement: Facts do not give the name away
A fact SHALL NOT contain the comune's name or any of its `/`-separated parts, compared after the quiz's normalisation.

#### Scenario: Clue without the name
- **WHEN** the clue for an unfound comune is opened
- **THEN** its text does not contain the comune's name

