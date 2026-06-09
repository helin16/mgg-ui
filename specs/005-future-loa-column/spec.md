# Feature Specification: Future L.O.A. Column

**Feature Branch**: `005-future-loa-column`  
**Created**: 2026-06-09  
**Status**: Draft  
**Input**: User description: "one more thing: we need to add a column right after \"NOT RETURNING NEXT YEAR\" and before \"Place Offered\". this new column needs to be under \"Future 2026\", just like \"Place Offered\". it's called \"Returning L.O.A\", it should contain all the student that has LOA that returning date in the future 2026."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See returning L.O.A. students in the current-year future section (Priority: P1)

When enrolment staff review the enrolment numbers dashboard, they can see a dedicated
`Returning L.O.A.` count in the `Future 2026` section so students expected to return from
leave in 2026 are visible without being mixed into other columns.

**Why this priority**: The requested business value is immediate visibility of students
returning from leave during the current future-year planning view.

**Independent Test**: Open the enrolment numbers dashboard with at least one student on
leave whose recorded returning date falls in 2026, and confirm that student appears in the
`Returning L.O.A.` column under `Future 2026`.

**Acceptance Scenarios**:

1. **Given** a student is on leave and has a returning date in 2026, **When** a user views
   the enrolment numbers dashboard, **Then** that student is counted in the `Returning
   L.O.A.` column within the `Future 2026` group.
2. **Given** multiple students are on leave and returning in 2026 across different year
   levels and campuses, **When** the dashboard loads, **Then** each applicable row and
   total row includes those students in the new `Returning L.O.A.` column.
3. **Given** one or more students appear in the new current-year future columns, **When**
   the dashboard recalculates `Total at Year End`, **Then** those students are included in
   the `Total at Year End` count for the same row.

---

### User Story 2 - Keep the future section readable and ordered (Priority: P2)

When staff scan the `Future 2026` group, the new `Returning L.O.A.` column appears in the
expected position between `Not Returning Next Year` and `Place Offered`, preserving the
dashboard’s existing reading order.

**Why this priority**: The value of the new count depends on staff being able to find it in
the intended place during routine review.

**Independent Test**: Open the dashboard and confirm the new header appears immediately
after `Not Returning Next Year` and immediately before `Place Offered` in every rendered
view of the table.

**Acceptance Scenarios**:

1. **Given** the enrolment numbers dashboard is rendered, **When** the header row is
   displayed, **Then** `Returning L.O.A.` appears under `Future 2026` after `Not Returning
   Next Year` and before `Place Offered`.
2. **Given** the dashboard includes campus totals and the grand total row, **When** the
   table is displayed or exported, **Then** the new column remains aligned with the rest of
   the `Future 2026` group.
3. **Given** a user exports the dashboard to PDF, **When** the export is generated,
   **Then** the PDF includes the `Returning L.O.A.` column in the same `Future 2026`
   position and with the same counts as the visible table.

---

### User Story 3 - Exclude students who do not qualify for the current-year return view (Priority: P3)

When staff rely on the new `Returning L.O.A.` count, only students whose leave status and
return timing match the current-year future section are included.

**Why this priority**: This keeps the number trustworthy and avoids overstating likely
returns.

**Independent Test**: Compare students with 2026 return dates against students who have no
return date, a return date outside 2026, or no leave context, and confirm only the
qualifying 2026 returning leave students are counted.

**Acceptance Scenarios**:

1. **Given** a student has no recorded returning date, **When** the dashboard is rendered,
   **Then** that student is not counted in the `Returning L.O.A.` column.
2. **Given** a student’s returning date is outside 2026, **When** the dashboard is
   rendered, **Then** that student is not counted in the `Returning L.O.A.` column for
   `Future 2026`.

### Edge Cases

- A student is on leave but their returning date is blank or unreadable.
- A student has a returning date in 2026 but is filtered out by campus or fee-type
  selection.
- A student qualifies for a leave-related current-year column as well as the new future
  return column; the dashboard must count them in the correct places without duplication
  within the same column.
- No students qualify for the new column; the dashboard should continue rendering with an
  empty count in that position.
- The user exports the dashboard while the new column has zero values in some or all rows.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST treat the affected surface as the Enrolment Numbers dashboard
  within the enrolments module, including the visible table and its PDF export.
- **FR-002**: The system MUST add a new column named `Returning L.O.A.` to the `Future
  2026` section of the dashboard.
