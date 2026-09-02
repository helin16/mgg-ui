# Research: Budget Tracker Exception Users & Lockdown Bypass

**Feature**: 020-bt-lockdown-exception-users
**Date**: 2026-09-02

All open questions from the spec are resolved. No `NEEDS CLARIFICATION` remains.
This is a frontend-only change in `mgg-ui`; no `mggs-api` change.

## Decision 1 - How to model and manage "Exception Users"

**Decision**: An Exception User is a Budget Tracker (`MGGS_MODULE_ID_BUDGET_TRACKER`
= 6) module membership row with the existing **Normal** role
(`ROLE_ID_NORMAL` = 1). The Exception Users list is a second
`<ModuleUserList moduleId={6} roleId={ROLE_ID_NORMAL} showCreatingPanel
showDeletingBtn />` rendered under the existing Admin Users list in
`src/pages/BudgetTracker/components/admin/BTUserAdminPanel.tsx`.

**Rationale**:

- `ModuleUserList` is already fully role-parameterised: it lists via
  `UserService.getUsers({ where: { Active: 1, ModuleID, RoleID } })`, creates via
  `UserService.createUser(moduleId, roleId, synergeticId)`, and deletes via
  `UserService.deleteUser(moduleId, roleId, synergeticId)`. No service or type
  change is needed.
- The exact "second list for the Normal role" pattern already ships in three
  other admin screens: `src/layouts/AdminPageTabs.tsx`,
  `src/pages/studentAbsences/StudentAbsenceAdminPage.tsx`, and
  `src/pages/reports/StudentAttendanceReport/StudentAttendanceRateReportAdminPage.tsx`.
- Live database check (read-only, via `mggs-api` `.env`): `uMGGSRoles` has only
  Normal (1) and Admin (2) active rows; `uMGGSUsers` primary key is `ID` only
  (no uniqueness constraint on person+module or person+module+role), and real
  rows exist today where one person holds both roles in the same module. So a
  person can appear on both the Admin Users and Exception Users lists
  simultaneously, and `deleteUser` (which is scoped by `roleId`) removes only
  the targeted row - matching spec Edge Case 1 and FR-004.

**Alternatives considered**:

- *New dedicated "Exception" role / membership flag* - rejected by the user and
  by cost: needs an `mggs-api` role seed + model constant + possibly service
  changes, for no functional gain over reusing the Normal role.
- *Store exempt users in `uMGGSUsers.settings` JSON* - rejected: opaque, not
  listable/filterable, diverges from the established roster pattern.

## Decision 2 - How the current user's "exempt" status is determined

**Decision**: In `src/pages/BudgetTracker/BTGLDetailsPage.tsx`, call the existing
`AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)` once and treat the
user as exempt when
`resp[ROLE_ID_ADMIN]?.canAccess === true || resp[ROLE_ID_NORMAL]?.canAccess === true`.

**Rationale**:

- `AuthService.canAccessModule` already returns a `{ [roleId]: { canAccess } }`
  map covering every active role in one request (backend
  `ModuleHelper.canAccessModule` builds it from active `uMGGSUsers` rows), so one
  call answers "admin OR normal member" with no new endpoint and no new service
  method.
- `BTGLDetailsPanel` already uses `AuthService.isModuleRole(6, ROLE_ID_ADMIN)`
  for its admin-only bulk controls; the page-level check is the same service,
  one level up, widened to include the Normal role.

**Alternatives considered**:

- *Two `isModuleRole` calls* - works but is two round-trips for what one
  `canAccessModule` call already returns.
- *Read the Redux `auth` user* - it does not carry module-role membership, so it
  cannot answer this.

## Decision 3 - Where the lockdown gate changes

**Decision**: The only behavioural gate is
`BTGLDetailsPage.getOptionsPanel()`, currently `if (isDisabled) return null`.
Change to keep the panel (with **New Item** and **Bulk Create Items**) rendered
when the user is exempt: `if (isDisabled && !isExempt) return null`. While the
lockdown/exempt status is still loading, render nothing (or the existing
spinner) for that panel so the actions never flash for a non-exempt user and are
never hidden from an exempt user mid-check (spec Edge Case 2).

**Rationale**:

- `BTItemCreatePopupBtn` and `BTItemBulkCreatePopupBtn` have no lockdown logic of
  their own - they are gated purely by whether `getOptionsPanel()` renders them.
- Lockdown is enforced **only** in the browser: `mggs-api`
  `BTItemController` POST has no lockdown check, so no server change is required
  or in scope.
- `isReadOnly={isDisabled}` passed to `BTGLDetailsPanel` (which makes the
  existing item list read-only on a locked year) is intentionally left unchanged
  per FR-008 and the Session 2026-09-02 clarification: exempt users get
  add-only, not edit/delete, on a locked year.

**Alternatives considered**:

- *Bypass server-side too* - out of scope; there is no server-side lockdown
  enforcement to bypass.
- *Also un-set `isReadOnly` for exempt users* - rejected: spec explicitly scopes
  the change to the visibility of the two create actions only.

## Decision 4 - Copy on the Exception Users delete confirmation

**Decision**: Accept `ModuleUserList`'s existing hardcoded confirmation text
("You are about to remove admin rights from ...") for the Exception Users list,
OR add one optional `subjectDescription`/`roleLabel` prop to `ModuleUserList` to
make the noun accurate. Treated as an optional polish task, not a blocker.

**Rationale**: `ModuleUserList` is a shared component (5+ call sites). The spec
requires reuse of the same roster component and the same interaction; the
confirmation wording is cosmetic. If touched, it must stay backward-compatible
for all existing callers (new prop, defaulted).

## Constitution / environment notes

- Node: run every `yarn` / `tsc` / Jest / Cypress command on the version in
  `mgg-ui/package.json` `engines.node` (>=20), selected via `nvm use 20` first.
- `/code-review` pass required after implementation per constitution v1.2.0.
- No new env var, storage, upload, embed, token, or `dangerouslySetInnerHTML`.
