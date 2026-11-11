## 1. Runs

- [x] 1.1 Generic `TOURS` (regions, provinces) and `tourStep()` replacing `giroStep()`; bordering provinces `PADJ` on the peninsula
- [x] 1.2 Toasts: regions as before; provinces every 10, break after ≥ 5, completion
- [x] 1.3 Save `tr` for runs in progress; read old `gr`; `giroP` in `CH`

## 2. Italia a piedi

- [x] 2.1 Count capoluoghi (peninsula only); keep the best chain's region mask

## 3. Panel

- [x] 3.1 Rows with always-visible rule (`h`) and status (`s`); styles
- [x] 3.2 Status texts: Giro (start hint / last region, next regions, missing), province Giro (last, next provinces, missing count), Italia a piedi (count, missing regions); clearer "Da costa a costa" info

## 4. Tests and docs

- [x] 4.1 Smoke test: next-stage hint (Friuli → Friuli, Veneto), old `gr` save, province run (continue, jump, reload), capoluogo now joins chains
- [x] 4.2 README, DEVELOPMENT.md, CLAUDE.md
- [ ] 4.3 `openspec validate --strict`; tests pass locally and on the pull request
