## ADDED Requirements

### Requirement: Side panel tabs
The side panel SHALL have two tabs, "Regioni" and "Traguardi", with only the selected one visible. The "Traguardi" tab SHALL show the unlocked/total count. "Regioni" SHALL be selected on load.

#### Scenario: Switch to achievements
- **WHEN** the player clicks "Traguardi"
- **THEN** the achievements panel is shown and the regions panel is hidden

### Requirement: Region progress and sort
Each region row SHALL show its colour, name, percentage found, found/total and a progress bar; each province row SHALL show a progress bar and found/total. The regions SHALL be sortable alphabetically (default), by percentage found (descending) or by comuni missing (ascending).

#### Scenario: Sort by percentage
- **WHEN** the player selects "%"
- **THEN** the region with the highest share found comes first

### Requirement: Achievement categories and filter
The achievements panel SHALL show the total unlocked/total with a bar, a filter "Tutti" / "Sbloccati" / "Da fare", and one collapsible row per category with its unlocked/total and a bar. Filtering SHALL show only the matching achievements.

#### Scenario: Filters add up
- **WHEN** the player compares "Sbloccati" and "Da fare"
- **THEN** together they list every achievement shown under "Tutti", and "Sbloccati" lists as many as the unlocked count
