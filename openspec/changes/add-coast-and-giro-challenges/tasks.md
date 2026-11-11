## 1. Geo data

- [x] 1.1 `scripts/build_geo.py` (stdlib): adjacency from shared segments, sea per coastal comune with documented cut points and the Messina override, island comuni (Campione d'Italia excepted); prints the boundary comuni and checks reference comuni
- [x] 1.2 Generate `data/geo.json`; `build_single_file.py` embeds it; `loadData()` fetches it and checks its length

## 2. Game logic

- [x] 2.1 Rebuild neighbour lists, island set and bordering regions at load
- [x] 2.2 Coast-to-coast: union-find over found inland comuni with sea masks and example coastal comuni; 9 pairs, toast naming the two comuni
- [x] 2.3 Italia a piedi: union-find over found peninsula non-capoluogo comuni with region masks; progress = best component
- [x] 2.4 Giro d'Italia a tappe: run in the input handler, toasts (new region from the 2nd, break from 3 regions, completion), saved in `gr`, `giro` in `a`
- [x] 2.5 Side panel: "Da costa a costa" category; Sfide with Giro (current run) and Italia a piedi, rules in the category info

## 3. Tests and docs

- [x] 3.1 Smoke test: geo data (Bologna neighbours, reference seas, islands), a Tirreno–Adriatico chain, a coastal-only Leuca walk that stays locked, Giro (continue, jump, capoluogo, full tour, reload), Italia a piedi progress and completion
- [x] 3.2 README (players), DEVELOPMENT.md, CLAUDE.md
- [x] 3.3 `openspec validate add-coast-and-giro-challenges --strict`; tests pass locally and on the pull request (PR #4, run 43041910820)
