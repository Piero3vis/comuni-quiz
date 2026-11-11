## ADDED Requirements

### Requirement: Size budget
The published single file `dist/quiz.html` SHALL stay at or below 1.3 MB, and 450 KB when gzip-compressed.

#### Scenario: Build within budget
- **WHEN** `npm test` builds the single file
- **THEN** the test fails if either size is over budget, printing both sizes

### Requirement: Guess speed guard
Typing a correct comune SHALL update the map, the counters and the achievements without noticeable delay. The smoke test MUST time 100 guesses and fail above a fixed limit, as a guard against regressions.

#### Scenario: 100 guesses
- **WHEN** the smoke test types 100 comuni
- **THEN** the elapsed time is printed and is below the limit
