# support-link Specification

## Purpose
TBD - created by archiving change add-support-link. Update Purpose after archive.
## Requirements
### Requirement: The footer offers a link to support the project
The footer SHALL contain, after the privacy note, the sentence "Il quiz è gratuito e senza pubblicità. Se ti diverte, puoi ☕ offrirmi un caffè (si apre Ko-fi, un sito esterno)." where "☕ offrirmi un caffè" is a link (`id="support"`) to the author's Ko-fi page, `https://ko-fi.com/diocastoro`.

#### Scenario: Footer link present
- **WHEN** the page is loaded, in the multi-file and in the single-file variant
- **THEN** the footer contains a link `#support` whose text includes "caffè" and whose address matches `https://ko-fi.com/` followed by a username, and the footer still contains the attribution and "Nessun cookie"

### Requirement: The side panel offers the same link, quietly
The side panel SHALL show, below the tab content and on both tabs, one line of small muted text "☕ Ti piace il quiz? Offrimi un caffè" where "Offrimi un caffè" is a link (`id="supportSide"`) to the same address as the footer link. The address MUST be taken from the footer link at load, so it is defined in one place. If the footer link is missing, the line MUST stay hidden.

#### Scenario: Side link matches the footer link
- **WHEN** the page is loaded
- **THEN** `#supportSide` is inside `.side` and its `href` equals the `href` of `#support`

#### Scenario: Visible on both tabs
- **WHEN** the player switches between "Regioni" and "Traguardi"
- **THEN** the line remains in the side panel

### Requirement: The support link is a plain link
Each support link SHALL be an `<a>` element with `target="_blank"` and `rel="noopener noreferrer"`. The page MUST NOT load any Ko-fi or other third-party script, iframe, image, font or stylesheet for it, MUST NOT set cookies, and MUST NOT send any request when the page is loaded or the quiz is played.

#### Scenario: Attributes
- **WHEN** the support links are inspected
- **THEN** both have `target="_blank"` and a `rel` that includes `noopener` and `noreferrer`

#### Scenario: Nothing external is loaded
- **WHEN** the single file is inspected and a few comuni are guessed
- **THEN** it contains no `<script src>`, `<iframe>` or `<link rel="stylesheet">`, no `<img>` with an external source, and `document.cookie` is empty

### Requirement: The support link never interrupts play
The support link SHALL NOT appear in toasts, popups, overlays or banners, SHALL NOT be shown or highlighted because of a game event (guess, achievement, milestone, game over), and MUST NOT lock or alter any feature.

#### Scenario: No prompt during play
- **WHEN** the quiz is started and comuni are guessed until at least one achievement toast appears
- **THEN** no toast or overlay mentions "caffè" or Ko-fi, and the only support links in the document are the two static ones

### Requirement: The repository points to the same page
The repository SHALL contain `.github/FUNDING.yml` with a `ko_fi` entry for the same username, and the README SHALL have a short "Sostieni il progetto" section with the Ko-fi link, stating that the quiz stays free and that forks should replace the link and `FUNDING.yml`.

#### Scenario: Funding file
- **WHEN** `.github/FUNDING.yml` is read
- **THEN** it contains `ko_fi:` with the same username as the footer link

