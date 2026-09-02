# Feature Specification: Budget Tracker - Exempt Users Edit Items After Lockdown

**Feature Branch**: `022-bt-exception-edit-after-lockdown`
**Created**: 2026-09-02
**Status**: Draft
**Input**: User description: "after lock down, the exceptional users and admin users need to be able to edit the BT item as per permissions before lockdown as well."

## Context

Feature **020-bt-lockdown-exception-users** let Budget Tracker **admin users** and
**exception users** keep creating budget items (New Item / Bulk Create Items) on
a GL account even after its budget year is locked down. It deliberately left the
existing budget-item **list read-only** for everyone on a locked year - exempt
users could add, but not edit or run item actions ("add-only", spec 020 FR-008
and the 2026-09-02 clarification; restated in feature 021).

That restriction is now unwanted. After lockdown, admin users and exception users
still need to **manage the items themselves** - edit item details, approve or
decline requests, change status, and delete - exactly as their permissions
allowed **before** the lockdown, with one limit on exception users:

- **Admin users**: the lockdown read-only clamp is lifted for **any** budget year.
- **Exception users**: the clamp is lifted **only for the budget year** - the
  not-yet-started year budgets are being prepared for (the current calendar year
  + 1). For the current calendar year and any earlier year, an exception user
  stays fully read-only after lockdown.
- **Everyone else**: fully read-only on any locked year, unchanged.

This feature supersedes, for admin and exception users (within the year limits
above), the "locked-year item list stays read-only / add-only" decision in
features 020 and 021. It does not change behaviour on unlocked years, and does
not change behaviour for non-exempt users. It does not change the feature-020
New Item / Bulk Create Items bypass (that stays as-is and is out of scope here).

## Clarifications

### Session 2026-09-02

- Q: After lockdown, should a non-admin exception user be able to edit any budget
  item, or only what their normal non-admin permissions already allow (in
  practice, items with no author or their own author id)? → A: Only what their
  normal non-admin permissions already allow. The lockdown read-only clamp is
  simply lifted for exception users; no new edit rights are granted, and
  admin-only item actions stay admin-only.
- Q: For which budget years should an exception user be able to edit/delete
  items after lockdown? → A: Only the **budget year** (the not-yet-started year
  budgets are being prepared for, i.e. the current calendar year + 1). For the
  current calendar year and any earlier year, an exception user stays fully
  read-only after lockdown - no edit, no delete.
- Q: Does the same year restriction apply to admin users? → A: No. Admin users
  keep full edit/delete for **any** budget year after lockdown; only exception
  users are limited to the budget year.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin user manages items after lockdown (Priority: P1)

A Budget Tracker administrator opens a GL-account detail screen for **any**
budget year that is locked down. Every item action they had before the lockdown
is available again: open an item and edit its details, approve or decline a
request, set items back to a pending/new state, select multiple items and run a
bulk approve/decline/status change, and delete items - governed by the same rules
that applied on an unlocked year. There is no year limit for administrators.

**Why this priority**: Administrators are the people expected to keep the budget
correct after close. Blocking their edits after lockdown forces workarounds
(re-opening the lockdown) and is the core of the request.

**Independent Test**: Lock a budget year, open a GL account as an administrator,
and confirm every item edit / approve / decline / status-change / bulk action /
delete that works on an unlocked year also works here, with the same results.

**Acceptance Scenarios**:

1. **Given** a locked budget year (of any year, including a past year) and an
   administrator on a GL-account detail screen, **When** they open an existing
   item, **Then** the item edit form is editable (not forced read-only) and a
   save persists the change.
2. **Given** a locked budget year and an administrator, **When** they approve or
   decline a single item request, **Then** the action succeeds and the item's
   status updates.
3. **Given** a locked budget year and an administrator who has selected one or
   more items, **When** they use a bulk action (approve / decline / set to
   new/pending), **Then** the bulk action is available and applies to the
   selection.
4. **Given** a locked budget year and an administrator, **When** they delete an
   item (single or bulk), **Then** the delete is available and removes the
   item(s), matching unlocked-year behaviour.
