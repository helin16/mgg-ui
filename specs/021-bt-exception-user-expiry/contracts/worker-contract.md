# Contract: Exception User Expiry - nightly job (`mggs-api`)

**Feature**: 021-bt-exception-user-expiry

A scheduled, unattended job. No HTTP surface. Same wiring shape as
`ExpiringSkillsWorker` / `ExpiringCreditCards` / `TermRolling`.

## Wiring

| Piece | File | Change |
|---|---|---|
| Message type | `src/models/Settings/Message.ts` | add `export const MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY = 'BT_EXCEPTION_USER_EXPIRY';` |
| Schedule | `src/worker.ts` `loadCronJobs()` | add `cron.schedule('<mm> 1 * * *', () => CronJobsQueue.addJobWithoutDuplicate({}, MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY, AuthHelper.getDefaultSystemUserId(), CronJobsQueue), defaultCronSettings)` at a minute not already used by the 1am jobs |
| Dispatch | `src/queue/CronJobsQueue.ts` `processJob` map | add `[MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY]: (message) => BTExceptionUserExpiryWorker.run(message.request)` + import |
| Worker | `src/workers/BTExceptionUserExpiryWorker.ts` | NEW (below) |
| Create endpoint | `src/controllers/UserController.ts` POST handler | persist `req.body.settings` into `SynMggsUser.create({ ..., settings: req.body?.settings })` (only new field; `validateMggUserRequest` already gates admin + not-self) |

## Worker: `BTExceptionUserExpiryWorker`

Exports `{ run, isExpired }` (and `if (require.main === module) run()`), matching
`ExpiringSkillsWorker`.

### `isExpired(expiryDate, now?, timeZone?)` - pure, unit-tested

- Input: `expiryDate` (`string | Date | null | undefined`), `now` (default
  `moment()`), `timeZone` (default `AppHelper.getDefaultTimeZone()`).
- `null` / `''` / unparseable ⇒ returns `false`. A value carrying a time
  component is first reduced to its calendar date
  (`moment(expiryDate).format('YYYY-MM-DD')`).
- Otherwise `true` iff `moment.tz(<calendar-date>, 'YYYY-MM-DD', timeZone).endOf('day').isBefore(now)`.

| `expiryDate` | `now` | result |
|---|---|---|
| `null` / `''` / `'garbage'` | any | `false` |
| `2026-09-01` | `2026-09-02T06:00 local` | `true` |
| `2026-09-02` | `2026-09-02T06:00 local` | `false` (date is inclusive) |
| `2026-09-02` | `2026-09-03T00:05 local` | `true` |
| `2026-12-31` | `2026-09-02` | `false` |
| `2026-09-02T13:00:00+10:00` | `2026-09-02T06:00 local` | `false` (reduced to `2026-09-02`, no off-by-one) |

### `run()` / `process()` behaviour

1. Log start.
2. `rows = SynMggsUser.findAll({ where: { Active: true, ModuleID: MGGS_MODULE_ID_BUDGET_TRACKER, RoleID: MGGS_ROLE_ID_NORMAL } })`.
3. `expired = rows.filter(r => isExpired(r.settings?.expiryDate))`.
4. For each `r` in `expired`, in its own `try/catch`:
   `await SynMggsUser.update({ Active: false, UpdatedById: AuthHelper.getDefaultSystemUserId() }, { where: { ID: r.ID } })`;
   log `deactivated SynergeticID=<id> (expiryDate=<d>)`. On error, log
   `WARN: deactivation failed for ID=<id>: <msg>` and continue.
5. Log finish with `evaluated=<n> deactivated=<k> failed=<f>`.
6. `run()` wraps `process()` and its top-level `catch` logs and swallows (job
   marked done; never crashes the worker process).

### Invariants

- Only rows with `ModuleID = 6 AND RoleID = 1 AND Active = true` are ever
  touched. Admin rows (`RoleID = 2`) and other modules are out of the query.
- The only columns written are `Active` (→ `false`) and `UpdatedById`. No delete,
  no `settings` change, no email, no other side effect.
- Rows with no / blank / malformed `expiryDate` are left active (logged at info).
- Idempotent: a second run in the same night deactivates nothing new.
- One row failing does not abort the run or affect other rows.
- A run with `expired.length === 0` completes successfully, changing nothing.
- Runs as the system user; there is no interactive caller and no per-user auth
  check (it is not reachable via HTTP).
