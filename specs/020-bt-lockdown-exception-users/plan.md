# Implementation Plan: Budget Tracker Exception Users & Lockdown Bypass

**Branch**: `020-bt-lockdown-exception-users` | **Date**: 2026-09-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/020-bt-lockdown-exception-users/spec.md`

## Summary

Two frontend-only changes to the Budget Tracker module:

1. **Exception Users list** - add a second roster (Budget Tracker members holding
   the existing **Normal** role) below the Admin Users list on the BT Admin
   *Users* screen, reusing the shared `ModuleUserList` component and existing
   `UserService` endpoints.
2. **Lockdown bypass** - on a GL-account detail screen for a locked budget year,
   keep the **New Item** and **Bulk Create Items** actions visible and usable
   when the current user is a Budget Tracker Admin *or* Exception (Normal-role)
   member, by widening the single gate in `BTGLDetailsPage.getOptionsPanel()`.

No `mggs-api` change. No new service, type, endpoint, env var, or storage. Lockdown
is browser-enforced only, so the bypass is a pure UI-visibility change.

## Technical Context

**Language/Version**: TypeScript 4.x, React 18 (Create React App / `react-scripts`, not ejected)
**Primary Dependencies**: react-bootstrap, styled-components, react-redux; internal `ModuleUserList`, `AuthService`, `UserService`, `BTLockDownService`
**Storage**: N/A (reads existing `uMGGSUsers` / `uMGGSRoles` via existing API; no schema change)
**Testing**: Jest + React Testing Library (`yarn test`); Cypress for the cross-system check (`yarn cypress:run`)
**Target Platform**: Browser SPA, also embedded in SchoolBox via `/modules/remote/:code`
**Project Type**: Single-project web frontend (this repo)
**Performance Goals**: N/A - admin rosters are tiny (single-digit rows); one extra `canAccess` request per GL-detail view
**Constraints**: Node version per `package.json` `engines.node` (>=20) selected via `nvm` before any command; must not regress locked-year behaviour for non-exempt users
**Scale/Scope**: 2 component files changed, 1 shared component optionally extended, ~3 test files touched

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Module surface & access control**: Affected surface is the Budget Tracker
  module (`MGGS_MODULE_ID_BUDGET_TRACKER` = 6), SchoolBox remote module. Screens:
  BT Admin *Users* (`BTAdminPage` → `BTUserAdminPanel`, already inside
  `ModuleAccessWrapper` with `roleId={ROLE_ID_ADMIN}`) and the GL-account detail
  screen (`BTGLDetailsPage`, reached via `BudgetTrackerPage` under
  `ModuleAccessWrapper moduleId={6}`). No new entry point. The Users screen stays
  admin-only; the new exempt check on the GL screen only *adds* visibility and
  never removes access. PASS.
- **Typed service boundaries**: Reuses `UserService.getUsers/createUser/deleteUser`
  and `AuthService.canAccessModule` through the existing `src/services/*`
  wrappers and `src/types/modules/*` contracts. No `axios` in components, no new
  endpoint. PASS.
- **Explicit async UX states**: The Exception Users list inherits
  `ModuleUserList`'s existing loading (`PageLoadingSpinner`), empty (empty
  table), success (`Toaster` success on add), and error (`Toaster.showApiError`)
  handling. The GL-screen exempt check adds a loading guard (panel hidden /
  spinner while resolving) and routes failure through `Toaster.showApiError`,
  defaulting to **not exempt**. PASS.
- **School-data / config safety**: No new sensitive data, env var, storage,
  upload, token handling, embed, or `dangerouslySetInnerHTML`. The Exception
  Users list shows the same staff ID/name/email already shown for Admin Users.
  PASS.
- **Risk-based verification**: New/changed logic is UI gating and a shared-panel
  addition - covered by Jest component tests (`BTUserAdminPanel`,
  `BTGLDetailsPage`). The locked-year cross-system access-visibility flow gets a
  Cypress spec or a documented manual SchoolBox/UAT check across the three user
  categories (admin / exception / neither). All verification runs on the
  `engines.node` version via `nvm`. A `/code-review` pass follows implementation
  (constitution v1.2.0). PASS.

**Result**: No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/020-bt-lockdown-exception-users/
├── plan.md              # This file
├── spec.md              # Feature spec (+ Clarifications)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 output - reused API + UI behaviour contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks - not created here)
```

### Source Code (repository root)

```text
src/
├── pages/BudgetTracker/
│   ├── BTGLDetailsPage.tsx                         # CHANGE: add isExempt state + widen getOptionsPanel gate
│   └── components/admin/BTUserAdminPanel.tsx       # CHANGE: add "Exception Users" ModuleUserList (roleId=ROLE_ID_NORMAL)
├── components/module/
│   └── ModuleUserList.tsx                          # OPTIONAL: add defaulted prop for accurate delete-confirm copy
├── services/
│   ├── AuthService.ts                              # REUSE (canAccessModule) - no change
│   └── UserService.ts                              # REUSE - no change
├── types/modules/
│   ├── iRole.ts                                    # REUSE (ROLE_ID_NORMAL already exists) - no change
│   └── iModuleUser.ts                              # REUSE (MGGS_MODULE_ID_BUDGET_TRACKER) - no change
└── __tests__/pages/BudgetTracker/
    ├── components/admin/BTUserAdminPanel.test.tsx  # UPDATE: assert Exception Users list renders
    └── BTGLDetailsPage.test.tsx                    # UPDATE: mock AuthService; cover locked + exempt/non-exempt

cypress/
└── e2e/                                            # OPTIONAL: bt-lockdown-exception spec, or documented manual check
```

**Structure Decision**: Single existing frontend project. Changes are localised
to two Budget Tracker files under `src/pages/BudgetTracker/`, with an optional
backward-compatible tweak to the shared `src/components/module/ModuleUserList.tsx`
and updates to the two matching Jest test files under `src/__tests__/`.

## Complexity Tracking

No constitution violations; no entries required.
