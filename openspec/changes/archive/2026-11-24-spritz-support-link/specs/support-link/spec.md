## MODIFIED Requirements

### Requirement: The footer offers a link to support the project
The footer SHALL contain, after the privacy note, the sentence "Il quiz è gratuito e senza pubblicità. Se ti diverte, puoi 🍹 offrirmi uno spritz, daiii (si apre Ko-fi, un sito esterno)." where "🍹 offrirmi uno spritz, daiii" is a link (`id="support"`) to the author's Ko-fi page, `https://ko-fi.com/diocastoro`.

#### Scenario: Footer link present
- **WHEN** the page is loaded, in the multi-file and in the single-file variant
- **THEN** the footer contains a link `#support` whose text includes "spritz" and whose address matches `https://ko-fi.com/` followed by a username, and the footer still contains the attribution and "Nessun cookie"

### Requirement: The side panel offers the same link, quietly
The side panel SHALL show, below the tab content and on both tabs, one line of small muted text "🍹 Ti piace il quiz? Offrimi uno spritz, daiii" where "Offrimi uno spritz, daiii" is a link (`id="supportSide"`) to the same address as the footer link. The address MUST be taken from the footer link at load, so it is defined in one place. If the footer link is missing, the line MUST stay hidden.

#### Scenario: Side link matches the footer link
- **WHEN** the page is loaded
- **THEN** `#supportSide` is inside `.side` and its `href` equals the `href` of `#support`

#### Scenario: Visible on both tabs
- **WHEN** the player switches between "Regioni" and "Traguardi"
- **THEN** the line remains in the side panel

### Requirement: The support link never interrupts play
The support link SHALL NOT appear in toasts, popups, overlays or banners, SHALL NOT be shown or highlighted because of a game event (guess, achievement, milestone, game over), and MUST NOT lock or alter any feature.

#### Scenario: No prompt during play
- **WHEN** the quiz is started and comuni are guessed until at least one achievement toast appears
- **THEN** no toast or overlay mentions "spritz" or Ko-fi, and the only support links in the document are the two static ones
