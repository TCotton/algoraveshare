<!--
Sync Impact Report

Version change: 1.5.0 -> 1.6.0

Modified principles:
 - Technology Constraints: require Supabase as the default BaaS for PostgreSQL and user authentication

Added guidance:
 - Supabase: Projects MUST use Supabase (Postgres + Auth) as the Backend-as-a-Service for PostgreSQL hosting and user authentication by default. Exceptions require an approved Constitution Check and documented rationale.
 - CI Secrets: CI pipelines MUST store Supabase credentials in secrets (e.g., SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY) and never commit secrets to the repository.

Added sections:
 - Supabase BaaS: guidance on using Supabase for Postgres and auth and CI integration

Templates requiring updates:
 - .specify/templates/plan-template.md ✅ updated
 - .specify/templates/spec-template.md ✅ updated
 - .specify/templates/tasks-template.md ✅ updated

Follow-up TODOs:
 - Add CI job examples and documentation for setting SUPABASE_* secrets
 - Add guidance for provisioning Supabase projects and mapping DB schemas/migrations
 - Add an example `backend/supabase/README.md` with initialization and local dev guidance (deferred)


# AlgoraveShare Constitution

## Core Principles

### I. Library-First
Every feature or capability should be modelled as a well-scoped, independently
testable library or package. Libraries MUST have a clear public contract,
automated tests, and documentation that allows reuse without heavy cross-team
coordination. Rationale: modular design improves testability, reviewability,
and reuse.

### II. CLI-First Interfaces
Where applicable, libraries and services MUST expose a CLI or programmatic
interface that supports stdin/args → stdout and structured output (JSON) for
automation. Rationale: text protocols simplify automation, CI integration, and
debugging across environments.

### III. Test-First (NON-NEGOTIABLE)
Tests MUST be written before implementation (TDD). Every new capability MUST
have failing tests committed first, followed by implementation that makes the
tests pass. Rationale: ensures design is verifiable and prevents regressions.

### III.b All code must have unit tests (NEW RULE)
All production code added to the repository MUST be accompanied by unit tests.
No code should be merged to the mainline without at least one unit test covering
its primary behaviour. This is in addition to the TDD requirement above and
applies to libraries, API handlers, UI components, and scripts. Rationale:
guarantees baseline test coverage and enforces testable design.

### IV. Integration Testing
Integration tests are RECOMMENDED for cross-boundary changes (API contracts,
shared schemas, and inter-service communication). Integration tests MUST be
added when changes affect multiple services or external systems. For
single-library or single-package changes, comprehensive unit tests using
Vitest MAY be sufficient. Rationale: maintain fast, reliable unit-test-driven
development while still requiring integration coverage when multiple systems
interact.

### V. Observability & Versioning
Structured logging, error traces, and actionable metrics MUST be part of any
service or long-running process. Releases MUST follow semantic versioning for
public packages; breaking changes MUST increment MAJOR and be documented with a
migration guide. Rationale: observability reduces incident time-to-resolution
and clear versioning communicates compatibility guarantees.

## Technology Constraints

The project sets minimal runtime constraints to ensure reproducible builds and
predictable CI behavior:

- Minimum LTS Node.js version: 22 (Node.js 22.x, LTS). Tooling, CI, and
	developer environments MUST target Node.js >= 22 where Node is used.
- JavaScript modules: All JavaScript/Node projects and packages in this
	repository MUST use ECMAScript Modules (ESM). Package manifests MUST set
	`"type": "module"` when using .js entry points, or use `.mjs` extensions
	for ESM files. CI and tooling configurations MUST be compatible with ESM.
- When Node.js is used, package manifests SHOULD include an `engines` entry to
	declare the minimum Node version. CI pipelines MUST enforce the declared
	engines version during builds.
- Unit testing: Vitest is the mandated unit testing framework for this
	repository. Unit tests MUST be written using Vitest and included in CI.
Integration and E2E tests are optional and required only when changes
	cross system boundaries (see Integration Testing above). Rationale: keep
	unit testing fast and consistent across the codebase while ensuring
	integration coverage where it matters.

This constitution change increments the version and records the amendment date below.
- Other technology constraints (databases, language runtimes) SHOULD be listed
	in feature-level `plan.md` files when relevant. If unspecified, mark as
	NEEDS CLARIFICATION in the spec.

## Development Workflow

- Pull Requests: All changes MUST be proposed via PRs and reviewed by at least
	one other maintainer. PRs that affect principles in this constitution MUST
	include a short justification and a passing Constitution Check (see below).
- CI Gates: Every PR MUST run unit tests, integration tests (when affected),
	linting, and the Constitution Check step that verifies compliance with the
	Technology Constraints and Core Principles.
- Code Review: Changes that increase system complexity or add runtime
	dependencies MUST be accompanied by a migration plan and cost/benefit
	analysis.

## Governance

Amendments:

- Amendments to this constitution MUST be proposed as a PR against
	`.specify/memory/constitution.md` and include a migration or compliance
	verification plan. For non-trivial changes the proposal MUST include a
	compatibility impact assessment.
- Approval: A simple majority of active maintainers (as defined in
	`MAINTAINERS.md` or repository settings) is required for MINOR/PATCH changes.
	MAJOR governance changes (removing or redefining an existing core principle)
	require a 2/3 majority and a 2-week notice period.

Versioning policy:

- MAJOR: Backwards-incompatible governance or principle removals/redefinitions.
- MINOR: New principles or materially expanded guidance.
- PATCH: Clarifications, wording, typo fixes, or non-semantic refinements.

Compliance review expectations:

- The Constitution Check is enforced in `/plan` and `/tasks` generation and CI
	where applicable. Non-compliant changes MUST be documented with an
	accepted Complexity Tracking entry that justifies deviations.

**Version**: 1.6.0 | **Ratified**: 2025-10-01 | **Last Amended**: 2025-10-02