# Data Model: Parent Teacher Interview Event Links

**Feature**: [Parent Teacher Interview Event Links](spec.md) | **Plan**: [plan.md](plan.md)  
**Date**: 2026-06-29

## Entity Definitions

### iParentTeacherInterviewSelectableStaffRow

**Purpose**: Represents one selectable active teaching-staff row shown in the first-step table.

**Fields**:
- `StaffID` (number)
- `StaffNameInternal` (string)
- `StaffPreferredName` (string)
- `SchoolStaffCode` (string)
- `StaffDepartment` (string)
- `StaffCategory` (string)
- `StaffCategoryDescription` (string)
- `ActiveFlag` (boolean)
- `StaffOccupEmail` (string)

**Validation Rules**:
- `ActiveFlag` must be `true`
- `StaffDepartment` must equal `SynLuDepartmentCodes.TS`
- `StaffID` must be unique within the table
- `StaffNameInternal` or a meaningful display-name fallback must be available for rendering

**Relationships**:
- Selected into zero or one `iParentTeacherInterviewScheduleRow`
- May later map to one `iParentTeacherInterviewCalendarEventsResponse`
- May later map to one `iParentTeacherInterviewCreateCalendarEventResponse`

---

### iParentTeacherInterviewStaffSearchCriteria

**Purpose**: Captures the first-step filter state.

**Fields**:
- `searchText` (string)
- `categoryCodes` (string[])

**Validation Rules**:
- `searchText` may be blank
- `categoryCodes` may be empty
- Search matches staff ID when numeric and staff name when textual

---

### iParentTeacherInterviewScheduleRow

**Purpose**: Represents one selected staff member in the second-step schedule table.

**Fields**:
- `staffId` (number)
- `staffName` (string)
- `staffCode` (string)
- `startDateTime` (string | null)
- `endDateTime` (string | null)
- `retrievalStatus` (`IDLE | LOADING | READY | EMPTY | FAILED`)
- `retrievalMessage` (string | null)
- `events` (`iParentTeacherInterviewCalendarEventSummary[]`)
- `isSelected` (boolean)

**Validation Rules**:
- `startDateTime` is required before retrieval/create
- `endDateTime` is required before retrieval/create
- `endDateTime` must be same as or later than `startDateTime` for retrieval eligibility
- `endDateTime` must be later than `startDateTime` for create eligibility because the API rejects same-time create windows
- `startDateTime` must not be in the past for create eligibility

**State Transitions**:
```text
IDLE -> LOADING -> READY
                -> EMPTY
                -> FAILED
```

**Notes**:
- Retrieval is row-scoped, not page-scoped.
- A row can remain selected while retrieval is retried after failure.

---

### iParentTeacherInterviewCalendarEventSummary

**Purpose**: Mirrors one existing calendar event returned from the API for operator review.

**Fields**:
- `id` (string)
- `subject` (string)
- `startDateTime` (string)
- `endDateTime` (string)
- `organizer.name` (string)
- `organizer.address` (string)
- `isOnlineMeeting` (boolean | null)
- `teamsJoinUrl` (string | null)

**Validation Rules**:
- `id`, `subject`, `startDateTime`, `endDateTime`, and `organizer` must be present
- `startDateTime` and `endDateTime` must be valid datetime strings

---

### iParentTeacherInterviewCalendarEventsResponse

**Purpose**: Represents the typed response for one retrieval request.

**Fields**:
- `staffId` (number)
- `staffOccupEmail` (string)
- `startDateTime` (string)
- `endDateTime` (string)
- `events` (`iParentTeacherInterviewCalendarEventSummary[]`)

**Validation Rules**:
- `staffId` must match the row that requested retrieval
- `events` may be empty

---

### iParentTeacherInterviewCreateCalendarEventRequest

**Purpose**: Represents one create request sent for one selected staff member.

**Fields**:
- `staffId` (number)
- `subject` (string)
- `bodyText` (string)
- `startDateTime` (string)
- `endDateTime` (string)

**Validation Rules**:
- `subject` and `bodyText` must come from module settings and be non-blank
- `startDateTime` and `endDateTime` must include explicit timezone offset information
- `endDateTime` must be later than `startDateTime`

---

### iParentTeacherInterviewCreateCalendarEventResponse

**Purpose**: Represents one per-staff create outcome returned by the API.

**Fields**:
- `staffId` (number)
- `staffOccupEmail` (string)
- `outcome` (`CREATED | EXISTS | FAILED`)
- `auditMessageId` (string)
- `event` (`iParentTeacherInterviewCalendarEventSummary | null`)
- `failureCategory` (`VALIDATION | PERMISSION | TARGET_INELIGIBLE | GRAPH | null`)
- `message` (string)

**Validation Rules**:
- `auditMessageId` must always be present
- `event` may be `null` for `FAILED`
- `failureCategory` is only present for `FAILED`

---

### iParentTeacherInterviewModuleSettings

**Purpose**: Stores the admin-managed subject/body content used for all create requests.

**Fields**:
- `parentTeacherInterviewCalendar.subject` (string)
- `parentTeacherInterviewCalendar.bodyText` (string)

**Validation Rules**:
- `subject` must be non-blank
- `bodyText` must be non-blank
- Missing settings block create submission and surface a configuration error

---

## UI State Model

### Step 1: Staff Selection

**States**:
- `LOADING`
- `READY`
- `EMPTY`
- `FAILED`

**Transitions**:
- Initial page load -> `LOADING`
- Successful staff/category load -> `READY`
- Successful load with zero matching rows -> `EMPTY`
- Service failure -> `FAILED`

### Step 2: Schedule + Retrieval

**States per row**:
- `IDLE`: no valid datetime range yet
- `LOADING`: retrieval in progress
- `READY`: retrieval returned one or more events
- `EMPTY`: retrieval succeeded with zero events
- `FAILED`: retrieval failed

**Create eligibility**:
- User must have module-admin permission
- Every selected row must have valid datetimes
- Every selected row must be in `READY` or `EMPTY`
- Module settings subject/body must be present

### Submission

**States**:
- `READY_TO_SUBMIT`
- `SUBMITTING`
- `COMPLETE`

**Transitions**:
- Valid rows + admin access + settings present -> `READY_TO_SUBMIT`
- Button click -> `SUBMITTING`
- All per-staff responses received -> `COMPLETE`

---

## Type/File Mapping

Planned files:

```text
src/types/ParentTeacherInterview/
├── iParentTeacherInterviewCalendarEventSummary.ts
├── iParentTeacherInterviewCalendarEventsResponse.ts
├── iParentTeacherInterviewCreateCalendarEventRequest.ts
├── iParentTeacherInterviewCreateCalendarEventResponse.ts
├── iParentTeacherInterviewModuleSettings.ts
└── iParentTeacherInterviewScheduleRow.ts

src/types/Synergetic/Lookup/
└── SynLuDepartmentCodes.ts
```

---

## Notes

- `SynVStaffService` already returns more staff fields than the page needs; the page should project that data into a smaller view model rather than widen unrelated code.
- The backend retrieval endpoint allows `endDateTime === startDateTime`, but the create endpoint rejects equal start/end values. The UI should reflect that distinction clearly.
- Meeting links are operationally sensitive but not secret credentials; they remain visible only inside authorized module surfaces.
