# fact-toast Specification

## Purpose
TBD - created by archiving change fact-toast-and-walk-weight. Update Purpose after archive.
## Requirements
### Requirement: Curiosità shown when found
When a guess finds a comune that has a curiosità, a toast SHALL show "💡 Curiosità su <name>: <text>". Loading a saved game SHALL NOT show these toasts.

#### Scenario: Finding Elva
- **WHEN** the player types "elva" during a game
- **THEN** a toast shows "💡 Curiosità su Elva: " followed by Elva's curiosità

#### Scenario: Comune without curiosità
- **WHEN** the player finds Milano
- **THEN** no curiosità toast is shown

