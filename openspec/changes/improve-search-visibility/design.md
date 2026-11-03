## Context

Only `dist/quiz.html` is published, as `index.html`, and it must not load external resources. `build_single_file.py` copies the `<head>` unchanged apart from inlining `style.css` and `app.js`.

## Decisions

- **All tags live in `index.html`**, so the dev page and the single file stay identical; the build script needs no change.
- **Favicon as an SVG data URI**: no extra file to publish. Browsers show it in tabs. Google Search requires a crawlable favicon file, so it may not show next to the result; publishing a real icon file would mean changing the "only `quiz.html`" rule and is left out.
- **Visible section below the game**, not under the heading: the map stays at the top of the screen. Search engines read text anywhere on the page.
- **`WebApplication` with `applicationCategory: GameApplication`**, free offer and `inLanguage: it`: the closest schema.org type for a browser game.
- **The number 7.896 is written in the title, description text and section**: it matches the counter on the page. When the 2026 mergers are applied, these strings must be updated (noted in `CLAUDE.md`).

## Risks / Trade-offs

- [The canonical URL is hard-coded] → if the site moves (custom domain), update the canonical, `og:url` and JSON-LD `url`; the smoke test checks they agree.
