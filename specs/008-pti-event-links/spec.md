# Feature Specification: Parent Teacher Interview Event Links

**Feature Branch**: `008-pti-event-links`  
**Created**: 2026-06-29  
**Status**: Draft  
**Input**: User description: "$speckit-specify can you have a read of ../mggs-api 's 004 feature:
1. we need to create services and types to cover these new endpoints in the API
2. similar to `StaffListPage`, we need to create a new SchoolBox Page and Admin Page for this new Module
2.1: list all the active Staff who is `Teaching Staff` with  filters: input to search for Staff ID or name and a dropdown to filter categories
2.2: use `src/components/common/Table.tsx` with hover, responsive and `striped`
2.3: the first column of the staff table is a checkbox, and the `Check All/ uncheckAll` checkbox for the Theader, which allows the user to select multiple staff of creating `Parent-teacher-interview`.
2.4: after admin user selected the staff and click on 'Next', another table will be shown with columns: ID, Staff Name, Staff Code, `Parent-teacher-interview Starting Date time` and `Parent-teacher-interview End Datetime`, the `starting Datetime` and the `end datetime` are compulsory and `endDateTime` needs to be later or eq to `startingDateTime`
2.5: after user provides all the StartingDateTIme and EndDateTime, the user then can click on the submission btn `create event links for {number of selected} staff`"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select eligible teaching staff (Priority: P1)

An authorized Parent Teacher Interview module user can open the new SchoolBox page,
filter active teaching staff, and select one or more staff members for parent-teacher
interview event-link creation.

**Why this priority**: Staff selection is the front door of the workflow. Without it,
there is no usable bulk scheduling flow.

**Independent Test**: Open the Parent Teacher Interview SchoolBox page as an authorized
user, filter the staff list by name or staff ID and category, select several rows through
individual and header checkboxes, and confirm only active teaching staff can be chosen.

**Acceptance Scenarios**:

1. **Given** an authorized user opens the Parent Teacher Interview SchoolBox page,
   **When** the staff list loads, **Then** the page shows active staff whose role is
   Teaching Staff and excludes inactive or non-teaching staff.
2. **Given** the staff list is visible, **When** the user enters part of a staff ID or
   staff name, **Then** the page narrows the visible rows to staff whose ID or name
   matches the search text.
3. **Given** the staff list is visible, **When** the user chooses a category from the
   category filter, **Then** the page narrows the visible rows to staff in that category.
4. **Given** filtered staff rows are visible, **When** the user checks the header
   checkbox, **Then** all currently visible rows become selected, and **When** the user
   unchecks it, **Then** all currently visible rows become unselected.
5. **Given** no staff rows are selected, **When** the user attempts to continue,
   **Then** the page keeps the user on the staff-selection step and shows that at least
   one staff member must be selected.

---

### User Story 2 - Enter interview schedule details for selected staff (Priority: P1)

An authorized Parent Teacher Interview module user can move selected staff into a second
step and provide the required interview start and end datetimes for each selected staff
member before creating event links.

**Why this priority**: The create request cannot be submitted without a valid time window
for every selected staff member.

**Independent Test**: Select multiple staff members, continue to the schedule step, enter
valid start and end datetimes for each row, and confirm the form blocks missing or invalid
time ranges.

**Acceptance Scenarios**:

1. **Given** one or more staff members are selected, **When** the user clicks `Next`,
   **Then** the page shows a schedule-entry table containing one row per selected staff
   member.
2. **Given** the schedule-entry table is visible, **When** the user reviews a row,
   **Then** the row shows the staff ID, staff name, staff code, start datetime input, and
   end datetime input for that selected staff member.
3. **Given** a selected staff row has a blank start datetime or blank end datetime,
   **When** the user attempts to submit the create action, **Then** the page blocks
   submission and marks the missing value as required.
4. **Given** a selected staff row has an end datetime earlier than the start datetime,
   **When** the user attempts to submit the create action, **Then** the page blocks
   submission and shows that the end datetime must be the same as or later than the start
   datetime.
5. **Given** the user has returned to the schedule-entry step after editing selection,
   **When** previously removed staff are no longer selected, **Then** they do not appear
   in the schedule-entry table.
6. **Given** the schedule-entry table contains one or more selected staff rows,
   **When** the user provides a valid datetime range for a row, **Then** the page can
   retrieve that staff member's existing calendar events for the same range before create
   submission so the user can review likely conflicts or existing bookings.
