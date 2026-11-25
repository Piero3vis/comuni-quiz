## 1. Data

- [x] 1.1 `data/facts.json`: facts for record comuni, microcomuni and famous villages, checked on the web, without the comune's name
- [x] 1.2 `scripts/build_single_file.py` embeds `facts.json`

## 2. App

- [x] 2.1 `loadData()` / `withGroups()`: load and resolve facts into `D.fact`
- [x] 2.2 `clickAt()`: closed "Curiosità" / "Indizio" disclosure; `placeInfo()` keeps the box inside the map
- [x] 2.3 `style.css`: `.fact`

## 3. Tests and docs

- [x] 3.1 Smoke test: every fact resolves, no fact contains its name, box shows the disclosure for found and unfound comuni
- [x] 3.2 `CLAUDE.md`, `DEVELOPMENT.md`, `README.md`
- [x] 3.3 Rebuild `dist/quiz.html`, run the smoke test on Node 22.23.4
- [x] 3.4 `openspec validate add-comune-facts --strict`
