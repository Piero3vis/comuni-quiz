## Context

`withGroups()` turns `facts.json` into `D.fact` (index → text); the click box and the toast read the text. The tests check names, length and apostrophe on the values.

## Decisions

- **Object per comune with `testo` and `fonte`** (Italian keys like `nota` in groups). Alternative: a parallel `sources` object; rejected because the two could drift.
- **One `fonte` per curiosità**: the page that supports the whole text; if two pages are needed the text is cut down to what one page supports. Preference: it.wikipedia page of the comune, then other it.wikipedia pages, official sites, Treccani.
- **Choice of comuni**: not capoluoghi (tested), preferably 1,000–20,000 residents, with a story that works as a clue without the name (no words that contain the name, e.g. "Adriatico" for Adria).
- **Coverage report, not a failing test**: until every region is done, the test prints how many provinces have a curiosità and fails only on the hard rules.
- **Existing 80 verified by agents in parallel**, each returning `fonte`, `verificato`, `problemi`; texts with problems are corrected by hand against the source before merging.

## Risks / Trade-offs

- [Wikipedia changes] → the URL is the page, not a revision; the text avoids yearly numbers.
- [Long agent work for 110 provinces] → batches by region, one pull request each.
