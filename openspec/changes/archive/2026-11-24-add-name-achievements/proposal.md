## Why

Very long and very short names are a classic curiosity of Italian comuni (San Valentino in Abruzzo Citeriore, Ne, Vo’, Re) and a fun hunt.

## What Changes

- New visible category **🔤 Nomi** in Cultura e storia, after Tesori di provincia, with four achievements (ids `nm:<k>`):
  - **Il nome più lungo** (`nm:lungo`): San Valentino in Abruzzo Citeriore, 30 letters;
  - **Gli 11 nomi più lunghi** (`nm:l10`): at least the 10 longest, all ties included (11 today, from 27 letters);
  - **Due lettere** (`nm:2`): Ne, Vo’, Re;
  - **Tre lettere o meno** (`nm:3`): 23 comuni.
- Length counts letters only (`\p{L}`, so Š, č, ž count; no spaces, apostrophes or hyphens); for `/` bilingual names the Italian part. Lists computed from `map.json` at load; the label of the long list follows its size.
- Closed list "Nomi trovati (n)" with the letter count, longest first. Toast on unlock, silent on load. Locked labels never show the names.

## Capabilities

### New Capabilities
- `name-achievements`: the Nomi category.

## Impact

`app.js` (`NLEN`, `NMS`, `achInit`, `achCheck`, `achCats`, `ACHG`), `tests/smoke.js`, `CLAUDE.md`, `README.md`.
