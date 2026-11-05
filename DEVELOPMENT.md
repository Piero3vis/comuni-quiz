# Developer notes

Technical documentation for the quiz. For players, see [README.md](README.md); for the code and data format, see [CLAUDE.md](CLAUDE.md).

## Features
- One map with every comune, province outlines (thin) and region outlines (bold), zoom and pan (wheel, drag, pinch).
- Forgiving name matching: accents, apostrophes and case are ignored, German names in Alto Adige work,
  small connecting words are optional ("Vodo di Cadore" finds Vodo Cadore, "Reggio Emilia" finds Reggio nell'Emilia).
- Comuni that share a name (Castro, Samone, Livo, Peglio, San Teodoro) are all filled by one guess.
- Duplicate guesses are flagged. The map pans only when a newly found comune is completely off screen.
- Side panel with two tabs. "Regioni": regions with percentage, found/total and a bar, sortable A-Z, by % or by comuni missing; provinces with a small bar.
  "Traguardi": total unlocked with a bar, filter (all, unlocked, to do), one collapsible category per group with its own bar.
- Giving up shows every comune (map and side list) and is saved; "Ricomincia" clears the game and starts over.
- Click an unfound comune for a hint (first letter, length) and an optional reveal.
- Achievements: milestones (including 666), secret ones (69, 420) hidden as "???" until unlocked, quarter/half/complete per province and region, one comune in every region and in every province, all capoluoghi (119, co-capoluoghi included),
  the "Raffica" challenge (10 comuni in one minute, saved with the progress),
  record comuni (northernmost, southernmost, easternmost, westernmost, largest, smallest, most and least populated; names hidden until found),
  the whole coast and each regional coast, minor islands, and walking routes (cammini).
- "Persone beccate" score in the top-left corner of the map: residents (ISTAT, 1 January 2025) of the comuni found;
  milestones at 1%, 10%, 25%, 50%, 75% and 100% of the population. Next to it, "punti rarità": small comuni are worth more (log scale); hover or click 💎 for a short explanation.
- Small comuni: borghi/paesini/microcomuni achievements (under 1000/500/100 inhabitants), a "comune raro" toast under 100,
  and provincial treasures (the least populated comune of each province).
- Light/dark theme button in the top bar (automatic → light → dark), remembered in `localStorage` (`comuniQuizTheme`).
- Progress is saved in the browser (`localStorage`, key `comuniQuizV1`).

## Run locally
```bash
python3 -m http.server 8000     # then open http://localhost:8000
```
(Opening `index.html` directly with a double click will not work: the page loads `data/*.json` with `fetch`.
For a double-clickable file, build the single-file version below.)

## Project layout
```
index.html            page skeleton
style.css             styles (light/dark theme via CSS variables)
app.js                all the logic: loading, canvas map, quiz, side panel, achievements
data/map.json         generated map data (see CLAUDE.md for the format)
data/extra.json       generated ISTAT data aligned to map.json: population, capoluoghi, record comuni
data/groups.json      hand-edited groups: islands and cammini, listed by comune name
scripts/build_data.py regenerates data/map.json from the open data sources
scripts/build_extra.py         regenerates data/extra.json (ISTAT population 2025, capoluoghi flag, records)
scripts/build_single_file.py   builds dist/quiz.html (CSS, JS and data inlined)
scripts/check_istat.py         compares comuni and provinces with the current ISTAT list
openspec/             OpenSpec specs and change proposals (spec-driven workflow)
tests/smoke.js        jsdom smoke test (npm test)
```

## Common tasks
**Add a cammino or an island group**: edit `data/groups.json`, adding `{ "name": "...", "comuni": ["Comune 1", "Comune 2"] }`.
Names must match `data/map.json` exactly and be unique (the page throws a clear error otherwise).
Put new items before the last entry of the list: the last one has `"union": true` and automatically contains every other group.

**Rebuild the map data** (only if you change simplification, projection or the coast rules):
```bash
pip install -r requirements.txt     # shapely
python3 scripts/build_data.py       # needs Node.js (uses npx mapshaper); downloads ~50 MB into scripts/cache/
```
The output is deterministic: running it on the same sources reproduces the committed `data/map.json` exactly.

**Rebuild the ISTAT data** (population, capoluoghi, records; stdlib only, needs internet). Run it again after every `build_data.py`:
```bash
python3 scripts/build_extra.py      # -> data/extra.json; prints capoluoghi and records to eyeball
```

**Single file** (handy for sharing or for hosts that take one HTML file):
```bash
python3 scripts/build_single_file.py   # -> dist/quiz.html (~900 KB)
```

**Check against ISTAT** (comuni, province sigle and names; needs internet, stdlib only):
```bash
python3 scripts/check_istat.py      # exit code 1 if comuni or provinces differ from ISTAT
```

**Test**: `npm install && npm test` (needs Node.js 22.23.4+, 24.22.1+ or 26.12.1+: earlier releases lack the Brotli fix; `.npmrc` makes npm refuse them)

## Publishing
Live site: **https://piero3vis.github.io/comuni-quiz/** (GitHub Pages).

Only the single file is published. `.github/workflows/pages.yml` runs `npm test` (Node 22.23.4) on every pull request and on `main`;
on `main`, if the tests pass, it copies `dist/quiz.html` to `index.html` and deploys it. Nothing else from the repo goes online.
A failed test means no deploy: the previous version stays live. You can also start a deploy by hand from the Actions tab ("Run workflow").

Recommended: in Settings → Branches, protect `main` and require the "test" check, so changes only arrive through green pull requests.

### How to make a change
1. `openspec new change <name>` (or `/opsx:propose`): proposal, design, specs, tasks; `openspec validate <name> --strict`.
2. `git switch -c <name>`, implement, tick the tasks, commit.
3. `git push -u origin <name>` and open a pull request (`gh pr create`): CI runs the tests.
4. Merge when green: the site updates within a minute or two.
5. `openspec archive <name>` to move the specs into `openspec/specs/`, commit on `main` (or in the same pull request before merging).

Privacy: no cookies, no analytics, nothing is sent anywhere; progress and theme stay in the browser's `localStorage`
(the footer says so). Adding analytics later would need a consent banner.

Note that saved progress belongs to the exact address the page is served from: a new URL or domain starts empty.

## Data and credits
- Municipal boundaries: © ISTAT, via [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy), licensed
  [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (licence checked on 2026-11-02). Simplified to 4%, reprojected and quantised,
  so the footer says "semplificati e modificati". CC BY requires the credit, the licence link and the change notice: keep them in the footer.
- State borders (used only to compute the coast): [Natural Earth](https://www.naturalearthdata.com/), public domain.

## Known limitations
- Provinces follow ISTAT 2026, including the Sardinian layout in force since 1 January 2026 (Città metropolitana di Sassari, Gallura Nord-Est Sardegna,
  Ogliastra, Medio Campidano, Sulcis Iglesiente). ISTAT uses the sigla `CI` for Sulcis Iglesiente; a proposed vehicle-plate rule would use `SU`.
- The dataset has 7,896 comuni; ISTAT lists 7,894 in 2026. Not yet merged: Castegnero + Nanto (VI) → Castegnero Nanto,
  and Lirio (PV), absorbed by Montalto Pavese on 31 January 2026. Merging needs a step in `scripts/build_data.py`.
- Coastal comuni are computed geometrically (644 found) and tuned by hand for the Alpine borders. Corner cases are possible.
- The Via Francigena list (103 comuni) is built from the main stage towns; the official route crosses about 140 comuni.
- Boundaries are simplified, so very small comuni look rough when zoomed in.
