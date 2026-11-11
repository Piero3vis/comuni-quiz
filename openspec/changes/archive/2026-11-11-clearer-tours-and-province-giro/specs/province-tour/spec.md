## ADDED Requirements

### Requirement: Province-by-province run
The challenge "Giro delle province a tappe" SHALL apply the Giro rule to provinces: a guess adding an allowed comune (on the peninsula, not a capoluogo) in the run's last province or in a bordering province extends the run; a guess whose new comuni are all forbidden (capoluogo or island) ends it; a guess with only allowed comuni in non-bordering provinces starts a new run from its first allowed comune. Repeated guesses and unrecognised text SHALL NOT affect the run. Bordering provinces are those with at least one pair of bordering comuni on the peninsula. The run SHALL be independent of the region run.

#### Scenario: Moving to a bordering province
- **WHEN** the last stage is in the province of Verona and the player finds a non-capoluogo comune in the province of Mantova
- **THEN** the province run continues with 2 provinces

#### Scenario: Jump
- **WHEN** the last stage is in the province of Verona and the player finds a comune in the province of Bari
- **THEN** the province run restarts from that comune with 1 province

### Requirement: Province run completion and persistence
The challenge SHALL be earned when one run has touched all 93 provinces of the peninsula and SHALL then stay earned (saved in `comuniQuizV1.a`). The run in progress SHALL be saved in `comuniQuizV1.tr.giroP` and restored on reload. Toasts SHALL announce every 10th province of a run, a break after at least 5 provinces, and the completion.

#### Scenario: Status in the panel
- **WHEN** a province run is in progress
- **THEN** the challenge row shows the count, the last province, the provinces the next stage can be in and how many provinces are missing
