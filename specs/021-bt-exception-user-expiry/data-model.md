# Data Model: Budget Tracker Exception User Expiry

**Feature**: 021-bt-exception-user-expiry
**Date**: 2026-09-02

No schema change. One new key inside an existing JSON column, plus a new job.

## Entities

### Exception User membership (`uMGGSUsers` row) - extended

Existing table (feature 020 uses `ModuleID = 6`, `RoleID = 1`). Frontend type
`iModuleUser`. This feature uses one key in the existing `settings` object.

| Field | Meaning here |
|---|---|
| `ID` | Row identity (only unique key on the table). |
| `SynergeticID` | The staff person. |
| `ModuleID` | `6` = `MGGS_MODULE_ID_BUDGET_TRACKER`. |
| `RoleID` | `1` = `MGGS_ROLE_ID_NORMAL` (Exception User). |
| `Active` | `true` while access is live. The nightly job flips this to `false`. |
| `settings` | JSON object. **New key:** `expiryDate`. |
| `settings.expiryDate` | `string` `YYYY-MM-DD`, a single calendar date. The last day of Exception access, interpreted in the school time zone. Absent only on rows created before this feature (`= "no expiry"`). Never stored as empty string once set. |
| `UpdatedById` | Set to the acting admin on edit, or the system user id on nightly deactivation. |

**Validation rules**

- Add / re-add (FR-002a): `expiryDate` MUST be present and a valid calendar date
  before the create request is sent. A past date is allowed (FR-005) - the UI
  MAY warn but MUST NOT block or discard it.
- Edit (FR-002): `expiryDate` MAY be changed to another valid date; there MUST be
  no control that clears it back to absent/empty.
- Legacy rows (FR-001): a row with no `settings.expiryDate` is shown as
  "no expiry"; the admin's next save on that row MUST set a date.
- Setting `expiryDate` MUST NOT touch the same person's `RoleID = 2` (Admin) row
  or any other module membership (FR-004).

### Expiry check run (nightly job) - new

An unattended job (no entity/table of its own; state is the memberships it
updates plus its log lines).

| Aspect | Value |
|---|---|
| Trigger | `node-cron` nightly schedule in `mggs-api/src/worker.ts`, enqueued as `MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY` via `CronJobsQueue`. |
| Input | All `uMGGSUsers` rows where `Active = true AND ModuleID = 6 AND RoleID = 1`. |
| Per-row decision | `expired = endOfDay(settings.expiryDate, schoolTimeZone) < now`. Missing / blank / unparseable `expiryDate` ⇒ not expired. |
| Effect on an expired row | `update({ Active: false, UpdatedById: <system user id> })`. |
| Output | Log: run start/finish, count evaluated, each deactivated staff ID, each per-row failure. No email, no other side effect. |
| Idempotency | A re-run finds no still-active expired rows ⇒ no further change. |
| Failure handling | Per-row `try/catch`; one failure is logged and the loop continues; the run still completes "successfully". |

## State transitions

### `settings.expiryDate` (per Exception User)

```
(absent, legacy row) --admin edits & saves--> <date set>        [required on save]
<date set>            --admin changes date -->  <different date>  [no path back to absent]
```

### Exception User membership `Active`

```
Active  --nightly job, endOfDay(expiryDate) < now-->  Inactive
Active  --admin removes (feature 020)------------->    Inactive
Inactive --admin re-adds via add control (FR-011, new expiry required)--> Active
         (POST creates a NEW active row with the new expiryDate; the old
          inactive row is left untouched as history. POST never flips Active
          on the old row - its WHERE clause matches Active:true only.)
```

The nightly job performs **only** the first transition. It never sets `Active`
back to `true`. Re-add is a fresh row, not a reactivation.

## Relationships / scope guards

- The job's `WHERE` pins `ModuleID = 6` and `RoleID = 1`, so Admin memberships
  (`RoleID = 2`) and every other module are structurally out of range (FR-009).
- A person on both the Admin and Exception lists has two rows; only the
  `RoleID = 1` row carries `expiryDate` and only it can be deactivated by the job
  (FR-004, FR-009, spec US2 scenario 5).
