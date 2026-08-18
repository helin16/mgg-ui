# Feature Specification: Staff Skill Expiration Management

**Feature Branch**: `013-staff-skill-expiration`  
**Created**: 2026-08-19  
**Status**: Draft  
**Module**: Staff List - Admin (SynergeticUserPermissions)  
**Input**: Bulk skill expiration updates, CSV highlighting, and notification configuration

## Overview

Enhance the Staff List Admin interface to provide comprehensive management of staff skill expiration dates, including:
- Visual identification of expired skills in CSV exports
- Bulk selection and update capabilities for multiple staff members' skill expiration dates
- Configurable notification system to alert staff and administrators of upcoming/past expiration dates

## User Scenarios & Testing

### User Story 1 - Export CSV with Expired Skill Highlighting (Priority: P1)

An administrator needs to download the staff list and quickly identify which staff members have expired skills in their exported CSV file, so they can take corrective action without requiring additional lookups in the UI.

**Why this priority**: Direct user need from original request; minimal dependencies; core value-add to existing export functionality.

**Independent Test**: Admin can export staff list as CSV and visually/programmatically distinguish expired skills in the file.

**Acceptance Scenarios**:

1. **Given** the staff list with mixed skill expiration dates, **When** admin clicks "Export", **Then** the CSV includes all staff data with expired skills visually highlighted or distinctly marked
2. **Given** a CSV export is downloaded, **When** opened in Excel/spreadsheet tool, **Then** expired skill entries are immediately recognizable (e.g., red background, bold text, or prefix marker like "[EXPIRED]")
3. **Given** staff with no expired skills, **When** exported, **Then** their skill entries appear unmarked/normal

---

### User Story 2 - Bulk Selection & Update UI (Priority: P1)

An administrator wants to select multiple staff members and update their skills' expiration dates in one operation, rather than editing each staff member individually, to save time when performing bulk maintenance tasks.

**Why this priority**: Addresses inefficiency in current workflow; enables efficient bulk operations; required for completing the Settings feature workflow.

**Independent Test**: Admin can select 2+ staff, update a skill's expiration date for all selected staff at once, and verify all were updated.

**Acceptance Scenarios**:

1. **Given** the staff list page, **When** checkboxes appear in a new column before the Staff ID, **Then** admin can click each checkbox to select individual staff
2. **Given** one or more staff selected, **When** the selection count becomes > 1, **Then** a "Bulk Update" button appears between the selection checkboxes and the "Export" button
3. **Given** the "Bulk Update" button is clicked, **When** a modal/popup opens, **Then** it displays a dropdown to select skill and a date picker for expiration date
4. **Given** skill and expiration date are selected in the modal, **When** admin clicks "Submit", **Then** all selected staff have that skill's expiration date updated to the selected date
5. **Given** the bulk update completes, **When** the modal closes, **Then** the staff list refreshes and checkboxes are automatically cleared

---

### User Story 3 - Settings Tab for Notification Configuration (Priority: P1)

An administrator wants to configure when and how staff and their supervisors are notified about expiring skills, so notifications reach the right people at the right time with the right information.

**Why this priority**: Core to proactive skill management; multi-faceted configuration (timing, skill filter, recipients) requires dedicated UI; impacts both staff and organizational compliance workflows.

**Independent Test**: Settings are saved and persisted in the module's settings column; can verify each field independently.

**Acceptance Scenarios**:

1. **Given** the Staff List - Admin page, **When** a "Settings" tab is visible alongside existing tabs, **Then** clicking it reveals the notification configuration panel
2. **Given** the Settings tab is open, **When** viewing the panel, **Then** at least four distinct configuration fields are visible and persistent across page refreshes
3. **Given** all settings are configured, **When** admin clicks "Save", **Then** all settings are stored in the module's settings column and a success message is shown

---

### User Story 4 - Initial Notification Timing Configuration (Priority: P1)

An administrator wants to specify how many days before a skill expires a notification should first be sent, so staff have adequate time to renew/plan.

**Why this priority**: Core notification feature; directly addresses business need for advance notice.

**Independent Test**: Setting is saved; notification system respects this value when determining which staff to notify.

