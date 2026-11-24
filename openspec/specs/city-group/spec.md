# city-group Specification

## Purpose
TBD - created by archiving change add-city-group. Update Purpose after archive.
## Requirements
### Requirement: Città e borghi group
The achievements panel SHALL have a theme group "Città e borghi" after Geografia containing, in order, Grandi città, Borghi, Paesini, Microcomuni and Tesori di provincia; these categories MUST NOT appear in other groups.

#### Scenario: Group order
- **WHEN** the player opens the achievements tab
- **THEN** the group titles are Progressi, Sfide, Geografia, Città e borghi, Cultura e storia, Segreti

### Requirement: Most populous comuni
Grandi città SHALL include the 10, 25, 50 and 100 most populous comuni (by residents), each unlocked when all of its comuni are found, with a toast, and its rows SHALL be sorted by the number of comuni.

#### Scenario: Finding Roma
- **WHEN** every comune with at least 100.000 residents except Roma is found and the player types "roma"
- **THEN** "I 10 comuni più popolosi" and "I 25 comuni più popolosi" unlock and "I 50 comuni più popolosi" shows 44/50

