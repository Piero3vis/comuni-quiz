## Why

The repository is on GitHub (`Piero3vis/comuni-quiz`, public) and the publishing decision is made: only `dist/quiz.html`, served as `index.html`, on GitHub Pages. Today nothing builds or publishes it, and nothing runs the tests outside this machine (where `npm test` cannot run: jsdom 30 needs Node 22.22+). Changes should go through a pull request whose tests must pass before they reach the live site.

## What Changes

- **CI on pull requests and on `main`:** a GitHub Actions workflow installs the dev dependencies with Node 22 and runs `npm test` (builds `dist/quiz.html` and runs the jsdom smoke test on both variants).
- **Deploy on `main`:** after the tests pass on a push to `main` (or a manual run), the workflow copies `dist/quiz.html` to `_site/index.html` and deploys it with the official Pages actions. Nothing else is published.
- **Pages enabled** with source "GitHub Actions". The site lives at `https://piero3vis.github.io/comuni-quiz/`.
- **Change workflow documented** in README and `CLAUDE.md`: OpenSpec change → branch → pull request (CI) → merge → automatic deploy → archive the change.

## Capabilities

### New Capabilities
- `ci-checks`: automated tests on every pull request and on `main`.
- `pages-deploy`: automatic publication of the single file to GitHub Pages after a green build on `main`.

### Modified Capabilities
None.

## Non-goals

- Custom domain (can be added later; note that saved progress is tied to the address).
- Branch protection rules (recommended in the README; set by the owner in the repository settings).
- Analytics, donations, previews per pull request.

## Impact

- New `.github/workflows/pages.yml`.
- `README.md` (Publishing, workflow), `CLAUDE.md` (workflow).
- Repository settings: Pages source = GitHub Actions (via `gh api`).
- No change to the app, data or tests.
