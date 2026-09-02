# Research: Budget Tracker Exception User Expiry

**Feature**: 021-bt-exception-user-expiry
**Date**: 2026-09-02

All spec `NEEDS CLARIFICATION` markers were resolved in `/speckit-clarify`
(Session 2026-09-02): the nightly job is silent (log only), and an expiry date is
required when adding/re-adding an Exception User. Remaining unknowns were code
patterns, resolved below by reading `mgg-ui` and `mggs-api`.

## Decision 1 - Where the expiry date is stored

**Decision**: In the existing `uMGGSUsers.settings` JSON column, on the Budget
Tracker **Normal-role** membership row, under a key `expiryDate` holding a single
calendar date string (`YYYY-MM-DD`).

**Rationale**:

- `SynMggsUser` (`mggs-api/src/models/Modules/SynMggsUser.ts`) already defines
  `settings` as `TEXT` with a getter that `JSON.parse`s and a setter that
  `JSON.stringify`s, and `iModuleUser` (`mgg-ui/src/types/modules/iModuleUser.ts`)
  already types `settings` as an open object. No schema change, no migration.
- `StudentAbsenceAdminPage.setEmailNotificationForAUser` is a working precedent:
  it persists a per-user setting with
  `UserService.updateUser(moduleId, roleId, synergeticId, { settings: { ...user.settings, key: value } })`.
- Storing a bare date (no time) matches "a single calendar date" and keeps
  time-zone interpretation on the API side.

**Alternatives considered**:

- *New column / table for expiry* - rejected: needs a migration for one nullable
  date; the settings blob already exists for exactly this kind of per-membership
  attribute.
- *Module-level settings* (`ModuleHelper.getModuleSettings`) - rejected: that is
  one config object for the whole module, not per user.

## Decision 2 - Saving the expiry date atomically when adding an Exception User

**Decision**: Extend the membership **create** path to accept `settings`:
`UserService.createUser(moduleId, roleId, synergeticId, { settings })` forwards
`settings` in the POST body, and `mggs-api` `UserController` POST persists
`req.body.settings` on `SynMggsUser.create(...)`.

**Rationale**:

- Today `UserController` POST **ignores the request body entirely** - it only
  creates `{ ModuleID, RoleID, SynergeticID, Active, CreatedById, UpdatedById }`.
  So "required expiry date at add time" cannot be met without either (a) a
  create-then-update pair on the client, or (b) letting POST persist `settings`.
- (b) is ~2 lines, keeps "add" atomic (no window where a member exists with no
  date), and `validateMggUserRequest` already gates POST to admins. (a) would
  leave a no-date member if the second call fails - contradicts FR-002a intent.
- `UserController` PUT already spreads `req.body` into `existingUser.update(...)`,
  so the **edit** path (change the date later) needs no API change; the client
  sends the full merged `settings` object, as `StudentAbsenceAdminPage` does.

**Alternatives considered**:

- *Client create-then-update* - rejected as above (non-atomic, violates the
  "always has a date" intent on partial failure).
- *Bend `ModuleUserList` to collect extra create fields* - rejected: it is a
  shared component with 5+ callers; adding a required-extra-field mechanism for
  one caller is the wrong altitude (see Decision 3).

## Decision 3 - UI: dedicated `BTExceptionUserList` vs. extending `ModuleUserList`

**Decision**: For the Exception Users list only, replace feature 020's generic
`<ModuleUserList roleId={ROLE_ID_NORMAL} showCreatingPanel showDeletingBtn />`
with a small dedicated `BTExceptionUserList` component in
`mgg-ui/src/pages/BudgetTracker/components/admin/`. It reuses the shared `Table`,
`StaffSelector`, `DateTimePicker`, `DeleteConfirmPopupBtn`, `Toaster`, and
`UserService`.

**Rationale**:

- `ModuleUserList`'s creating panel is fixed: `StaffSelector` → `onCreate` →
  `createUser(moduleId, roleId, value)`. It has an `extraColumns` prop (good for
  the expiry **column**) but **no** hook for a required extra field in the
  **add** dialog.
