## ADDED Requirements

### Requirement: History and maritime republic groups
The quiz SHALL have achievements for the groups "Le capitali d’Italia", "Capitali per caso", "Repubblica di Cospaia", "Principato di Seborga", "Le quattro repubbliche marinare", "Non erano solo quattro" and "Tutte le repubbliche marinare", unlocked when every comune of the group is found, with a toast during play or silently on load.

#### Scenario: Cospaia
- **WHEN** the player finds San Giustino
- **THEN** "Repubblica di Cospaia" is unlocked and a toast tells its story

### Requirement: Border groups
The quiz SHALL have one achievement per neighbouring state (France, Switzerland, Austria, Slovenia, San Marino, Vatican) for finding every comune on that border, and "Giro delle frontiere" for at least one comune on each border. The border lists SHALL come from `scripts/border_comuni.py`.

#### Scenario: Six borders
- **WHEN** the player finds Ventimiglia, Como, Brennero, Gorizia, Rimini and Roma
- **THEN** "Giro delle frontiere" is unlocked

### Requirement: Anecdotes
A group MAY have a `nota`. It SHALL be shown in the unlock toast and under the unlocked achievement, and SHALL NOT be shown while the achievement is locked.

#### Scenario: Hidden answer
- **WHEN** "Non erano solo quattro" is locked
- **THEN** the list does not show which cities it needs
