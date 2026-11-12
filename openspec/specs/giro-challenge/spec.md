# giro-challenge Specification

## Purpose
TBD - created by archiving change add-coast-and-giro-challenges. Update Purpose after archive.
## Requirements
### Requirement: Region-by-region run
The challenge "Giro d'Italia a tappe" SHALL track a run of consecutive guesses. A guess that adds an allowed comune (on the peninsula, not a capoluogo) in the run's last region or in a bordering region SHALL extend the run. A guess whose new comuni are all forbidden (capoluogo or island) SHALL end the run. A guess that adds only allowed comuni in non-bordering regions SHALL start a new run from its first allowed comune. Repeated guesses and unrecognised text SHALL NOT affect the run. Bordering regions are those with at least one pair of bordering comuni on the peninsula.

#### Scenario: Moving to a bordering region
- **WHEN** the last stage is in Veneto and the player finds a non-capoluogo comune in Emilia-Romagna
- **THEN** the run continues and counts Emilia-Romagna

#### Scenario: Jumping
- **WHEN** the last stage is in Veneto and the player finds a comune in Puglia
- **THEN** the run restarts from that comune with 1 region

#### Scenario: Capoluogo or island
- **WHEN** the player finds a capoluogo (e.g. Padova) or an island comune during a run
- **THEN** the run ends, and the next allowed comune starts a new run

### Requirement: Giro completion and persistence
The challenge SHALL be earned when one run has touched all 18 regions of the peninsula; it SHALL then stay earned (saved in `comuniQuizV1.a`). The run in progress SHALL be saved in `comuniQuizV1.tr.giro` and restored on reload; a run saved by the previous version in `comuniQuizV1.gr` SHALL still be restored. The challenge row SHALL always show the rule (start from any region of the peninsula, same or bordering region each time, going back allowed, capoluoghi and island comuni end the run) and a status line: how to start when no run is in progress; otherwise the last region, the regions the next stage can be in and the regions still missing (listed when 8 or fewer, otherwise counted).

#### Scenario: Completing the tour
- **WHEN** a run reaches its 18th region
- **THEN** a toast announces the Giro d'Italia a tappe and the challenge shows as earned after a reload

#### Scenario: Run survives a reload
- **WHEN** the page is reloaded during a run of 5 regions
- **THEN** the panel still shows 5/18 and the next bordering guess continues the run

#### Scenario: Old save
- **WHEN** a save contains `gr: [region, mask]` from the previous version
- **THEN** the run is restored with that last region and those regions

#### Scenario: Next-stage hint
- **WHEN** the last stage is in Friuli-Venezia Giulia
- **THEN** the status line says the next stage can be in Friuli-Venezia Giulia or Veneto

### Requirement: Tours paused
While a guess can be taken by a shorter comune name that is the beginning of the name being typed, the "Giro d’Italia a tappe" and "Giro delle province a tappe" challenges SHALL be switched off by a single constant `TOURS_ON` in `app.js`. When off, they MUST NOT appear in the achievements panel, MUST NOT show toasts or count steps, and a run or an earned id already in the save MUST be kept unchanged.

#### Scenario: Tours hidden
- **WHEN** the page is loaded with `TOURS_ON` false
- **THEN** the Sfide category shows Raffica and Italia a piedi, and no row for the two tours

#### Scenario: Saved run kept
- **WHEN** a save contains `tr` with a tour in progress and `a` with `giro`, and a comune is guessed
- **THEN** the new save still contains the same `tr` value and `giro` in `a`

