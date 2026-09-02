<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles:
- None renamed or redefined
Added sections:
- None (new mandatory rules added to existing "Engineering Constraints" and
  "Delivery Workflow" sections across v1.1.0 and v1.2.0)
Materially expanded guidance:
- v1.1.0 - Engineering Constraints: mandatory Node runtime rule requiring every
  project command to run on the Node version required by package.json
  (engines.node), selected via nvm.
- v1.1.0 - Delivery Workflow: matching pre-command Node alignment requirement,
  with verification evidence tied to that version.
- v1.2.0 - Delivery Workflow: mandatory /code-review pass after every
  /speckit-implement (or equivalent implementation pass), with blocking findings
  resolved or explicitly deferred before the work is considered complete.
Removed sections:
- None
Templates requiring updates:
- ✅ reviewed: .specify/templates/plan-template.md (Constitution Check already
  covers a Node-version gate; no change required)
- ✅ reviewed: .specify/templates/spec-template.md (no change required)
- ✅ reviewed: .specify/templates/tasks-template.md (no change required)
- ⚠ pending: .specify/templates/commands/*.md (directory missing in this repo)
- ⚠ pending: .specify/extensions.yml (optional: wire an after_implement hook to
  prompt /code-review; not required for the governance rule to apply)
- ✅ reviewed: README.md (no change required)
Follow-up TODOs:
- None
-->
# Mentone Girls Grammar UI Constitution

## Core Principles

### I. Module-Gated Delivery
Every feature exposed inside the SchoolBox or remote module surface MUST declare its
route entry point, its `moduleId`, and its access model before implementation begins.
Protected experiences MUST be wrapped with `ModuleAccessWrapper` or an equivalent shared
guard, and admin-only actions MUST use the admin role path explicitly. New work MUST fit
the existing routed module model instead of introducing one-off entry mechanisms.
Rationale: this application serves many school operations from one frontend, and access
drift creates real operational and privacy risk.

### II. Typed Service Boundaries
UI components MUST consume backend data through `src/services/*` wrappers and shared
types in `src/types/*`. Direct `axios` usage in pages or components is forbidden unless
the shared service layer is being extended in the same change. Request headers, tokens,
and environment-derived endpoints MUST flow through `AppService` and related helpers
rather than being rebuilt ad hoc in feature code.
Rationale: the repo already centralizes API shape, auth headers, and pagination logic in
the service layer; bypassing that pattern creates inconsistent contracts and harder
maintenance.

### III. Explicit Async UX States
Any user-triggered async operation MUST present loading, success, and failure behaviour
explicitly. Errors MUST surface through shared UI mechanisms such as `Toaster`,
validation components, or access-denied panels; silent failures are non-compliant.
Pages that load operational data MUST handle empty, loading, and unauthorized states
deliberately, and long-running actions MUST prevent duplicate submission.
Rationale: this UI is used for finance, attendance, enrolments, donations, and reporting;
operators need clear feedback to act safely.

### IV. School Data and Configuration Safety
Changes that handle student, parent, staff, finance, or donation data MUST minimise
exposure of sensitive information in browser storage, logs, and rendered HTML. New
environment variables MUST use the `REACT_APP_` prefix, be documented at introduction,
and degrade safely when absent. Any use of `dangerouslySetInnerHTML`, token persistence,
file upload, or third-party embeds MUST include an explicit justification and a review of
sanitisation, origin, and permission impact.
Rationale: this codebase integrates with SchoolBox, Synergetic, payments, Power BI, and
messaging systems, so small frontend shortcuts can become privacy or security defects.

### V. Risk-Based Verification
Every change MUST include verification matched to its operational risk. Shared helpers,
calculations, reducers, hooks, and data transforms MUST gain automated tests when
behaviour changes. Module access, routing, payments, exports, uploads, and other
cross-system workflows MUST receive an end-to-end check through Cypress or a documented
manual verification path when automation is not practical. A feature is not complete
until the author records the verification evidence.
Rationale: the current repo has light automated coverage, so discipline must come from
targeting the highest-risk paths rather than assuming incidental correctness.

## Engineering Constraints

This project is a single React 18 and TypeScript application rooted in `src/`, with a
shared service layer, Redux store, Netlify deployment assets, and an `AppLoader` bundle
for embedded use. New frontend work MUST preserve that shape unless an approved plan
justifies structural change.

Implementation constraints:

- Reuse shared UI, hooks, helpers, and layouts before introducing new abstractions.
- Keep module-specific API calls in domain service files under `src/services/`.
- Keep domain contracts in `src/types/` and avoid anonymous `any` payloads when a stable
  interface can be defined.
- Prefer local component state for screen-local behaviour and Redux only for cross-app
  state that must survive route transitions.
- Preserve Sentry initialization, toast notifications, and existing operational support
  paths for production-visible errors.
- Run every project command (dependency install, `yarn start`, `yarn build`, `yarn test`,
  Cypress, lint, and the Spec Kit scripts) on the Node version required by `package.json`
  (`engines.node`), selected with `nvm` before the command runs. Contributors and agents
  MUST NOT rely on a globally active, system, or newer Node version, and MUST NOT change
  `engines.node` to match an already-active runtime instead of switching with `nvm`.

## Delivery Workflow

Feature specs and plans MUST capture the affected route or module surface, access control
requirements, backend services touched, environment/config changes, and verification
strategy before implementation starts.

Implementation and review expectations:

- Plans MUST pass the Constitution Check before research ends and again before coding
  begins.
- Before running any install, build, test, lint, or dev command, contributors MUST align
  the active Node version with `package.json` (`engines.node`) using `nvm`. Verification
  evidence (test runs, builds) MUST be produced on that Node version, and the version used
  SHOULD be recorded in the task or review notes.
- After every `/speckit-implement` run (or any equivalent implementation pass that produces
  code changes), a `/code-review` pass over the resulting diff MUST run before the work is
  considered complete. Blocking findings MUST be fixed, or explicitly deferred with a
  recorded rationale, before merge. The review outcome is part of the verification evidence
  required by Principle V.
- Reviews MUST confirm service-layer reuse, access-control coverage, async-state handling,
  and verification evidence.
- Refactors that move shared patterns MUST include migration notes for affected modules.
- Breaking changes to module URLs, environment variables, or API contracts MUST be called
  out explicitly in the plan, tasks, and review summary.

## Governance

This constitution overrides conflicting local habits for this repository. Amendments
require the updated constitution, a Sync Impact Report at the top of this file, and
aligned changes to affected Spec Kit templates and runtime guidance documents in the same
change whenever those artifacts exist.

Versioning policy:

- MAJOR for removing or redefining a core principle in a way that changes compliance.
- MINOR for adding a principle or materially expanding governance requirements.
- PATCH for clarifications, wording improvements, or non-semantic template sync.

Compliance policy:

- Every implementation plan MUST document how the change satisfies the five core
  principles or justify any temporary exception.
- Every review or self-review MUST verify that required tests or manual checks ran and
  that any skipped coverage is explained.
- Exceptions are time-boxed decisions owned by maintainers and MUST be tracked in the
  relevant plan or PR notes until removed.

**Version**: 1.2.0 | **Ratified**: 2026-04-22 | **Last Amended**: 2026-09-02
