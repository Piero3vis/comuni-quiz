## ADDED Requirements

### Requirement: Start by typing
The text box SHALL be enabled whenever the game is not over. Typing the name of a comune while the game is not running SHALL start (or resume) the game and count the guess, exactly as if "Inizia" or "Riprendi" had been pressed first.

#### Scenario: New player types without pressing Inizia
- **WHEN** a new player types "roma" in the box
- **THEN** Roma is found, the counter shows 1, the button says "Pausa", "Mi arrendo" is enabled and the timer runs

#### Scenario: Typing during a pause
- **WHEN** the game is paused and the player types a comune not found yet
- **THEN** the game resumes and the comune is found

#### Scenario: Game over
- **WHEN** the player has given up
- **THEN** the box is disabled and typing does nothing

### Requirement: Placeholder tells what to do
The placeholder SHALL be "Scrivi il nome di un comune per iniziare…" for a new game, "Scrivi il nome di un comune…" while running and "In pausa: scrivi un comune per riprendere…" while paused, including after a reload with saved progress.

#### Scenario: Pause
- **WHEN** the player presses Pausa
- **THEN** the box stays enabled and its placeholder is "In pausa: scrivi un comune per riprendere…"

### Requirement: Feedback on Enter
Pressing Enter on text that matches no comune SHALL show the notice "Nessun comune si chiama così" for a moment, without clearing the text.

#### Scenario: Wrong name
- **WHEN** the player types "Paperopoli" and presses Enter
- **THEN** the notice "Nessun comune si chiama così" appears and the text stays
