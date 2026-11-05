## Context

Achievements are derived from `found[]` on load and never stored. The save is `localStorage['comuniQuizV1'] = { f, t }`.

## Decisions

- **Store earned challenge ids in `comuniQuizV1.a`**: the alternative (session-only) would re-lock Raffica on every reload. Only ids listed in `CH` are restored, so a hand-edited or future save cannot unlock anything else. Other achievements stay derived.
- **Real time (`Date.now()`), not play time**: input is disabled while paused, so pausing cannot help; real time is simpler and matches "in un minuto" as the player feels it.
- **Sliding window of the last 10 timestamps (`burst`)**, one per comune added; checked after each correct guess with `burstCheck(n)`. Restored progress never feeds the window.
- **List `CH = [[id, icon, name, rule]]`**, rendered in a "Sfide" section, so later challenges are one line each.

## Risks / Trade-offs

- [Typing a shared name (e.g. two Castro) adds two comuni at once] → counts as two, consistent with how the comuni count works.
- [Players clearing site data lose Raffica] → same as losing the progress itself.
