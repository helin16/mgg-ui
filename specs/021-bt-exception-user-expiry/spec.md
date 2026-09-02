# Feature Specification: Budget Tracker Exception User Expiry

**Feature Branch**: `021-bt-exception-user-expiry`
**Created**: 2026-09-02
**Status**: Draft
**Input**: User description: "for the exceptional users, we need to hold the expiry date in the user's setting, and on the API side, when we need a crontab worker run every night to run check for those exceptional user's expiry, if they are expired then we need to deactivated them"

## Context

This feature extends **020-bt-lockdown-exception-users**. That feature introduced
**Exception Users** for the Budget Tracker module (module members holding the
Normal role) who can add budget items even when a budget year is locked down, and
a list to manage them on the BT Admin → Users screen.

Exception access is meant to be temporary - granted for a defined window (for
example, "until end of the finance close"). Today it must be revoked by an
administrator remembering to remove the person. This feature makes the window
explicit and self-enforcing: each Exception User carries an **expiry date**, and
the access is withdrawn automatically once that date passes.

## Clarifications

### Session 2026-09-02

- Q: When the nightly check auto-deactivates an expired Exception User, should
  anyone be notified by email, or is it silent (log only)? → A: Silent - the job
  only deactivates and writes to its run log. No email to the affected person or
  to administrators. (Notification may be added as a later feature.)
- Q: When an administrator adds someone to the Exception Users list, must they
  set an expiry date, or can an Exception User be created with no expiry? → A:
  Required. The add (and re-add) control must not complete without a valid expiry
  date; every Exception User created from now on always has one. Exception Users
  that already exist without a date are left as-is (treated as "no expiry") until
  an administrator next edits them. The expiry date cannot be cleared once set -
  only changed to another date.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Set an expiry date on an Exception User (Priority: P1)

A Budget Tracker administrator, on the BT Admin → Users screen, must provide an
**expiry date** when adding a person to the Exception Users list, and can later
change that date to a different one from the list. The date is saved against that
person and shown in the list. The date cannot be left blank or cleared.

**Why this priority**: Without a way to record the expiry date, the nightly
check has nothing to act on. This is the control surface for the whole feature.

**Independent Test**: Open BT Admin → Users, set an expiry date on an Exception
User, reload the screen, confirm the date persisted and is displayed; clear it
and confirm it is removed.

**Acceptance Scenarios**:

1. **Given** the administrator is adding a person to the Exception Users list,
   **When** they try to complete the add without an expiry date, **Then** the add
   is blocked with a clear prompt to supply a date; **When** they supply a valid
   date and confirm, **Then** the person is added with that expiry date shown in
   the list and a success confirmation.
2. **Given** an Exception User with an expiry date, **When** the administrator
   changes it to a different date, **Then** the new date replaces the old one.
3. **Given** an Exception User with an expiry date, **When** the administrator
   edits it, **Then** there is no option to clear/blank the date - it can only be
   set to another valid date.
4. **Given** the administrator enters an expiry date in the past, **When** they
   save, **Then** the value is accepted and saved (the nightly check will
   deactivate the person on its next run) - the UI does not silently reject a
   past date, though it may warn.
5. **Given** a person who is on both the Admin Users and Exception Users lists,
   **When** an expiry date is set on their Exception Users entry, **Then** only
   their Exception (Normal-role) access carries the expiry; their Admin access
   is unaffected.
6. **Given** an Exception User that pre-dates this feature and has no stored
   expiry date, **When** the administrator opens its entry, **Then** they are
   shown "no expiry" and, on their next edit, must set a date to save.

---

### User Story 2 - Nightly automatic deactivation of expired Exception Users (Priority: P1)

Every night, the system checks all active Exception Users. Any whose expiry date
has passed are deactivated, so they lose Exception access (and the locked-year
bypass from feature 020) without an administrator having to act.

**Why this priority**: This is the actual outcome the request asks for -
time-boxed access that enforces itself. It depends on User Story 1 for data but
delivers the security/operational value.

**Independent Test**: Set an Exception User's expiry date to yesterday, run the
nightly check (or wait for its scheduled run), and confirm that person is
deactivated, no longer appears in the Exception Users list, and no longer gets
the locked-year New Item / Bulk Create Items bypass. Confirm an Exception User
with a future date or no date is left untouched.

**Acceptance Scenarios**:

