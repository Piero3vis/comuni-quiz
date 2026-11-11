## Context

`achCheck(i)` runs only for live guesses (not on load), so toasts there never replay old finds. Toasts last `max(2800 ms, 45 ms per character)`; curiosità are at most 200 characters (checked by the tests), about 10 seconds. `renderAch()` counts every item as 1 for the header (`achn/acht`), the bar and the category counts.

## Decisions

- **Toast from `achCheck(i)`** after the achievement toasts of the same comune, so the "unlocked" news comes first. The text uses the comune's first name part, like other toasts; the curiosità never contains the name (tested).
- **Weight as an optional item field `w`** (default 1). The header total and the bar use weights; category counts stay as numbers of items (a category of 3 challenges still reads 2/3). Rows carry `data-w` when `w > 1` so the test can sum them. The rule text of Italia a piedi says it is worth 10.
- **Weight 10**: about the number of regions-worth of milestones it replaces; easy to tune in one place.

## Risks / Trade-offs

- [Many toasts in a row] → curiosità exist for 80 comuni only, and the queue already shows one toast at a time.
