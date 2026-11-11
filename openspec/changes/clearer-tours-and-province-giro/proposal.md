## Why

Players testing the Giro d'Italia a tappe were unsure whether it can start from any region and what breaks it: the rules are one dense paragraph in the "Sfide" category, with no hint of where the next stage can go. The player also asked for the same challenge at province level, and for capoluoghi to count in "Italia a piedi" (the chain is hard enough without detours around every capoluogo).

## What Changes

- **Clearer explanations in the side panel.** Every challenge row shows its rule under the name, always visible (not a spoiler), plus a live status line:
  - Giro d'Italia a tappe: where the last stage is, the regions the next stage can be in, the regions still missing; or how to start.
  - Giro delle province a tappe: the same with provinces (missing provinces as a count).
  - Italia a piedi: how many regions the longest chain touches and which are missing.
  - Da costa a costa: a step-by-step rule (coast, inland, coast) in the category info.
- **New challenge "Giro delle province a tappe"**: the Giro rule applied to provinces: one run touching all 93 provinces of the peninsula, each guess in the same province as the previous one or a bordering one; capoluoghi and island comuni end the run. Toasts every 10 provinces, on a break after at least 5 provinces, and on completion.
- **Italia a piedi counts capoluoghi**: the chain may pass through capoluoghi; island comuni still do not count.
- **Saving:** both runs are saved in `comuniQuizV1.tr` (`{ giro: [last, [regions]], giroP: [last, [provinces]] }`); an old `gr` from the previous version is still read.

## Capabilities

### New Capabilities
- `province-tour`: the Giro delle province a tappe challenge.

### Modified Capabilities
- `giro-challenge`: saved in `tr` instead of `gr`; the panel shows the rule, the next possible regions and the missing ones.
- `walk-challenge`: capoluoghi count in the chain.

## Non-goals

- Changing the Giro rule itself (start anywhere, going back allowed, capoluoghi and islands forbidden).
- Drawing runs or chains on the map.

## Impact

- `app.js` (shared run logic for regions and provinces, panel rows with rule and status), `style.css` (status line), `tests/smoke.js`, docs (`README.md`, `DEVELOPMENT.md`, `CLAUDE.md`).