5. **Given** a locked budget year, **When** an administrator performs any of the
   above, **Then** the outcome and any validation/confirmation prompts are
   identical to performing the same action on an unlocked year.

---

### User Story 2 - Exception user manages budget-year items after lockdown within their own permissions (Priority: P1)

A Budget Tracker exception user (a non-admin member trusted to keep working after
lockdown) opens a GL-account detail screen for the **budget year** (current
calendar year + 1) after it has been locked down. For that year only, they can do
to items exactly what a non-admin user could do **before** the lockdown - for
example edit and delete their own still-editable requests - and nothing more.
Admin-only item actions remain admin-only for them. For the current calendar year
or any earlier locked year, the item list stays fully read-only for them.

**Why this priority**: The request names exception users alongside admins, but
their trust is forward-looking - finishing the upcoming budget - not reopening
historical years. Their post-lockdown ability must track their normal (non-admin)
permissions and be confined to the budget year.

**Independent Test**: Lock the budget year, open a GL account as an exception
user on that year, and confirm they can perform exactly the item actions a
non-admin member can on an unlocked year - no more, no less. Then switch the
screen to the current calendar year (also locked) and confirm the item list is
read-only for them.

**Acceptance Scenarios**:

1. **Given** the locked budget year and an exception user viewing that year,
   **When** they open an item they are allowed to edit on an unlocked year (e.g.
   their own request in an editable state), **Then** the edit form is editable
   and a save persists.
