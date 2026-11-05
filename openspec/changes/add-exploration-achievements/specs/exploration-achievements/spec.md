## ADDED Requirements

### Requirement: Achievement for one comune in every region
The quiz SHALL have an achievement "Giro d’Italia" unlocked when at least one comune has been found in every region. It SHALL unlock once, with the toast "🇮🇹 Giro d’Italia: almeno un comune in ogni regione!", when the first comune of the last missing region is found during play, and silently when saved progress already covers every region. It SHALL count towards the overall achievements total.

#### Scenario: Finding the last missing region
- **WHEN** the player has found comuni in 19 regions and finds a comune in the 20th
- **THEN** the toast appears and the achievement is listed as unlocked

#### Scenario: Restored progress
- **WHEN** the page loads saved progress with at least one comune in every region
- **THEN** the achievement is unlocked without a toast

### Requirement: Achievement for one comune in every province
The quiz SHALL have an achievement "Giro delle province" unlocked when at least one comune has been found in every province of the map data. It SHALL unlock once, with the toast "🧭 Giro delle province: almeno un comune in ogni provincia!", when the first comune of the last missing province is found during play, and silently when saved progress already covers every province. It SHALL count towards the overall achievements total.

#### Scenario: Finding the last missing province
- **WHEN** the player has found comuni in every province but one, and finds a comune in that province
- **THEN** the toast appears and the achievement is listed as unlocked

#### Scenario: Restored progress
- **WHEN** the page loads saved progress with at least one comune in every province
- **THEN** the achievement is unlocked without a toast

### Requirement: Exploration progress is shown
The achievements panel SHALL contain an "Esplorazione" section, after "Segreti", with a "Giro d’Italia" row showing regions with at least one comune found out of the total, and a "Giro delle province" row showing the same for provinces. Each row SHALL show 🔒 while locked and its own icon once unlocked.

#### Scenario: Early in the game
- **WHEN** the player has found comuni in 6 provinces of 5 regions
- **THEN** the rows show "🔒 Giro d’Italia" with "5/20" and "🔒 Giro delle province" with "6/110" (110 provinces in the current map data)