1. **Given** an active Exception User whose expiry date is before "now", **When**
   the nightly check runs, **Then** that person's Exception (Budget Tracker
   Normal-role) membership is deactivated.
2. **Given** an active Exception User whose expiry date is today or in the
   future, **When** the nightly check runs, **Then** that person is left active.
3. **Given** an active Exception User with no expiry date, **When** the nightly
   check runs, **Then** that person is left active.
4. **Given** an Exception User who was deactivated by the nightly check, **When**
   an administrator later views the Exception Users list, **Then** that person no
   longer appears in it (the list shows active members only).
5. **Given** a person with both Admin and Exception access to Budget Tracker
   where only the Exception entry has expired, **When** the nightly check runs,
   **Then** only the Exception membership is deactivated and the person keeps
   Admin access and access to any other module.
6. **Given** the nightly check runs on a night when no Exception User has
   expired, **When** it completes, **Then** nothing is changed and the run is
   recorded as successful.
7. **Given** the nightly check encounters an error while deactivating one person,
   **When** it continues, **Then** the remaining expired Exception Users are
   still processed and the failure is logged.

---

### Edge Cases

- **Expiry boundary**: a person is considered expired once the current time is
  after the **end** of their expiry date (the expiry date is the last full day
  of access), evaluated in the school's local time zone.
- **Re-granting access**: the nightly check only ever deactivates. A person who
  has been auto-deactivated disappears from the Exception Users list (it shows
  active members only). To restore their access an administrator re-adds them
  through the add control, which requires a new expiry date. There is no
  "reactivate" affordance and the nightly check never reactivates anyone.
- **Expiry date on an Admin User**: out of scope. Only Exception (Normal-role)
  Budget Tracker memberships carry an expiry; Admin memberships are never
  auto-deactivated by this feature.
- **Person already inactive**: the nightly check ignores memberships that are
  already inactive; it does not error on them.
- **Malformed or empty stored expiry value**: treated as "no expiry" - the
  person is left active, and the malformed value is logged, not acted on.
- **Clock / run-time**: if the nightly run is missed (system down), the next run
  still deactivates everyone who has expired in the meantime; expiry is not tied
  to being caught exactly on the day it lapses.
- **Time zone of the entered date**: the date the administrator enters is
  interpreted as a calendar date in the school's local time zone, not the
  browser's.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each Exception User (Budget Tracker Normal-role membership) MUST
  carry an **expiry date** stored in that membership's per-user settings.
  Exception Users created before this feature MAY have no stored date; that state
  is treated as "no expiry" until an administrator next edits the entry.
- **FR-002**: A Budget Tracker administrator MUST be able to set the expiry date
  when adding a person to the Exception Users list and to change it afterwards
  from that list, with explicit success and error feedback. The date MUST NOT be
  clearable back to blank once set.
- **FR-002a**: The Exception Users add control (and the re-add flow in FR-011)
  MUST require a valid expiry date and MUST NOT complete the add without one.
- **FR-003**: The Exception Users list MUST display each person's current expiry
  date (or a clear "no expiry" indication).
- **FR-004**: Setting an expiry date MUST NOT affect the same person's Admin
  Users entry or their membership of any other module.
- **FR-005**: An expiry date in the past MUST be accepted and saved (the nightly
  check enforces it); the UI MAY warn but MUST NOT silently discard it.
- **FR-006**: The system MUST run an automated check **every night** that
  evaluates all active Exception Users against their expiry date.
- **FR-007**: The nightly check MUST deactivate every active Exception User whose
  expiry date is before the current time (past the end of the expiry date, local
  time zone).
- **FR-008**: The nightly check MUST leave untouched any Exception User whose
  expiry date is today or later, or who has no expiry date, or whose stored
  expiry value is empty/malformed.
- **FR-009**: Deactivation MUST remove only the person's Exception (Budget
  Tracker Normal-role) access - after deactivation they MUST lose the locked-year
  New Item / Bulk Create Items bypass from feature 020 - while leaving any Admin
  access and any other-module access intact.
- **FR-010**: The nightly check MUST process all expired Exception Users in a
  single run even if one deactivation fails; failures MUST be logged and MUST NOT
  abort the run. A run in which nothing expired MUST complete successfully with
  no changes.
