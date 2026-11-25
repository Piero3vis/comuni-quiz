## ADDED Requirements

### Requirement: A typed name fills every comune that has it
When the typed text (ignoring case, accents, apostrophes and spaces) equals the name of more than one comune, the quiz SHALL mark all of those comuni as found in a single guess. The data currently has five such names: Samone (TO, TN), Livo (CO, TN), Peglio (CO, PU), Castro (BG, LE) and San Teodoro (ME, OT).

#### Scenario: Both Castro are accepted
- **WHEN** the quiz is running and the player types "castro"
- **THEN** both Castro (BG) and Castro (LE) are marked as found and the counter increases by 2

#### Scenario: One of the homonyms was already found
- **WHEN** Castro (BG) is found (e.g. from saved progress) but Castro (LE) is not, and the player types "Castro"
- **THEN** Castro (LE) is marked as found and the counter increases by 1

#### Scenario: Repeating a shared name
- **WHEN** both Castro are already found and the player types "castro" again
- **THEN** no comune is added and the duplicate notice reads "Già indovinato: Castro (2 comuni con questo nome)"
