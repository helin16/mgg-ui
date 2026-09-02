---
description: "Task list for Budget Tracker Exception Users & Lockdown Bypass"
---

# Tasks: Budget Tracker Exception Users & Lockdown Bypass

**Input**: Design documents from `/specs/020-bt-lockdown-exception-users/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, quickstart.md

**Tests**: The changed logic is a shared roster panel plus a UI visibility gate. The gate
decision is extracted into a pure exported helper and unit-tested (mirrors the existing
`canShowDeleteForSelectedItems` pattern in `BTGLDetailsPanel.tsx`). The cross-system
locked-year flow gets a Cypress spec or a documented manual verification.

**Organization**: Grouped by the two user stories from spec.md (both Priority P1). Frontend
only; no `mggs-api` change.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 = Manage the Exception Users list; US2 = Exempt users bypass the lockdown
- All paths are relative to repo root `/Users/helin/git/MentoneGirls/mgg-ui/`

## Path Conventions

Single existing frontend project: source under `src/`, tests under `src/__tests__/`,
Cypress under `cypress/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the change surface before editing.

- [X] T001 Confirm the affected surfaces per plan.md: `src/pages/BudgetTracker/components/admin/BTUserAdminPanel.tsx` (US1) and `src/pages/BudgetTracker/BTGLDetailsPage.tsx` (US2), both already inside the Budget Tracker `ModuleAccessWrapper`; no new route, `moduleId`, or SchoolBox entry point.
- [X] T002 Confirm no service/type changes are needed: `UserService.getUsers/createUser/deleteUser`, `AuthService.canAccessModule`, `BTLockDownService.getAll`, `ROLE_ID_NORMAL`/`ROLE_ID_ADMIN` in `src/types/modules/iRole.ts`, and `MGGS_MODULE_ID_BUDGET_TRACKER` in `src/types/modules/iModuleUser.ts` all already exist and are used elsewhere.
- [X] T003 [P] Confirm environment: run all commands on `mgg-ui` `package.json` `engines.node` (>=20) via `nvm use 20`; no new env var, storage, upload, embed, token, or `dangerouslySetInnerHTML` is introduced (constitution school-data safety).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Nothing blocks both stories - they touch disjoint files and share only
already-existing services/types. This phase only records that fact.

- [X] T004 Verify US1 and US2 are independent: `BTUserAdminPanel.tsx` and `BTGLDetailsPage.tsx` do not import each other; the reused `ModuleUserList` and `AuthService.canAccessModule` are already shipped and unit-covered elsewhere. No foundational code task required.

**Checkpoint**: Both user stories can proceed in parallel.

---

## Phase 3: User Story 1 - Manage the Exception Users list (Priority: P1) 🎯 MVP

**Goal**: The BT Admin › Users screen shows an **Exception Users** list (Budget Tracker
members with the Normal role) below **Admin Users**, with add / remove using the shared
roster component.

**Independent Test**: Open Budget Tracker → Admin → Users; confirm the Exception Users
section renders; add a staff member, reload, confirm it persisted; remove them; confirm the
Admin Users list is untouched throughout. (spec SC-001)

### Implementation for User Story 1

- [X] T005 [US1] In `src/pages/BudgetTracker/components/admin/BTUserAdminPanel.tsx`: import `ROLE_ID_NORMAL` from `../../../../types/modules/iRole`, and below the existing Admin Users `panel-wrapper` add a second `panel-wrapper` block with an `<h6>Exception Users:</h6>` heading, an `<ExplanationPanel text={'Exception users can add budget items even when the budget year is locked down'} />`, and `<ModuleUserList moduleId={MGGS_MODULE_ID_BUDGET_TRACKER} roleId={ROLE_ID_NORMAL} showCreatingPanel showDeletingBtn />` (same pattern as `src/pages/studentAbsences/StudentAbsenceAdminPage.tsx`).

### Verification for User Story 1 ⚠️

