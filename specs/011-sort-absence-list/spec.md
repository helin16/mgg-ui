# Feature Specification: Sort Student Absence List

**Feature Branch**: `011-sort-absence-list`  
**Created**: 2026-08-10  
**Status**: Draft  
**Input**: User description: "Sort the Student Absence(s) list by Date, then yearLevel, then luForm, then Student, then period. Periods must follow timetable order: Tutor Group, Period 1, Period 2, Period 3, Period 4, Period 5, Period 6, Period 7, as shown in the screenshot."

## Clarifications

### Session 2026-08-10

- Q: How should non-standard period values such as `All Day`, `AM`, or `PM` be ordered? → A: Place them after Period 7, sorted alphabetically.
- Q: What should happen if current timetable information cannot be loaded? → A: Show records and sort recognised displayed periods normally; treat unknown values as non-standard.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Absences in School Order (Priority: P1)

As an authorised staff member reviewing Student Absence(s), I want records grouped and ordered by date, year level, `luForm`, student, and period so that I can work through the report in the same sequence used by the school day.

**Why this priority**: The requested ordering is the feature's primary value and makes long absence lists predictable and easier to review.

**Independent Test**: Load a deliberately unordered result set spanning multiple dates, year levels, forms, students, and periods, then verify that every row follows the required hierarchy.

**Acceptance Scenarios**:

1. **Given** absence records span multiple dates, **When** the list is displayed, **Then** earlier dates appear before later dates.
2. **Given** records share a date but have different year levels, **When** the list is displayed, **Then** they are grouped by the school's year-level order.
3. **Given** records share a date and year level but have different `luForm` values, **When** the list is displayed, **Then** they are ordered by `luForm` ascending.
4. **Given** records share a date, year level, and `luForm` but belong to different students, **When** the list is displayed, **Then** students are ordered by surname and then preferred or given name ascending.
5. **Given** one student has multiple records within the same date, year level, and `luForm`, **When** the list is displayed, **Then** those records follow timetable period order: Tutor Group, Period 1, Period 2, Period 3, Period 4, Period 5, Period 6, Period 7.

---

### User Story 2 - Preserve Ordering Across Pages and Searches (Priority: P2)

As an authorised staff member, I want the same ordering to apply across the complete result set so that changing pages or search criteria does not produce gaps, duplicates, or misleading groupings.

**Why this priority**: A correctly sorted individual page is insufficient when records on later pages belong earlier in the overall sequence.

**Independent Test**: Load enough deliberately unordered records to span multiple pages, move between pages, repeat the search, and verify that the combined result sequence remains correct and stable.

**Acceptance Scenarios**:

1. **Given** results span multiple pages, **When** the user reads the last row of one page and the first row of the next, **Then** the ordering hierarchy remains valid across the page boundary.
2. **Given** the same data and filters are searched more than once, **When** each result set is displayed, **Then** records appear in the same order each time.

### Edge Cases

