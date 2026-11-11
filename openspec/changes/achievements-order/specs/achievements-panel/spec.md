## ADDED Requirements

### Requirement: Categories ordered by theme
The achievements panel SHALL list the categories in five groups, in this order: Progressi, Sfide, Geografia, Cultura e storia, Segreti. Achievement ids MUST NOT change.

#### Scenario: Order
- **WHEN** the achievements tab is opened
- **THEN** "Traguardi" is the first category, "A tempo" comes before "Costa italiana", "Costa italiana" before "Cammini", and "Segreti" is the last

#### Scenario: Saves unaffected
- **WHEN** a save made before the change is loaded
- **THEN** the same achievements are unlocked and the total is the same
