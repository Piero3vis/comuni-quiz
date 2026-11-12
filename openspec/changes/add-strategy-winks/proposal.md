## Why

Many players follow a strategy: all the San/Santa comuni, every name with "gallo", towns along the A1. The game does not notice. A few secret "winks" that react to the player's strategy (a toast with a joke, then an entry in Segreti) make the game feel like it is watching, without asking anyone to complete a list. The point is to recognise the pattern, not to reward completeness.

## What Changes

- New secret achievements in the "Segreti" category, hidden as "🔒 ???" until unlocked, each with a toast when it fires. They fire on **consecutive guesses**: N new guesses in a row that fit the same theme.
- Themes (first set, wording proposed by the player, kept as written):
  - **Santi**: names with San, Santo, Santa, Santi, Sant’ as a separate word (529 comuni), after **5** in a row. 📈 "Jesus increasing".
  - **Cervi**: names starting a word with "Cerv" (19 comuni: Cervo, Cervia, Cerveteri…). 🦌 with a line on the deer's field of view of almost 310 degrees.
  - **Gallo**: names containing "gallo" (6 comuni: Cantagallo, Gallo Matese, Gallodoro, Gargallo, Montegallo, Priolo Gargallo), after **3** in a row. 🐓 A Robin Hood (Disney) line: "Robin Hood e Little John vanno per la foresta", the song of Cantagallo.
  - **Parole comuni**: single-word names that are everyday Italian words (Laghi, Paese, Lago, Ponte, Scala, Stella, Lettere…; hand list).
  - **Nomi parlanti**: names that "say something" (Cantagallo, Strangolagalli, Tramonti…; hand list).
  - **Autostrade**: comuni along a major motorway (A1 first), from a data list like the cammini in `data/groups.json`.
- Unlocked winks are saved with the progress (the streak cannot be rebuilt from the found set on load).
- README and DEVELOPMENT.md keep saying only "qualche obiettivo segreto": the winks are not listed for players. CLAUDE.md documents ids and patterns.

## Open questions

- Streak length for the other themes (gallo 3 and santi 5 are decided). Proposed: cervi 3, parole comuni 3, nomi parlanti 3, autostrade 5.
- Does a wrong or duplicate guess break the streak, or only a correct guess outside the theme? Proposed: only a correct new guess outside the theme.
- A guess that fills two homonyms (Castro) counts once.
- Exact texts for cervi, parole comuni, nomi parlanti and autostrade (the user's lines for santi and gallo are fixed).
- Autostrade: which ones (A1 only, or A1, A4, A14…), "crossed by" or "with an exit", and the source of the list. This part can ship later without blocking the others.
- Should Sanremo, Santena, Sansepolcro (San glued to the name) count as santi? Proposed: no, only a separate word.
- Should winks count in the achievements total like the other secrets? Proposed: yes.

## Capabilities

### New Capabilities
- `strategy-winks`: secret achievements triggered by a streak of consecutive themed guesses.

## Impact

`app.js` (theme list, streak state on each guess, Segreti items, `CH`/`earned` so the ids are saved and reloaded), `data/groups.json` (autostrade, later), `tests/smoke.js`, `CLAUDE.md`.
