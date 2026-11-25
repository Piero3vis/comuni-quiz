## ADDED Requirements

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