**Acceptance Scenarios**:

1. **Given** the Settings tab, **When** viewing configuration, **Then** a numeric input field is displayed labeled "Days before expiration for initial notification"
2. **Given** the field is set to 14, **When** settings are saved, **Then** the value persists and is used by the notification system
3. **Given** a skill expires on a future date, **When** the expiration date minus this setting equals today, **Then** a notification is sent to the staff

---

### User Story 5 - Ongoing Notification Frequency Configuration (Priority: P1)

An administrator wants to specify how often reminders are sent after the initial notification, continuing even after expiration, so staff and supervisors are persistently reminded until the skill is renewed.

**Why this priority**: Ensures staff don't miss skill renewal; supports compliance tracking; affects ongoing notification delivery.

**Independent Test**: Setting is saved; notification scheduler respects this value for follow-up notifications.

**Acceptance Scenarios**:

1. **Given** the Settings tab, **When** viewing configuration, **Then** a numeric input field is displayed labeled "Number of days between follow-up notifications (send daily after this interval)" or similar
2. **Given** the field is set to 7, **When** settings are saved, **Then** the value persists
3. **Given** a skill has expired and initial notification was sent, **When** 7 days have passed since the last notification, **Then** another notification is sent, repeating daily at 11:59 PM until the skill expiration date is updated
4. **Given** a skill expires and follow-up notifications are configured, **When** a new expiration date is set (e.g., via bulk update), **Then** the notification cycle restarts

---

### User Story 6 - Skill Filter Configuration for Notifications (Priority: P1)

An administrator wants to select which specific skills trigger expiration notifications, so notifications focus only on critical skills and avoid alert fatigue from less important skill categories.

**Why this priority**: Enables targeted notification strategy; reduces noise; directly requested feature; multi-select dropdown is complex and deserves acceptance coverage.

**Independent Test**: Only staff with expiring skills in the selected list receive notifications.

**Acceptance Scenarios**:

1. **Given** the Settings tab, **When** viewing configuration, **Then** a multi-select dropdown is displayed labeled "Skill codes to monitor for expiration notifications" or similar
2. **Given** the dropdown is opened, **When** clicking items, **Then** multiple skills can be selected; all can also be cleared
3. **Given** skills are selected (e.g., "CPR", "First Aid", "Leadership"), **When** settings are saved, **Then** only staff with those skills in their expiring list trigger notifications
4. **Given** no skills are selected, **When** settings are saved, **Then** notifications are disabled (or all skills are monitored — document assumption)

---

### User Story 7 - Notification Recipients & Email Distribution (Priority: P2)

An administrator and individual staff members receive notifications at the correct email addresses in the correct format, so they are informed without manual intervention.

**Why this priority**: Depends on Skills configuration and notification timing; coordination between individual and bulk recipients is important; supports accessibility and role-based communication.

**Independent Test**: Staff receive notifications at their occpEmail; supervisors receive bulk summaries; email filtering/delivery can be verified in logs.

**Acceptance Scenarios**:

1. **Given** a skill is expiring for multiple staff, **When** notification time is triggered, **Then** each individual staff member receives an email at their occpEmail address
2. **Given** notification is sent, **When** the email arrives, **Then** it contains that staff member's expiring skill details (e.g., skill code, current expiration date)
3. **Given** multiple staff have expiring skills in the same notification cycle, **When** an administrator email is configured in settings, **Then** they receive one summary email with all expiring staff listed as rows and skills as columns
4. **Given** multiple nominated emails are configured (separated by ";"), **When** notification is sent, **Then** all nominated addresses receive the bulk summary email
5. **Given** notifications are ongoing for Active Staff only, **When** a staff member's status changes to Inactive, **Then** they no longer receive notifications

---

### Edge Cases

