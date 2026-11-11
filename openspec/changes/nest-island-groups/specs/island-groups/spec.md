## ADDED Requirements

### Requirement: Islands inside their archipelago
An island group with `parte` SHALL be shown in the "Isole" category as a sub-row of the archipelago it names: Ischia under Isole campane, Isola d'Elba under Arcipelago toscano. Every comune of the island MUST belong to the archipelago, and the island keeps its own achievement.

#### Scenario: Nested rows
- **WHEN** the "Isole" category is opened
- **THEN** the Ischia row follows Isole campane and is marked as part of it, and the Isola d'Elba row follows Arcipelago toscano

#### Scenario: Data check
- **WHEN** an island's `parte` names a missing group, or one of its comuni is not in the archipelago
- **THEN** loading the data fails with an error naming the group