- The clarified requirement (expiry required to complete the add, and no-clear
  afterwards) is specific to this one caller. Per the constitution ("reuse shared
  UI before adding new abstractions" but also don't invent one-off flexibility),
  a ~120-line dedicated component is lower risk than a new shared-component
  extension point exercised by a single consumer.
- The dedicated component still leans on shared primitives, so it is not a
  from-scratch table.

**Alternatives considered**:

- *`ModuleUserList` + `extraColumns` for the date, add stays date-less* -
  rejected: fails FR-002a (add control must require the date).
- *New generic `createFields`/`onResolveCreateSettings` props on
  `ModuleUserList`* - rejected: speculative flexibility for one use; harder to
  review; risk to 5+ existing callers.

## Decision 4 - API: nightly job wiring

**Decision**: Follow the existing cron pattern exactly (same shape as
`ExpiringSkillsWorker`, `ExpiringCreditCards`, `TermRolling`):

1. `mggs-api/src/models/Settings/Message.ts`: add
   `MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY`.
2. `mggs-api/src/worker.ts` `loadCronJobs()`: add a nightly
   `cron.schedule('<mm> <hh> * * *', ...)` (a low-traffic slot near the other
   1am jobs, distinct minute) that calls
   `CronJobsQueue.addJobWithoutDuplicate({}, MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY, AuthHelper.getDefaultSystemUserId(), CronJobsQueue)`.
3. `mggs-api/src/queue/CronJobsQueue.ts` dispatch map: add
   `[MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY]: (message) => BTExceptionUserExpiryWorker.run(message.request)`.
4. `mggs-api/src/workers/BTExceptionUserExpiryWorker.ts`: `run()` wrapping
   `process()` with `Logger` start/finish and a `catch` that logs, plus
   `if (require.main === module) { BTExceptionUserExpiryWorker.run(); }` for
   manual runs. Export a pure `isExpired(expiryDate, now, timeZone)` (and/or
   `selectExpired(rows, now)`) for unit testing, mirroring
   `ExpiringSkillsWorker.isNotifyDay`.

**`process()` logic**:

- Load active Budget Tracker Normal-role memberships:
  `SynMggsUser.findAll({ where: { Active: true, ModuleID: 6, RoleID: 1 } })`
  (`MGGS_MODULE_ID_BUDGET_TRACKER` = 6, `MGGS_ROLE_ID_NORMAL` = 1).
- For each, read `settings?.expiryDate`. Skip when missing/blank/unparseable
  (log at debug/info, leave active).
- "Expired" = `now` is after the **end of** the expiry date in the school time
  zone: `moment.tz(expiryDate, 'YYYY-MM-DD', AppHelper.getDefaultTimeZone()).endOf('day').isBefore(moment())`.
- For each expired row, `SynMggsUser.update({ Active: false, UpdatedById: <system user id> }, { where: { ID: row.ID } })` inside its own try/catch;
  log each deactivation (staff ID) and each failure; never rethrow so the loop
  continues.
- A run with nothing expired logs "0 deactivated" and completes successfully.

**Rationale**: `SynMggsUser` is not upsert-blocked (the `UserController` DELETE
handler already calls `SynMggsUser.update({ Active: false, ... })`). `RoleID`/
`ModuleID` filtering is the same the frontend and `ModuleHelper` already use.
Idempotent by construction: a second run finds no still-active expired rows.

**Alternatives considered**:

- *Direct DB `UPDATE`* - rejected: the Sequelize model + hooks are the house
  style; raw SQL bypasses `UpdatedById` bookkeeping and audit expectations.
- *Deleting the row* - rejected: spec says deactivate (set `Active=false`),
  retaining history, same state as an admin removal.

## Decision 5 - Time zone

**Decision**: The admin enters a plain calendar date in the browser; it is
stored as `YYYY-MM-DD` with no zone. The **API** interprets it in the school's
configured zone (`AppHelper.getDefaultTimeZone()`), treating the date as
inclusive (access through 23:59:59 of that day).

**Rationale**: Avoids browser-zone drift (spec edge case) and keeps a single
authority (the job) for the boundary decision. `moment-timezone` is already a
dependency in both repos.

## Constitution / environment notes

- `mgg-ui`: `nvm use 20` before `yarn` / `tsc` / Jest.
- `mggs-api`: `nvm use 18` before `yarn` / `tsc` / Jest / running `src/worker.ts`
  (machine default Node breaks the api Jest/Sentry/ts-node toolchain - pinned
  memory).
- `/code-review` pass on each repo's diff (constitution v1.2.0).
- No new env var, storage, upload, embed, token, or `dangerouslySetInnerHTML`.
- Sequencing: implement feature 020 first (it creates `BTExceptionUserList`'s
  host panel and the Normal-role Exception User concept).
