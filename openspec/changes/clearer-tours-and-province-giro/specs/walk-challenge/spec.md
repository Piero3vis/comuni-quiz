## MODIFIED Requirements

### Requirement: Italia a piedi
The super-challenge "Italia a piedi" SHALL unlock when the found comuni of the peninsula, capoluoghi included, contain one connected group of bordering comuni that touches all 18 regions of the peninsula. Island comuni SHALL NOT count. The order of guesses SHALL NOT matter. The challenge row SHALL show the rule and the largest number of regions touched by one such group, with the regions it still misses (listed when 8 or fewer, otherwise counted).

#### Scenario: Progress
- **WHEN** the player has found two separate chains, one touching 3 regions and one touching 5
- **THEN** the panel shows 5/18

#### Scenario: Capoluoghi connect
- **WHEN** two chains in different regions are joined only through a found capoluogo
- **THEN** they count as one chain

#### Scenario: Completion
- **WHEN** a single chain touches all 18 regions of the peninsula
- **THEN** "Italia a piedi" unlocks with a toast
