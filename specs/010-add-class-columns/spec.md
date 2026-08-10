# Feature Specification: Student Absence Class Columns

**Feature Branch**: `010-add-class-columns`  
**Created**: 2026-08-10  
**Status**: Draft  
**Input**: User description: "As shown in the Student Absence(s) screenshot, add `classCode` and `class description` columns after `luForm` and before `Period`."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify the Class for Each Absence (Priority: P1)

As an authorised staff member reviewing Student Absence(s), I want to see the class code and class description for each absence record so that I can identify the affected class without consulting another screen.

**Why this priority**: Showing the class information is the entire user-facing value of this feature and directly improves interpretation of each absence record.

**Independent Test**: Load a report containing an absence with class information and verify that both class values appear in the correct columns for that row.

**Acceptance Scenarios**:

1. **Given** an authorised user has loaded Student Absence(s) and a result has both a class code and class description, **When** the results table is displayed, **Then** the row shows both values in separate columns.
2. **Given** the results table is displayed, **When** the user reads its headers from left to right, **Then** `ClassCode` and `Class Description` appear immediately after `luForm` and before `Period`.
3. **Given** the user changes the existing search criteria and searches again, **When** matching records load, **Then** each row displays the class information belonging to that absence record.

---

### User Story 2 - Read Records Without Class Information (Priority: P2)

As an authorised staff member, I want absence records without class information to remain readable so that incomplete or non-class-based absences do not prevent me from using the report.

**Why this priority**: Some absence types, including all-day events, may not be tied to a specific class; these records must remain usable.

**Independent Test**: Load an absence record with no class code or description and verify that the record remains visible, with empty class cells and all other values unchanged.

**Acceptance Scenarios**:

1. **Given** an absence result has no class code, no class description, or both, **When** the results table is displayed, **Then** the corresponding class cell is blank and the rest of the row is displayed normally.
2. **Given** a result set contains records with and without class information, **When** the table is displayed, **Then** all records retain consistent column alignment.

### Edge Cases

- An absence may have a class code but no class description, or a description but no code; each available value is displayed independently.
- All-day and non-class-based absence events may have neither class value; both cells remain blank.
- Long class descriptions must remain readable without causing values to appear under the wrong headers.
- Loading, empty-result, access-denied, and request-failure behaviour remains the same as the existing Student Absence(s) report.
- Pagination and repeated searches must preserve the association between each absence and its own class information.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Student Absence(s) results table MUST include separate `ClassCode` and `Class Description` columns.
- **FR-002**: The two new columns MUST appear immediately after `luForm` and immediately before `Period`, ordered as `ClassCode` followed by `Class Description`.
- **FR-003**: Each result row MUST show the class code and class description associated with that specific absence event.
- **FR-004**: If either class value is unavailable, the system MUST display an empty cell for that value without hiding the row, shifting other values, or presenting placeholder data as genuine class information.
- **FR-005**: The new class values MUST remain correctly associated with their absence record across initial load, search, and pagination.
- **FR-006**: Existing date range, year-level, and `luForm` filters MUST continue to behave as they do before this change; no class filter is introduced.
- **FR-007**: Existing table columns and their values MUST remain available and in their current relative order, except for insertion of the two new columns at the specified position.
- **FR-008**: Access control MUST remain inherited from the existing Student Absence(s) report; this feature MUST NOT provide a new route or an alternative way to view absence data.
- **FR-009**: The report's absence-event data contract MUST expose an optional class code and optional class description, and the displayed report-row contract MUST carry both values. No unrelated service contract changes are required.
- **FR-010**: Existing loading, populated, empty, access-denied, and request-error outcomes MUST continue unchanged; the feature introduces no new user-visible asynchronous interaction.
- **FR-011**: The feature MUST NOT introduce new environment variables, browser storage, uploads, embeds, payment processing, or additional categories of sensitive data.
- **FR-012**: Exported and emailed report content is outside the scope of this change; the new values are required in the on-screen results table only.

### Key Entities

- **Absence Event**: A student's dated absence record. Relevant attributes include student, `luForm`, optional class code, optional class description, period, type, reason, and comment.
- **Student Absence Summary Row**: The on-screen representation of one absence event, including the two optional class values positioned between form and period information.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of sampled absence records with class data show the correct class code and class description for that record.
- **SC-002**: In all tested populated, partial, and missing-class cases, the table displays exactly two class columns between `luForm` and `Period`, with no row misalignment.
- **SC-003**: Authorised staff can identify the class code and class description for a displayed absence directly from the report in under 5 seconds, without navigating elsewhere.
- **SC-004**: All existing Student Absence(s) search, pagination, empty-state, and access-control acceptance checks continue to pass after the columns are introduced.

## Assumptions

- The screenshot represents the existing Student Absence(s) daily-summary report and its on-screen table is the requested surface.
- `ClassCode` is the requested visible header spelling; `Class Description` uses a space and title case.
- The absence-event source can provide class code and class description values for class-associated events.
- Some absence records legitimately have no class association, so blank cells are preferable to inferred or placeholder values.
- Search controls, sort order, page size, exports, email report content, and SchoolBox URL mappings are unchanged.
- Existing automated component coverage and manual authenticated report verification are sufficient for this small display enhancement.
