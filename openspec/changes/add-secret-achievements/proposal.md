## Why

Joke milestones are more fun when they are a surprise. Today 420 ("Quattro e venti") sits in the visible milestone list, so players see it coming. A small set of secret achievements, hidden until unlocked, adds a reward for players who stumble on them, starting with 69 ("Nice.") and 420 ("Blaze it").

## What Changes

- New secret achievements, unlocked by the number of comuni found: **69** → "Nice." (😏, toast "Nice.") and **420** → "Blaze it" (🌿, toast "420 comuni. Blaze it.").
- 420 moves out of the visible milestones ("Quattro e venti" is removed) into the secret list.
- The achievements panel gets a "Segreti" section right after "Traguardi": unlocked secrets show their icon, name and threshold; locked ones show only "🔒 ???". The header shows the unlocked/total count.
- Secrets count towards the overall achievements total.
- Smoke test covers both secrets; `CLAUDE.md` documents the new `s<n>` id.

## Capabilities

### New Capabilities
- `secret-achievements`: achievements that stay hidden until the player reaches their threshold.

### Modified Capabilities
None. `openspec/specs/` is empty.

## Non-goals

- Secrets triggered by anything other than the number of comuni found (specific names, times, etc.). The list is easy to extend later.
- Persisting achievements: like all others, secrets are derived from the found comuni on load.

## Impact

`app.js` (`SEC` list, `achInit`, `achCheck`, `renderAch`), `tests/smoke.js`, `CLAUDE.md`.
