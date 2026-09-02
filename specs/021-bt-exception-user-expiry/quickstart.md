# Quickstart / Validation: Budget Tracker Exception User Expiry

**Feature**: 021-bt-exception-user-expiry

Two repos. UI adds a required expiry date to Exception Users; the API adds a
nightly job that deactivates expired ones. See
[contracts/ui-contract.md](./contracts/ui-contract.md) and
[contracts/worker-contract.md](./contracts/worker-contract.md) for exact
behaviour, [data-model.md](./data-model.md) for the storage shape.

**Prerequisite**: feature 020-bt-lockdown-exception-users is implemented (the
Exception Users list and the Normal-role membership concept).

## Prerequisites

```bash
# mgg-ui
cd /Users/helin/git/MentoneGirls/mgg-ui
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20
yarn install --immutable

# mggs-api  (separate shell / separate nvm switch)
cd /Users/helin/git/MentoneGirls/mggs-api
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 18
yarn install
```

## Automated checks

```bash
# mgg-ui (Node 20)
yarn test -t "BTExceptionUserList"
yarn test                       # full suite before hand-off
npx tsc -p tsconfig.json --noEmit

# mggs-api (Node 18)
yarn test -t "BTExceptionUserExpiry"   # isExpired() table + selection logic
yarn test
npx tsc -p tsconfig.json --noEmit
```

Expected after implementation:

- `BTExceptionUserList` test: add is blocked with no date; a valid date lets the
  add through and the date renders in the row; the edit control offers no
  "clear"; a legacy row (no `settings.expiryDate`) shows "no expiry".
- `BTExceptionUserExpiryWorker` test: `isExpired` matches the table in the worker
  contract (inclusive date boundary, school time zone, null/blank/garbage →
  `false`); `selectExpired` picks only active `ModuleID=6 RoleID=1` rows with a
  past date.

## Manual / scheduled validation - the cross-system flow

Covers SC-002..SC-006. Needs a running `mgg-ui`, the `mggs-api` API, and the
`mggs-api` worker process (`node src/worker.ts` or the deployed worker).

### A. UI - required expiry date (SC-001, SC-001a)

1. BT Admin → Users → Exception Users. Click add. Confirm you cannot complete
   the add without picking a date; pick a staff member + a future date → added,
   date shown in the row.
2. Reload the screen → the date is still there.
3. Edit the row's date to a different future date → saves, no option to blank it.
4. If a pre-feature Exception User exists with no date, confirm it shows
   "no expiry" and that saving its editor requires a date.
5. Confirm setting the date did not change that person's Admin Users row (if
   they have one).

### B. Nightly job - deactivation (SC-002, SC-003, SC-005, SC-006)

| Setup | Run the job | Expect |
|---|---|---|
| Exception User X with `expiryDate` = yesterday | trigger the worker (wait for the nightly slot, or run `node src/workers/BTExceptionUserExpiryWorker.ts` on Node 18) | X's Budget Tracker Normal-role row `Active` → `false`; X disappears from the Exception Users list; X no longer sees New Item / Bulk Create Items on a locked year (feature 020 bypass gone) |
| Exception User Y with `expiryDate` = next month | same run | Y untouched, still listed |
| Exception User Z with no `expiryDate` (legacy) | same run | Z untouched, still listed |
| Person P with **Admin** + **Exception** rows, only the Exception `expiryDate` in the past | same run | only P's Normal-role row deactivated; P keeps Admin access and all other modules |
| No Exception User has a past date | same run | nothing changes; run logs `deactivated=0` and completes successfully |

6. Run the job **again** immediately → it deactivates nothing new (idempotent).
7. Check the worker log shows run start/finish, evaluated count, each deactivated
   staff ID, and (if forced) a per-row failure that did not stop the run.
8. Confirm **no email** was sent to anyone.

## Post-implementation

```bash
# in each repo, on its pinned Node version
/code-review
```

Record the manual B-matrix result (date, tester, per-row pass/fail) in the PR
description(s) - the overnight cycle is verified by a triggered run, not full
automation.
