# Quickstart / Validation: Exempt Users Edit Items After Lockdown

**Feature**: 022-bt-exception-edit-after-lockdown

Frontend-only change to the Budget Tracker GL-account detail screen. See
[contracts/ui-contract.md](./contracts/ui-contract.md) for the exact prop flow
and [data-model.md](./data-model.md) for the `getItemListReadOnly` truth table.

**Prerequisite**: feature **020-bt-lockdown-exception-users** is implemented (this
feature extends its `canAccessModule` wiring in `BTGLDetailsPage`).

## Prerequisites

```bash
cd /Users/helin/git/MentoneGirls/mgg-ui
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use 20
yarn install --immutable
```

A backend where you can be, in turn, a Budget Tracker **admin** member, a
Budget Tracker **exception** (Normal-role) member, and a plain member.

## Automated checks

```bash
yarn test -t "BTGLDetailsPage"
yarn test -t "BTGLDetailsPanel"
yarn test                 # full suite before hand-off
npx tsc -p tsconfig.json --noEmit
```

Expected after implementation:

- `BTGLDetailsPage.helper.test.ts`: `getItemListReadOnly` matches the truth
  table - unlocked → false; locked+admin → false (any year); locked+exception+
  year==budgetYear → false; locked+exception+year!=budgetYear → true;
  locked+non-exempt → true.
- `BTGLDetailsPage.test.tsx`: the `isReadOnly` prop handed to `BTGLDetailsPanel`
  is `false` for a locked budget year as admin and as exception-on-budget-year,
  and `true` for exception-on-old-year and for non-exempt; unchanged (`false`)
  on unlocked years.
- `BTGLDetailsPanel.test.tsx`: the main `BTItemsTable` receives
  `readyOnly === isReadOnly`.

## Manual validation (SchoolBox / UAT) - the locked-year matrix

Covers SC-001..SC-005. Set `budgetYear` = current calendar year + 1 (e.g. 2027).

### Setup

1. Ensure the budget year and at least one earlier year both have a lockdown
   whose timestamp has passed (Admin → Lockdowns, or use a past year).
2. Have a GL account with a few items: one NEW (no author), one you authored, one
   actioned by someone else.

### A. Admin user (SC-001)

Open the GL account, **budget year** (locked): confirm you can open & edit an
item, approve/decline a single item, select items and run a bulk
approve/decline/set-new, and delete (single + bulk) - identical to an unlocked
year. Switch the year selector to the **earlier locked year**: confirm the same
actions still work (no year limit for admins).

### B. Exception user, budget year (SC-002)

Open the GL account, **budget year** (locked): confirm you can edit items you
could edit on an unlocked year (NEW / your own), and that admin-only actions
(bulk approve/decline, approve/decline, admin delete) are **not** shown. Confirm
you cannot edit an item actioned by someone else.

### C. Exception user, earlier locked year (SC-002a)

Switch the year selector to the **earlier locked year**: confirm the item list is
fully read-only - opening a row shows a read-only form, no delete, no bulk
controls - even for a NEW item or one you authored.

### D. Non-exempt user (SC-003)

As a plain Budget Tracker member, open the GL account on any **locked** year:
confirm every item-modifying control is unavailable, including editing a NEW item
via the row popup (this is the behaviour that changes - it was editable before).

### E. Unlocked years (SC-004)

Repeat A–D on an **unlocked** year: no observable change for any user type.

### F. Check-failure (SC-005)

Throttle / block `GET /auth/canAccess`: the locked-year screen shows the
read-only view and a visible error toast, never a silent pass/fail.

## Post-implementation

```bash
/code-review
```

Record the A–F results (date, tester, pass/fail per row) in the PR description -
call out explicitly that non-exempt users lose locked-year NEW/own-item editing
they had before (intended).
