# Specification Quality Checklist: Impersonation Detection & Per-Module Block

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-09-03
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- Clarifications settled (2026-09-03): FR-011 = fail open; FR-011a = Sentry warning once
  at boot when embedded-but-global-missing; FR-012 = flag set outside the app (DB / backend
  admin) with an API-project migration; FR-013 = screen-level gate only (no in-app entry
  points to hide - the MGG UI has no module navigation of its own); detection signal = a
  JavaScript global on the SchoolBox host page, resolved once at boot into the Redux `app`
  slice.
- "UI only" enforcement is explicitly recorded (FR-010): this is browser-side
  defence-in-depth, not a security boundary; backend role checks are unchanged. The API
  changes (FR-003a/FR-003b) are additive - they only add and return the new field.
- Named identifiers (`uMGGSModules`, `blockImpersonatedUser`, `ModuleAccessWrapper`,
  `Page401`, Redux `app` slice, Sentry, `#mgg-root` / `iframe#remote`) appear because the
  user specified them as constraints or because they are existing artifacts this feature
  extends - kept for traceability, not as new design decisions.
- Open risk carried into planning: whether the Synergetic-side database that holds
  `uMGGSModules` can take an app-run migration (Assumptions section). Confirming the exact
  SchoolBox host-page global name/field-path is a planning/implementation task.
