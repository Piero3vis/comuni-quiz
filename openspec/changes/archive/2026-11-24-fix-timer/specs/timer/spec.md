## ADDED Requirements

### Requirement: Timer shows and keeps the play time
The clock SHALL show the saved play time on load (0:00:00 without saved progress), advance only while the quiz is running, stay still while paused or finished, and resume from the saved time.

#### Scenario: Fresh load
- **WHEN** the page loads without saved progress
- **THEN** the clock shows 0:00:00

#### Scenario: Resuming saved progress
- **WHEN** the saved play time is 65 seconds and the player presses Inizia and plays for about a second
- **THEN** the clock shows 0:01:05 on load and 0:01:06 after that second

#### Scenario: Pause
- **WHEN** the player pauses
- **THEN** the clock stops and does not advance until the player resumes

### Requirement: Play time is saved accurately
The play time saved in `comuniQuizV1` SHALL be up to date when the player pauses, finishes or gives up, and when the page is closed while the quiz is running.

#### Scenario: Saving on pause
- **WHEN** the player pauses after playing
- **THEN** the saved time equals the time shown, to within a second

#### Scenario: Closing the tab while playing
- **WHEN** the player closes the tab while the quiz is running, without a new guess since the last save
- **THEN** reopening the page shows the time reached at closing
