# Contract: Exception User Expiry - UI (`mgg-ui`)

**Feature**: 021-bt-exception-user-expiry

No new endpoint. Uses the existing membership service; one call gains an optional
argument.

## Service calls

| Call | HTTP | Change | Purpose |
|---|---|---|---|
| `UserService.getUsers({ where: { Active: 1, ModuleID: 6, RoleID: 1 }, include: "SynCommunity" })` | `GET /user` | none | List Exception Users (with `settings`). |
| `UserService.createUser(6, 1, synergeticId, { settings: { expiryDate } })` | `POST /user/6/1/:id` | **new optional 4th arg** `{ settings }`, forwarded as the POST body | Add an Exception User **with** the required expiry date, atomically. |
| `UserService.updateUser(6, 1, synergeticId, { settings: { ...existing, expiryDate } })` | `PUT /user/6/1/:id` | none (PUT already spreads `req.body`) | Change an existing Exception User's expiry date. Client sends the full merged `settings` object. |
| `UserService.deleteUser(6, 1, synergeticId)` | `DELETE /user/6/1/:id` | none | Remove an Exception User (feature 020). |

`createUser` signature (backward compatible):

```
createUser(moduleId, roleId, synergeticId, params: iConfigParams = {}) // params already exists; now { settings } is honoured server-side
```

## Component: `BTExceptionUserList` (new)

Rendered by `BTUserAdminPanel` in place of feature 020's
`<ModuleUserList roleId={ROLE_ID_NORMAL} ...>`. Admin-only context is already
enforced by the surrounding `ModuleAccessWrapper`.

### List

- Columns: ID, Name, Email (as feature 020's list), plus **Expiry**.
- Expiry cell shows the stored `settings.expiryDate` (formatted), or a visually
  distinct **"No expiry - set a date"** affordance for legacy rows.
- Loading → spinner; load failure → `Toaster.showApiError`; empty → empty table.
- Shows active members only (no inactive/expired rows) - deactivated users
  simply drop off.

### Add

- Trigger opens a dialog with `StaffSelector` **and** a required date field
  (`DateTimePicker` in date mode, or equivalent).
- Submit is disabled until both a person and a valid date are chosen.
- On submit: `createUser(6, 1, personId, { settings: { expiryDate } })` →
  success `Toaster` → row appears with its expiry date → dialog closes.
- Cannot add yourself (server responds 400; surface it) - matches feature 020.
- A past date is accepted; the UI MAY show a non-blocking warning.

### Edit expiry

- Inline control on the row (e.g. a date field / small popover) → on change,
  `updateUser(6, 1, personId, { settings: { ...row.settings, expiryDate } })` →
  success `Toaster`, list refresh.
- No "clear" / "remove date" control is presented. The field cannot be committed
  empty.
- Legacy row: opening its editor shows "no expiry"; saving requires a date.

### Remove

- `DeleteConfirmPopupBtn` → `deleteUser(6, 1, personId)` → row disappears.
  (Unchanged from feature 020.)

## Invariants

- `settings.expiryDate` is stored as a `YYYY-MM-DD` string with **no time or zone
  component**; the API worker is the sole authority for the day-boundary
  decision.
- Editing/adding an expiry date never affects the person's Admin (`RoleID = 2`)
  row or any other module (server pins module/role in the path).
- No new env var, browser storage, upload, embed, token handling, or
  `dangerouslySetInnerHTML`.
- Every async action has explicit loading / success / validation / error states;
  submit is blocked while a save is in flight.
