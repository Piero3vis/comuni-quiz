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

### Requirement: Smooth map on phones
Dragging, pinching and zooming SHALL move and scale the last full drawing instead of redrawing every comune, and the full map MUST be redrawn once the gesture stops. A guess SHALL redraw only the area around the new comuni, with the same result as a full redraw. Only comuni whose bounding box is on screen SHALL be drawn or hit-tested, and the canvas MUST NOT use more than 2 device pixels per CSS pixel.

#### Scenario: Drag frame
- **WHEN** the map is dragged on a phone profile (390×844, CPU slowed 4×)
- **THEN** frames take about one display frame (under 20 ms) instead of redrawing the map

#### Scenario: Guess redraw
- **WHEN** 10 comuni are guessed and the map is then fully redrawn in the same view
- **THEN** the two images are visually identical