- **FR-003**: The system MUST place the new `Returning L.O.A.` column immediately after
  `Not Returning Next Year` and immediately before `Place Offered`.
- **FR-004**: The system MUST count in this column each student who is on leave and has a
  returning date that falls within the current dashboard year’s future section, which for
  the example shown is 2026.
- **FR-005**: The system MUST exclude from this column students who have no returning date,
  whose returning date falls outside the current dashboard year’s future section, or who do
  not meet the leave criteria.
- **FR-006**: The system MUST place qualifying `Returning L.O.A.` students into dashboard
  rows using their current `StudentYearLevel` when their returning date falls within the
  active current dashboard year.
- **FR-007**: The system MUST apply the new column consistently for year-level rows, campus
  subtotal rows, and the grand total row.
- **FR-008**: The system MUST include students counted in the current-year future columns,
  including `Returning L.O.A.`, in the `Total at Year End` value for the same row so that
  the year-end total increases when those columns contain students not already counted
  elsewhere in that total.
- **FR-009**: The system MUST respect the existing campus and fee-type filters when
  calculating the new column.
- **FR-010**: The system MUST preserve the existing access rules for the enrolments module
  and MUST NOT broaden who can view enrolment counts.
- **FR-011**: The specification identifies no required service-layer contract changes for
  the existing `src/services/*` and `src/types/*` boundaries; the feature reuses data
  already available to the dashboard.
- **FR-012**: The system MUST preserve the dashboard’s existing loading, success, empty,
  and error behaviours while adding the new column.
- **FR-013**: The system MUST include the new column in exported dashboard output wherever
  the visible `Future 2026` table structure is reproduced.
- **FR-014**: The system MUST ensure the PDF export places `Returning L.O.A.` after `Not
  Returning Next Year` and before `Place Offered`, matching the visible table layout.
- **FR-015**: The system MUST ensure the `Returning L.O.A.` counts shown in the PDF export
  match the counts shown in the visible dashboard for the same filters and rows.
- **FR-016**: The feature MUST ensure `Total at Year End` in the PDF export reflects the
  same inclusion rules as the visible table, including students counted in the new
  current-year future columns.
- **FR-017**: The existing next-year `Returning L.O.A.` logic MUST remain unchanged, so
  next-year row placement continues using `StudentOverrideNextYearLevel` when present and
  otherwise falls back to the inferred next year level from the ordered year-level list.
- **FR-018**: The feature MUST not require new environment variables, browser storage,
  third-party credentials, or new categories of student data beyond the existing enrolment
  dashboard inputs.

### Key Entities *(include if feature involves data)*

- **Returning L.O.A. Student**: A student currently on leave whose recorded returning date
  places them back in the relevant current-year future section of the dashboard.
- **Future 2026 Column Group**: The current-year future subsection of the enrolment
  numbers dashboard that currently includes future-planning counts such as `Place Offered`.
- **Returning Date**: The recorded date used to determine whether a leave student should be
  shown as returning in the current-year future section.
- **Dashboard Filters**: Existing campus and fee-type selections that limit which students
  are counted in each row and total.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In manual validation, 100% of sampled students on leave with a 2026
  returning date appear in the `Returning L.O.A.` column under `Future 2026`.
- **SC-002**: In manual validation, 0 sampled students without a 2026 returning date
  appear in the `Returning L.O.A.` column.
- **SC-003**: In the rendered dashboard and PDF export, the new column appears in the
  intended position for 100% of tested views.
- **SC-004**: In manual validation, `Total at Year End` increases exactly by the number of
  additional qualifying students introduced through the relevant current-year future
  columns for each tested row.
- **SC-005**: Support or enrolment staff can identify the number of 2026 returning leave
  students from the dashboard without opening detail popups or using another report.

## Assumptions

- The current-year future section label changes with the active file year, even though the
  request example refers to `Future 2026`.
- Existing student records already contain the leave and returning-date information needed
  to derive this count.
- `Returning L.O.A.` in `Future 2026` is intended to represent students returning during
  the current dashboard year, not the next-year future section.
- Students returning within the current dashboard year remain in their current
  `StudentYearLevel` for this new column rather than being promoted to an inferred next
  year level.
- The existing dashboard export is expected to stay structurally aligned with the visible
  table whenever a new visible column is added.
- Manual enrolment/UAT validation remains necessary because the final behavior is easiest
  to confirm against live dashboard data and exports.
