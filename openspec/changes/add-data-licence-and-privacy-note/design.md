## Context

The footer in `index.html` currently reads: "Confini dei comuni: ISTAT, tramite openpolis/geojson-italy (semplificati). Confini degli Stati: Natural Earth." The `LICENSE` of openpolis/geojson-italy is CC BY 4.0 (checked on 2026-11-02), and its README says the data is derived from ISTAT and redistributed under CC-BY. Natural Earth is public domain. `build_single_file.py` copies the footer unchanged into `dist/quiz.html`.

## Goals / Non-Goals

**Goals:** attribution that meets CC BY 4.0 (source, licence link, notice of changes); a one-line privacy note; publishing documented as single file only.

**Non-Goals:** deploying, GitHub Pages configuration, a licence for the code, cookie banners.

## Decisions

- **Text in the footer rather than an "about" dialog.** CC BY attribution must be reasonably visible; the footer already exists and is in both variants. A dialog would add UI with nothing else to show.
- **Italian licence deed link** (`…/by/4.0/deed.it`), matching the Italian UI.
- **"semplificati e modificati"**: the boundaries are simplified (mapshaper 4 %), reprojected and quantised, so "modified" is the accurate notice CC BY asks for.
- **Privacy note in the footer, not a banner.** No consent is needed for `localStorage` used only to make the game work; a banner would imply tracking that does not exist.
- **Publishing = `dist/quiz.html` renamed to `index.html`.** One file, no relative paths to break. The multi-file version stays for development.

## Risks / Trade-offs

- [The source repository changes licence] → the README records the licence and the check date; re-check when regenerating data.
- [Footer grows to two lines on phones] → acceptable; it is small muted text.
