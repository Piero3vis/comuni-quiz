## ADDED Requirements

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
The challenge SHALL be earned when one run has touched all 18 regions of the peninsula; it SHALL then stay earned (saved in `comuniQuizV1.a`). The run in progress SHALL be saved in `comuniQuizV1.gr` and restored on reload. The side panel SHALL show the regions of the current run and its last region.

#### Scenario: Completing the tour
- **WHEN** a run reaches its 18th region
- **THEN** a toast announces the Giro d'Italia a tappe and the challenge shows as earned after a reload

#### Scenario: Run survives a reload
- **WHEN** the page is reloaded during a run of 5 regions
- **THEN** the panel still shows 5/18 and the next bordering guess continues the run