7. **Given** a selected staff row has both valid datetimes, **When** the user finishes
   entering or updating that row's datetime values, **Then** the page automatically
   refreshes that row's existing-event results without requiring a separate retrieval
   button.

---

### User Story 3 - Create event links and review outcomes (Priority: P2)

An authorized Parent Teacher Interview module admin can submit event-link creation for the
selected staff and review the per-staff results returned by the calendar-event API.

**Why this priority**: Event-link creation is the business outcome, but it depends on
successful selection and schedule entry first.

**Independent Test**: Complete the two-step flow with multiple selected staff, submit the
create action, and confirm the page returns a per-staff result for each selected staff
member, including any created or existing Teams meeting link.

**Acceptance Scenarios**:

1. **Given** every selected staff row has valid datetimes, **When** the user clicks
   `create event links for {number of selected} staff`, **Then** the page submits one
   create request per selected staff member and prevents duplicate submission while the
   requests are in progress.
2. **Given** a create request succeeds for a selected staff member, **When** the result is
   returned, **Then** the page shows that staff member's success outcome and the returned
   meeting link when one is available.
3. **Given** the API returns that a matching event already exists for a selected staff
   member, **When** the result is returned, **Then** the page shows a non-creation outcome
   for that staff member and any returned existing meeting link.
4. **Given** one selected staff member fails while others succeed, **When** the results
   are returned, **Then** the page shows independent outcomes per staff member and does not
   lose the successful results.
5. **Given** the create requests complete, **When** the user remains on the page,
   **Then** the selected-staff count, result rows, and any failure reasons remain visible
   long enough for the user to review them without re-running the workflow.

---

### User Story 4 - Reach the module through restricted SchoolBox and admin surfaces (Priority: P3)

An authorized user can access the new Parent Teacher Interview SchoolBox page, and an
authorized admin can open the matching admin page shell for the module using the same page
pattern already used by Staff List.

**Why this priority**: The workflow must be reachable through the existing module and
navigation model, but the core value still sits in the staff-selection and create flow.

**Independent Test**: Open the new Parent Teacher Interview module route through
SchoolBox, confirm the page renders inside the module-gated page shell, and confirm the
admin surface is reachable for an authorized admin.

**Acceptance Scenarios**:

1. **Given** a user has Parent Teacher Interview module access, **When** the user opens
   the new SchoolBox route for this module, **Then** the system renders the page in the
   standard module page shell using the same restricted-access pattern as Enrolments.
2. **Given** a user lacks Parent Teacher Interview module access, **When** the user opens
   the same route, **Then** the system applies the existing module-access denial behavior.
3. **Given** an authorized admin opens the module's admin entry point, **When** the page
   loads, **Then** the system renders the matching admin page shell for the same module and
   limits that admin surface to module admins only.
4. **Given** a module user who is not a module admin reaches the schedule step,
   **When** the page shows the create action area, **Then** the page clearly indicates that
   event-link creation requires module-admin access and does not allow submission.

### Edge Cases

- The staff query returns no active Teaching Staff rows for the current filters.
- The user filters the table, selects all visible rows, then changes the filters so the
  visible result set changes.
- The user leaves the schedule step with partial datetime input and then changes the staff
  selection.
- The user enters a valid datetime range for a selected staff row but the retrieval request
  returns no existing events.
- The user enters a valid datetime range for a selected staff row but the retrieval request
  fails while create remains unavailable for that row until the user retries or changes the
  data.
- The user updates a row's datetime after previously loaded events were shown and the page
  must replace stale retrieval results with a fresh load for that same row.
- The API returns a mix of `CREATED`, `EXISTS`, and `FAILED` outcomes across the same bulk
  submission.
- The returned result does not include a meeting link even though the request succeeded.
- The user refreshes the page after submission and loses any unsaved selection or datetime
  entries.
- The API is available for event creation but returns a validation or permission failure
  for one or more staff members.
- The module settings exist but only one of `subject` or `bodyText` is populated.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST expose a new Parent Teacher Interview SchoolBox page and a
  matching Parent Teacher Interview admin page using the same page-shell pattern currently
  used by `StaffListPage` and `StaffListAdminPage`.
- **FR-002**: The system MUST add a new Parent Teacher Interview entry route in
  `SchoolBoxRouter` for the new SchoolBox page and wire that route through the same
  restricted-access `ModuleAccessWrapper` pattern used by `EnrolmentManagementPage`.
