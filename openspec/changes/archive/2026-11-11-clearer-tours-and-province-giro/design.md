## Context

`giroStep()` (from `add-coast-and-giro-challenges`) handles one run over regions with a bitmask saved as `gr`. Provinces are 93 on the peninsula, too many for a 32-bit mask. Panel rows (`achCats()` items) show a detail `d` only once unlocked, to avoid spoilers; challenge rules are not spoilers.

## Goals / Non-Goals

**Goals:** one implementation for both runs; rules readable at a glance; useful next-step hints; backward-compatible saves.

**Non-Goals:** map overlays; changing the run rules.

## Decisions

- **Generic runs (`TOURS`)**: each run has `unit(i)` (region index or province sigla), `adj` (bordering units on the peninsula, from comune adjacency), `total`, naming helpers and toast thresholds; state `last` + `seen` (a `Set`). `tourStep(t, added)` replaces `giroStep()` with the same rule. Alternative: copy `giroStep()` for provinces; rejected (two copies of a subtle rule).
- **Panel rows get `h` (help, always shown) and `s` (status, always shown)** next to the existing `d` (shown when unlocked). Only challenges use them.
- **Next-stage hint**: last unit plus its bordering units, sorted by name; for provinces the full province names (≤ 9 entries). Missing units listed for regions (≤ 18) and counted for provinces.
- **Toasts for provinces**: every 10 provinces, on a break after ≥ 5, on completion, to avoid 93 toasts.
- **Italia a piedi** uses `MAIN[i]` only; `allowed()` (peninsula and not capoluogo) stays for the runs. Its best chain also keeps the region mask (`wkBestM`) to list missing regions.
- **Save format** `tr: { giro: [last, [...seen]], giroP: [...] }`, only for runs in progress. Old `gr: [k, mask]` is converted on load.

## Risks / Trade-offs

- [Long status text on phones] → status is a single short line; lists use short region names.
- [Province run is very long] → it is meant as a long-term challenge; progress survives reloads.
