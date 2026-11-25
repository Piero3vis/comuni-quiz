## Why

The README has an open TODO before a public launch: check the licence of the municipal boundaries and keep the attribution. The source repository, openpolis/geojson-italy, is published under **Creative Commons Attribution 4.0 International** and its data comes from ISTAT. CC BY 4.0 requires three things: crediting the source, linking the licence, and saying whether the data was modified. The current footer credits the source but has no licence link and no mention of modifications. Players should also be told plainly that the quiz uses no cookies and keeps progress only in their own browser. Publishing has been decided: only the single file `dist/quiz.html` will go online, later, on GitHub Pages.

## What Changes

- **Footer attribution:** "Confini dei comuni: © ISTAT, tramite openpolis/geojson-italy, licenza CC BY 4.0, semplificati e modificati. Confini degli Stati (usati per individuare la costa): Natural Earth, pubblico dominio."
- **Footer privacy note:** "Nessun cookie: il progresso resta salvato solo in questo browser."
- **README:** replace the TODO with the verified licence; Publishing section states that only `dist/quiz.html` is published (served as `index.html`), with GitHub Pages as the planned host; `CLAUDE.md` mentions the footer must keep the attribution.
- **Smoke test:** asserts the attribution, the licence link and the privacy note are present in both variants, and that the single file loads no external resources.

## Capabilities

### New Capabilities
- `data-attribution`: the page credits every data source as its licence requires.
- `privacy-notice`: the page states that it uses no cookies and where progress is stored.
- `publishing`: the published artifact is the self-contained `dist/quiz.html`.

### Modified Capabilities
None.

## Non-goals

- Setting up GitHub Pages or any deployment now. The user wants to improve the look and add achievements first.
- A licence for the project's own code.
- A cookie banner: no cookies or tracking are used. If analytics are ever added, that becomes a new change.

## Impact

- `index.html` (footer), `README.md`, `CLAUDE.md`, `tests/smoke.js`, rebuilt `dist/quiz.html`.
- No change to app logic, data or storage keys.
