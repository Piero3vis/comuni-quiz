## ADDED Requirements

### Requirement: The page states it uses no cookies
The footer SHALL contain the sentence "Nessun cookie: il progresso resta salvato solo in questo browser." The page MUST NOT set cookies or send progress anywhere; it stores data only in `localStorage` (`comuniQuizV1`, `comuniQuizTheme`).

#### Scenario: Privacy note visible
- **WHEN** the page is loaded
- **THEN** the footer contains "Nessun cookie"

#### Scenario: No cookies after playing
- **WHEN** the quiz is started, a few comuni are guessed and the theme is changed
- **THEN** `document.cookie` is empty
