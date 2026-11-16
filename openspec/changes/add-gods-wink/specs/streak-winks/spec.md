## ADDED Requirements

### Requirement: Gods wink
The game SHALL have a secret wink "Olimpo" that unlocks after three consecutive correct new guesses of comuni from a fixed list of comuni named after a god, with the toast "Only Giano can judge me.". Comuni that only contain a god's letters by chance MUST NOT count.

#### Scenario: Three gods in a row
- **WHEN** the player finds Ercolano, Portovenere and Giano dell’Umbria one after the other
- **THEN** "🔱 Olimpo" unlocks and the toast says "Only Giano can judge me."

#### Scenario: Not a god
- **WHEN** the player finds Giove, Nettuno, then Martellago
- **THEN** the streak is reset and the wink stays locked
