## MODIFIED Requirements

### Requirement: The support link is a plain link
Each support link SHALL be an `<a>` element with `target="_blank"` and `rel="noopener noreferrer"`. The page MUST NOT load any Ko-fi or other third-party script, iframe, image, font or stylesheet for it, MUST NOT set cookies, and MUST NOT send any request when the page is loaded or the quiz is played, except the anonymous visit count (`visit-count`).

#### Scenario: Attributes
- **WHEN** the support links are inspected
- **THEN** both have `target="_blank"` and a `rel` that includes `noopener` and `noreferrer`

#### Scenario: Nothing external is loaded
- **WHEN** the single file is inspected and a few comuni are guessed
- **THEN** its only `<script src>` is the GoatCounter counter, it contains no `<iframe>` or `<link rel="stylesheet">`, no `<img>` with an external source, and `document.cookie` is empty
