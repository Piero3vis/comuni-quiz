## Why

"Offrimi un caffè" is the stock wording of every support button. The quiz has a playful tone (secret achievements, jokes in the toasts), so the link should sound like the author: "offrimi uno spritz, daiii".

## What Changes

- Footer: "Se ti diverte, puoi 🍹 offrirmi uno spritz, daiii (si apre Ko-fi, un sito esterno)."
- Side panel: "🍹 Ti piace il quiz? Offrimi uno spritz, daiii".
- README "Sostieni il progetto": "offrirmi uno spritz su Ko-fi".
- Tests look for "spritz" instead of "caffè" (and still check that no toast mentions the support link).
- Same address (`https://ko-fi.com/diocastoro`), same rules: plain link, no widget, never during play.

## Capabilities

### Modified Capabilities
- `support-link`: link text.

## Impact

`index.html`, `README.md`, `tests/smoke.js`. The Ko-fi page itself still talks about coffee: its wording is changed on ko-fi.com, outside the repository.
