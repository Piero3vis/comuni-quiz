## Why

With 471 achievements the side panel became a long flat list above the regions, and the region rows have thin bars and no percentage. Both are hard to scan: the player cannot see at a glance which region is furthest along, or which group of achievements is close to done.

## What Changes

- **Two tabs** at the top of the side panel, "Regioni" and "🏆 Traguardi" (with the unlocked/total count), sticky while the panel scrolls.
- **Regions**: each row shows the colour dot, the name, the percentage found, found/total and a thicker bar. A segmented control sorts them A-Z, by percentage found or by comuni missing. Province rows get a small bar in the region colour.
- **Achievements**: a total "🏆 57 / 471 sbloccati" with a bar, a filter Tutti / Sbloccati / Da fare, and one collapsible row per category with icon, name, unlocked/total and a mini bar. Extra counters (people, borghi, treasures) move into a line inside the category.

## Capabilities

### New Capabilities
- `side-panel`: tabs, region sort and progress, achievement categories and filter.

### Modified Capabilities
None.

## Non-goals

- No change to which achievements exist or how they unlock.
- The tab, sort and filter choices are not saved: they reset on reload.

## Impact

`index.html` (side panel markup), `style.css`, `app.js` (`buildSide`, `updateReg`, `sortRegs`, `achCats`, `renderAch`, tabs), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
