## Context

Milestones are `MS = [[n, name]]` with ids `m<n>`; `achInit()` derives them on load and `achCheck()` toasts new ones. `renderAch()` lists every milestone, locked or not.

## Decisions

- **Separate list `SEC = [[n, name, icon, toast]]`, ids `s<n>`**, instead of a flag on `MS`: secrets need their own icon and toast text, and `renderAch()` shows them differently. Keeping them apart leaves the `MS` code untouched.
- **Locked secrets are shown as "🔒 ???"** rather than hidden completely: the player knows secrets exist (and how many), which invites exploring, without spoiling the thresholds.
- **No persistence change**: like every achievement, secrets are recomputed from `found[]`, so a player who already has 420 comuni sees them unlocked silently on load.

## Risks / Trade-offs

- [Typing a name that matches several comuni can skip a threshold, e.g. 68 → 70] → unlocking uses `>=`, as for milestones, so it still unlocks.
- [The joke text may not suit every audience] → texts are mild and live in one list, easy to change.
