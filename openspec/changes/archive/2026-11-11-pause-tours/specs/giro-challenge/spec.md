## ADDED Requirements

### Requirement: Tours paused
While a guess can be taken by a shorter comune name that is the beginning of the name being typed, the "Giro d’Italia a tappe" and "Giro delle province a tappe" challenges SHALL be switched off by a single constant `TOURS_ON` in `app.js`. When off, they MUST NOT appear in the achievements panel, MUST NOT show toasts or count steps, and a run or an earned id already in the save MUST be kept unchanged.

#### Scenario: Tours hidden
- **WHEN** the page is loaded with `TOURS_ON` false
- **THEN** the Sfide category shows Raffica and Italia a piedi, and no row for the two tours

#### Scenario: Saved run kept
- **WHEN** a save contains `tr` with a tour in progress and `a` with `giro`, and a comune is guessed
- **THEN** the new save still contains the same `tr` value and `giro` in `a`
