## ADDED Requirements

### Requirement: Rarity score
Every comune SHALL be worth `max(1, round(10 · log10(P / pop)))` rarity points, where `pop` is its population and `P` the population of the most populated comune. The map SHALL show the total for the comuni found as "💎 N punti rarità" next to "persone beccate", updated after every correct guess and on load. The info shown for a found comune SHALL include its inhabitants and rarity points.

#### Scenario: Roma and Morterone
- **WHEN** the player finds Roma and then Morterone
- **THEN** the rarity score goes from 1 to 50

### Requirement: Borghi achievements
The quiz SHALL have achievements for the number of comuni found below 1.000 ("Borghi"), 500 ("Paesini") and 100 ("Microcomuni") inhabitants, at 10, 100 and 500 when lower than the total, and at the total. Each category SHALL have a section with found/total. They SHALL unlock with a toast during play or silently on load, and count in the totals.

#### Scenario: All microcomuni
- **WHEN** the player finds all 67 comuni under 100 inhabitants
- **THEN** "🔬 Tutti i microcomuni" is unlocked and the section shows 67/67

### Requirement: Rare comune toast
Finding a comune with fewer than 100 inhabitants during play SHALL show the toast "🔍 Comune raro: <name>, <pop> abitanti!".

#### Scenario: Pedesina
- **WHEN** the player finds Pedesina
- **THEN** the toast "🔍 Comune raro: Pedesina, 37 abitanti!" appears

### Requirement: Provincial treasures
The least populated comune of each province SHALL be its treasure. Finding one during play SHALL show a toast naming it and its province. Achievements SHALL unlock at 10, 50 and all treasures, and a "Tesori di provincia" section SHALL show found/total and a collapsible list of the treasures found as "<province>: <comune>".

#### Scenario: Morterone
- **WHEN** the player finds Morterone
- **THEN** the toast "🗝️ Tesoro: Morterone è il comune meno popoloso della Provincia di Lecco" appears and the list contains "Lecco: Morterone"