- **FR-002A**: The route constant MUST be `SchoolBoxUrls.ParentTeacherInterview` with the
  path `/parentTeacherInterview`.
- **FR-003**: The system MUST gate both page surfaces behind the Parent Teacher Interview
  module's existing access rules, including standard denied-access behaviour for
  unauthorized users.
- **FR-003A**: The module constant used by the route, page shell, admin page, and module
  settings editor MUST be `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24`.
- **FR-004**: The SchoolBox page MUST be available only to users who pass Parent Teacher
  Interview module access checks, matching the access pattern used by Enrolments, and the
  page MUST show the existing module-access denial behaviour when access is denied.
- **FR-005**: The page MUST use the shared `Page` shell pattern so the admin entry remains
  discoverable from the main page while the matching admin page is separately restricted to
  module admins only, consistent with the Enrolments page/admin split.
- **FR-005A**: The admin page MUST define a real settings-management purpose for this
  module by allowing module admins to manage the event subject and body used by create
  requests.
- **FR-006**: The staff-selection step MUST source staff rows from the existing Synergetic
  staff data pattern and MUST treat `SynLuDepartmentCodes.TS` as the source-of-truth rule
  for Teaching Staff eligibility.
- **FR-007**: The staff-selection step MUST list only active staff whose staff role is
  Teaching Staff.
- **FR-008**: The staff-selection step MUST provide a text search that matches staff ID or
  staff name.
- **FR-009**: The staff-selection step MUST provide a category filter that limits the
  visible rows to the chosen staff category.
- **FR-009A**: The category filter MUST source its options from `SynLuStaffCategory`
  records loaded through the existing staff-category lookup service.
- **FR-010**: The staff-selection table MUST use the existing shared table presentation for
  hover, responsive layout, and striped rows so the page remains visually consistent with
  current table-driven module pages.
- **FR-011**: The first column of the staff-selection table MUST be row-selection
  checkboxes, and the table header MUST provide a checkbox that selects or unselects all
  rows currently shown in the staff table.
- **FR-012**: The system MUST preserve row selection as the user searches or filters unless
  the user explicitly clears that selection.
- **FR-013**: The system MUST block progression to the schedule-entry step until at least
  one staff member is selected.
- **FR-014**: After the user clicks `Next`, the system MUST show a second step containing
  one row per selected staff member.
- **FR-015**: Each schedule-entry row MUST show the selected staff member's ID, name, and
  staff code alongside required start datetime and end datetime fields.
- **FR-016**: The UI MUST display and validate schedule-entry datetimes in the browser's
  local timezone and MUST serialize those datetimes consistently when calling the API.
- **FR-017**: The system MUST require both the start datetime and end datetime for every
  selected staff member before any retrieval or create request can be submitted.
- **FR-018**: The system MUST reject any schedule-entry row whose end datetime is earlier
  than its start datetime.
- **FR-019**: The system MUST reject any create attempt whose selected start datetime is in
  the past according to the browser-local timezone view shown to the user.
- **FR-020**: The page MUST use the calendar retrieval endpoint as part of the v1 workflow
  so users can review existing events for the selected staff and chosen datetime range
  before create submission.
- **FR-021**: The retrieval flow MUST submit one calendar-events request per selected staff
  member and retain the returned event list, empty result, or retrieval failure per staff
  row.
- **FR-021A**: The retrieval flow MUST automatically trigger for a selected row when both
  datetime fields for that row become valid or when a previously valid row's datetime range
  changes.
- **FR-021B**: The schedule step MUST render retrieval results inline for each selected
  row, using either a compact existing-events table or an inline empty/error/loading state
  directly beneath that row.
- **FR-022**: The page MUST not allow create submission for a selected staff row until that
  row has a valid datetime range and its retrieval state is either successfully loaded or
  intentionally acknowledged as empty.
- **FR-023**: The primary create action MUST display the selected-staff count using the
  label `create event links for {number of selected} staff`.
- **FR-024**: The system MUST create a focused UI service layer and matching types in
  `src/services/*` and `src/types/*` that cover the new Parent Teacher Interview calendar
  retrieval and calendar-event creation endpoints introduced by `../mggs-api` feature 004.
- **FR-025**: The service and type additions MUST cover the retrieval response for an
  individual staff member's existing calendar events and the create response for a single
  staff member's event-link outcome.
- **FR-026**: The create flow MUST submit one create request per selected staff member and
  retain per-staff outcomes from the API response.
