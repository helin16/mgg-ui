# Implementation Plan: Budget Tracker - Exempt Users Edit Items After Lockdown

**Branch**: `022-bt-exception-edit-after-lockdown` | **Date**: 2026-09-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/022-bt-exception-edit-after-lockdown/spec.md`

## Summary

On a GL-account detail screen for a **locked** budget year, decide the item
list's read-only state per user and per viewed year instead of "locked ⇒
read-only for all":

- **Admin user** → item list editable for **any** viewed year.
- **Exception user** (non-admin) → item list editable **only when the viewed year
  is the budget year** (current calendar year + 1).
- **Everyone else**, and exception users on any other locked year → item list
  fully read-only (edit + single/bulk actions + delete), which also **closes a
  current gap** where row-level edit popups stay editable on locked years.

Frontend-only (lockdown is browser-enforced only). One computed value in
`BTGLDetailsPage` feeds the existing `isReadOnly` prop of `BTGLDetailsPanel`, and
`BTGLDetailsPanel` starts passing that flag to the item table so row popups
honour it. Admin-vs-exception is read from the `AuthService.canAccessModule`
response feature 020 already fetches.

**Depends on**: feature **020-bt-lockdown-exception-users** (the `isExempt` /
`AuthService.canAccessModule` wiring in `BTGLDetailsPage`). 020 must be
implemented first (it currently is, in the working tree).

## Technical Context

**Language/Version**: TypeScript 4.x, React 18 (CRA, not ejected), Node >=20.
**Primary Dependencies**: `AuthService` (feature 020), `BTLockDownService`, `moment-timezone`, `react-bootstrap`; components `BTGLDetailsPage`, `BTGLDetailsPanel`, `BTItemsTable`, `BTItemCreatePopupBtn`/`BTItemEditPanel` (unchanged, just receive the flag).
**Storage**: None. No schema, no persisted state.
**Testing**: Jest + RTL (`yarn test`). Cross-system locked-year matrix - Cypress or documented manual SchoolBox/UAT.
**Target Platform**: Browser SPA, also SchoolBox-embedded via `/modules/remote/:code`.
**Project Type**: Single-project web frontend.
**Performance Goals**: N/A - one boolean computed from an already-fetched response; no extra request.
**Constraints**: Run commands on `package.json` `engines.node` (>=20) via `nvm use 20`. Must not regress unlocked-year behaviour or the feature-020 New Item / Bulk Create bypass. No-flash: the item controls must not render editable for a non-exempt user (or read-only for an exempt user) while the admin/exception check is in flight.
**Scale/Scope**: 2 component files changed (`BTGLDetailsPage.tsx`, `BTGLDetailsPanel.tsx`), 1 new exported pure helper, ~2 test files touched.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Module surface & access control**: change is confined to the Budget Tracker
  GL-account detail screen, already inside the module's `ModuleAccessWrapper`. No
  new route/`moduleId`/entry point. The change only **removes** a read-only
  restriction for already-trusted users (admins any year; exception users on the
  budget year) and **adds** a restriction elsewhere (non-exempt users lose the
  current locked-year edit gap); it never grants module access to anyone who
  lacks it. PASS.
- **Typed service boundaries**: reuses `AuthService.canAccessModule` and
  `src/types/modules/iRole.ts` constants; no new service, endpoint, or `axios`
  use. PASS.
- **Explicit async UX states**: the admin/exception check reuses feature 020's
  existing loading (`isCheckingExempt`) and error handling (`Toaster.showApiError`,
  default to non-exempt on failure); no new async call, no new silent-failure
  path. The item edit/approve/decline/bulk/delete flows are unchanged and keep
  their existing states. PASS.
- **School-data / config safety**: no new env var, storage, upload, embed, token
  handling, or `dangerouslySetInnerHTML`. No new data rendered. PASS.
- **Risk-based verification**: the read-only decision is a small pure function -
  exported and unit-tested (mirrors `canShowCreateOptions` / 
  `canShowDeleteForSelectedItems`). The locked-year edit matrix across
  admin / exception-on-budget-year / exception-on-old-year / non-exempt is a
  cross-system flow - Cypress or documented manual verification. `/code-review`
  on the diff (constitution v1.2.0). Commands on the pinned Node. PASS.

**Result**: No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/022-bt-exception-edit-after-lockdown/
├── plan.md              # This file
├── spec.md              # Feature spec (+ Clarifications)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-contract.md   # Phase 1 - the read-only decision + prop flow
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks - not created here)
```

### Source Code (repository root)

```text
src/
├── pages/BudgetTracker/
│   ├── BTGLDetailsPage.tsx                 # CHANGE: derive isAdmin + isException from the
│   │                                       #   canAccessModule response (feature 020 already calls it);
│   │                                       #   add exported getItemListReadOnly(...) helper;
│   │                                       #   pass isReadOnly={itemListReadOnly} to BTGLDetailsPanel
│   │                                       #   (was isReadOnly={isDisabled}); getOptionsPanel unchanged;
│   │                                       #   getContent() shows a spinner (not the panel) while
│   │                                       #   isLoading || isCheckingExempt (no-flash, FR-006)
│   └── components/
│       └── BTGLDetailsPanel.tsx            # CHANGE: pass readyOnly={isReadOnly} to the main
│                                           #   <BTItemsTable> in getBTItemsTable() (currently omitted),
│                                           #   so row-level edit popups honour the clamp
├── types/modules/
│   └── iRole.ts                            # REUSE (ROLE_ID_ADMIN / ROLE_ID_NORMAL) - no change
└── __tests__/pages/BudgetTracker/
    ├── BTGLDetailsPage.helper.test.ts      # UPDATE: add getItemListReadOnly cases (from feature 020's file)
    ├── BTGLDetailsPage.test.tsx            # UPDATE: assert the isReadOnly prop value per user/year
    └── components/BTGLDetailsPanel.test.tsx# UPDATE: assert BTItemsTable receives readyOnly === isReadOnly

cypress/
└── e2e/                                    # OPTIONAL: locked-year edit matrix, or documented manual check
```

**Structure Decision**: Single existing frontend project. Two Budget Tracker
component files change; everything else (item edit panel, item table row popups,
bulk-operation logic, `AuthService`) is reused untouched and simply receives a
more precise `isReadOnly` value.

## Complexity Tracking

No constitution violations; no entries required.
