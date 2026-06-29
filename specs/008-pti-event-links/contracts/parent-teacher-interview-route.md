# Route & UI Contract: Parent Teacher Interview Event Links

**Feature**: [Parent Teacher Interview Event Links](../spec.md) | **Data Model**: [../data-model.md](../data-model.md)  
**Date**: 2026-06-29

## Route Definition

### Primary SchoolBox Route

**Path**: `SchoolBoxUrls.ParentTeacherInterview = '/parentTeacherInterview'`

**Router Entry**:
- Add a new `case SchoolBoxUrls.ParentTeacherInterview` in `src/layouts/SchoolBox/SchoolBoxRouter.tsx`
- Wrap the page with `ModuleAccessWrapper moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}`

**Module Constant**:
- `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24`

**Access Control**:
- Main page: any user with module access
- Admin page: module admin only
- Create action: module admin only

### Page Shell

**Main page file**: `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`  
**Admin page file**: `src/pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage.tsx`

Both reuse:
- `Page`
- `AdminPage`
- `ModuleAdminBtn`

## Main Page Contract

### Layout

```text
Page title: "Parent Teacher Interview"

Step 1
- Search input: "Search By Staff ID or Staff Name..."
- Category selector
- Staff table (shared Table component, hover, responsive, striped)
- Row checkbox column + header checkbox
- Next button

Step 2
- Selected staff schedule table
- Start datetime / End datetime inputs per row
- Inline retrieval state per row
- Existing calendar events rendered below each row when available
- Create button: "create event links for {n} staff"
```

### Behaviour Rules

1. Step 1 loads active `TS` department staff and category options.
2. Header checkbox selects/unselects all rows currently shown in the table.
3. `Next` is disabled until at least one staff row is selected.
4. In step 2, when both datetimes are valid for a row, retrieval runs automatically for that row.
5. Create is unavailable until:
   - the user is a module admin
   - module settings subject/body exist
   - all selected rows have valid datetimes
   - all selected rows are in retrieval state `READY` or `EMPTY`

### Retrieval Rendering

**Inline presentation**:
- Under each selected schedule row, show one of:
  - spinner + "Loading existing events..."
  - empty message + "No existing events for this range"
  - compact event table with columns:
    - Subject
    - Start
    - End
    - Organizer
    - Teams Link (when available)
  - retry/error line for failed retrieval

### Non-Admin UX

Module users who are not admins can:
- load the page
- search staff
- enter datetimes
- retrieve existing events

They cannot:
- submit create
- edit module settings

The page should surface a clear explanation near the create action when the user lacks admin access.

## Admin Page Contract

### Purpose

The admin page manages Parent Teacher Interview module settings used by the main page's create requests.

### Settings Surface

Use `ModuleEditPanel` with:
- `subject` text input
- `bodyText` multi-line input
- save/update action via `MggsModuleService.updateModule`

### Settings Shape

```json
{
  "parentTeacherInterviewCalendar": {
    "subject": "Parent Teacher Interview",
    "bodyText": "Interview booking details..."
  }
}
```

## Error/Access Contract

### Access Denial

- Main page access denial follows the existing `ModuleAccessWrapper` behaviour used by Enrolments.
- Admin page access denial follows the existing `AdminPage` + `ModuleAccessWrapper(roleId=ROLE_ID_ADMIN)` behaviour.

### Main Error States

| State | Trigger | UX |
|---|---|---|
| Staff load failure | `SynVStaffService` error | toast + failed screen/section |
| Category load failure | `SynLuStaffCategoryService` error | toast + filter unavailable state |
| Missing settings | module settings missing `subject`/`bodyText` | block create + configuration message |
| Retrieval failure | `getCalendarEvents` error | per-row retry state |
| Create failure | `createCalendarEvent` returns `FAILED` | per-row result with failure category/message |

## Test-Facing Contract

Routing/access tests must confirm:
- route exists in `SchoolBoxRouter`
- route uses `ModuleAccessWrapper` with module ID 24
- admin page requires admin role

Page tests must confirm:
- header checkbox behaviour
- progression from step 1 to step 2
- retrieval state rendering
- create-button gating for non-admin users