- What happens when a skill has no expiration date set for a staff member? (Assumption: skill is not included in notifications)
- What happens when the initial notification interval is set to 0 or negative days? (Assumption: validation prevents invalid values; default to 1 if not specified)
- How are follow-up notifications handled if the notification interval is set to 0? (Assumption: treated as "no follow-up"; only initial notification sent)
- What happens if no skills are selected in the Skill codes dropdown? (Assumption: document behavior — either disable notifications or monitor all skills)
- **What if a nominated email address is invalid or bounces?** (Clarified: Error logged; no retry attempted; delivery is lossy. Admin should validate email addresses on save via UI validation)
- What happens if a staff member is deleted while awaiting a notification? (Assumption: notification is skipped gracefully; no error)
- What happens if the system time changes (e.g., DST transition)? (Assumption: notifications scheduled at 11:59 PM are not missed; use server time, not client time)
- Can a staff member's own occpEmail be included in the nominated emails list? (Assumption: yes, no de-duplication; email system handles any redundancy)

## Requirements

### Functional Requirements

**FR-001**: CSV Export MUST include a visual or textual marker on skill expiration date cells where the date is in the past relative to today's date, so expired skills are immediately identifiable in the exported file

**FR-002**: The staff list table MUST include a new checkbox column positioned immediately before the Staff ID column, allowing individual staff selection

**FR-003**: When one or more staff are selected (checkbox count > 0), a "Bulk Update" button MUST be displayed immediately before the "Export" button, positioned visibly to the user

**FR-004**: When the "Bulk Update" button is clicked, a modal/popup MUST appear with:
  - A dropdown to select a skill code
  - A date picker to select an expiration date
  - A "Submit" button to apply the update
  - A "Cancel" button to dismiss the modal

**FR-005**: When "Submit" is clicked in the bulk update modal, the system MUST update the selected skill's expiration date for all selected staff to the chosen date, then close the modal and clear all checkboxes

**FR-006**: The Staff List - Admin interface MUST include a "Settings" tab that provides access to notification configuration

**FR-007**: The Settings tab MUST include a numeric input field for "Initial notification interval in days" (how many days before expiration the first notification is sent)

**FR-008**: The Settings tab MUST include a numeric input field for "Follow-up notification frequency in days" (interval between follow-up notifications sent daily at 11:59 PM, continuing until the skill expiration date is updated)

**FR-009**: The Settings tab MUST include a multi-select dropdown for "Skill codes to monitor for expiration notifications", allowing users to select/deselect any combination of skills and clear all selections

**FR-010**: All settings values MUST be persisted in the module's settings column and retrieve on page load, so configuration survives page refreshes and user sessions

**FR-011**: The notification system MUST send individual notifications to staff at their occpEmail address when a skill expiration is triggered

**FR-012**: The notification system MUST send a bulk summary email to all nominated email addresses (separated by ";") listing all staff with expiring skills, with skills represented as columns and staff as rows

**FR-013**: Notifications MUST only be sent for Active Staff (status = Active), and notifications MUST cease if a staff member's status changes to Inactive

**FR-014**: When a skill's ExpiryDate field is updated via bulk update or any other means, the notification timing cycle MUST reset (i.e., the next notification is recalculated based on the new date and initial notification interval); changes to other skill fields (SkillLevel, Comment) do not trigger reset

**FR-015**: The route `/modules/remote/staff-list-admin` MUST be protected by `ModuleAccessWrapper` with the appropriate module ID for access control

**FR-016**: All async operations (bulk update, settings save, CSV export) MUST display appropriate loading, success, and error states to the user

**FR-017**: Specification MUST identify service-layer contract changes required in `src/services/Synergetic/*` and corresponding types in `src/types/Synergetic/*`

**FR-018**: Specification MUST define expected error handling for failed notifications, invalid email addresses, and API errors

### Service Layer Requirements

**FR-019**: A new or updated service method MUST exist to fetch the current module settings for skill expiration notifications (or retrieve from existing settings store)

**FR-020**: A new or updated service method MUST exist to update module settings for skill expiration notifications

**FR-021**: A new or updated service method MUST exist to bulk update skill expiration dates for multiple staff at once

**FR-022**: A service method or scheduled task MUST exist to check for skills reaching their notification trigger dates and send notifications accordingly

**FR-023**: Email sending infrastructure MUST support individual staff notifications and bulk administrator notifications with configurable recipient lists

**FR-024**: The Settings tab MUST include configurable email template fields for individual notification email subject, individual notification email body, bulk notification email subject, and bulk notification email body

