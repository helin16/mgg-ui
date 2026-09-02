# Contract: Exempt Users Edit Items After Lockdown - UI

**Feature**: 022-bt-exception-edit-after-lockdown

No API change. No new service call. This contract is the observable UI behaviour
of the GL-account detail screen and the internal prop flow between two components.

## Reused, unchanged

| Call | Purpose |
|---|---|
| `AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)` | Already called by feature 020 in `BTGLDetailsPage`. This feature reads two more booleans from the same response (`ROLE_ID_ADMIN` / `ROLE_ID_NORMAL` `canAccess`). |
| `BTLockDownService.getAll({ where: { year } })` | Existing lockdown load; unchanged. |

## `getItemListReadOnly` (new exported pure function in `BTGLDetailsPage.tsx`)

```
getItemListReadOnly({ isDisabled, isAdmin, isException, showingYear, budgetYear }): boolean
  = isDisabled && !( isAdmin || (isException && showingYear === budgetYear) )
```

Truth table: see [data-model.md](../data-model.md).

## `BTGLDetailsPage` → `BTGLDetailsPanel`

- MUST pass `isReadOnly={itemListReadOnly}` (was `isReadOnly={isDisabled}`), where
  `itemListReadOnly = getItemListReadOnly({...})` and `budgetYear = moment().year() + 1`.
- While `isLoading || isCheckingExempt` is true, `getContent()` MUST render a
  loading spinner instead of `<BTGLDetailsPanel>`, so a locked year never briefly
  shows editable controls to a would-be non-exempt user or a read-only list to an
  exempt user. `itemListReadOnly` is only read after `isAdmin` / `isException`
  are known.
- On `canAccessModule` failure (already handled by feature 020): `isAdmin` and
  `isException` are `false`, `Toaster.showApiError` is shown, and the item list
  is read-only on a locked year.
- `getOptionsPanel()` MUST keep using feature 020's `isExempt` (admin OR
  exception, any year) - the New Item / Bulk Create Items bypass is unchanged.

## `BTGLDetailsPanel` → `BTItemsTable` (main list in `getBTItemsTable()`)

- MUST pass `readyOnly={isReadOnly}` to the main `<BTItemsTable>` (currently no
  `readyOnly` prop is passed).
- Effect: each row's `BTItemCreatePopupBtn` receives `forceReadyOnly={isReadOnly}`,
  so `BTItemEditPanel` opens read-only when `isReadOnly` is true.
- `getOperationBtns()` and `canShowDeleteForSelectedItems(...)` already consume
  `isReadOnly` - no change; they now reflect the year-aware value.
- `onItemSelected` stays gated by `isModuleAdmin` only - unchanged.

## Observable behaviour on a **locked** year

| Viewer | Viewed year | Item list |
|---|---|---|
| Admin user | any | Editable - open/edit item, single & bulk approve/decline/status, single & bulk delete, all as on an unlocked year. |
| Exception user (not admin) | budget year (`now.year()+1`) | Editable within normal non-admin permissions (own / unauthored items per existing `BTItemEditPanel` rules). No admin-only actions. |
| Exception user (not admin) | current calendar year or earlier | Fully read-only - no edit, approve/decline, status change, bulk action, delete. |
| Neither admin nor exception | any | Fully read-only (this closes the current gap where NEW / own items were still editable via the row popup). |
| Any user, check still resolving | any | `BTGLDetailsPanel` is not rendered - a loading spinner is shown until both the lockdown load and the admin/exception check resolve; no read-only/editable flash. |

## Observable behaviour on an **unlocked** year

Unchanged for every viewer (`isDisabled === false` ⇒ `itemListReadOnly === false`).

## Invariants

- No API/endpoint/env-var/storage/upload/embed/token/`dangerouslySetInnerHTML`
  change.
- No new async call; no new silent-failure path; existing item-action
  loading/success/error/duplicate-submit handling is untouched.
- The feature-020 create bypass and all non-`isReadOnly` locked-year behaviour
  are unchanged.
