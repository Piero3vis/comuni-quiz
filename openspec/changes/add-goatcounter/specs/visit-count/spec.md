## ADDED Requirements

### Requirement: Anonymous visit count
The page SHALL load the GoatCounter script `https://gc.zgo.at/count.js` with `data-goatcounter="https://dio-castoro.goatcounter.com/count"` from a single `async` script tag placed after the game script. It MUST NOT set cookies, MUST NOT send guesses, progress or any other game data, and the footer SHALL say that visits are counted anonymously with GoatCounter.

#### Scenario: One cookieless counter
- **WHEN** the single file is loaded and a few comuni are guessed
- **THEN** the only external script is `https://gc.zgo.at/count.js`, it is `async`, and `document.cookie` is empty

### Requirement: No cost for the game
The counter MUST NOT delay the first drawing of the map or the guesses; if the script is blocked or fails, the game SHALL work exactly the same.

#### Scenario: Blocked counter
- **WHEN** the request to `gc.zgo.at` is blocked
- **THEN** the map is drawn and guesses work as usual, with no errors from the game
