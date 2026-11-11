## Context

The input handler looks up the normalised text on every keystroke (`keyMap`, then `looseMap`) and, on a hit that adds comuni, clears the field. A name that is the beginning of another one (Castro / Castrocaro Terme) is therefore taken first. If the shorter comune is already found, the duplicate notice appears and the field is cleared only if the player stops typing for 1.5 s, so the longer name can still be typed.

## Decisions

- **One switch.** `const TOURS_ON = false` filters `TOURS` to an empty list, so `tourStep`, `tourStatus` and the Sfide rows are skipped with no other change. Switching it back to `true` restores the feature and its tests.
- **Keep saved state.** `load()` remembers the raw `tr` (or old `gr`) and `save()` writes it back while the tours are off; `giro` / `giroP` stay in `earned` and in `a`. They are not shown, so they do not count in the total.

## To think about: the prefix problem

Options, not decided:
1. **Wait before accepting a prefix name.** If the typed key is the start of another comune name, accept it only after a short pause (e.g. 600–800 ms) or on Enter; exact unique names stay instant.
2. **Enter to confirm prefix names only.** Show "Castro? premi Invio" while longer names are possible.
3. **Accept, but keep the text.** Take Castro, do not clear the field while longer names are possible; if the player goes on to "Castrocaro Terme", undo Castro (it was found by accident).
4. **Tour-only fix.** Keep the quiz as it is, but let a run ignore a guess that is a prefix of the next one typed within a few seconds.

Option 1 or 3 fix the cause for the whole quiz; 3 keeps the instant feel but needs an "undo" of a found comune (and of its achievements and toasts). Raffica (10 in a minute) is sensitive to any delay.

## Risks

- [Players with a run in progress see it disappear] → the run is kept in the save and comes back when the tours are switched on.
