## ADDED Requirements

### Requirement: Gods wink
The game SHALL have a secret wink "Olimpo" that unlocks after three consecutive correct new guesses of comuni from a fixed list of comuni named after a god, with the toast "Only Giano can judge me.". Comuni that only contain a god's letters by chance MUST NOT count.

#### Scenario: Three gods in a row
- **WHEN** the player finds Ercolano, Portovenere and Giano dell’Umbria one after the other
- **THEN** "🔱 Olimpo" unlocks and the toast says "Only Giano can judge me."

#### Scenario: Not a god
- **WHEN** the player finds Giove, Nettuno, then Martellago
- **THEN** the streak is reset and the wink stays locked

### Requirement: Cryptic secret names
A locked secret (count secrets and winks) SHALL be shown in Segreti as "🔒" followed by its cryptic name only, without its rule, detail or count. The names SHALL NOT state the theme: the gallo, cervi and parole winks are called "Urca tirulero", "310 gradi" and "Elementare". Ids MUST NOT change.

#### Scenario: Locked secret
- **WHEN** the achievements tab is opened before any secret is unlocked
- **THEN** Segreti shows "🔒 Olimpo", "🔒 Urca tirulero" and "🔒 Nice." and no "???" or rule text

#### Scenario: Unlocked secret
- **WHEN** the player finds Ponte, Sale and Scala one after the other
- **THEN** a toast appears and Segreti shows "💬 Elementare" with "Tre comuni che sono parole di tutti i giorni, di fila."

### Requirement: Gall names
The gallo wink SHALL count every comune whose name contains "gall", not only "gallo".

#### Scenario: Gallicano, Senigallia, Galliera
- **WHEN** the player finds Gallicano, Senigallia and Galliera one after the other
- **THEN** "🐓 Urca tirulero" unlocks
