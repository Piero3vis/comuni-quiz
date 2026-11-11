# coast-to-coast Specification

## Purpose
TBD - created by archiving change add-coast-and-giro-challenges. Update Purpose after archive.
## Requirements
### Requirement: Sea-to-sea achievements across land
The "Da costa a costa" category SHALL contain nine achievements: Tirreno–Adriatico, Adriatico–Ionio, Ionio–Tirreno, Ligure–Adriatico, Ligure–Tirreno, Ligure–Ionio, Tirreno–Canale di Sicilia, Ionio–Canale di Sicilia, Tirreno–Mar di Sardegna. An achievement SHALL unlock when a found coastal comune on one sea and a found coastal comune on the other are both bordered by the same connected group of found inland (non-coastal) comuni. The order of guesses SHALL NOT matter.

#### Scenario: Crossing the peninsula
- **WHEN** the player finds a Tyrrhenian coastal comune, a chain of bordering inland comuni, and an Adriatic coastal comune bordering the end of the chain
- **THEN** "Tirreno – Adriatico" unlocks with a toast naming the two coastal comuni

#### Scenario: Walking along the coast does not count
- **WHEN** the player finds only coastal comuni around Santa Maria di Leuca, from the Adriatic side to the Ionian side
- **THEN** "Adriatico – Ionio" stays locked

#### Scenario: Restored on reload
- **WHEN** a saved game already contains such a chain and the page is reloaded
- **THEN** the achievement is shown as unlocked without a toast

