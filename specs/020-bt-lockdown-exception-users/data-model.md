# Data Model: Budget Tracker Exception Users & Lockdown Bypass

**Feature**: 020-bt-lockdown-exception-users
**Date**: 2026-09-02

No schema changes. This feature only reads and writes existing structures through
existing endpoints. Documented here for traceability.

## Entities

### Budget Tracker module membership (`uMGGSUsers` row)

Existing table. Represented in the frontend as `iModuleUser`
(`src/types/modules/iModuleUser.ts`). No fields added.

| Field | Meaning for this feature |
|---|---|
| `ID` | Primary key (identity). **Only** unique key on the table - see note below. |
| `SynergeticID` | The staff person. |
| `ModuleID` | `6` (`MGGS_MODULE_ID_BUDGET_TRACKER`) for all rows this feature touches. |
| `RoleID` | `2` (`ROLE_ID_ADMIN`) = Admin User; `1` (`ROLE_ID_NORMAL`) = **Exception User**. |
| `Active` | `1` for rows that count. Inactive rows are ignored by list and access checks. |
| `SynCommunity` | Included on list reads for ID / name / email display. |

**Uniqueness note (DB-verified, read-only)**: the table's only key is `ID`
(auto-increment). There is no unique constraint on `(SynergeticID, ModuleID)` or
`(SynergeticID, ModuleID, RoleID)`, and rows already exist elsewhere where one
person holds both roles in one module. Consequences:

- A person can be an Admin User **and** an Exception User at the same time
  (two rows). Both lists show them; each list's delete removes only its own
  `RoleID` row. (spec FR-004, Edge Case 1)
- Duplicate identical `(SynergeticID, ModuleID, RoleID)` rows are theoretically
  possible; `ModuleUserList` de-duplicates its display by `SynergeticID`
  (`userMap` keyed by `SynergeticID`), so this is cosmetically safe.

### Role (`uMGGSRoles` row)

Existing table. Active rows: `1` Normal, `2` Admin. **No new role.** The
`MGGS_ROLE_ID_APPROVER = 3` constant in `mggs-api` has no table row and is
irrelevant here.

### Budget Tracker lockdown (`BTLockDown` / `iBTLockDown`)

Existing per-year record `{ year, lockdown: <timestamp>, ... }`. **Read only.**
A year is "locked" when `moment().isAfter(moment(lockdown))`. Past years with no
record are treated as locked at end of the prior year (existing
`BTGLDetailsPage` logic, unchanged).

## Derived / in-memory state

### `isExempt` (new local state in `BTGLDetailsPage`)

- **Type**: `boolean` (plus an implicit "still resolving" state = not yet set).
- **Source**: `AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)`.
- **Rule**: `isExempt = resp[ROLE_ID_ADMIN]?.canAccess === true || resp[ROLE_ID_NORMAL]?.canAccess === true`.
- **On error**: `isExempt = false`; surface via `Toaster.showApiError`.
- **Lifetime**: recomputed when the GL-account detail screen mounts / `gl.GLCode`
  or `showingYear` changes (same dependency set as the existing lockdown load;
  can share that `useEffect`).
- **Not persisted.**

## State transitions

### Exception Users list (per row)

```
(absent) --admin adds staff member--> Exception User (Active uMGGSUsers row, RoleID=1, ModuleID=6)
Exception User --admin confirms remove--> (absent)   [deletes only the RoleID=1 row]
```

### GL-account detail screen - "Options" panel visibility

| Year state | Current user | New Item / Bulk Create Items |
|---|---|---|
| Unlocked | any BT member | shown (unchanged) |
| Locked | Admin or Exception member | **shown (new)** |
| Locked | neither | hidden (unchanged) |
| Locked | status still resolving | hidden / spinner until resolved (no flash) |

## Validation rules

- Adding to the Exception Users list uses the same guard as Admin Users: a user
  cannot add themselves (`ModuleUserList` "You can NOT add yourself" +
  `currentUser?.synergyId === user.SynergeticID` hides self-delete). (FR-003)
- The exempt check must not *remove* any action a user can perform today; it only
  adds visibility on locked years. (FR-006, FR-007, FR-009)
- Exempt status grants only the two create actions on locked years - no
  admin-only ability (bulk approve/decline/delete, lockdown admin). (FR-013)
