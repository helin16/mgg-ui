---
description: "Task list for Budget Tracker - Exempt Users Edit Items After Lockdown"
---

# Tasks: Budget Tracker - Exempt Users Edit Items After Lockdown

**Input**: Design documents from `/specs/022-bt-exception-edit-after-lockdown/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: The read-only decision is a small exported pure helper - unit-tested (mirrors
`canShowCreateOptions` / `canShowDeleteForSelectedItems`). The prop flow is asserted in the
existing page/panel component tests. The locked-year edit matrix is a cross-system flow -
Cypress or documented manual SchoolBox/UAT.

**Organization**: Three user stories (all P1) that are facets of one shared change, so the
implementation lives in the Foundational phase and each story phase carries its verification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Different file, no dependency on an incomplete task
- **[Story]**: US1 = admin any year; US2 = exception user, budget year only; US3 = non-exempt stay read-only
- Paths are relative to repo root `/Users/helin/git/MentoneGirls/mgg-ui/`

## Path Conventions

Single existing frontend project: source under `src/`, tests under `src/__tests__/`.

---

## Phase 1: Setup

- [X] T001 Confirm feature **020-bt-lockdown-exception-users** is implemented in `src/pages/BudgetTracker/BTGLDetailsPage.tsx`: the lockdown `useEffect` already calls `AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)` and maintains `isExempt` + `isCheckingExempt`, and `canShowCreateOptions` is exported. If not, implement 020 first.
- [X] T002 Confirm the change surface per plan.md: only `src/pages/BudgetTracker/BTGLDetailsPage.tsx` and `src/pages/BudgetTracker/components/BTGLDetailsPanel.tsx`; `ROLE_ID_ADMIN` / `ROLE_ID_NORMAL` (`src/types/modules/iRole.ts`) and `moment-timezone` already imported/available; no new service, endpoint, env var, storage, embed, or `dangerouslySetInnerHTML`.
- [X] T003 [P] Confirm environment: run all commands on `mgg-ui` `package.json` `engines.node` (>=20) via `nvm use 20`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The single shared change that satisfies all three user stories.

- [X] T004 In `src/pages/BudgetTracker/BTGLDetailsPage.tsx`: add an exported pure helper `export const getItemListReadOnly = ({ isDisabled, isAdmin, isException, showingYear, budgetYear }: { isDisabled: boolean; isAdmin: boolean; isException: boolean; showingYear: number; budgetYear: number }): boolean => isDisabled && !(isAdmin || (isException && showingYear === budgetYear));` (place near the existing `canShowCreateOptions` helper).
- [X] T005 In `src/pages/BudgetTracker/BTGLDetailsPage.tsx`: in the existing lockdown `useEffect`, from the `AuthService.canAccessModule(...)` response also set `const isAdmin = resp[ROLE_ID_ADMIN]?.canAccess === true` and `const isException = resp[ROLE_ID_NORMAL]?.canAccess === true` into new state (`isAdmin`, `isException`), keeping the existing `isExempt`/`isCheckingExempt`/`isCanceled` handling. Compute `const budgetYear = moment().year() + 1;` and `const itemListReadOnly = (isLoading || isCheckingExempt) ? isDisabled : getItemListReadOnly({ isDisabled, isAdmin, isException, showingYear, budgetYear });`. In `getContent()` pass `isReadOnly={itemListReadOnly}` to `<BTGLDetailsPanel>` (was `isReadOnly={isDisabled}`). While `isLoading || isCheckingExempt` is true, `getContent()` MUST render `<PageLoadingSpinner />` (import from `../../components/common/PageLoadingSpinner`) instead of `<BTGLDetailsPanel>`, so an admin/exception user is never briefly shown a read-only item list before the role check resolves (spec FR-006); this overlaps `BTGLDetailsPanel`'s own item-fetch spinner in practice. Leave `getOptionsPanel()` using `isExempt` unchanged.
- [X] T006 In `src/pages/BudgetTracker/components/BTGLDetailsPanel.tsx` `getBTItemsTable()`: pass `readyOnly={isReadOnly}` to the main `<BTItemsTable>` (currently no `readyOnly` prop is passed). Do not change `getOperationBtns`, `canShowDeleteForSelectedItems`, `onItemSelected`, or the `getBulkPopupPanel` preview table.
- [X] T007 Add unit tests for `getItemListReadOnly` in `src/__tests__/pages/BudgetTracker/BTGLDetailsPage.helper.test.ts` covering every row of the truth table in `data-model.md`: unlocked → false (any roles/year); locked + admin → false (year == and != budgetYear); locked + exception only + year == budgetYear → false; locked + exception only + year != budgetYear → true; locked + neither → true; admin wins when both admin and exception.

**Checkpoint**: All three stories are functionally satisfied; the phases below verify each.

---

## Phase 3: User Story 1 - Admin user manages items after lockdown, any year (Priority: P1)

**Goal**: On a locked year of any age, an admin user has every item action they have on an unlocked year.

**Independent Test**: Lock the budget year and an earlier year; as an admin, confirm edit / single + bulk approve/decline/status / single + bulk delete all work on both, identical to an unlocked year.

- [X] T008 [US1] In `src/__tests__/pages/BudgetTracker/BTGLDetailsPage.test.tsx`: mock `AuthService.canAccessModule`, `BTLockDownService.getAll`, and `../../../services/Toaster`; assert the `isReadOnly` prop passed to the mocked `BTGLDetailsPanel` is `false` for a locked year when the user is an admin (test both `showingYear === budgetYear` and an earlier year), and stays `false` on an unlocked year. Also assert that when `AuthService.canAccessModule` rejects, `BTGLDetailsPanel` renders with `isReadOnly === true` on a locked year and `Toaster.showApiError` is called (covers SC-005 / FR-006 failure path). (This test file also covers the US2/US3 prop cases below.)
- [ ] T009 [US1] Execute `specs/022-bt-exception-edit-after-lockdown/quickstart.md` section A (admin, budget year + earlier locked year) and record date/tester/result in the PR description. (SC-001)

**Checkpoint**: Admin has full locked-year item management on any year.

---

## Phase 4: User Story 2 - Exception user manages budget-year items after lockdown (Priority: P1)

**Goal**: An exception user (non-admin) can manage items on the locked **budget year** within their normal non-admin permissions, and is fully read-only on any earlier locked year.

**Independent Test**: Lock the budget year and an earlier year; as an exception user, confirm normal non-admin editing works on the budget year and the earlier year is fully read-only.

- [X] T010 [US2] Extend `src/__tests__/pages/BudgetTracker/BTGLDetailsPage.test.tsx` (from T008): assert the `isReadOnly` prop is `false` for a locked year when the user is an exception user (not admin) and `showingYear === budgetYear`, and `true` when the same user views a locked year where `showingYear !== budgetYear`.
- [ ] T011 [US2] Execute `specs/022-bt-exception-edit-after-lockdown/quickstart.md` sections B and C (exception user on budget year; exception user on an earlier locked year) and record the result in the PR description. (SC-002, SC-002a)

**Checkpoint**: Exception-user editing is confined to the budget year; older locked years are read-only for them while an admin on the same year is not.

---

## Phase 5: User Story 3 - Non-exempt users stay read-only after lockdown (Priority: P1)

**Goal**: A user who is neither admin nor exception user has a fully read-only item list on any locked year - including the row-popup edit of NEW / own items that is currently still possible.

**Independent Test**: Lock a year; as a plain member, confirm no item-modifying control is available, including opening a NEW item's row popup (must be read-only).

- [X] T012 [P] [US3] In `src/__tests__/pages/BudgetTracker/components/BTGLDetailsPanel.test.tsx`: assert that the main `<BTItemsTable>` rendered by `getBTItemsTable()` receives `readyOnly` equal to the `isReadOnly` prop given to `BTGLDetailsPanel` (true when `isReadOnly` is true, false when false). Mock `BTItemsTable` if not already mocked.
- [X] T013 [US3] Extend `src/__tests__/pages/BudgetTracker/BTGLDetailsPage.test.tsx` (from T008): assert the `isReadOnly` prop is `true` for a locked year when the user is neither admin nor exception, and `false` on an unlocked year for the same user.
- [ ] T014 [US3] Execute `specs/022-bt-exception-edit-after-lockdown/quickstart.md` section D (non-exempt user; confirm the NEW/own-item row popup is now read-only on a locked year) and record the result, explicitly noting this is an intended behaviour change. (SC-003)

**Checkpoint**: Non-exempt users are genuinely read-only on locked years; the pre-existing edit gap is closed.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T015 Run `nvm use 20 && yarn test` (full suite) and `nvm use 20 && npx tsc -p tsconfig.json --noEmit`; fix regressions in the touched areas. Confirm no new `tsc` errors versus the pre-change baseline.
- [ ] T016 Execute `specs/022-bt-exception-edit-after-lockdown/quickstart.md` sections E (unlocked-year regression, SC-004) and F (`canAccess` failure → read-only + visible error, SC-005); record results in the PR description.
- [ ] T017 Run `/code-review` over the diff and resolve or explicitly defer blocking findings (constitution v1.2.0). Call out in the PR that non-exempt users lose locked-year NEW/own-item editing they had before (intended).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup. T004 → T005; T006 independent of T004/T005 (different file) but part of the same shippable change; T007 after T004.
- **US1 / US2 / US3 (Phases 3-5)**: all depend on Phase 2. They are verification-only and can run in parallel, except T008 → T010 → T013 share `BTGLDetailsPage.test.tsx` and must be sequential.
- **Polish (Phase 6)**: after Phases 2-5.

### User Story Dependencies

- All three stories are satisfied by the same Phase 2 change; none depends on another's code. US2's manual check and US1's manual check both need the same locked-year setup.

### Parallel Opportunities

- T003 with T001/T002.
- T006 ∥ (T004 + T007) - different files.
- T012 ∥ the `BTGLDetailsPage.test.tsx` tasks - different file.
- Manual validation sections A/B/C/D can be done in one sitting with one data setup.

---

## Parallel Example

```bash
# After Phase 1, within Foundational:
Task: "T004 Add getItemListReadOnly helper to src/pages/BudgetTracker/BTGLDetailsPage.tsx"
Task: "T006 Forward readyOnly={isReadOnly} to BTItemsTable in src/pages/BudgetTracker/components/BTGLDetailsPanel.tsx"