**FR-025**: All email templates MUST support variable substitution with placeholders like `{staffName}`, `{skillCode}`, `{expirationDate}`, `{occpEmail}` for individual notifications and `{expiringStaffTable}` for bulk notifications

**FR-026**: When notification email sending fails (invalid recipient, SMTP error, API timeout), the error MUST be logged at WARN level with full context (recipient, skill, staff ID, error details) and the notification cycle MUST continue for other recipients; no automatic retry is attempted

**FR-027**: When substituting variables in email templates (e.g., `{staffName}`, `{skillCode}`), all variables MUST be HTML-escaped in HTML email bodies to prevent XSS injection; plain text email bodies require no escaping

**FR-028**: Notification deduplication MUST track sent notifications by (staffId, skillCode, expirationDate, notificationDate) tuples to prevent duplicate emails for unchanged expiring skills on the same day

**FR-029**: When multiple skills are expiring for the same staff on the same notification trigger date, all expiring skills for that staff MUST be batched into a single email (listing all expiring skills in that one message), not multiple separate emails

**FR-030**: Notification activity MUST be logged to application logs at INFO level (successful sends, recipient addresses, skill details) and WARN level (send failures, validation errors); no persistent notification log database table is required; logs rotate per standard application log retention policy

### Key Entities

- **Staff**: Core entity with `staffId`, `occpEmail`, `status` (Active/Inactive), and associated skills/expiration dates
- **Skill**: Entity with `skillCode`, `skillName`, `expirationDate` (per staff member)
- **Module Settings**: Configuration stored against the module, including:
  - `initialNotificationDays` (integer) — days before expiration for first notification
  - `followUpNotificationDays` (integer) — days between follow-up notifications sent daily at 11:59 PM
  - `monitoredSkillCodes` (array of skill codes) — which skills trigger notifications
  - `skillExpirationNotificationEmails` (string with ";" separator) — nominated admin/supervisor emails receiving bulk summary
  - `individualNotificationEmailSubject` (string template) — email subject for individual staff notifications
  - `individualNotificationEmailBody` (string template) — email body for individual staff notifications  
  - `bulkNotificationEmailSubject` (string template) — email subject for bulk admin/supervisor notifications
  - `bulkNotificationEmailBody` (string template) — email body for bulk admin/supervisor notifications
- **Notification Log**: (Optional) track sent notifications to prevent duplicates and support audit trail

## Success Criteria

### Measurable Outcomes

- **SC-001**: Administrators can export CSV with expired skills highlighted and visually identify expiration status within 5 seconds of opening the file
- **SC-002**: Bulk update operation completes in under 3 seconds for up to 50 selected staff
- **SC-003**: Notification configuration UI loads in under 2 seconds and persists all settings without data loss
- **SC-004**: Individual staff notifications are sent within 1 hour of the configured trigger time (initial notification and follow-ups)
- **SC-005**: Bulk administrator notifications include all expiring staff with complete skill information and are sent to all nominated email addresses within 1 hour of trigger time
- **SC-006**: 100% of Active Staff with expiring monitored skills receive notifications; 0 notifications are sent to Inactive staff
- **SC-007**: Skill expiration notification cycle correctly resets after bulk update or manual expiration date change (next notification recalculated)
- **SC-008**: Administrators report time saved on skill expiration management workflow reduced by at least 50% compared to pre-bulk-update manual process
- **SC-009**: Email notification delivery is best-effort: sent without retry; failures are logged at WARN level; admin is responsible for validating email addresses in settings and monitoring logs for delivery failures

## Assumptions

