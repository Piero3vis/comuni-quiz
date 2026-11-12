## ADDED Requirements

### Requirement: Timed challenges
The achievements panel SHALL have a category "A tempo" with these challenges, each unlocked when the stated number of comuni of the stated kind is found within the stated game time: Raffica (10 in 1 minute), Raffica doppia (20 in 1 minute), Cinquanta in cinque (50 in 5 minutes), Cento in cinque (100 in 5 minutes), Mezza maratona (250 in 15 minutes), Maratona (500 in 30 minutes), Raffica di capoluoghi (10 capoluoghi in 1 minute), Raffica di borghi (10 comuni under 1,000 residents in 5 minutes), Stessa lettera (10 comuni with the same initial in 1 minute). Time MUST be game time (paused time does not count). Unlocked challenges SHALL be saved with the game and shown with a toast.

#### Scenario: Quick guesses
- **WHEN** 20 comuni are guessed within a few seconds
- **THEN** Raffica and Raffica doppia are unlocked, with a toast each, and their ids are in the save

#### Scenario: Kind matters
- **WHEN** 10 comuni starting with the same letter are guessed within a minute
- **THEN** Stessa lettera is unlocked; 10 comuni with different initials do not unlock it

#### Scenario: Old save
- **WHEN** a save has `raffica` in `a`
- **THEN** Raffica is shown unlocked in the "A tempo" category

### Requirement: Personal record
Each timed challenge row SHALL show its rule and the best number of matching comuni reached within its time window ("Il tuo record: N in un minuto.", or "Nessun tentativo per ora."). Records MUST be saved in `comuniQuizV1.rb` and restored on load.

#### Scenario: Record survives reload
- **WHEN** 12 comuni are guessed quickly and the page is reloaded
- **THEN** the Raffica row shows "Il tuo record: 12 in un minuto."