- Records with the same values for all visible sort fields require a stable final ordering so they do not move unpredictably between searches or pages.
- Blank or unknown `luForm` values must not prevent records from displaying and must be grouped consistently after populated forms within the same date and year level.
- A period not present in the defined Tutor Group through Period 7 sequence must still display after Period 7 and be ordered alphabetically among other non-standard periods.
- Period ranking must use the period's timetable position, not alphabetic comparison; for example, Period 2 precedes Period 7 regardless of label formatting.
- If current timetable information cannot be loaded, the report remains available: displayed values recognisable as Tutor Group or Periods 1 through 7 retain their defined rank, while all unknown values follow the non-standard alphabetical fallback.
- Empty, access-denied, loading, and request-failure states remain unchanged by sorting.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Student Absence(s) result set MUST be sorted using this precedence: Date, Year Level, `luForm`, Student, then Period.
- **FR-002**: Date MUST be ordered chronologically ascending, with earlier dates before later dates.
- **FR-003**: Within the same date, year levels MUST follow the school's established year-level sequence rather than alphabetic label order.
- **FR-004**: Within the same date and year level, populated `luForm` values MUST be ordered ascending; blank forms MUST follow populated forms.
- **FR-005**: Within the same date, year level, and `luForm`, students MUST be ordered by surname ascending and then preferred name, falling back to given name when no preferred name is available.
- **FR-006**: Within the same date, year level, `luForm`, and student, recognised periods MUST be ordered as Tutor Group, Period 1, Period 2, Period 3, Period 4, Period 5, Period 6, then Period 7.
- **FR-007**: Period sorting MUST be based on the current timetable's ordered period identity or position, not alphabetic sorting of the displayed period description.
- **FR-008**: Periods outside the recognised Tutor Group through Period 7 sequence MUST appear after Period 7 and MUST be sorted alphabetically by their displayed period description.
- **FR-009**: Records equal on every requested sort field MUST use a stable final ordering based on their unique absence identity.
- **FR-010**: The required ordering MUST apply to the complete filtered result set before page boundaries are determined.
- **FR-011**: Initial load, explicit searches, repeated searches, and pagination MUST all use the same ordering rules.
- **FR-012**: Existing filters, displayed columns, period descriptions, page size, and access-control behaviour MUST remain unchanged.
- **FR-013**: The affected surface is the existing Student Absence(s) report; no new route or alternative access path is introduced.
- **FR-014**: The absence-list service contract MUST support the complete, pagination-safe ordering hierarchy, including a deterministic period rank and final absence identity where they are not already available. Display contracts require no new user-visible fields solely for sorting.
- **FR-015**: Existing loading, populated, empty, access-denied, timetable-load failure, and absence-request failure outcomes MUST remain explicit; sorting introduces no new user action or validation state.
- **FR-016**: The feature MUST NOT introduce new environment variables, browser storage, embeds, uploads, payments, or additional sensitive-data exposure.
- **FR-017**: If current timetable information is unavailable, the system MUST still display absence records, rank recognised displayed period descriptions according to FR-006, and treat all unrecognised values according to FR-008.

### Key Entities

- **Absence Event**: One student absence record, identified uniquely and associated with a date, student, year level, `luForm`, and period.
- **Timetable Period**: A period definition with an ordered position and display description; the requested recognised sequence is Tutor Group followed by Periods 1 through 7.
- **Sorted Absence Result Set**: All records matching the active filters, ordered globally before being divided into pages.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance tests containing mixed values for every sort field, 100% of records appear in the required date → year level → `luForm` → student → period hierarchy.
- **SC-002**: In timetable-order tests, Tutor Group and Periods 1 through 7 appear in the correct relative order in 100% of applicable student groupings.
- **SC-003**: In result sets spanning at least three pages, 100% of adjacent records—including page-boundary pairs—satisfy the ordering rules with no duplicates or omissions.
- **SC-004**: Repeating the same search three times produces an identical record sequence each time.
- **SC-005**: Authorised staff can follow a student's absences through the school-day sequence without manually reordering or cross-referencing period labels.

## Assumptions

- The screenshot represents the current timetable sequence relevant to the Student Absence(s) report.
- Sorting is ascending at each level because the report is intended to be reviewed from earlier dates, junior-to-senior year levels, lower forms, alphabetically ordered students, and earlier timetable periods.
- The existing institutional year-level sort value remains the authority for year-level order.
- `luForm` comparison uses the existing form codes and is case-insensitive.
- Period descriptions outside Tutor Group and Periods 1 through 7, including all-day or other non-timetable events, remain visible after Period 7 and are sorted alphabetically.
- Recognised displayed period descriptions are sufficient to preserve their requested rank when current timetable information is unavailable; unrecognised values use the non-standard fallback.
- The existing Student Absence(s) access controls, filters, page size, export, email, and SchoolBox URL mapping remain unchanged.
- Verification will include focused automated ordering tests plus manual authenticated review using representative timetable data.
