## Decisions

- **One table.** `TIMED = [{ id, ic, l, n, ms, ok?, key?, h }]`; `ok(i)` filters comuni (capoluoghi, borghi), `key(i)` groups them (initial letter for "Stessa lettera", otherwise one group). `CH` (ids saved in `a`) is built from `TIMED` plus the tours.
- **Sliding window per challenge and group.** On each new comune: push the game time, drop times older than `ms`, the queue length is the current count; record = max. Queues are not saved (a reload starts a new window); records are saved as `comuniQuizV1.rb = { id: n }`.
- **Game time**, `Date.now() - t0` while running: guesses are only possible while running, and a pause does not eat the window.
- **Homonyms count each** (as Raffica did): "Castro" adds two.
- **Initial letter** from `norm()` of the first `/` part.
- **Raffica keeps id `raffica`**, so it stays earned in existing saves.

## Risks

- [Prefix names (Castro before Castrocaro) give an extra comune] → harmless here: it is a real comune found by the player.
- [A fix for the prefix problem that adds a short wait] → would slow the fastest challenges a little; to weigh when that is designed.
