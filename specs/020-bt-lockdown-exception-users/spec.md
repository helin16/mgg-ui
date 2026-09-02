# Feature Specification: Budget Tracker Exception Users & Lockdown Bypass

**Feature Branch**: `020-bt-lockdown-exception-users`
**Created**: 2026-09-02
**Status**: Draft
**Input**: User description: "as per screenshot, the BudgetTrack Module: 1. it should have a list of Exception Users, which now are missing. can you find out why? 2. as per 2nd screenshot, if the current user in the admin user or exception users, then under the GL account, event if there is a lockdown, the current user should still be able to do see the options: 'New Item' and 'Bulk Create Items'"

## Investigation: why is the Exception Users list missing?

The reported "missing" list was never built. It is not a regression:

- The Budget Tracker admin **Users** screen renders only one list, "Admin Users",
  which shows Budget Tracker module members holding the **Admin** role. There is
  no second list, panel, or tab for any other class of user on that screen, and
  the screen has only ever contained the single Admin Users list since the module
  was first added.
- There is no "Exception User" concept anywhere in the product today: no such
  role, no such flag on a module membership, no storage for it in the backend,
  and no reference to the term in the user interface or the service layer.
- Budget Tracker memberships already support more than one role in principle,
  but the Budget Tracker Users screen only ever creates and lists **Admin**
  members, so any non-admin Budget Tracker member would be invisible in the
  current UI.

**Confirmed against the live database (read-only)**:

- The role table contains exactly two active roles: **Normal** (1) and **Admin**
  (2). (A third "Approver" role constant exists in backend code but has no row
  in the table.)
- Every Budget Tracker (module 6) membership row is the **Admin** role. There
  are **zero** Normal-role members for Budget Tracker, so there is no data
  behind an "Exception Users" list today - nothing was deleted; the list and
  its data were never created. The three active Admin rows match the people
  shown in the first screenshot.
- Many other modules already have Normal-role members in the same membership
  table, and the existing membership create / list / delete flow already
  handles the Normal role. Adding Normal-role members for Budget Tracker needs
  no schema change and no new role.

**Conclusion**: "Exception Users" needs to be defined and surfaced as a new,
explicitly managed list on the Budget Tracker Users screen, backed by Budget
Tracker memberships holding the existing **Normal** role. This specification
treats it as new functionality rather than a bug fix for lost data.

## Investigation: how the lockdown currently blocks item creation

- Each Budget Tracker GL-account detail screen loads the lockdown record for the
  year being viewed. A year counts as "locked" once the current date is past the
  lockdown timestamp (past budget years with no explicit record are treated as
  locked at the end of the prior year).
- When the year is locked, the GL-account screen hides the entire **Options**
  panel, which removes both the **New Item** and **Bulk Create Items** actions,
  and also switches the item list into read-only mode. This applies to every
  user, including Budget Tracker admins.
- The lockdown is enforced **only** in the browser UI. The backend item-creation
  endpoint does not check lockdown state, so the bypass in this feature is a
  UI-visibility change and does not require new server-side enforcement or a new
  server-side exemption check.

## Clarifications

### Session 2026-09-02

- Q: Beyond the locked-year bypass, should an Exception User get the same general
  Budget Tracker access that any module member has today, or be restricted to
  only the locked-year New Item / Bulk Create bypass? → A: Same as any normal
  module member — full read access and normal item creation on unlocked years —
  plus the locked-year New Item / Bulk Create bypass. No new restrictions are
  built for Exception Users; the only admin-only actions they still cannot use
  are the existing ones (bulk approve/decline/delete, lockdown management, admin
  options).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manage the Exception Users list (Priority: P1)

A Budget Tracker administrator opens the **Users** screen in Budget Tracker
Admin. Below the existing **Admin Users** list they see a second list,
**Exception Users**. They can add a staff member to it, see who is currently on
it (name, ID, email), and remove someone from it, using the same interaction
pattern as the Admin Users list.

**Why this priority**: The Exception Users list is the control surface that makes
User Story 2 usable. Without a way to populate the list, the lockdown bypass
cannot be granted to anyone who is not already a full admin, and the primary
request ("it should have a list of Exception Users") is unmet.

**Independent Test**: Can be fully tested by opening Budget Tracker Admin →
Users, adding and removing a staff member on the Exception Users list, and
reloading the screen to confirm the change persisted. Delivers value on its own
as a visible, managed roster even before the bypass behaviour is wired in.

**Acceptance Scenarios**:

1. **Given** an administrator on the Budget Tracker Users screen, **When** the
   screen loads, **Then** an **Exception Users** list is shown as a distinct
   section below **Admin Users**, with column headings for ID, Name, and Email.
2. **Given** the Exception Users list, **When** the administrator adds a staff
   member through the add control, **Then** that person appears in the Exception
   Users list and a success confirmation is shown.
3. **Given** a person already on the Exception Users list, **When** the
   administrator confirms removal, **Then** that person is removed from the list
   and the removal is confirmed.
