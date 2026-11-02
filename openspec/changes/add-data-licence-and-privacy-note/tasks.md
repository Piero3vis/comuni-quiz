## 1. Footer

- [x] 1.1 `index.html`: attribution with ISTAT, openpolis link, CC BY 4.0 link, "semplificati e modificati", Natural Earth "pubblico dominio"
- [x] 1.2 `index.html`: privacy sentence "Nessun cookie: il progresso resta salvato solo in questo browser."

## 2. Docs

- [x] 2.1 README "Data and credits": licence (CC BY 4.0, checked 2026-11-02), replace the TODO
- [x] 2.2 README "Publishing": only `dist/quiz.html`, served as `index.html`; GitHub Pages planned later; privacy line
- [x] 2.3 `CLAUDE.md`: footer must keep attribution and privacy note

## 3. Verification

- [x] 3.1 Smoke test: footer text and links in both variants; `document.cookie` empty after playing; single file has no external `<script src>` / stylesheet
- [x] 3.2 Rebuild `dist/quiz.html` and run the smoke test for both variants (with jsdom 24, since `npm test` needs Node 22.22+ here)
- [x] 3.3 `openspec validate add-data-licence-and-privacy-note --strict`