- **Email Infrastructure**: The application has access to a mail service for sending individual and bulk notifications; SMTP configuration is available and email sending is proven functional elsewhere in the app
- **Module Access Control**: The `ModuleAccessWrapper` and module ID constants are already defined in the codebase; only new route mapping is required
- **Staff Data Availability**: The Synergetic API provides skill expiration data and staff status/email information; no new data source integration is required
- **Skill Codes**: Skill codes are fixed/enumerated and available via Synergetic API; the multi-select dropdown can be populated from an existing service method
- **Settings Storage**: The module settings column exists and is accessible via existing service methods; no database schema changes are required
- **Active/Inactive Status**: Staff status is consistently tracked and available as a boolean or enum; filtering by Active status is straightforward
- **Notification Timing**: The application has a scheduled task/cron system in place to trigger notifications at the configured times; implementation will use existing notification scheduler
- **Date & Time**: All dates are handled in server time (not client-dependent); 11:59 PM refers to server timezone
- **Backup & Audit**: No special audit logging is required beyond standard application logging; notification sending is logged at INFO level
- **Mobile/Responsive**: Initial implementation targets desktop/web admin interface; mobile optimization is out of scope for v1
- **Bulk Update Limit**: There is no specified limit on the number of staff that can be selected for bulk update; assume system can handle at least 50 in a reasonable timeframe
- **Nominated Emails Validation**: Email addresses in the "nominated emails" field are validated on save; invalid addresses are rejected or flagged to the user
- **Notification Preferences**: Staff cannot opt out of skill expiration notifications; all notifications are mandatory for Active staff

## Clarifications Resolved

**Previous Clarifications**:

**Q1 - Nominated Emails Field Name & Storage**: ✅ RESOLVED  
Confirmed field name: `skillExpirationNotificationEmails` (new module settings field for nominated admin/supervisor emails receiving bulk summary notifications)

**Q2 - Skill Expiration Date Column in CSV Export**: ✅ RESOLVED  
CSV export includes all currently selected/visible columns from the staff list table display. Highlighting of expired skills applies to any skill expiration date column(s) visible in the current table view.

**Q3 - Follow-up Notification Behavior After Expiration**: ✅ RESOLVED  
Follow-up notifications continue daily at 11:59 PM indefinitely after the initial notification, even after the skill expiration date passes, until the skill expiration date is updated (which triggers a cycle reset).

**Q4 - Email Template Configuration**: ✅ IDENTIFIED AS NEW REQUIREMENT  
Users need to configure email subject and body templates for both individual staff notifications and bulk administrator notifications, with support for variable substitution (e.g., `{staffName}`, `{skillCode}`, `{expirationDate}`, `{occpEmail}`).

### Session 2026-08-19

- Q: What should happen when a notification email fails to send (e.g., invalid recipient, SMTP timeout, API error)? → A: Log the error and skip; do not retry (accept lossy delivery)
- Q: How should the system handle special characters or HTML/script content in email template variables (e.g., staff name with "<script>" in it)? → A: Always HTML-escape all variables in HTML email bodies; plain text emails need no escaping
- Q: What should happen if a skill's expiration date has not changed since the last scheduled run — resend or skip? → A: Skip duplicates per (staffId, skillCode, expirationDate) tuple; **but batch all expiring skills for the same staff into ONE email per day**
- Q: Which updates to a skill should trigger the notification cycle reset? → A: Only ExpiryDate field changes trigger reset; other skill metadata fields (SkillLevel, Comment, etc.) do not
- Q: How long should notification logs be retained? → A: No persistent database log required; use application logs only (INFO/WARN level), rotating per standard policy

---

## Acceptance Criteria Summary

1. **Bulk Selection & Update**: Admin can select 2+ staff, bulk update a skill expiration date in <3 seconds, all selected staff reflect the change
2. **CSV Export with Highlighting**: Exported CSV visually marks expired skills; admin can identify status within 5 seconds
3. **Settings Configuration**: All notification settings fields (timing, skills, emails, templates) are present, saveable, and persistent
4. **Individual Notifications**: Staff with expiring monitored skills receive emails at occpEmail within 1 hour of trigger
5. **Bulk Administrator Notifications**: Admin emails receive summary of all expiring staff (rows) × skills (columns) within 1 hour of trigger
6. **Active Staff Only**: Inactive staff do not receive notifications; status change triggers notification eligibility update
7. **Notification Cycle Reset**: Manual or bulk update of expiration date recalculates next notification based on initial interval
8. **Access Control**: Feature is protected by module access control; only authorized admins can access
9. **Performance**: All operations complete within specified timeframes; system handles 50+ selected staff without significant delay
10. **Error Handling**: Failed notifications, invalid settings, and API errors are handled gracefully with user-facing error messages

