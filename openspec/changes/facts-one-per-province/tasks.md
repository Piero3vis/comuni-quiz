## 1. Format and rules

- [x] 1.1 `facts.json` entries become `{ testo, fonte }`; `withGroups()` reads `testo`
- [x] 1.2 Tests: `fonte` required (https), no capoluoghi, existing checks on `testo`, Veneto covered, coverage report

## 2. Sources for the existing 80

- [x] 2.1 Collect sources (agents), check every reported problem against the source
- [x] 2.2 Fix or shorten texts that the source does not support

## 3. Veneto

- [x] 3.1 Seven curiosità (BL, PD, RO, TV, VE, VR, VI), each checked on its source

## 4. Docs and verification

- [x] 4.1 DEVELOPMENT.md ("Add a curiosità"), CLAUDE.md (format)
- [x] 4.2 `openspec validate --strict`; tests pass locally and on the pull request (PR #7, run 43063887326)
