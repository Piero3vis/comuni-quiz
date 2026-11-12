## Context

Secrets today (`SEC` in `app.js`: 69 "Nice.", 420 "Blaze it") are derived from the number of comuni found, so they are rebuilt on load. Challenges that depend on the order of guesses (timed challenges, giro) are stored in `earned` and saved as `a` in `comuniQuizV1`; `load()` keeps only ids listed in `CH`.

## Decisions

- **Streak per theme.** Each theme has a test `fit(i)` on the comune index and a length `n`. On every correct new guess, each theme whose `fit` matches increments its counter, the others reset to 0. When a counter reaches `n`, the wink unlocks once (`earned`, toast). Wrong and duplicate guesses do not touch the counters (open question in the proposal).
- **Ids.** `w:<key>` is taken by cammini, so winks use `sw:<key>` (`sw:santi`, `sw:cervi`, `sw:gallo`, `sw:parole`, `sw:parlanti`, `sw:a1`). They are added to `CH` so `load()` keeps them.
- **Matching** on the comune's name lowercased, without accents, with apostrophes and hyphens turned into spaces (not `norm()`, which also drops the spaces and so the word boundaries):
  - santi: `/(^| )(san|santo|santa|santi|sant)( |$)/` ("Sant’Agata" becomes "sant agata");
  - cervi: `/(^| )cerv/`;
  - gallo: `/gallo/`;
  - parole comuni and nomi parlanti: hand lists of names in `app.js` (or `data/groups.json` if they grow), checked with `withGroups()` so a typo fails loudly.
  - autostrade: one group per motorway in `data/groups.json` (`"autostrade"`), built like the cammini.
- **Panel.** Items go into the existing Segreti category after 69 and 420, "🔒 ???" until unlocked, then icon, name and a one-line text.

### Candidate lists (to review)

- Parole comuni (single word, everyday Italian, found in the data): Arena, Campana, Canale, Carbone, Castelli, Cervo, Grotte, Lago, Laghi, Lavagna, Lettere, Massa, Paese, Ponte, Sale, Scala, Stella, Taverna, Tramonti, Vasto.
- Nomi parlanti: Cantagallo, Strangolagalli, Tramonti… (to collect; at least 10).

## Risks

- Santi streaks happen by chance in Campania and Sicily: a longer streak keeps it a wink and not noise.
- Homonyms: a guess can fill two comuni; the streak counts guesses, not comuni.
