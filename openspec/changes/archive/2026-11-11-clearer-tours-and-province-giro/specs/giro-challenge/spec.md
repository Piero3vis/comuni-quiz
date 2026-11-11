## MODIFIED Requirements

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
