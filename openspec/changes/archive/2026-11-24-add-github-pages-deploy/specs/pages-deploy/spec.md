## ADDED Requirements

### Requirement: Only the single file is deployed
The deploy SHALL publish exactly one file: `dist/quiz.html` produced by the test job's build, renamed to `index.html` at the root of the Pages artifact. No other repository file SHALL be part of the artifact.

#### Scenario: Artifact contents
- **WHEN** the Pages artifact is built
- **THEN** it contains only `index.html`, byte-identical to `dist/quiz.html` from the same run

### Requirement: Deploy happens only after green tests on main
The deploy job SHALL run only for pushes to `main` and manual runs, and only after the test job succeeds. Concurrent deploys SHALL be serialised so the last push wins, without cancelling a deploy in progress.

#### Scenario: Merge to main
- **WHEN** a pull request is merged into `main` and the tests pass
- **THEN** the site at `https://piero3vis.github.io/comuni-quiz/` serves the new `index.html`

#### Scenario: Tests fail on main
- **WHEN** a push to `main` fails `npm test`
- **THEN** no deploy runs and the previously published site stays online

#### Scenario: Pull requests never deploy
- **WHEN** the workflow runs for a pull request
- **THEN** the deploy job is skipped
