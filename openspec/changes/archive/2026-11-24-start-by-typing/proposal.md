## Why

Some players were confused at the start. The text box is disabled until "Inizia" is pressed, so tapping it does nothing (no cursor, no keyboard on phones), and the button can wrap to a second row on small screens. In pause the box keeps the "Scrivi il nome di un comune…" placeholder but cannot be typed in, and after a reload the button says "Riprendi" while the box still says "Premi Inizia…". Pressing Enter on a wrong name gives no feedback, so the game looks stuck.

## What Changes

- The text box is always enabled, except when the game is over (given up or all found).
- Typing a comune starts the game (or resumes it from pause) and the guess counts at once: timer, Pausa button and "Mi arrendo" behave as if Inizia had been pressed.
- The Inizia / Pausa / Riprendi button stays, and only starts or stops the timer; Pausa no longer disables the box.
- Placeholder per state: "Scrivi il nome di un comune per iniziare…" (new game), "Scrivi il nome di un comune…" (running), "In pausa: scrivi un comune per riprendere…" (paused, also after a reload with progress); the game-over texts are unchanged.
- Enter on text that is not a comune shows "Nessun comune si chiama così" for a moment (same notice as "Già indovinato").
- README "Come si gioca": start by typing.

## Capabilities

### New Capabilities
- `game-start`: how a game starts, pauses and resumes.

## Impact

`index.html` (input not disabled, placeholder), `app.js` (`start`, `pause`, input handler, Enter, load), `tests/smoke.js`, `CLAUDE.md`, `README.md`.