4. **Given** the add control for Exception Users, **When** the administrator
   tries to add themselves, **Then** the same self-add restriction that applies
   to Admin Users applies here.
5. **Given** a person who is already an Admin User, **When** the administrator
   views both lists, **Then** the two lists are managed independently and adding
   or removing someone from one list does not silently change the other.

---

### User Story 2 - Exempt users bypass the lockdown for item creation (Priority: P1)

A Budget Tracker admin, or a user on the Exception Users list, opens a GL-account
detail screen for a budget year that is locked down. They still see the
**New Item** and **Bulk Create Items** actions and can use them to add budget
items for that GL account and year. Every other user continues to see no
creation actions for a locked year.

**Why this priority**: This is the operational outcome the requester needs -
finance staff who are trusted to keep working after lockdown must not be blocked
from entering items. It depends on User Story 1 for the non-admin case but can be
demonstrated immediately for the admin case.

**Independent Test**: Can be tested by locking a budget year, then opening a
GL-account screen as (a) a plain user, (b) an Admin User, and (c) an Exception
User, and confirming only the latter two see and can use New Item and Bulk
Create Items.

**Acceptance Scenarios**:

1. **Given** a locked budget year and a current user who is a Budget Tracker
   Admin User, **When** they open a GL-account detail screen for that year,
   **Then** the **New Item** and **Bulk Create Items** actions are visible and
   usable.
2. **Given** a locked budget year and a current user on the Exception Users list,
   **When** they open a GL-account detail screen for that year, **Then** the
   **New Item** and **Bulk Create Items** actions are visible and usable.
3. **Given** a locked budget year and a current user who is neither an Admin User
   nor an Exception User, **When** they open a GL-account detail screen for that
   year, **Then** no item-creation actions are shown, matching today's behaviour.
4. **Given** an unlocked budget year, **When** any user with Budget Tracker
   access opens a GL-account detail screen, **Then** item-creation actions are
   shown as they are today (this feature does not change unlocked-year
   behaviour).
5. **Given** an exempt user who has created an item via the bypass on a locked
   year, **When** the save completes, **Then** the standard success, error, and
   duplicate-submission handling for item creation is unchanged.

---

### Edge Cases

- A user who is on **both** the Admin Users and Exception Users lists is treated
  as exempt (membership in either list is sufficient); removing them from one
  list must not grant or revoke exemption if they remain on the other.
- Determination of whether the current user is exempt must resolve before the
  creation actions are shown, so a locked-year screen must not briefly flash the
  actions to a non-exempt user or hide them from an exempt user while access is
  still being checked; a loading state is acceptable.
- If the exemption check fails to load (network or permission error), the screen
  must fall back to the safe default of treating the user as **not** exempt and
  surface the error through the shared error mechanism rather than failing
  silently.
- The rest of the locked-year screen (read-only item list, no bulk
  approve/decline/delete for non-admins) is out of scope and must remain as it
  is today; only the visibility of **New Item** and **Bulk Create Items** changes
  for exempt users.
- Adding a staff member who is not a current Budget Tracker member to the
  Exception Users list makes them an Exception User: they gain the same general
  Budget Tracker access as any normal module member (browse GL accounts, view
  budget items, create items on unlocked years) plus the locked-year bypass. It
  must not grant them Admin rights (bulk approve/decline/delete, lockdown
  management, admin options).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Budget Tracker Admin **Users** screen MUST display an
  **Exception Users** list as a distinct section, in addition to the existing
  **Admin Users** list, showing each member's ID, name, and email.
- **FR-002**: An administrator MUST be able to add a staff member to the
  Exception Users list and remove a member from it, using the same add/confirm
  interaction and the same shared roster component as the Admin Users list.
- **FR-003**: The Exception Users list MUST enforce the same self-management
  restriction as Admin Users (a user cannot add themselves).
- **FR-004**: The Exception Users list and the Admin Users list MUST be managed
  independently; a person can appear on one, the other, both, or neither.
- **FR-005**: On a GL-account detail screen for a **locked** budget year, the
  **New Item** and **Bulk Create Items** actions MUST be shown and usable when
  the current user is a Budget Tracker Admin User OR a Budget Tracker Exception
  User.
- **FR-006**: On a GL-account detail screen for a **locked** budget year, users
  who are neither Admin nor Exception Users MUST continue to see no item-creation
  actions (no behaviour change from today).
- **FR-007**: Behaviour on **unlocked** budget years MUST be unchanged for all
  users.
- **FR-008**: The read-only state of the locked-year item list and all other
  locked-year restrictions besides item-creation visibility MUST be unchanged.
- **FR-009**: Affected module surface: the Budget Tracker module (SchoolBox
  remote module), specifically the Admin → Users screen and the GL-account
  detail screen. Access control: both screens remain behind the existing Budget
  Tracker module guard; the Users screen remains admin-only; the new exemption
  check on the GL-account screen grants **additional** visibility only and never
  removes access anyone has today.
