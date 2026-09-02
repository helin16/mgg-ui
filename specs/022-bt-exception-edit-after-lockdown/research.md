# Research: Exempt Users Edit Items After Lockdown

**Feature**: 022-bt-exception-edit-after-lockdown
**Date**: 2026-09-02

All spec clarifications are resolved (Session 2026-09-02). Remaining unknowns were
about the current code, resolved by reading `src/pages/BudgetTracker/`.

## Finding 0 - How the locked-year "read-only" actually behaves today

- `BTGLDetailsPage` computes `isDisabled` (year is locked) and passes
  `isReadOnly={isDisabled}` to `BTGLDetailsPanel`.
- Inside `BTGLDetailsPanel`, `isReadOnly` only gates: the **bulk** operation
  buttons (approve / decline / set-to-new) and the **bulk delete** button - both
  already additionally gated by `isModuleAdmin`.
- The **main item table** (`getBTItemsTable()`) renders `<BTItemsTable>` **without
  a `readyOnly` prop**, so each row's `BTItemCreatePopupBtn` gets
  `forceReadyOnly = false`. Opening a row therefore shows `BTItemEditPanel` with
  `readyOnly = false`, whose own read-only rule is only
  `author_id != null && author_id != currentUser` (item already actioned by
  someone else).
- **Net effect today**: on a locked year, any module member can still edit a NEW
  item (no author) or their own item via the row popup; only admin bulk actions
  are suppressed.

This is a gap versus the intent recorded in features 020/021 ("locked-year item
list is read-only / add-only"). Feature 022 both **closes that gap** (non-exempt
users and out-of-window exception users become genuinely read-only) and **opens a
carve-out** (admins any year; exception users on the budget year).

## Decision 1 - The read-only decision, as one pure function

**Decision**: Add
`export const getItemListReadOnly = ({ isDisabled, isAdmin, isException, showingYear, budgetYear }): boolean => isDisabled && !(isAdmin || (isException && showingYear === budgetYear))`
to `BTGLDetailsPage.tsx`, mirroring the existing exported helpers
`canShowCreateOptions` (feature 020, same file) and `canShowDeleteForSelectedItems`
(`BTGLDetailsPanel.tsx`).

- `budgetYear = moment().year() + 1` (the value `BTLockDownCreatePopup` already
  uses for "currentBudgetYear").
- `showingYear` is the existing `BTGLDetailsPage` state bound to the screen's
  `FileYearSelector`.

**Rationale**: keeps the branching logic testable without rendering, matches the
established pattern in this exact area, and isolates the one behavioural rule the
feature adds.

**Alternatives considered**:

- *Inline the boolean in the component* - rejected: not unit-testable, and the
  sibling helpers set the precedent for extracting it.
- *A date range / configurable window* - rejected: the clarification fixed the
  window at exactly the budget year; no configuration in this iteration.

## Decision 2 - Getting admin vs exception separately

**Decision**: In `BTGLDetailsPage`'s existing lockdown `useEffect`, the feature
020 code already calls `AuthService.canAccessModule(MGGS_MODULE_ID_BUDGET_TRACKER)`
and sets a combined `isExempt`. Extend that same `.then` to also set
`isAdmin = resp[ROLE_ID_ADMIN]?.canAccess === true` and
`isException = resp[ROLE_ID_NORMAL]?.canAccess === true`. No new request.

**Rationale**: `canAccessModule` returns `{ [roleId]: { canAccess } }` for every
active role in one call, so both booleans come from the response already in hand.
`isExempt` (used by feature 020's `getOptionsPanel`) stays as-is; the two new
booleans are additive.

To satisfy spec FR-006's no-flash rule, `BTGLDetailsPage.getContent()` renders a
loading spinner (not `<BTGLDetailsPanel>`) while `isLoading || isCheckingExempt`,
so `itemListReadOnly` is only ever read after `isAdmin` / `isException` are
known - an exempt user never briefly sees a read-only list, and a non-exempt
user never briefly sees editable controls.

**Alternatives considered**:

- *Two `isModuleRole` calls* - rejected: redundant round-trips.
- *Redux `auth` user* - rejected: carries no module-role membership.

## Decision 3 - Propagate the flag to the row popups

**Decision**: In `BTGLDetailsPanel.getBTItemsTable()`, pass
`readyOnly={isReadOnly}` to the main `<BTItemsTable>` (currently omitted). This
makes each row's `BTItemCreatePopupBtn` receive `forceReadyOnly = isReadOnly`, so
`BTItemEditPanel` opens read-only when the list is clamped.

- `BTItemsTable` already treats `readyOnly` correctly (hides selection
  checkboxes, forwards `forceReadyOnly`). For an admin on a locked year
  `isReadOnly` resolves to `false`, so checkboxes/edit stay; for a non-exempt
  user `onItemSelected` is already `undefined`, so nothing else regresses.
- `getOperationBtns` and `canShowDeleteForSelectedItems` already consume
  `isReadOnly`; they now get the year-aware value for free.

**Rationale**: this is the minimal change that makes the spec's "no edit" for
non-exempt / out-of-window users real, and it reuses the prop the table already
supports.

**Alternatives considered**:

- *Leave row popups editable, only fix bulk buttons* - rejected: fails spec
  US3/FR-004 and the user's "exception user can't edit last year" requirement.
- *Add lockdown awareness inside `BTItemEditPanel`* - rejected: spreads the rule
  across more files; the table's `readyOnly` prop is the existing seam.

## Decision 4 - Keep the feature-020 create bypass untouched

**Decision**: `getOptionsPanel()` in `BTGLDetailsPage` keeps using `isExempt`
(admin OR exception, any year) exactly as feature 020 shipped it. This feature
does not add a year limit to New Item / Bulk Create Items.

**Rationale**: out of scope per the spec; changing it would be a separate
decision the user has not asked for.

## Constitution / environment notes

- `nvm use 20` before `yarn` / `tsc` / Jest.
- `/code-review` on the diff (constitution v1.2.0).
- No new env var, storage, upload, embed, token, or `dangerouslySetInnerHTML`.
- Sequencing: feature 020 must land first (provides the `canAccessModule` wiring
  and `isCheckingExempt` loading state this feature extends).
- Behavioural change to call out in review: non-exempt users (and exception users
  outside the budget year) lose the ability to edit NEW / own items on a locked
  year that they have today. This is intended (spec US3, FR-004, and the
  exception-user year limit).
