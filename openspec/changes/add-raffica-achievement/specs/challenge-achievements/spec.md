## ADDED Requirements

### Requirement: Raffica achievement
The quiz SHALL have an achievement "Raffica" unlocked when 10 comuni have been found by guesses made within 60 seconds of real time while playing. It SHALL unlock once with the toast "⚡ Raffica: 10 comuni in un minuto!", and the achievements panel SHALL show it in a "Sfide" section with the rule "10 comuni in un minuto" (🔒 while locked). It SHALL count towards the overall total.

#### Scenario: Fast answers
- **WHEN** the player finds 10 comuni in 40 seconds
- **THEN** the toast appears and "⚡ Raffica" is listed as unlocked

#### Scenario: Slow answers
- **WHEN** the player finds 10 comuni over 3 minutes, never 10 within 60 seconds
- **THEN** Raffica stays locked

### Requirement: Challenge achievements are saved
Earned challenge achievements SHALL be saved in `localStorage['comuniQuizV1'].a` as a list of ids and restored on load without a toast. Saves without `a` SHALL load as before; ids that are not known challenges SHALL be ignored.

#### Scenario: Reload after Raffica
- **WHEN** the player earned Raffica and reloads the page
- **THEN** Raffica is shown as unlocked