- **FR-027**: The create flow MUST show explicit async states for loading the staff list,
  loading category options, loading retrieval results, advancing between steps, submitting
  create requests, successful completion, empty results, validation failures, and API
  failures.
- **FR-028**: While create requests are in progress, the system MUST prevent duplicate
  submissions from the same page state.
- **FR-029**: The post-submit view MUST show each selected staff member's outcome,
  including success, existing-event, or failure status, and any returned meeting link or
  failure reason.
- **FR-030**: The system MUST preserve successful per-staff results even when one or more
  other selected staff members fail.
- **FR-031**: The system MUST obtain the event subject and body text from Parent Teacher
  Interview module settings so all created events use the same configured content.
- **FR-031A**: The module settings structure MUST be
  `module.settings.parentTeacherInterviewCalendar.subject` and
  `module.settings.parentTeacherInterviewCalendar.bodyText`.
- **FR-032**: The page MUST block create submission when the required subject or body
  module settings are missing or blank and MUST surface that configuration problem to the
  user.
- **FR-032A**: The admin page MUST treat both `subject` and `bodyText` as required fields
  before saving or updating those module settings.
- **FR-032B**: For module users who are not module admins, the page MUST keep the create
  action unavailable and show a clear explanation that event-link creation requires
  Parent Teacher Interview module-admin access.
- **FR-033**: The system MUST treat returned meeting links as operational data shown only
  to users who already have Parent Teacher Interview module access and MUST NOT introduce
  new environment variables, browser storage requirements, uploads, or payment handling.

### Key Entities *(include if feature involves data)*

- **Eligible Teaching Staff Row**: A selectable active staff member whose role is Teaching
  Staff and whose row exposes staff ID, display name, staff code, and category for
  filtering and selection.
- **Staff Category Filter**: The selectable category value used to narrow the visible staff
  list without changing the underlying staff source, using `SynLuStaffCategory` option
  values.
- **Selected Staff Schedule Entry**: The row-level working state that pairs one selected
  staff member with a required start datetime and end datetime before submission.
- **Staff Calendar Retrieval State**: The per-staff state that tracks whether existing
  calendar events for the selected datetime range are loading, empty, available, or failed
  before create submission.
- **Inline Existing Events View**: The compact per-row schedule-step presentation that shows
  loading, empty, error, or existing-event details immediately beneath the selected staff
  row after retrieval.
- **Calendar Events Response**: The service-layer representation of the API response that
  returns one staff member's existing calendar events for a requested time range.
- **Create Event Link Result**: The per-staff result returned after an event-link create
  request, including outcome, audit reference, optional meeting link, and optional failure
  reason.
- **Parent Teacher Interview Module Settings**: The module-scoped configuration that holds
  the default event subject and body used for all created events in this workflow under the
  `parentTeacherInterviewCalendar` settings key.
- **Parent Teacher Interview Module Surface**: The new SchoolBox page and admin page entry
  points that expose this workflow inside the UI's existing module navigation model.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In manual validation, an authorized user can locate and select the intended
  staff members for a typical interview batch of 10 staff in under 3 minutes using search,
  category filtering, and header selection.
- **SC-002**: 100% of attempted submissions with missing datetimes or an end datetime
  earlier than the start datetime are blocked before create requests are sent.
- **SC-003**: In manual validation, the system returns and displays a per-staff outcome for
  100% of submitted staff rows in a batch, including mixed success and failure batches.
- **SC-004**: In manual validation, an authorized admin can complete the full flow from
  staff selection to create submission for a valid batch without leaving the module page.
- **SC-005**: In sampled validation, duplicate button presses during an in-flight create
  submission do not trigger duplicate create requests from the same page state.

## Assumptions

- The API work in `../mggs-api` feature `004-azure-calendar-delegation` is available to
  the UI before implementation begins.
- The Parent Teacher Interview module already has, or will receive as part of integration,
  a module identifier and SchoolBox route that can be wired into the existing page-shell
  and admin-page patterns.
- Active teaching-staff rows and category values can be sourced through existing UI data
  patterns for Synergetic staff and staff-category lookup data.
- This first UI iteration focuses on bulk selection, per-staff retrieval review, schedule
  entry, and event-link creation; editing event subject/body text, reviewing full calendar
  history beyond the selected window, and canceling created events are out of scope.
- The subject and body text required by the create endpoint are sourced from Parent Teacher
  Interview module settings rather than editable user input in this workflow.
