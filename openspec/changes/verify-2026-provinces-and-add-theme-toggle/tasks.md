## 1. Province data (2026)

- [x] 1.1 Add `scripts/check_istat.py` (stdlib only): download ISTAT `Elenco-comuni-italiani.xlsx`, diff (name, sigla) against `data/map.json`, diff `PN` names in `app.js` (bilingual = info only), check the metropolitan-city set; non-zero exit on (name, sigla) differences
- [x] 1.2 Run it and confirm the only differences are the 2026 mergers (Castegnero, Nanto, Lirio vs Castegnero Nanto)
- [x] 1.3 Add the `CM` set and `provLabel(p)` to `app.js`; use them in the province toasts (quarter, half, complete)

## 2. Comuni that share a name

- [x] 2.1 Smoke test: typing "castro" adds 2; typing it again shows "Già indovinato: Castro (2 comuni con questo nome)"
- [x] 2.2 Fix `CLAUDE.md` to list all five shared names (Samone, Livo, Peglio, Castro, San Teodoro)

## 3. Theme toggle

- [x] 3.1 `index.html`: theme button in `.bar`; inline `<head>` script applying `comuniQuizTheme` before first paint (try/catch)
- [x] 3.2 `style.css`: compact icon-button style for the theme button
- [x] 3.3 `app.js`: cycle auto → light → dark, update icon and `aria-label`/`title`, persist (try/catch), call `draw()`; `matchMedia` change listener calling `draw()`
- [x] 3.4 Smoke test: three clicks cycle `data-theme` light → dark → none and update `localStorage`

## 4. Docs and verification

- [x] 4.1 README: theme toggle in Features, `check_istat.py` in Common tasks, the two 2026 mergers in Known limitations
- [x] 4.2 `CLAUDE.md`: theme key and toggle, check script, metropolitan-city labels
- [x] 4.3 Rebuild `dist/quiz.html` and run `tests/smoke.js` for both variants: all green. Note: `npm test` itself fails on this machine (Node 20 vs jsdom 30, which needs Node 22.22+); verified with jsdom 24 outside the repo
- [x] 4.4 `openspec validate verify-2026-provinces-and-add-theme-toggle`
