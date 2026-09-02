# Contract: Budget Tracker Exception Users & Lockdown Bypass

**Feature**: 020-bt-lockdown-exception-users

This feature adds no API endpoint. It consumes existing service wrappers only.
The "contract" is (a) the existing endpoints it relies on, unchanged, and
(b) the observable UI behaviour of the two touched screens.

## Reused API endpoints (no change)

| Service call | HTTP | Purpose here |
|---|---|---|
| `UserService.getUsers({ where: { Active: 1, ModuleID: 6, RoleID: 1 }, include: "SynCommunity" })` | `GET /user` | List Exception Users. |
| `UserService.createUser(6, 1, synergeticId)` | `POST /user/6/1/:synergeticId` | Add an Exception User. |
| `UserService.deleteUser(6, 1, synergeticId)` | `DELETE /user/6/1/:synergeticId` | Remove an Exception User (removes only the `RoleID=1` row). |
| `AuthService.canAccessModule(6)` | `GET /auth/canAccess?moduleId=6` | Returns `{ [roleId]: { canAccess: boolean, role } }` for every active role; used to compute `isExempt`. |
| `BTLockDownService.getAll({ where: { year } })` | `GET /bt/lockDown` | Existing lockdown load; unchanged. |

All of the above already flow through `AppService` (token + `X-MGGS-TOKEN`
header). `ModuleUserList` already calls the first three; `BTGLDetailsPanel`
already calls `AuthService`.

## UI contract - BT Admin › Users screen (`BTUserAdminPanel`)

Precondition: caller is inside `ModuleAccessWrapper(moduleId=6, roleId=ROLE_ID_ADMIN)`
(already true via `BTAdminPage`).

- MUST render the existing **Admin Users** section unchanged.
- MUST render an **Exception Users** section below it: a heading, an
  `ExplanationPanel`, and `<ModuleUserList moduleId={6} roleId={ROLE_ID_NORMAL}
  showCreatingPanel showDeletingBtn />`.
- The Exception Users list MUST show columns ID, Name, Email (from
  `ModuleUserList`'s default columns).
- Add control MUST create a `RoleID=1` membership and show a success toast;
  the added person appears in the list without a full reload.
- Delete control MUST remove the `RoleID=1` membership after confirmation; the
  current user MUST NOT see a delete control for their own row.
- Loading MUST show `PageLoadingSpinner`; API failure MUST surface via
  `Toaster.showApiError`; an empty list renders an empty table (no crash).
- Adding/removing an Exception User MUST NOT change the Admin Users list.

## UI contract - GL-account detail screen (`BTGLDetailsPage`)

Let `locked` = existing `isDisabled` (year past its lockdown timestamp), and
`isExempt` = `canAccessModule(6)` shows `canAccess === true` for `ROLE_ID_ADMIN`
or `ROLE_ID_NORMAL`.

| State | Required rendering of the "Options" panel (New Item + Bulk Create Items) |
|---|---|
| `!locked` | Shown (unchanged from today). |
| `locked && isExempt` | **Shown.** Both actions open their existing popups and create items for `gl.GLCode` / `showingYear`. |
| `locked && !isExempt` | Not rendered (unchanged from today). |
| status still resolving (`canAccess` and/or lockdown not yet returned) | Panel not rendered, or a spinner in its place - the two actions MUST NOT briefly appear for a would-be non-exempt user, and MUST NOT briefly disappear for an exempt user. |

Invariants:

- `isReadOnly={isDisabled}` passed to `BTGLDetailsPanel` is UNCHANGED: on a
  locked year the item list stays read-only for everyone, including exempt users
  (add-only, no inline edit/delete).
- No other locked-year restriction changes (bulk approve/decline/delete remain
  admin-only and hidden on locked years as today).
- `canAccessModule(6)` failure ⇒ `isExempt = false` (safe default) +
  `Toaster.showApiError`; never a silent failure, never an exempt fallback.
- Behaviour for unlocked years is byte-for-byte unchanged for all user
  categories.
