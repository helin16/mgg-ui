# Implementation Plan: Budget Tracker Exception User Expiry

**Branch**: `021-bt-exception-user-expiry` | **Date**: 2026-09-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/021-bt-exception-user-expiry/spec.md`

## Summary

Give every Budget Tracker **Exception User** (a Normal-role module membership from
feature 020) a **required expiry date**, held in that membership's per-user
`settings` JSON, and add a **nightly API job** that deactivates any active
Exception User whose expiry date has passed.

- **UI (`mgg-ui`)**: on the BT Admin → Users screen, the Exception Users list
  gains an expiry-date column (inline edit) and its add flow requires a date.
  Persisted through the existing `UserService` membership endpoints.
- **API (`mggs-api`)**: a new nightly `cron.schedule` entry enqueues a new
  `MESSAGE_TYPE`, dispatched by `CronJobsQueue` to a new worker under
  `src/workers/` that reads active Budget Tracker Normal-role memberships, finds
  those with a past `settings.expiryDate`, and sets `Active = false`. Silent
  (log only) - no email. Also a ~2-line change to the membership create endpoint
  so the expiry date can be saved atomically at add time.

**Depends on**: feature **020-bt-lockdown-exception-users** (the Exception Users
list and the Normal-role membership model it introduces). 021 assumes 020 is
implemented first, or the two are implemented together.

## Technical Context

**Language/Version**: `mgg-ui` - TypeScript 4.x, React 18 (CRA, not ejected), Node >=20. `mggs-api` - TypeScript, Express + Sequelize (MSSQL via tedious), `node-cron`, Bee-Queue, Node >=18.
**Primary Dependencies**: `mgg-ui` - `UserService`, `AuthService` (feature 020), shared `Table`, `StaffSelector`, `DateTimePicker`, `DeleteConfirmPopupBtn`, `Toaster`. `mggs-api` - `worker.ts` cron loader, `CronJobsQueue`, `Message` model + `MESSAGE_TYPE_*`, `SynMggsUser` model, `Logger`, `AuthHelper.getDefaultSystemUserId()`, `AppHelper.getDefaultTimeZone()`.
**Storage**: Existing `uMGGSUsers` table. Expiry date lives in the existing `settings` TEXT/JSON column (`SynMggsUser.settings` getter/setter already `JSON.parse`/`JSON.stringify`). No schema change, no migration.
**Testing**: `mgg-ui` - Jest + RTL (`yarn test`). `mggs-api` - Jest (`yarn test`, run on Node 18). Cross-system overnight flow - documented manual / scheduled-job run.
**Target Platform**: `mgg-ui` browser SPA (also SchoolBox-embedded). `mggs-api` Node worker process (`src/worker.ts`, separate from the API server).
**Project Type**: Two services in two repos, one feature.
**Performance Goals**: N/A - Exception Users are a single-digit set; the nightly job is one indexed query + a handful of row updates.
**Constraints**: `mgg-ui` commands on Node >=20 via `nvm use 20`; `mggs-api` commands on Node >=18 via `nvm use 18` (per constitution / pinned memory - the machine default Node breaks the api toolchain). Expiry evaluated in the school's local time zone (`AppHelper.getDefaultTimeZone()` on the API side). Job must be idempotent and non-aborting on per-row failure.
**Scale/Scope**: ~1 new UI component + 1 panel edit + 1 service tweak; ~1 new worker + 1 cron entry + 1 message-type + 1 dispatch entry + 1 endpoint tweak on the API.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Module surface & access control**: UI change is confined to the Budget
  Tracker module's admin Users screen (already `ModuleAccessWrapper`
  `roleId={ROLE_ID_ADMIN}`). The membership create/update/delete endpoints
  already enforce admin-only + "can't operate on yourself" via
  `validateMggUserRequest`. The nightly job runs unattended as the system user
  (`AuthHelper.getDefaultSystemUserId()`), consistent with every other cron
  worker. No new route or module surface. PASS.
- **Typed service boundaries**: UI goes through `src/services/UserService.ts`
  (`getUsers`/`createUser`/`updateUser`/`deleteUser`) and `src/types/modules/*`.
  `createUser` gains an optional `settings` argument (typed, backward
  compatible). No `axios` in components. API worker uses the `SynMggsUser`
  Sequelize model, not raw SQL. PASS.
- **Explicit async UX states**: the expiry column edit and the add-with-date
  flow surface loading, success (`Toaster` success), validation (missing/invalid
  date blocks submit with a message), and error (`Toaster.showApiError`) states,
  matching the `StudentAbsenceAdminPage` settings-write precedent. No silent
  failure; submit is disabled while saving. PASS.
- **School-data / config safety**: no new env var, browser storage, upload,
  embed, token handling, or `dangerouslySetInnerHTML`. The only new stored datum
  is a date on an existing settings blob. The nightly job writes only
  `Active`/`UpdatedById`. No sensitive data added to logs (log staff IDs, as
  other workers do). PASS.
- **Risk-based verification**: the expiry-boundary decision and the "which rows
  are expired" filter are pure logic - unit-tested on both sides (a UI helper
  and an API `isExpired`/selection function, mirroring `ExpiringSkillsWorker`'s
  exported `isNotifyDay`). The overnight deactivate-then-lose-access flow is a
  cross-system workflow - documented manual/scheduled verification per
  quickstart. `/code-review` on each repo's diff (constitution v1.2.0).
  Commands run on each repo's pinned Node. PASS.

**Result**: No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/021-bt-exception-user-expiry/
├── plan.md              # This file
├── spec.md              # Feature spec (+ Clarifications)
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   ├── ui-contract.md   # Phase 1 - UI behaviour + reused/changed service calls
│   └── worker-contract.md  # Phase 1 - nightly job inputs, outputs, invariants
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit-tasks - not created here)
```

### Source Code

```text
mgg-ui/  (Node >= 20)
└── src/
    ├── pages/BudgetTracker/components/admin/
    │   ├── BTUserAdminPanel.tsx            # CHANGE: render <BTExceptionUserList/> in place of the
    │   │                                   #   generic <ModuleUserList roleId={ROLE_ID_NORMAL}> from feat 020
    │   └── BTExceptionUserList.tsx         # NEW: list + add(with required expiry date) + inline edit date + remove
    ├── services/
    │   └── UserService.ts                  # CHANGE: createUser() forwards optional { settings } to POST body
    ├── types/modules/
    │   └── iModuleUser.ts                  # REUSE: settings already typed as open JSON; optionally add `expiryDate?`
    └── __tests__/pages/BudgetTracker/components/admin/
        └── BTExceptionUserList.test.tsx    # NEW: required-date validation, no-clear rule, expiry display

mggs-api/  (Node >= 18)
└── src/
    ├── models/Settings/Message.ts          # CHANGE: add MESSAGE_TYPE_BT_EXCEPTION_USER_EXPIRY
    ├── worker.ts                            # CHANGE: cron.schedule(...) nightly -> enqueue the new message type
    ├── queue/CronJobsQueue.ts               # CHANGE: dispatch-map entry -> BTExceptionUserExpiryWorker.run
    ├── workers/
    │   └── BTExceptionUserExpiryWorker.ts   # NEW: select expired active BT Normal-role members, deactivate, log
    ├── controllers/UserController.ts        # CHANGE: POST handler persists req.body.settings on create
    └── (worker unit test)                   # NEW: isExpired / selectExpired pure-logic test
```

**Structure Decision**: Two repos, one feature. On the UI side, feature 020 ships
the Exception Users list as a generic `ModuleUserList`; this feature replaces that
one render with a small dedicated `BTExceptionUserList` because the add flow now
needs a **required extra field** (the expiry date), which the shared
`ModuleUserList` creating panel does not support and should not be bent to
support for a single caller. Everything else is reuse: shared `Table`,
`StaffSelector`, `DateTimePicker`, `DeleteConfirmPopupBtn`, `UserService`, and on
the API side the established cron → message-type → `CronJobsQueue` → worker
pattern (identical shape to `ExpiringSkillsWorker`, `ExpiringCreditCards`,
`TermRolling`).

## Complexity Tracking

No constitution violations; no entries required.
