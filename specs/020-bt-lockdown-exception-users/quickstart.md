# Quickstart / Validation: Budget Tracker Exception Users & Lockdown Bypass

**Feature**: 020-bt-lockdown-exception-users

Frontend-only change in `mgg-ui`. Two screens affected: BT Admin › Users, and the
GL-account detail screen. See [contracts/ui-contract.md](./contracts/ui-contract.md)
for the exact expected behaviour and [data-model.md](./data-model.md) for the
state rules.

## Prerequisites

```bash
cd /Users/helin/git/MentoneGirls/mgg-ui
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20   # engines.node >= 20
yarn install --immutable
```

`.env` must have `REACT_APP_API_END_POINT` and `REACT_APP_TOKEN` pointed at a
backend where you have a Budget Tracker **Admin** membership (module 6, role 2).

## Automated checks

```bash
# Component tests for the two touched files
yarn test -t "BTUserAdminPanel"
yarn test -t "BTGLDetailsPage"

# Full suite before hand-off
yarn test

# Type + lint
yarn tsc --noEmit   # or: npx tsc -p tsconfig.json --noEmit
```

Expected after implementation:

- `BTUserAdminPanel` test asserts both an **Admin Users** and an **Exception
  Users** list render (the latter as a `ModuleUserList` with `roleId={ROLE_ID_NORMAL}`).
- `BTGLDetailsPage` test mocks `AuthService` and covers: unlocked year (actions
  shown), locked + exempt (actions shown), locked + non-exempt (actions hidden).

## Manual validation (SchoolBox / UAT) - the cross-system flow

Covers spec SC-001..SC-005. Do this in a running app (`yarn start`, or the
SchoolBox-embedded build).

### A. Manage the Exception Users list (User Story 1 / SC-001)

1. Open **Budget Tracker → Admin → Users**.
2. Confirm an **Exception Users** section appears below **Admin Users**.
3. Add a staff member to Exception Users → success toast, row appears.
4. Reload the screen → the row is still there.
5. Remove the row → confirm dialog, row disappears; the Admin Users list is
   unchanged throughout.
6. Confirm you cannot delete your own row and cannot add yourself.

### B. Locked-year bypass (User Story 2 / SC-002..SC-005)

Set up: ensure a budget year is locked (Admin → Lockdowns), or use a past year.

| As... | Open a GL-account detail screen for the locked year | Expect |
|---|---|---|
| Admin User | | **New Item** + **Bulk Create Items** visible; both create items successfully (SC-002) |
| Exception User (from step A) | | Same - both actions visible and usable (SC-002) |
| Neither (plain staff with no BT membership, or Normal member removed) | | No creation actions - matches the pre-feature screenshot (SC-003) |

7. Switch the year selector to an **unlocked** year as each user type → no
   observable change vs. today (SC-004).
8. Simulate the exempt check failing (throttle / block `GET /auth/canAccess`) →
   the screen shows the non-exempt view **and** a visible error toast, never a
   silent pass or a silent fail (SC-005).
9. On the locked year as an Exception User, confirm the existing item list is
   still read-only (no inline edit/delete) - only adding is enabled.

## Post-implementation

```bash
# Constitution v1.2.0: review the diff
/code-review
```

Record the manual-validation result (date, tester, pass/fail per row) in the PR
description, since full automation of the locked-year state is impractical this
iteration.
