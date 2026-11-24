# language-minorities Specification

## Purpose
TBD - created by archiving change add-minoranze. Update Purpose after archive.
## Requirements
### Requirement: Language minority groups data
`data/groups.json` SHALL contain a list `minoranze` with exactly 8 groups, in this order: Francoprovenzale, Occitana, Ladina, Albanese (arbëreshë), Slovena, Greca, Croata, Catalana. Each group MUST have `name`, `comuni` (names resolvable by `withGroups()`), `nota` and `fonte` (an `https://` URL or a list of them). Sardinian, Friulian, German and French minorities MUST NOT be included.

#### Scenario: Groups resolve
- **WHEN** the data is loaded
- **THEN** `D.min` has 8 groups, every name resolves to exactly one comune, and every group has an `https` source

#### Scenario: Single-comune group
- **WHEN** the Catalana group is loaded
- **THEN** it contains only Alghero

#### Scenario: Whole Valle d'Aosta
- **WHEN** the Francoprovenzale group is loaded
- **THEN** it contains every comune of Valle d'Aosta

### Requirement: One achievement per minority
The achievements panel SHALL have a category "Minoranze linguistiche" in the group "Cultura e storia" with one row per minority, id `ml:<gi>`, showing found/total, unlocked when every comune of the group is found. A comune in two groups MUST count for both.

#### Scenario: Croatian minority completed
- **WHEN** the player finds every comune of the Croatian group (Acquaviva Collecroce, Montemitro, San Felice del Molise, Tavenna)
- **THEN** the achievement for the Croatian minority is unlocked and its `nota` is shown

#### Scenario: Restored on reload
- **WHEN** a saved game with all comuni of a group is loaded
- **THEN** the achievement is unlocked silently, without being stored

### Requirement: Tour of minorities
The category SHALL include "Giro delle minoranze", id `ml:giro`, unlocked when at least one comune of every minority group is found, showing how many groups are touched out of 8.

#### Scenario: Giro delle minoranze
- **WHEN** the player has found one comune in each of the 8 groups
- **THEN** `ml:giro` is unlocked