- [X] T006 [P] [US1] Update `src/__tests__/pages/BudgetTracker/components/admin/BTUserAdminPanel.test.tsx`: render `BTUserAdminPanel` with the existing `ModuleUserList` manual mock (`src/components/module/__mocks__/ModuleUserList.tsx`) mocked via `jest.mock('../../../../../components/module/ModuleUserList')`; assert the "Admin Users:" and "Exception Users:" headings both render and that `ModuleUserList` is rendered twice with `roleId` props `ROLE_ID_ADMIN` and `ROLE_ID_NORMAL` respectively.
- [ ] T007 [US1] Execute the manual validation in `specs/020-bt-lockdown-exception-users/quickstart.md` section A (add / reload / remove; Admin Users list unaffected; cannot add or delete self) and record date + tester + result in the PR description. (SC-001)

**Checkpoint**: Exception Users list is fully functional and independently testable (MVP).

---

## Phase 4: User Story 2 - Exempt users bypass the lockdown for item creation (Priority: P1)

**Goal**: On a GL-account detail screen for a locked budget year, **New Item** and **Bulk
Create Items** stay visible and usable for Budget Tracker Admin members and Exception
(Normal-role) members; everyone else still sees no creation actions.

**Independent Test**: Lock a budget year; open a GL-account detail screen as (a) an Admin
member, (b) an Exception member, (c) a non-member - only (a) and (b) see and can use the two
actions. Unlocked years unchanged for all. (spec SC-002..SC-005)

### Implementation for User Story 2

- [X] T008 [US2] In `src/pages/BudgetTracker/BTGLDetailsPage.tsx`: add an exported pure helper `export const canShowCreateOptions = ({ isDisabled, isExempt }: { isDisabled: boolean; isExempt: boolean }): boolean => !isDisabled || isExempt;` (mirrors `canShowDeleteForSelectedItems` in `BTGLDetailsPanel.tsx`).
- [X] T009 [US2] In `src/pages/BudgetTracker/BTGLDetailsPage.tsx`: add `const [isExempt, setIsExempt] = useState(false)` and `const [isCheckingExempt, setIsCheckingExempt] = useState(true)`. In the existing lockdown `useEffect` (keyed on `gl.GLCode`, `showingYear`), also call `AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)`; set `isExempt` to `resp[ROLE_ID_ADMIN]?.canAccess === true || resp[ROLE_ID_NORMAL]?.canAccess === true`; on error set `isExempt` to `false` and call `Toaster.showApiError(err)`; clear `isCheckingExempt` in `finally`. Guard the `isCanceled` flag as the existing code does. Import `AuthService` from `../../services/AuthService` and `ROLE_ID_ADMIN`, `ROLE_ID_NORMAL` from `../../types/modules/iRole` and `MGGS_MODULE_ID_BUDGET_TRACKER` from `../../types/modules/iModuleUser`.
- [X] T010 [US2] In `src/pages/BudgetTracker/BTGLDetailsPage.tsx` `getOptionsPanel()`: replace `if (isDisabled) { return null; }` with: while `isLoading || isCheckingExempt` return `null` (no flash); then `if (!canShowCreateOptions({ isDisabled, isExempt })) { return null; }`. Leave `isReadOnly={isDisabled}` passed to `BTGLDetailsPanel` unchanged (locked-year item list stays read-only for everyone per FR-008).

### Verification for User Story 2 ⚠️

- [X] T011 [P] [US2] Add a unit test for `canShowCreateOptions` covering the four states from `data-model.md` (unlocked → true; locked+exempt → true; locked+not-exempt → false; unlocked+not-exempt → true) - either a new `src/__tests__/pages/BudgetTracker/BTGLDetailsPage.helper.test.ts` or a `describe` block added to the existing page test file.
- [X] T012 [US2] Update `src/__tests__/pages/BudgetTracker/BTGLDetailsPage.test.tsx`: add an inline `jest.mock('../../../services/AuthService', () => ({ __esModule: true, default: { canAccessModule: jest.fn().mockResolvedValue({}) } }))` (factory style, matching `BTItemEditPanel.test.tsx`) so the new call is stubbed; confirm the existing "renders options with new item and bulk create item buttons" assertion still passes (initial `isDisabled=false`).
- [ ] T013 [US2] Add a Cypress spec under `cypress/e2e/` for the locked-year matrix, OR perform and document the manual validation in `specs/020-bt-lockdown-exception-users/quickstart.md` section B across Admin / Exception / neither, plus the unlocked-year regression (SC-004) and the `canAccess` failure case (SC-005). Record the result in the PR description.

