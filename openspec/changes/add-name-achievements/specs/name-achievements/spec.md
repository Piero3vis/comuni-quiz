## ADDED Requirements

### Requirement: Nomi category
The achievements panel SHALL have a "Nomi" category in Cultura e storia with: the longest name, the longest names (at least 10, all ties included), all comuni with two letters, all comuni with at most three letters. Length SHALL count letters only, using the Italian part of bilingual names. Locked achievements MUST NOT show the names; a closed list SHALL show the found ones with their length, longest first.

#### Scenario: Two letters
- **WHEN** the player finds Ne, Vo’ and Re
- **THEN** "Due lettere" unlocks with a toast and "Tre lettere o meno" shows 3/23

#### Scenario: Longest
- **WHEN** the player finds San Valentino in Abruzzo Citeriore
- **THEN** "Il nome più lungo" unlocks and the list starts with "San Valentino in Abruzzo Citeriore (30)"
