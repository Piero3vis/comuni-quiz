## 1. Page

- [x] 1.1 `index.html`: new title, meta description, canonical link, Open Graph and Twitter tags, JSON-LD `WebApplication`
- [x] 1.2 `index.html`: inline SVG favicon (data URI)
- [x] 1.3 `index.html` + `style.css`: "Il quiz dei comuni italiani" section above the footer (`.about`)

## 2. Tests and docs

- [x] 2.1 Smoke test: title, description, canonical, Open Graph, JSON-LD, inline favicon, visible text
- [x] 2.2 `CLAUDE.md`: SEO tags live in `index.html`; update the count and the URL in them when they change
- [x] 2.3 Rebuild `dist/quiz.html` and run `tests/smoke.js` (both variants green on Node 22.23.4)
- [x] 2.4 `openspec validate improve-search-visibility --strict`
