# walk-challenge Specification

## Purpose
TBD - created by archiving change add-coast-and-giro-challenges. Update Purpose after archive.
## Requirements
### Requirement: Italia a piedi
The super-challenge "Italia a piedi" SHALL unlock when the found comuni of the peninsula, capoluoghi excluded, contain one connected group of bordering comuni that touches all 18 regions of the peninsula. The order of guesses SHALL NOT matter. The side panel SHALL show the largest number of regions touched by one such group.

#### Scenario: Progress
- **WHEN** the player has found two separate chains, one touching 3 regions and one touching 5
- **THEN** the panel shows 5/18

#### Scenario: Capoluoghi do not connect
- **WHEN** two chains are joined only through a found capoluogo
- **THEN** they still count as separate chains

#### Scenario: Completion
- **WHEN** a single chain touches all 18 regions of the peninsula
- **THEN** "Italia a piedi" unlocks with a toast

