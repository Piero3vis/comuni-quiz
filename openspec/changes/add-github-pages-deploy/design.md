## Context

`dist/` is gitignored, so the published file must be built in CI. `npm test` already runs `scripts/build_single_file.py` (stdlib Python, available on `ubuntu-latest`) and the jsdom smoke test, which needs Node 22.22+ for jsdom 30. `package-lock.json` is committed, so `npm ci` is reproducible.

## Goals / Non-Goals

**Goals:** one workflow that tests every pull request and deploys `main`; only `index.html` online; a documented change process.

**Non-Goals:** custom domain, branch protection setup, preview deploys.

## Decisions

- **One workflow, two jobs (`test`, `deploy`)** instead of separate CI and deploy files: the deploy reuses the exact file the tests just checked, passed as the Pages artifact from the test job. Alternative: rebuild in the deploy job. Rejected because the artifact could differ from the tested one.
- **Official actions, pinned to major versions** (`actions/checkout@v7`, `actions/setup-node@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, `actions/deploy-pages@v5`): all published by GitHub, current majors as of 2026-11-02. Third-party actions are avoided.
- **Upload the artifact only when it will be deployed** (`if:` on push to `main` or manual run), so pull requests do not create Pages artifacts.
- **Least-privilege permissions:** `contents: read` at workflow level; `pages: write` and `id-token: write` only on the deploy job.
- **Concurrency:** runs on `main` share one group with `cancel-in-progress: false` (GitHub's recommended setting; a running deploy is not cut off halfway); pull request runs are grouped per branch and cancel older runs of the same PR.
- **Pages source set via API** (`gh api -X POST repos/Piero3vis/comuni-quiz/pages -f build_type=workflow`) so the setting is reproducible and recorded here.

## Risks / Trade-offs

- [jsdom 30 behaves differently from the jsdom 24 used locally] → the first CI run on the pull request is the real check; fix before merging.
- [Action majors get deprecated] → GitHub warns in the run log; bump the majors in a small change.
- [Direct pushes to `main` skip review] → README recommends a branch protection rule requiring the "test" check.
