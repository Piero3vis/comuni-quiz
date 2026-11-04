## ADDED Requirements

### Requirement: Giving up shows every comune
After the player gives up, the map SHALL show every missing comune in its region colour at 50% opacity, the side list SHALL list every comune of each province with missing ones visually marked, and a toast SHALL report the comuni found, the total and the time.

#### Scenario: Give up with 3 comuni found
- **WHEN** the player has found Roma, Milano and Napoli and gives up
- **THEN** the side list contains all 7.896 comuni, 7.893 of them marked as missing, and the toast "🏳️ Hai trovato 3 comuni su 7.896 in …" appears

### Requirement: The end of the game is saved
The surrender SHALL be saved with the progress. Loading a save of a surrendered or completed game SHALL show the end state (input disabled, every comune shown if surrendered) and SHALL NOT allow resuming.

#### Scenario: Reload after giving up
- **WHEN** the player gives up and reloads the page
- **THEN** the game is still over, every comune is shown and the main button reads "Ricomincia"

### Requirement: Restart
When the game is over, the main button SHALL read "Ricomincia" and be enabled, and "Mi arrendo" SHALL be disabled. Pressing it SHALL ask for confirmation and then delete the saved game (comuni, time, challenges), keep the theme choice, and start from an empty game.

#### Scenario: Restart after giving up
- **WHEN** the player presses "Ricomincia" and confirms
- **THEN** `localStorage['comuniQuizV1']` is removed and the page reloads with 0 comuni found
