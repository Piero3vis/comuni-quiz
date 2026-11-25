## ADDED Requirements

### Requirement: Search metadata
The page SHALL have an Italian `<title>` starting with "Quiz dei comuni d’Italia", a `<meta name="description">` of at least 50 characters, and a canonical link to `https://piero3vis.github.io/comuni-quiz/`.

#### Scenario: Search result
- **WHEN** a search engine reads the page
- **THEN** it finds the title, the description and the canonical address

### Requirement: Link previews
The page SHALL have Open Graph tags `og:type`, `og:site_name`, `og:title` (equal to the page title), `og:description` (equal to the meta description), `og:url` (equal to the canonical address) and `og:locale` `it_IT`, plus `twitter:card` `summary`.

#### Scenario: Sharing the link
- **WHEN** someone shares the address in a messaging app that reads Open Graph
- **THEN** the preview shows the quiz title and description

### Requirement: Structured data
The page SHALL contain a valid JSON-LD block of type `WebApplication` with `applicationCategory` `GameApplication`, `inLanguage` `it`, `isAccessibleForFree` true, a free offer and `url` equal to the canonical address.

#### Scenario: Parsing the block
- **WHEN** the JSON-LD script is parsed
- **THEN** it is valid JSON with the fields above

### Requirement: Inline favicon
The page SHALL declare a favicon as an `image/svg+xml` data URI, so no external file is requested.

#### Scenario: Single file
- **WHEN** `dist/quiz.html` is opened
- **THEN** the tab shows the icon and the page loads no external resource

### Requirement: Visible description
The page SHALL contain a visible section, below the game and above the footer, that describes the game in Italian and includes the phrases "comuni italiani" and "gioco di geografia".

#### Scenario: Reading the page
- **WHEN** a player or a crawler scrolls below the map
- **THEN** they find a short description of the quiz
