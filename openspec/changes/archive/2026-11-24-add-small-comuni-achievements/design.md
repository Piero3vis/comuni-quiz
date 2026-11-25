## Context

`D.pop` has the residents of every comune (`data/extra.json`). The score box in the top-left of the map shows "persone beccate".

## Decisions

- **Logarithmic rarity, scaled by 10 and rounded, at least 1**: a linear inverse (1/pop) would make the 67 microcomuni outweigh everything else; a log keeps every comune worth something while a tiny village is worth about 16 times Milano. Integer points read well next to the people count.
- **Computed in `app.js` from `pop`** (`RAR`, `BG` totals, `TES`), not stored in `extra.json`: they are cheap derivations and keep the data file plain. `rarFound` and `bgFound[]` are kept in `addFound()` like `popFound`.
- **Ids**: `b<limit>:<n>` for borghi (e.g. `b1000:100`, `b100:67` for all microcomuni), `t<n>` for treasures. The last step of each list is the total, so "Tutti i …" rows follow the data.
- **Steps**: 10, 100, 500 when below the total, then the total. Microcomuni (67) get 10 and all.
- **Treasures by population, ties broken by the lower index**: there are no ties in the 2025 data.
- **"Comune raro" and treasure toasts are not achievements**: they react to a single find and would only add noise to the counters.

## Risks / Trade-offs

- [Several toasts at once (rare comune, treasure, borghi step)] → the toast queue shows them in order.
- [Italian number formatting writes 4-digit numbers without a separator ("1000")] → CLDR rule for `it-IT`, kept as is.
