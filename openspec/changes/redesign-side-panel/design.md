## Context

The side panel had a "Traguardi" `<details>` with every achievement in sections, followed by the regions (`#regs`), each a `<details>` with provinces inside.

## Decisions

- **Tabs instead of one long column**: regions and achievements are both long lists; tabs give each the full height. Plain buttons with `role="tab"`, `aria-selected` and `hidden` panels; no state saved.
- **Sort with CSS `order`** on `#regs` (flex column): the region elements are never moved, so open `<details>` and province state survive a re-sort. `sortRegs()` runs after each `updateReg()`, ties broken by the alphabetical index.
- **Percentages**: floor, with "<1%" for a non-zero share under 1% and "100%" only when complete, so a region never looks finished early.
- **Categories from `achCats()`**: one function returns `{k, ic, t, info?, items, more?}`; `renderAch()` builds the totals, filter and rows from it. The category `<details>` reuses `data-a` and `openAch`, so open categories stay open across re-renders.
- **Filter hides rows, not categories with matches**: a category with no row left after filtering is omitted; an empty result shows "Nessun traguardo qui, per ora."

## Risks / Trade-offs

- [Secret achievements counted in the totals] → they were already counted; they still show as "🔒 ???".
