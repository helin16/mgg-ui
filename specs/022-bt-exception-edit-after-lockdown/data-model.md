# Data Model: Exempt Users Edit Items After Lockdown

**Feature**: 022-bt-exception-edit-after-lockdown
**Date**: 2026-09-02

No schema, no persisted state, no new stored field. All state is derived at view
time on the GL-account detail screen.

## Derived values (in `BTGLDetailsPage`)

| Value | Type | Source | Notes |
|---|---|---|---|
| `isDisabled` | boolean | existing - lockdown record for `showingYear` has a past timestamp | Unchanged by this feature. |
| `isAdmin` | boolean | `AuthService.canAccessModule(6)` → `resp[ROLE_ID_ADMIN]?.canAccess === true` | New; from the response feature 020 already fetches. |
| `isException` | boolean | same response → `resp[ROLE_ID_NORMAL]?.canAccess === true` | New. |
| `isExempt` | boolean | `isAdmin || isException` | Existing (feature 020); still used by `getOptionsPanel` for the create bypass. Unchanged. |
| `isCheckingExempt` | boolean | existing (feature 020) - true while `canAccessModule` is in flight | Reused to suppress the item controls until resolved (no flash). |
| `showingYear` | number | existing - the GL screen's `FileYearSelector` | The "viewed year". |
| `budgetYear` | number | `moment().year() + 1` | The year budgets are being prepared for; same as `BTLockDownCreatePopup`'s `currentBudgetYear`. |
| `itemListReadOnly` | boolean | `getItemListReadOnly({ isDisabled, isAdmin, isException, showingYear, budgetYear })` | New; replaces `isDisabled` as the `isReadOnly` prop passed to `BTGLDetailsPanel`. |

## The rule (`getItemListReadOnly`, exported pure function)

```
getItemListReadOnly({ isDisabled, isAdmin, isException, showingYear, budgetYear })
  = isDisabled && !( isAdmin || (isException && showingYear === budgetYear) )
```

| isDisabled | isAdmin | isException | showingYear vs budgetYear | result (list read-only?) |
|---|---|---|---|---|
| false | any | any | any | **false** (unlocked - unchanged) |
| true | true | any | any | **false** (admin, any year) |
| true | false | true | equal | **false** (exception user, budget year) |
| true | false | true | not equal | **true** (exception user, older/other year) |
| true | false | false | any | **true** (non-exempt) |
| any | while `isCheckingExempt` (or on `canAccessModule` error) | - | - | **= `isDisabled`** - the panel is not rendered yet (a spinner is shown); once resolved, the row above applies |

`isAdmin` wins regardless of `isException` (spec FR-007: both ⇒ treated as
admin).

## Downstream effect of `itemListReadOnly`

Passed as `isReadOnly` to `BTGLDetailsPanel`, which:

- gates the bulk approve / decline / set-to-new buttons (existing),
- gates the bulk delete button via `canShowDeleteForSelectedItems` (existing),
- **new:** is forwarded as `readyOnly` to the main `<BTItemsTable>`, so each
  row's edit popup (`BTItemEditPanel`) opens read-only when `itemListReadOnly`
  is true.

`BTItemEditPanel`'s own per-item rule (`author_id` ownership, `isModuleAdmin`
gating of approve/decline fields) is unchanged and still applies on top - so a
non-admin exception user on the budget year gets exactly their normal non-admin
capability, no more (spec FR-003).

## Entities (unchanged, for reference)

- **Budget Tracker item**: existing budget line with status / creator / author.
  Not modified by this feature.
- **Lockdown record**: existing per-year record. Read-only here.