2. **Given** the locked budget year and an exception user viewing that year,
   **When** they view an item they could **not** edit before the lockdown (e.g.
   someone else's, or one already actioned), **Then** it remains read-only for
   them.
3. **Given** the locked budget year and an exception user viewing that year,
   **When** they look for admin-only item actions (bulk approve/decline,
   approve/decline, admin delete), **Then** those remain unavailable, exactly as
   before the lockdown.
4. **Given** the locked budget year and an exception user viewing that year,
   **When** they delete an item they are permitted to delete on an unlocked year,
   **Then** the delete succeeds.
5. **Given** an exception user, **When** they switch the GL-account screen to the
   current calendar year or an earlier year that is locked, **Then** the item
   list is fully read-only for them - no edit, approve/decline, status change,
   bulk action, or delete - regardless of item ownership.

---

### User Story 3 - Non-exempt users stay read-only after lockdown (Priority: P1)

A Budget Tracker user who is neither an admin nor an exception user opens a
GL-account detail screen for a locked budget year. The item list is read-only for
them, exactly as it is today: no edit, no approve/decline, no status change, no
bulk actions, no delete, no create.

**Why this priority**: This is the guardrail. The change must not widen access
for ordinary users; only admin and exception users are affected.

**Independent Test**: Lock a budget year, open a GL account as a plain member
(module access but neither admin nor exception), and confirm no item-modifying
control is available.

**Acceptance Scenarios**:

1. **Given** a locked budget year and a non-exempt user, **When** they open a
   GL-account detail screen, **Then** items are shown but every item-modifying
   control (edit save, approve/decline, status change, bulk actions, delete,
   create) is unavailable.
2. **Given** an unlocked budget year, **When** any user opens a GL-account detail
   screen, **Then** behaviour is unchanged by this feature for every user type.

---

### Edge Cases

- **Determining exempt status**: whether the current user is an admin or
  exception user must be resolved before the item controls render, so a locked
  year must not briefly show editable controls to a non-exempt user, or briefly
  lock out an exempt user, while the check is in flight; a loading state is
  acceptable. If the check fails, the safe default is **non-exempt** (read-only),
  surfaced through the shared error mechanism, not a silent failure.
- **User is both admin and exception**: treated as an admin (the higher
  capability), so the clamp is lifted for any year, not just the budget year.
- **Which year is the "budget year"**: the current calendar year + 1 (the year
  budgets are being prepared for), evaluated when the screen loads. As the
  calendar year rolls over, the budget year the exception-user exemption covers
  rolls forward with it. The year the exception user is *viewing* (the GL-account
  screen's year selector) must equal the budget year for their clamp to lift; the
  current calendar year and earlier stay read-only for them.
- **Exception user on a not-yet-locked budget year**: if the budget year is not
  actually locked, behaviour is the unlocked-year behaviour for everyone (this
  feature only concerns locked years).
- **Exception user whose access has expired** (feature 021): once the nightly
  check deactivates them they are no longer an exception user, so on the next
  load they are treated as non-exempt and the item list is read-only for them
  again.
- **Item-level permission still applies**: lifting the lockdown clamp does not
  grant an exempt user any capability they would not have on an unlocked year -
  ownership, item status, and admin-only gating are unchanged.
- **Server-side**: the lockdown is enforced only in the browser today; this
  feature does not add or rely on server-side lockdown enforcement. If such
  enforcement is added later, the same "admin or exception user is exempt" rule
  must apply to item edits.
- **Unlocked years and other locked-year restrictions**: nothing else about the
  locked-year screen changes - only the read-only clamp on the item list is
  lifted, and only for exempt users.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: On a GL-account detail screen for a **locked** budget year, the
  budget-item list MUST NOT be forced read-only when the current user is a Budget
  Tracker **admin user** (for any viewed year) or a Budget Tracker **exception
  user** viewing the **budget year** (current calendar year + 1). In every other
  case the current fully read-only clamp stays.
- **FR-001a**: For an **exception user** (who is not also an admin), the item
  list MUST remain fully read-only on any locked year that is not the budget year
  - i.e. the current calendar year and every earlier year - regardless of item
  ownership or status.
- **FR-002**: Where the clamp is lifted (FR-001), every item action that is
  available on an **unlocked** year MUST be available and behave identically:
  opening and editing an item, approving or declining a single request, changing
  an item's status, selecting items and running bulk approve / decline / status
  actions, and deleting items (single and bulk). "Identical" means the existing
  per-item rules still apply unchanged - item-author / ownership gating of the
  detail fields, and the admin-only gating of approve/decline - exactly as on an
  unlocked year. Lifting the lockdown clamp does not bypass those rules; it only
  removes the lockdown's blanket read-only.
- **FR-003**: The capability of an exempt user on a locked year MUST equal their
  capability on an unlocked year - no more (Session 2026-09-02 clarification).
  Admin-only item actions remain admin-only; a non-admin exception user gets only
  what a non-admin member gets (in practice, editing items that have no
  actioning author or whose author is that user, per the existing rules); item
  ownership and item-status rules are unchanged. No new edit right or privilege
  tier is created for exception users.
- **FR-004**: On a **locked** budget year, users who are neither admin nor
  exception users MUST keep the current fully read-only item list - no edit,
  approve/decline, status change, bulk action, delete, or create.
- **FR-005**: Behaviour on **unlocked** budget years MUST be unchanged for all
  user types.
- **FR-006**: Whether the current user is an admin or exception user MUST be
  determined before the item-modifying controls are shown; while it is being
  determined, those controls MUST NOT be shown (a loading indicator is
  acceptable). If the determination fails, the user MUST be treated as
  non-exempt and the failure surfaced through the shared error mechanism.
- **FR-007**: A user who is both an admin and an exception user MUST be treated
  as an admin - the clamp lifts for any viewed year, not only the budget year.
- **FR-008**: This feature supersedes the "locked-year item list is read-only /
  add-only" behaviour from features 020 and 021 for admin users (any year) and
  exception users (budget year only). It changes nothing for non-exempt users,
  nothing for exception users outside the budget year, nothing on unlocked years,
  and nothing about the feature-020 New Item / Bulk Create Items bypass.
- **FR-009**: Affected surface: the Budget Tracker module (SchoolBox remote
  module), GL-account detail screen. Access control: the screen stays behind the
  existing Budget Tracker module guard; this change only **removes** a
  restriction for already-trusted users and never grants access to anyone who
  lacks it today.
- **FR-010**: No new backend contract, endpoint, environment variable, browser
  storage, upload, embed, token handling, or `dangerouslySetInnerHTML` is
  introduced. Determining exempt status reuses the existing module-access lookup
  already used for the feature-020 create-options bypass.
- **FR-011**: Every user-triggered item action on a locked year MUST keep its
  existing explicit loading / success / validation / error handling; there is no
  new silent-failure path and no new way to submit an action twice.

### Key Entities *(include if feature involves data)*

- **Budget Tracker item**: an existing budget request/line on a GL account for a
  year, with a status (new / requested / pending / approved / declined), a
  creator, and an actioning author. Unchanged by this feature; only the
  conditions under which it can be modified change.
- **Locked budget year**: an existing per-year lockdown record. A year is
  "locked" once the current time is past its lockdown timestamp. Read-only here.
- **Budget year (derived)**: the current calendar year + 1 - the year budgets are
  being prepared for. Computed at view time. Bounds the exception-user exemption.
- **Viewed year**: the year currently selected in the GL-account screen's year
  selector.
- **Item-list-editable (derived)**: for a locked viewed year, the item list is
  editable for the current user when they are a Budget Tracker admin user (any
  viewed year), OR they are a Budget Tracker exception user AND the viewed year
  equals the budget year. Otherwise the list is read-only. Computed at view time,
  not stored. Admin/exception membership comes from the same module-access lookup
  used by the feature-020 create-options bypass.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On a locked budget year, an administrator can complete 100% of the
  item actions (edit, approve, decline, status change, bulk action, delete) that
  they can complete on an unlocked year, with identical results.
- **SC-002**: On the locked **budget year**, an exception user can complete
  exactly the item actions a non-admin member can on an unlocked year - measured
  as 0 additional capabilities and 0 missing capabilities versus the
  unlocked-year non-admin baseline.
- **SC-002a**: On a locked year that is **not** the budget year (current calendar
  year or earlier), an exception user has 0 item-modifying controls available,
  while an administrator on the same year still has all of them.
- **SC-003**: On a locked budget year, a non-exempt user has 0 item-modifying
  controls available - identical to today's locked-year behaviour.
- **SC-004**: On unlocked budget years, there is no observable behavioural change
  for any user type (regression check passes).
- **SC-005**: When exempt status cannot be determined, the locked-year screen
  shows the read-only (non-exempt) view and a visible error, with no
  console-only or silent failure, in 100% of induced-failure checks.

## Assumptions

- "As per permissions before lockdown" means the existing pre-lockdown
  permission model (admin can edit/approve/decline/bulk-action/delete any item;
  a non-admin member can act only on items they are entitled to, by ownership and
  status) is the source of truth. Lockdown currently clamps the item list to
  read-only on top of that model; this feature removes that clamp for admin and
  exception users so the underlying model governs their edits again.
- "Exception users" are the Budget Tracker Normal-role members introduced in
  feature 020 (with an expiry date from feature 021). "Admin users" are Budget
  Tracker Admin-role members.
- The "budget year" is the current calendar year + 1 (Session 2026-09-02
  clarification). The exception-user exemption applies only when the GL-account
  screen is showing that year; admin users have no year limit. There is no
  configurable override for the window in this iteration.
- The change is frontend-only: the lockdown is enforced only in the browser, so
  removing the read-only clamp for exempt users needs no backend change, and
  exempt status is read from the same module-access lookup feature 020 already
  uses.
- The item edit / approve / decline / bulk / delete flows themselves are not
  redesigned; only the input that currently forces them read-only on a locked
  year is changed for exempt users.
- Verification: the exempt-vs-clamp decision is small shared logic and will get
  automated tests; the full "every unlocked-year item action also works on a
  locked year for an admin / an exception user / not for a plain user" matrix is
  a cross-system flow and will be covered by a Cypress check or a documented
  manual SchoolBox/UAT run, since a locked-year state is impractical to fully
  automate this iteration.
- All verification commands run on the Node version pinned in `package.json`
  (`engines.node`), selected via `nvm`, per the project constitution.
