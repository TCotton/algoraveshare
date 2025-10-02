# Contributing

Please follow these rules when contributing to AlgoraveShare:

- All new production code MUST include unit tests (Vitest).
- Follow TDD where practical: add failing tests first, then implement.
- Unit tests should live next to code (e.g., `component.test.tsx` or `__tests__/foo.test.ts`).
- PRs must pass the CI gate which enforces the presence of tests for changed source files.

If you need to add integration or E2E tests, document why they're required in the PR description.
