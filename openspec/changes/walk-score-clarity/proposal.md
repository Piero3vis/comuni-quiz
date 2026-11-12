## Why

"Italia a piedi" is by far the hardest challenge (a chain of bordering comuni through all 18 regions of the peninsula), but today it only weighs 10 in the achievements total, and the weight is explained only inside the rule text ("Vale 10 obiettivi"). Players see "🏆 51 / 506 sbloccati" with no hint of why the number jumps by 10, so the score is unclear.

## What Changes

- Raise the weight (`WALKW`) from 10 to 25 (to confirm: 25 is about 5% of the total; 50 would be about 10%).
- Make the weight visible: a small badge "vale 25" on the row, also while locked, and a line under the header total "Italia a piedi vale 25 obiettivi" (or a tooltip on the total).
- The total counter word changes from "sbloccati" to "obiettivi" if needed, so "51 / 521 obiettivi" reads as a score.
- Tests: weight in the total, badge text.

## Open questions

- 25 or 50? Should other hard challenges (Maratona, Da costa a costa) also weigh more, or only Italia a piedi?
- Alternative: keep the total a plain count and add a separate "punti" score where hard challenges count more.

## Capabilities

### Modified Capabilities
- `walk-challenge`: weight and how it is shown.

## Impact

`app.js` (`WALKW`, row badge, header), `style.css` (badge), `tests/smoke.js`, README, CLAUDE.md.
