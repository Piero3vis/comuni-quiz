## Context

`finish()` disabled the input and both buttons and saved `{f, t, a}`. `gaveUp` lived only in memory; `render()` used it to fill missing comuni with the region colour + `55` alpha. `updateReg()` listed only found comuni.

## Decisions

- **Restart by deleting `comuniQuizV1` and reloading the page**, instead of resetting state in place: the state is spread over many counters (`found`, `regCount`, `provFound`, `coastFound`, `popFound`, `unlocked`, `earned`, `burst`, side lists); a reload rebuilds all of it from an empty save with no risk of forgetting one. The theme key is separate and stays.
- **The main button (`#go`) becomes "Ricomincia"**: it is the primary, visible button and it was already disabled at the end. `over()` (`gaveUp || foundCount === N`) decides its action.
- **Save the surrender as `g: 1`** (absent otherwise), so older saves load unchanged. On load, `showOver()` restores the end state without saving or toasting.
- **Side list from `regAll` when given up**: every comune per region, grouped by province as before; the counter stays found/total.

## Risks / Trade-offs

- [7.896 list items after giving up] → built once per region by `showOver()`, inside collapsed `<details>`; no measurable cost.
- [A player who presses Ricomincia by mistake loses the game] → the confirmation names what is deleted.
