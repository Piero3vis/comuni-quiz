# borghi-belli Specification

## Purpose
TBD - created by archiving change add-borghi-belli. Update Purpose after archive.
## Requirements
### Requirement: Borghi più belli data
`data/borghi.json` SHALL list the comuni that are members of "I Borghi più belli d’Italia", grouped by region, with an update date `agg` and an `https` source `fonte`. Every name MUST resolve to exactly one comune whose region matches its group. A borgo that is a frazione MUST be listed under its comune, with the frazione name in `fraz`. San Marino MUST NOT be listed.

#### Scenario: Data resolves
- **WHEN** the data is loaded
- **THEN** every name resolves to one comune of the region it is listed under, and `fonte` is an `https` URL

#### Scenario: Frazione
- **WHEN** a borgo is a frazione of a comune
- **THEN** the comune is listed and the found list shows "Comune (Frazione)"

### Requirement: National steps
The achievements panel SHALL have a category "Borghi più belli d’Italia" in the group "Città e borghi", with steps for 10, 50, 100 and 200 borghi found and one for all of them, ids `bb:<n>`, and an info line with found/total and the update date.

#### Scenario: Ten borghi
- **WHEN** the player finds the tenth comune of the list
- **THEN** `bb:10` is unlocked with a toast

### Requirement: One achievement per region
The category SHALL include one row per region that has at least one borgo, id `bb:r<k>`, showing found/total and unlocked when every borgo of the region is found. Achievements MUST be derived from the found comuni and restored silently on reload.

#### Scenario: Region completed
- **WHEN** the player finds every borgo of a region
- **THEN** the regional achievement is unlocked

#### Scenario: Reload
- **WHEN** a saved game that completes a region is loaded
- **THEN** the achievement is unlocked without a toast and without being stored

