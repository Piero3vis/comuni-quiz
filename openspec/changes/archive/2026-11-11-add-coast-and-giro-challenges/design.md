## Context

`data/map.json` stores each comune as integer SVG paths produced by mapshaper, which simplifies shared borders identically on both sides. Two bordering comuni therefore share exact boundary segments. A prototype on the current data found 39,187 distinct segments, average 5.8 neighbours per comune (Bologna's 10 match the real list), and 21 connected groups: the peninsula (7,106), Sicily (383), Sardinia (375), Elba (7), Ischia (6), Salina (3), Capri (2) and single-comune islands, plus the exclave Campione d'Italia. `extra.json` already lists the capoluoghi (`cap`). Challenges that depend on the order of guesses already exist (`CH`, Raffica) and are saved in `comuniQuizV1.a`.

## Goals / Non-Goals

**Goals:** reproducible geo data with no new dependency; achievements and challenges that are correct, cheap to evaluate on every guess and stable across reloads.

**Non-Goals:** map overlays for routes; official IHO sea polygons; changing other achievements.

## Decisions

- **Adjacency from shared segments of `map.json`**, not from shapely on the full-resolution source: no dependency, always aligned to the map indices, regenerated with one stdlib script. Two comuni are neighbours when they share at least one segment (touching at a single point does not count).
- **Sea by rules on the coastline segments.** For each coastal comune, every boundary segment that belongs to no other comune is classified by region/province and coordinates, weighted by length; the majority wins (one sea per comune). Cut points: Piombino (Ligure/Tirreno, lat 42.96), Santa Maria di Leuca (Adriatico/Ionio), Strait of Messina (Villa San Giovanni Tirreno, Reggio Ionio; Capo Peloro), Capo Passero (Ionio/Canale), Capo Lilibeo (Tirreno/Canale), Capo Teulada (Tirreno/Mar di Sardegna); Calabria split by province and longitude. Override: Messina → Ionio (city and port on the Strait; its coastline is 53 % Tyrrhenian). Alternative: nearest "seed point" per sea; rejected because it misclassifies the Strait of Messina.
- **Islands = not connected to the peninsula's group**, except `Campione d'Italia` (exclave, listed in the script).
- **`geo.json` format:** `seas` (6 names), `sea` (one integer per comune, −1 inland), `nb` (for each comune, the neighbours with a higher index as positive deltas, to halve the size), `ins` (island indices). `app.js` rebuilds symmetric lists at load; `loadData()` throws if `sea.length` differs from the number of comuni.
- **Union-find for chains**, updated in `addFound()` so that loading a save rebuilds the state:
  - coast: components of found inland comuni, each with a bitmask of seas reached by a found bordering coastal comune and one example coastal comune per sea (for the toast "da X a Y");
  - walk: components of found peninsula non-capoluogo comuni, each with a bitmask of regions; the best component's region count is the progress.
  Both are derived, never stored (consistent with the other derived achievements).
- **Giro run** is evaluated in the input handler (only on live guesses, not on load), like Raffica. Bordering regions are computed from comune adjacency on the peninsula. For a guess that adds several comuni (homonyms), the first allowed comune that continues the run is used, preferring one in a new region; if none continues, the run restarts from the first allowed one, or ends if all are forbidden. Saved as `gr: [lastRegion, regionMask]`; `giro` goes in `a` when earned.
- **Ids:** `cc:<x><y>` with sea letters `L T I A C S` (e.g. `cc:TA`), `giro`, `walk`.

## Risks / Trade-offs

- [Sea rules are a convention] → cut points documented in the script; the boundary comuni are listed when the script runs; tests pin key comuni (Rimini A, Gallipoli I, Villa San Giovanni T, Reggio I, Messina I, Agrigento C, Alghero S, Olbia T, Livorno L, Follonica T).
- [Regenerating `map.json` changes indices] → `build_geo.py` must be rerun; `loadData()` throws on length mismatch, and the test checks known neighbours.
- [Giro toasts could be noisy] → toast only on a new region in the run (from the 2nd) and on a break after at least 3 regions.
- [Extra 150 KB in the single file] → acceptable; GitHub Pages serves it compressed.
