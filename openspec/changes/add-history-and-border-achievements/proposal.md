## Why

The achievements reward geography and population but not history. Comuni tied to a past event or to a state that no longer exists make good, short goals with a story to tell, and the foreign borders are a natural "tour" next to the coast and the islands.

## What Changes

- **Storia (📜)**: "Le capitali d’Italia" (Torino, Firenze, Roma), "Capitali per caso" (Salemi, Brindisi, Salerno), "Repubblica di Cospaia" (San Giustino), "Principato di Seborga" (Seborga).
- **Repubbliche marinare (⚓)**: "Le quattro repubbliche marinare" (Amalfi, Genova, Pisa, Venezia), "Non erano solo quattro" (Ancona, Gaeta, Noli), "Tutte le repubbliche marinare".
- **Confini (🛂)**: "Tutto il confine con …" for France (39 comuni), Switzerland (87), Austria (27), Slovenia (25), San Marino (7) and the Vatican (Roma), plus "Giro delle frontiere" (one comune on every border).
- Every group can have a **nota**, a short anecdote shown in the unlock toast and under the unlocked achievement; long toasts stay on screen longer.
- Group names can name a duplicated comune as "Nome (SIGLA)" (Livo in Como borders Switzerland).
- `scripts/border_comuni.py` computes the border comuni and writes them to `data/groups.json`.

## Capabilities

### New Capabilities
- `history-achievements`: history, maritime republic and border groups with anecdotes.

### Modified Capabilities
None.

## Non-goals

- The pre-unification states with a progress bar each (they need a province-to-state table with many exceptions): a later change.
- Ragusa (Dubrovnik) is not in Italy: it is only mentioned in the anecdote.

## Impact

`data/groups.json`, `scripts/border_comuni.py` (new), `app.js` (`withGroups`, `TG`, `achInit`, `achCheck`, `achCats`, `renderAch`, toast duration), `style.css`, `tests/smoke.js`, `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`.