**Checkpoint**: Both user stories independently functional; locked-year behaviour unchanged
for non-exempt users and for all unlocked years.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T014 [P] (Optional) In `src/components/module/ModuleUserList.tsx`: add an optional, defaulted prop (e.g. `removeSubjectLabel?: string` defaulting to `'admin rights'`) used in the delete-confirm description text, and pass `removeSubjectLabel={'exception access'}` from the Exception Users `ModuleUserList` in `BTUserAdminPanel.tsx`. Must not change behaviour for the 4+ existing call sites. Skip if the team accepts the current generic wording.
- [X] T015 Run `nvm use 20 && yarn test` (full suite) and `nvm use 20 && npx tsc -p tsconfig.json --noEmit`; fix any regressions in the touched areas.
- [ ] T016 Run the full `specs/020-bt-lockdown-exception-users/quickstart.md` validation once end to end and paste the filled-in result table into the PR.
- [ ] T017 Run `/code-review` over the diff and resolve or explicitly defer blocking findings (constitution v1.2.0).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup; contains no code work (T004 is a check).
- **User Story 1 (Phase 3)** and **User Story 2 (Phase 4)**: both depend only on Phase 1-2; they touch disjoint files and can run fully in parallel.
- **Polish (Phase 5)**: after both stories; T014 depends on T005, T015-T017 depend on T005-T013.

### User Story Dependencies

- **US1 (P1)**: independent. Delivers the manageable Exception Users roster (MVP).
- **US2 (P1)**: independent code path. Its *exception-member* test case needs an Exception User to exist (US1 or a manual `uMGGSUsers` row), but the *admin-member* case is testable with US1 not yet done.

### Within Each User Story

- US1: T005 → T006 (test) / T007 (manual).
- US2: T008 (helper) → T009 (state) → T010 (gate); then T011 (helper unit test, parallel-safe once T008 lands), T012 (page test), T013 (cross-system).

### Parallel Opportunities

- T003 with T001/T002.
- Entire US1 (T005-T007) in parallel with entire US2 (T008-T013) - different files.
- T006 ∥ T011 once their targets exist.
- T014 is independent of T015-T017 except for the shared file.

---

## Parallel Example

```bash
# After Phase 1-2, two developers (or two passes) in parallel:
# Track A - User Story 1:
Task: "T005 Add Exception Users list to src/pages/BudgetTracker/components/admin/BTUserAdminPanel.tsx"
Task: "T006 Update src/__tests__/pages/BudgetTracker/components/admin/BTUserAdminPanel.test.tsx"

# Track B - User Story 2:
Task: "T008 Add canShowCreateOptions helper to src/pages/BudgetTracker/BTGLDetailsPage.tsx"
Task: "T009 Add isExempt state + AuthService.canAccessModule call in src/pages/BudgetTracker/BTGLDetailsPage.tsx"
Task: "T010 Widen getOptionsPanel gate in src/pages/BudgetTracker/BTGLDetailsPage.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 → Phase 2 → Phase 3 (T005-T007).
2. **STOP and VALIDATE**: Exception Users list adds/removes and persists; Admin Users list unaffected.
3. Ship. The roster is useful on its own even before the bypass lands.

### Incremental Delivery

1. Setup + Foundational.
2. US1 → validate → ship (MVP).
3. US2 → validate the locked-year matrix → ship.
4. Optional Polish (T014) and the mandatory `yarn test` / `tsc` / quickstart / `/code-review` gate (T015-T017).

---

## Notes

- [P] = different files, no dependency on an incomplete task.
- Lockdown is browser-enforced only; there is deliberately no `mggs-api` change (research.md Decision 3).
- Do not touch `isReadOnly={isDisabled}` on `BTGLDetailsPanel` - add-only on locked years is intentional (spec FR-008 + Clarifications 2026-09-02).
- Commit after each task or logical group; run commands under `nvm use 20`.
