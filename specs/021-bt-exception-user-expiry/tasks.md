---
description: "Task list for Budget Tracker Exception User Expiry"
---

# Tasks: Budget Tracker Exception User Expiry

**Input**: Design documents from `/specs/021-bt-exception-user-expiry/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-contract.md, contracts/worker-contract.md, quickstart.md

**Tests**: The expiry-boundary decision and the "which rows are expired" filter are stable
pure logic - unit-tested on both sides. The add-control validation is a shared-helper-class
change - unit-tested. The overnight deactivate-then-lose-access path is cross-system -
documented manual / triggered-run verification.

**Organization**: Grouped by the two user stories from spec.md (both Priority P1). Spans two
repos: `mgg-ui` (Node >=20, `nvm use 20`) and `mggs-api` (Node >=18, `nvm use 18`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on an incomplete task)
- **[Story]**: US1 = Set an expiry date on an Exception User; US2 = Nightly automatic deactivation
- Paths are relative to each repo root: `/Users/helin/git/MentoneGirls/mgg-ui/` or `/Users/helin/git/MentoneGirls/mggs-api/`

## Path Conventions

`mgg-ui`: source under `src/`, tests under `src/__tests__/`.
`mggs-api`: source under `src/`, worker entry `src/worker.ts`, workers under `src/workers/`.

---

## Phase 1: Setup

- [X] T001 Confirm feature **020-bt-lockdown-exception-users** is implemented: `mgg-ui/src/pages/BudgetTracker/components/admin/BTUserAdminPanel.tsx` renders an Exception Users list for Budget Tracker Normal-role members (`MGGS_MODULE_ID_BUDGET_TRACKER` = 6, `ROLE_ID_NORMAL` = 1). If not, implement 020 first - 021 replaces that list's rendering.
- [X] T002 Confirm the touch points per plan.md: `mgg-ui` - `UserService.ts`, `iModuleUser.ts`, `BTUserAdminPanel.tsx`, new `BTExceptionUserList.tsx`; `mggs-api` - `Message.ts`, `worker.ts`, `CronJobsQueue.ts`, `UserController.ts`, new `workers/BTExceptionUserExpiryWorker.ts`. No DB migration (expiry rides in the existing `uMGGSUsers.settings` JSON).
- [X] T003 [P] Confirm environment: `mgg-ui` commands on `nvm use 20`, `mggs-api` commands on `nvm use 18` (machine default Node breaks the api toolchain). No new env var, storage, upload, embed, token, or `dangerouslySetInnerHTML`.

---

## Phase 2: Foundational

- [X] T004 Verify US1 and US2 are independent: US1 changes are in `mgg-ui` plus `mggs-api/src/controllers/UserController.ts`; US2 changes are elsewhere in `mggs-api` (`Message.ts`, `worker.ts`, `CronJobsQueue.ts`, `workers/`). No shared file, so the two stories can proceed in parallel after Phase 1. No foundational code task.

**Checkpoint**: Both user stories can start.

---

## Phase 3: User Story 1 - Set an expiry date on an Exception User (Priority: P1) 🎯 MVP

**Goal**: On BT Admin → Users, every Exception User carries an expiry date: it is required
to complete an add, editable afterwards, never clearable, and shown in the list.

**Independent Test**: Open BT Admin → Users → Exception Users; confirm add is blocked
without a date; add with a future date, reload, date persists; edit to another date; confirm
no "clear" control; a pre-feature member shows "no expiry".

### Implementation for User Story 1

- [X] T005 [US1] In `mggs-api/src/controllers/UserController.ts` POST handler (`/:moduleId/:roleId/:SynergeticID`): persist the request body's settings by adding `settings: req.body?.settings` to the `SynMggsUser.create({...})` call. `validateMggUserRequest` (admin-only, not-self) already guards this route; do not change it. Leave PUT/DELETE untouched.
- [X] T006 [US1] In `mgg-ui/src/services/UserService.ts`: ensure `createUser(moduleId, roleId, synergeticId, params = {})` forwards `params` (e.g. `{ settings: { expiryDate } }`) as the POST body to `AppService.post(\`${endPoint}/${moduleId}/${roleId}/${synergeticId}\`, params)`. Adjust the signature/JSDoc only if needed; keep it backward compatible (existing 3-arg callers unaffected).
- [X] T007 [P] [US1] In `mgg-ui/src/types/modules/iModuleUser.ts`: add `expiryDate?: string;` to the `settings` object type (alongside the existing optional keys).
- [X] T008 [US1] Create `mgg-ui/src/pages/BudgetTracker/components/admin/BTExceptionUserList.tsx`: a self-contained panel that
  - loads active Exception Users via `UserService.getUsers({ where: JSON.stringify({ Active: 1, ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER, RoleID: ROLE_ID_NORMAL }), include: 'SynCommunity' })`;
  - renders a shared `Table` with columns ID, Name, Email, **Expiry** (formatted `settings.expiryDate`, or a distinct "No expiry - set a date" for legacy rows);
  - **Add**: a dialog with `StaffSelector` + a required date field (`DateTimePicker` date mode); submit disabled until a person and a valid date are chosen; on submit `UserService.createUser(MGGS_MODULE_ID_BUDGET_TRACKER, ROLE_ID_NORMAL, personId, { settings: { expiryDate } })` where `expiryDate` is a bare `YYYY-MM-DD` calendar-date string - normalise the picker value with `moment(value).format('YYYY-MM-DD')` so no time/zone component is stored; success `Toaster`, error `Toaster.showApiError`; a past date is allowed (optional non-blocking warning);
  - **Edit expiry**: inline date control per row → `UserService.updateUser(MGGS_MODULE_ID_BUDGET_TRACKER, ROLE_ID_NORMAL, personId, { settings: { ...row.settings, expiryDate: moment(value).format('YYYY-MM-DD') } })`; no control that blanks the date;
  - **Remove**: `DeleteConfirmPopupBtn` → `UserService.deleteUser(MGGS_MODULE_ID_BUDGET_TRACKER, ROLE_ID_NORMAL, personId)`;
  - loading spinner, empty table, `Toaster.showApiError` on load failure; refresh after each mutation; cannot add self (surface the server 400).
- [X] T009 [US1] In `mgg-ui/src/pages/BudgetTracker/components/admin/BTUserAdminPanel.tsx`: replace feature 020's `<ModuleUserList moduleId={MGGS_MODULE_ID_BUDGET_TRACKER} roleId={ROLE_ID_NORMAL} showCreatingPanel showDeletingBtn />` (the Exception Users section only) with `<BTExceptionUserList />`. Keep the Admin Users `ModuleUserList` and the "Exception Users:" heading + `ExplanationPanel`.

### Verification for User Story 1 ⚠️

- [X] T010 [P] [US1] Create `mgg-ui/src/__tests__/pages/BudgetTracker/components/admin/BTExceptionUserList.test.tsx`: mock `UserService` (factory style, per `BTItemEditPanel.test.tsx`); assert (a) the add submit is disabled / blocked with no date and enabled with a valid date, (b) a row with `settings.expiryDate` renders the formatted date, (c) a row without it renders the "no expiry" affordance and its editor requires a date to save, (d) no "clear date" control exists, (e) on a valid add, `UserService.createUser` is called with a 4th argument `{ settings: { expiryDate: <the chosen YYYY-MM-DD> } }`.
- [ ] T011 [US1] Execute quickstart.md **section A** (required-date add, reload persistence, edit to another date, no-clear, legacy row, Admin row untouched). Record date + tester + result in the PR description. (SC-001, SC-001a)

**Checkpoint**: Expiry dates can be captured and maintained. Shippable increment (data capture) even before the nightly job exists.

---

## Phase 4: User Story 2 - Nightly automatic deactivation of expired Exception Users (Priority: P1)

**Goal**: Every night, active Exception Users whose expiry date has passed are deactivated
(lose the feature-020 locked-year bypass) with no administrator action; silent (log only).

**Independent Test**: Set an Exception User's `settings.expiryDate` to yesterday, trigger
the worker, confirm that row's `Active` is `false`, the person is gone from the Exception
Users list and no longer sees New Item / Bulk Create Items on a locked year; a future-dated
and a no-date Exception User are untouched; a re-run changes nothing.

### Implementation for User Story 2

- [X] T012 [US2] In `mggs-api/src/models/Settings/Message.ts`: add `export const MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY = 'BT_EXCEPTION_USER_EXPIRY';` alongside the other `MESSAGE_TYPE_*` constants.
- [X] T013 [US2] Create `mggs-api/src/workers/BTExceptionUserExpiryWorker.ts` (shape mirrors `src/workers/ExpiringSkillsWorker.ts`):
  - export `isExpired(expiryDate: string | Date | null | undefined, now = moment(), timeZone = AppHelper.getDefaultTimeZone()): boolean` - `false` for null/empty/unparseable; normalise any time component first (`moment(expiryDate).format('YYYY-MM-DD')`); else `moment.tz(normalised, 'YYYY-MM-DD', timeZone).endOf('day').isBefore(now)`;
  - `process()`: `SynMggsUser.findAll({ where: { Active: true, ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER, RoleID: MGGS_ROLE_ID_NORMAL } })`; filter by `isExpired(row.settings?.expiryDate)`; for each, in its own `try/catch`, `await SynMggsUser.update({ Active: false, UpdatedById: AuthHelper.getDefaultSystemUserId() }, { where: { ID: row.ID } })` and `Logger.log` the deactivation; log + continue on per-row error; `Logger.log` an `evaluated/deactivated/failed` summary;
  - `run()` wraps `process()` with start/finish logging and a top-level `catch` that logs and swallows;
  - `if (require.main === module) { BTExceptionUserExpiryWorker.run(); }`;
  - `export default BTExceptionUserExpiryWorker; // { run, isExpired }`.
- [X] T014 [US2] In `mggs-api/src/worker.ts` `loadCronJobs()`: add `cron.schedule('40 1 * * *', async () => { await CronJobsQueue.addJobWithoutDuplicate({}, MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY, AuthHelper.getDefaultSystemUserId(), CronJobsQueue); }, defaultCronSettings);` (pick a minute not already used by the 1am jobs) and import `MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY`.
- [X] T015 [US2] In `mggs-api/src/queue/CronJobsQueue.ts`: import `BTExceptionUserExpiryWorker` and `MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY`, and add to the `processJob` map: `[MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY]: (message: MessageModel) => BTExceptionUserExpiryWorker.run(message.request),`.

### Verification for User Story 2 ⚠️

- [X] T016 [P] [US2] Add a unit test for `BTExceptionUserExpiryWorker.isExpired` covering the truth table in `contracts/worker-contract.md` (inclusive date boundary in the school time zone; null / `''` / `'garbage'` → `false`; yesterday → `true`; today → `false`; today after midnight next day → `true`; far future → `false`; an ISO datetime string like `2026-09-02T13:00:00+10:00` resolves to the `2026-09-02` calendar date with no off-by-one). Place it per `mggs-api` test conventions (e.g. `src/workers/__tests__/BTExceptionUserExpiryWorker.test.ts` or sibling `*.test.ts`). Run on `nvm use 18`.
- [ ] T017 [US2] Execute quickstart.md **section B** (deactivation matrix across future/past/no-date/dual-membership/nothing-expired, re-run idempotency, log contents, no email sent) by triggering the worker (`node src/workers/BTExceptionUserExpiryWorker.ts` on Node 18, or wait for the scheduled slot). Record the per-row result in the PR description. (SC-002, SC-003, SC-005, SC-006)

**Checkpoint**: Expired Exception Users are removed automatically; non-expired and legacy
ones are safe; the job is idempotent and silent.

---

## Phase 5: Polish & Cross-Cutting Concerns

- [X] T018 [P] `mgg-ui`: `nvm use 20 && yarn test` (full) and `nvm use 20 && npx tsc -p tsconfig.json --noEmit`; fix regressions in touched areas.
- [X] T019 [P] `mggs-api`: `nvm use 18 && yarn test` (full) and `nvm use 18 && npx tsc -p tsconfig.json --noEmit`; fix regressions in touched areas.
- [ ] T020 Run `/code-review` over the diff in each repo and resolve or explicitly defer blocking findings (constitution v1.2.0).
- [ ] T021 Run the full `specs/021-bt-exception-user-expiry/quickstart.md` once end to end and paste the filled A + B result tables into the PR description(s).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies.
- **Foundational (Phase 2)**: after Setup; no code (T004 is a check).
- **US1 (Phase 3)** and **US2 (Phase 4)**: both depend only on Phase 1; they touch disjoint files (US1's only `mggs-api` file is `UserController.ts`; US2 does not touch it) and run fully in parallel.
- **Polish (Phase 5)**: after both stories.

### User Story Dependencies

- **US1 (P1)**: independent. Delivers expiry-date capture (MVP).
- **US2 (P1)**: independent code path. Its end-to-end test needs an Exception User with a past `settings.expiryDate`, which US1 (or a manual settings edit) provides; the worker logic itself is testable via `isExpired` unit tests without US1.

### Within Each Story

- US1: T005 ∥ T006 ∥ T007 → T008 → T009; T010 after T008; T011 after T009 + T005.
- US2: T012 → T013 → T015; T014 after T012; T016 after T013; T017 after T013 + T014 + T015 (+ an expired row from US1/manual).

### Parallel Opportunities

- T003 with T001/T002.
- Entire US1 (T005-T011) in parallel with entire US2 (T012-T017) - different repos/files.
- T006 ∥ T007 ∥ T005; T010 ∥ (US2 work); T016 ∥ (US1 work).
- T018 ∥ T019.

---

## Parallel Example

```bash
# After Phase 1-2, two tracks in parallel:

# Track A - User Story 1 (mgg-ui + UserController POST):
Task: "T005 Persist req.body.settings in mggs-api/src/controllers/UserController.ts POST"
Task: "T006 Forward { settings } from mgg-ui/src/services/UserService.ts createUser"
Task: "T007 Add expiryDate? to settings in mgg-ui/src/types/modules/iModuleUser.ts"
Task: "T008 Create mgg-ui/src/pages/BudgetTracker/components/admin/BTExceptionUserList.tsx"

# Track B - User Story 2 (mggs-api nightly job):
Task: "T012 Add MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY in mggs-api/src/models/Settings/Message.ts"
Task: "T013 Create mggs-api/src/workers/BTExceptionUserExpiryWorker.ts"
Task: "T014 Schedule the nightly cron in mggs-api/src/worker.ts"
Task: "T015 Add the dispatch entry in mggs-api/src/queue/CronJobsQueue.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Phase 1 → Phase 2 → Phase 3 (T005-T011).
2. **STOP and VALIDATE**: expiry dates are required, persisted, editable, non-clearable.
3. Ship. Enforcement (US2) follows.

### Incremental Delivery

1. Setup + Foundational.
2. US1 → validate section A → ship (MVP: data capture).
3. US2 → validate section B (triggered run) → ship (enforcement).
4. Polish: `yarn test` / `tsc` on each repo's pinned Node, `/code-review` each diff, full quickstart.

### Parallel Team Strategy

- Dev A: `mgg-ui` + `UserController` POST (US1).
- Dev B: `mggs-api` worker/cron/dispatch (US2).
- Integrate on the shared quickstart section B run.

---

## Notes

- No DB migration - expiry is a key in the existing `uMGGSUsers.settings` JSON.
- `mgg-ui` on `nvm use 20`; `mggs-api` on `nvm use 18` - always switch first.
- The nightly job only ever sets `Active=false` on `ModuleID=6 RoleID=1` rows; it never deletes, never edits `settings`, never emails, never reactivates.
- Do not bend shared `ModuleUserList` for the required date field - the dedicated `BTExceptionUserList` owns the add flow (research.md Decision 3).
- Commit after each task or logical group.