- **FR-011**: After the nightly check auto-deactivates an Exception User, access
  is restored only by an administrator **re-adding** that person through the
  Exception Users add control, which requires a new expiry date (per FR-002a).
  No "reactivate" or "expired" state is shown in the list, and the nightly check
  MUST never reactivate a membership - it only deactivates.
- **FR-012**: The nightly check MUST record enough of its activity (run
  start/finish, which people were deactivated, any failures) to support
  operational review, consistent with how other nightly jobs in the system are
  logged.
- **FR-013**: The nightly check MUST be safe to run more than once in a day
  (manually re-triggered or double-scheduled) without additional effect beyond
  the first run's deactivations.
- **FR-013a**: The nightly check MUST NOT send email or any other notification to
  the affected person or to administrators; its only outputs are the membership
  deactivations and the run log (see FR-012).
- **FR-014**: Access control - only Budget Tracker administrators may set or
  change Exception User expiry dates; the nightly check runs as an unattended
  system process with no interactive user.

### Key Entities *(include if feature involves data)*

- **Exception User membership**: an existing Budget Tracker Normal-role module
  membership (from feature 020). This feature adds one attribute to its per-user
  settings: **expiry date** (a single calendar date). Required for every
  Exception User added or re-added from now on; absent only on memberships that
  pre-date this feature, where absent = "no expiry".
- **Expiry check run (nightly)**: an unattended job that, each night, reads all
  active Exception User memberships, determines which have an expiry date in the
  past, and deactivates those memberships. Produces a log of what it did.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An administrator can set an expiry date while adding an Exception
  User and change it afterwards; after a full screen reload the current date is
  still shown - 100% of add/change operations persist.
- **SC-001a**: The Exception Users add control rejects completion with no expiry
  date in 100% of attempts, and offers no way to blank an existing date.
- **SC-002**: An Exception User whose expiry date is in the past is deactivated
  within one nightly cycle (by the morning after the date lapses, assuming the
  nightly job runs).
- **SC-003**: After auto-deactivation, the person no longer appears in the
  Exception Users list and no longer sees the locked-year item-creation actions -
  verified for 100% of a test cohort.
- **SC-004**: Exception Users with a future expiry date or no expiry date are
  never deactivated by the nightly check (0% false positives across a
  verification run).
- **SC-005**: When a person holds both Admin and Exception access and only the
  Exception entry expires, they retain Admin access and all other-module access
  in 100% of cases.
- **SC-006**: A nightly run on which nothing has expired completes successfully
  and changes no records.

## Assumptions

- The expiry date is a single calendar date per Exception User, stored in the
  existing per-user settings on the Budget Tracker Normal-role membership; no new
  standalone data store is introduced.
- The expiry date is required when adding or re-adding an Exception User
  (Session 2026-09-02 clarification) and cannot later be cleared to blank. Only
  Exception Users created before this feature may have no date; a blank/absent
  value means "no expiry" and the person is never auto-deactivated until an
  administrator edits the entry and supplies a date.
- "Expired" means the current time is after the end of the expiry date in the
  school's configured local time zone; the expiry date itself is the last day of
  access.
- The nightly check reuses the system's existing scheduled-job / worker
  mechanism and its logging, running once per night at a low-traffic hour,
  consistent with other nightly jobs (cleanup, term rolling, expiring-skills,
  expiring credit cards).
- "Deactivate" means marking the Exception (Budget Tracker Normal-role)
  membership inactive - the same state a membership has after an administrator
  removes someone - not deleting the record. History/audit of the membership is
  retained.
- The nightly check does not send email or other notification to the affected
  person or to administrators (confirmed in the Session 2026-09-02
  clarification); it only deactivates and logs. Notification can be added later
  as a separate feature.
- Admin Users are explicitly out of scope for expiry; only Exception Users are
  time-boxed.
- Editing the expiry date reuses the existing Exception Users list UI (from
  feature 020) rather than introducing a separate screen.
- Restoring a wrongly-expired person is done by re-adding them; the list never
  shows inactive/expired memberships, so no inactive-row loading or reactivate
  endpoint is needed.
- All verification commands are run on the Node version pinned in each repo's
  `package.json` (`engines.node`), selected via `nvm`, per the project
  constitution. The nightly check lives in the API service; the expiry-date
  editing lives in the UI service.
- High-risk cross-system verification (the nightly job actually deactivating a
  member and the member losing access) will be validated with a documented
  manual / scheduled-job run because full automation of an overnight cycle is
  impractical.
