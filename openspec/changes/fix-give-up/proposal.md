## Why

Giving up is broken. After "Mi arrendo" both buttons are disabled, so the game is a dead end with no way to start again. The surrender is not saved: after a reload the missing comuni are hidden again and "Riprendi" lets the player keep playing after seeing the answers. The missing comuni are also hard to see: faint on the map (about 33% opacity) and absent from the side list. Completing every comune has the same dead end.

## What Changes

- When the game ends (surrender or all comuni found), the main button becomes **"Ricomincia"**. After a confirmation it deletes the saved game (`comuniQuizV1`: comuni, time, challenges; the theme stays) and reloads the page.
- The surrender is saved (`comuniQuizV1.g = 1`): after a reload the game is still over, with every comune shown.
- After giving up, the side list shows every comune of each province; missing ones are in italic and dimmed. On the map missing comuni use their region colour at 50% opacity (was 33%).
- Surrendering shows a toast with the result, e.g. "🏳️ Hai trovato 3 comuni su 7.896 in 0:00:12". The input placeholder explains what happened and how to start again.
- Smoke test: give up, reload, Ricomincia.

## Capabilities

### New Capabilities
- `game-end`: what happens when the player gives up or finds every comune.

### Modified Capabilities
None.

## Non-goals

- Keeping achievements across games: a new game starts from zero, like a fresh browser.

## Impact

`app.js` (`updateReg`, `render`, `save`, `load`, `finish`, new `showOver`/`restart`, `go` button), `style.css` (`.miss`), `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`.