- **FR-010**: Service-layer contract: managing Exception Users MUST reuse the
  existing module-membership service and types (create / list / delete a module
  member by module, role, and person) with no new endpoint. Determining whether
  the current user is an Admin or Exception User MUST reuse the existing
  module-access lookup. If the reused membership listing cannot distinguish
  Exception Users from other non-admin members, a minimal additive filter
  parameter on the existing service is acceptable; no ad hoc direct API calls
  from components.
- **FR-011**: Async UX: the Exception Users list MUST present loading, success,
  empty, and error states consistently with the Admin Users list. The
  GL-account exemption check MUST present a loading state while resolving and
  MUST route failures through the shared error mechanism, defaulting to
  "not exempt" on failure.
- **FR-012**: No new environment variable, browser storage, file upload,
  payment, third-party embed, or `dangerouslySetInnerHTML` usage is introduced.
  No additional sensitive data is persisted or rendered beyond the staff
  name/ID/email already shown for Admin Users.
- **FR-013**: The lockdown *bypass* applies only to the visibility and use of
  **New Item** and **Bulk Create Items** on a locked year; it MUST NOT grant a
  non-admin exempt user any admin-only ability (bulk approve, decline, delete,
  lockdown management, or other admin options).
- **FR-014**: An "Exception User" is a Budget Tracker module member holding the
  existing **Normal** (non-admin) role. This is a frontend-only change: it
  reuses the existing membership create / list / delete flow and the existing
  role table, and requires no new role, schema change, or backend work.
  (Confirmed with the user and verified against the live database.)
- **FR-015**: An Exception User MUST receive the same general Budget Tracker
  access as any normal module member (browse GL accounts, view budget items,
  create items on unlocked years), in addition to the locked-year bypass. No
  new module-wide gating or Exception-User-specific restriction is introduced;
  their access is bounded only by the module's existing non-admin limits.

### Key Entities *(include if feature involves data)*

- **Budget Tracker module membership**: a link between a staff person and the
  Budget Tracker module, carrying a role. Today only the **Admin** role is
  created and listed here. This feature adds management and display of a second
  category, **Exception User**, on the same membership concept.
- **Budget Tracker lockdown**: an existing per-year record with a lockdown
  timestamp. A year is "locked" once the current time is past that timestamp.
  Unchanged by this feature; only read.
- **Exempt user (derived)**: the current user, evaluated at view time, is
  "exempt" if they are an Admin User or an Exception User of the Budget Tracker
  module. Not stored; computed from membership.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: On the Budget Tracker Admin Users screen, an administrator can see
  the current Exception Users, add one, and remove one, with the change still
  present after a full screen reload - 100% of these three operations succeed in
  a verification run.
- **SC-002**: For a locked budget year, an Admin User and an Exception User can
  each open a GL-account detail screen and successfully create at least one
  budget item via **New Item** and one batch via **Bulk Create Items**.
- **SC-003**: For a locked budget year, a user who is neither Admin nor Exception
  User sees no item-creation actions on the GL-account detail screen - matching
  the pre-feature screenshot exactly.
- **SC-004**: For unlocked budget years, there is no observable change in the
  GL-account detail screen for any user category (regression check passes).
- **SC-005**: When the exemption check cannot complete, the GL-account detail
  screen shows the non-exempt view and surfaces a visible error, with no
  console-only or silent failure.

## Assumptions

- "Exception Users" is understood to mean users who are trusted to keep entering
  budget items after a year is locked down, without being given full Budget
  Tracker admin rights. The name in the UI will be "Exception Users" to match the
  request.
- Exception Users are modelled as Budget Tracker module members with the existing
  **Normal** role (confirmed with the user and verified against the database), so
  the change is frontend-only and reuses the existing module-membership
  create/list/delete service and the existing module-access lookup.
- The lockdown remains UI-enforced only; no server-side lockdown enforcement or
  server-side exemption list is added in this iteration. If server-side
  enforcement is added later, the same Admin-or-Exception exemption rule should
  apply.
- The Exception Users list reuses the shared module-user roster component, so its
  loading, empty, add, remove, and error behaviour match the Admin Users list
  without bespoke UX.
- Per the Session 2026-09-02 clarification, an Exception User is a normal Budget
  Tracker module member plus the locked-year bypass; the module's existing
  access guard already admits any member, so no Exception-User-specific gating is
  built.
- Verification: the roster management (User Story 1) is covered by automated
  component tests around the Users screen; the locked-year bypass (User Story 2)
  is a cross-system access-visibility flow and will get a Cypress check or a
  documented manual SchoolBox/UAT verification across the three user categories,
  since full automation of the locked-year state is impractical this iteration.
- All verification commands are run on the Node version pinned in the repo's
  `package.json` (`engines.node`), selected via `nvm`, per the project
  constitution.
