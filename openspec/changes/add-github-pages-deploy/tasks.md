## 1. Workflow

- [x] 1.1 Add `.github/workflows/pages.yml`: triggers (pull_request to main, push to main, workflow_dispatch), `test` job (checkout, Node 22, `npm ci`, `npm test`, copy `dist/quiz.html` to `_site/index.html`, upload Pages artifact only on main/manual), `deploy` job (needs test, only on main/manual, `pages: write` + `id-token: write`, concurrency `pages`)
- [x] 1.2 Enable Pages with source "GitHub Actions" via `gh api`

## 2. Docs

- [x] 2.1 README "Publishing": live URL, how deploys happen, recommended branch protection
- [x] 2.2 README + `CLAUDE.md`: change workflow (OpenSpec change → branch → PR → CI → merge → deploy → archive)

## 3. Verification

- [x] 3.1 `openspec validate add-github-pages-deploy --strict`
- [x] 3.2 Push the branch, open a pull request, confirm the "test" job passes on GitHub (jsdom 30, Node 22) and deploy is skipped (run 41467357589: Node 22.23.4, both variants OK)
- [ ] 3.3 After merge: deploy job succeeds and `https://piero3vis.github.io/comuni-quiz/` serves the quiz
