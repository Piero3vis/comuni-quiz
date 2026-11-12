## ADDED Requirements

### Requirement: Streak winks
The game SHALL recognise a streak of consecutive correct new guesses that fit the same theme (santi, cervi, gallo, parole comuni, nomi parlanti, autostrade) and, when the streak reaches the theme's length, unlock a secret achievement once and show a toast. A correct new guess outside the theme MUST reset that theme's streak. A guess that fills several homonyms MUST count as one.

#### Scenario: Gallo after three in a row
- **WHEN** the player finds Cantagallo, Gallodoro and Montegallo one after the other
- **THEN** the gallo wink unlocks and a Robin Hood toast is shown

#### Scenario: Streak broken
- **WHEN** the player finds Cantagallo, Gallodoro, then Roma, then Montegallo
- **THEN** the gallo wink does not unlock

### Requirement: Hidden and saved
Winks SHALL appear in the Segreti category as "🔒 ???" until unlocked, and SHALL stay unlocked after a reload.

#### Scenario: Reload
- **WHEN** a wink is unlocked and the page is reloaded
- **THEN** the wink is still shown as unlocked in Segreti
