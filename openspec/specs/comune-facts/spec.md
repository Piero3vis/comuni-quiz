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

