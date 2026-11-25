# cognomi Specification

## Purpose
TBD - created by archiving change add-cognomi. Update Purpose after archive.
## Requirements
### Requirement: Same-surname groups
The achievements panel SHALL have a "Stesso cognome" category in the Geografia group, right after Laghi, with one achievement for each group in `groups.json` `cognomi`. An achievement SHALL unlock when every comune of its group is found, with a toast that shows the group's `nota`, and silently on load.

#### Scenario: Strada del vino
- **WHEN** the player finds 7 of the 8 comuni "sulla strada del vino"
- **THEN** the row is locked and shows 7/8

#### Scenario: VINOOH
- **WHEN** the player finds the eighth
- **THEN** the achievement unlocks with the toast "🏷️ Sulla strada del vino: 🍷 VINOOH!!" and stays unlocked after a reload

### Requirement: Same area
A group named after a place SHALL contain only comuni of that historical area: a comune whose name has the same word but lies elsewhere MUST NOT be in the group.

#### Scenario: Polesine
- **WHEN** the Polesine group is read
- **THEN** it does not contain Polesine Zibello (province of Parma)