# Verification, in parallel across files:
Task: "T012 Assert BTItemsTable readyOnly in src/__tests__/pages/BudgetTracker/components/BTGLDetailsPanel.test.tsx"
Task: "T007 getItemListReadOnly truth-table test in src/__tests__/pages/BudgetTracker/BTGLDetailsPage.helper.test.ts"
```

---

## Implementation Strategy

### MVP

The feature is one indivisible change (Phase 1 + Phase 2). After Phase 2, run the
US1/US2/US3 verification and the Polish gate. There is no partial ship - the
`getItemListReadOnly` value serves all three user stories at once.

### Incremental Delivery

1. Phase 1 + Phase 2 (helper + wiring + prop forward + unit test).
2. Verify US1 (admin), US2 (exception + year limit), US3 (non-exempt closed gap).
3. Polish: full `yarn test` / `tsc`, unlocked-year + failure-mode checks, `/code-review`.

---

## Notes

- Depends on feature 020 (provides the `canAccessModule` call + `isCheckingExempt`).
- `getOptionsPanel()` (feature-020 New Item / Bulk Create bypass) is deliberately left unchanged - no year limit added there.
- Intended behaviour change: non-exempt users (and exception users outside the budget year) can no longer edit NEW / own items on a locked year via the row popup. Flag this in review and the PR.
- `nvm use 20` before every command. Commit after each task or logical group.
