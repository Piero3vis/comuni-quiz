## ADDED Requirements

### Requirement: Tests run on every pull request and on main
A GitHub Actions workflow SHALL run on every pull request targeting `main`, on every push to `main`, and on manual dispatch. It SHALL install the dev dependencies with `npm ci` on Node.js 22 and run `npm test`. The job SHALL fail when `npm test` exits with a non-zero status.

#### Scenario: Pull request with passing tests
- **WHEN** a pull request targeting `main` is opened or updated and `npm test` passes
- **THEN** the "test" job reports success on the pull request and nothing is deployed

#### Scenario: Pull request with a failing test
- **WHEN** a pull request breaks the smoke test
- **THEN** the "test" job reports failure on the pull request
