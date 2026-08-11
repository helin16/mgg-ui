# Feature Specification: Export Class Columns

**Feature Branch**: `012-export-class-columns`  
**Created**: 2026-08-10  
**Status**: Draft  
**Input**: User description: "Add the two class columns to direct Student Absence exports and the on-screen list; leave emailing PDFs unchanged."

## Clarifications

### Session 2026-08-10

- Q: Should the class columns be included in emailed PDFs? → A: No; apply them to direct exports only and leave all emailed PDFs unchanged.
- Q: If more than one class could match an absence and no unique class can be determined, what should the report show? → A: Leave both class fields blank.
- Q: Should authorised users also see the class columns on screen? → A: Yes; show them after `luForm` and before `Period` while keeping emailed PDFs unchanged.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export Absences with Class Details (Priority: P1)

As an authorised staff member, I want the exported Student Absence report to include class code and class description so that the downloaded report contains the same class context needed to interpret each absence.

**Why this priority**: Export is a primary report action, and a report that omits class context is less useful after it leaves the on-screen module.

**Independent Test**: Export a filtered report containing class-associated and non-class-associated absences, then verify that the generated report shows the correct class values and blanks in the required column positions.

**Acceptance Scenarios**:

1. **Given** an authorised user exports a populated Student Absence report, **When** the generated report is opened, **Then** it includes separate `ClassCode` and `Class Description` columns after `Form` and before `Period`.
2. **Given** an exported row represents a class-associated absence, **When** the report is opened, **Then** the row displays the class code and class description belonging to that absence.
3. **Given** an exported row has no class association, **When** the report is opened, **Then** both class cells are blank and the row remains aligned and readable.

---

### User Story 2 - Preserve Usable Export Layout (Priority: P2)

As a report reader, I want all existing information to remain legible after the two columns are added so that gaining class context does not make other absence details unusable.

**Why this priority**: The report contains several existing fields, and adding columns must not cause headers, values, or page boundaries to become misleading.

**Independent Test**: Generate reports containing long student names, class descriptions, reasons, and comments, then verify correct alignment and readable pagination across multiple pages.

**Acceptance Scenarios**:

1. **Given** a report contains long class descriptions and other long values, **When** it is opened, **Then** every value remains under its correct header and no row overlaps another row.
2. **Given** a report spans multiple pages, **When** each page is reviewed, **Then** the column headings remain available and the class fields stay aligned with their absence rows.

### Edge Cases

- `All Day`, `AM`, `PM`, and other non-class-based absences may have no class code or class description; both report cells remain blank.
- An absence may have only one class value; the available value is shown and the other cell remains blank.
- Multiple candidate attendance records must not duplicate an absence row or attach another class's details to it; when they do not resolve to one class, both class cells remain blank.
- Empty direct exports retain the two class headers while showing the existing empty-report message.
- Long or unusual class values remain associated with the correct row and do not shift subsequent columns.
- A failure to resolve class information must not invent placeholder class data; existing report failure handling remains in effect for failures that prevent report generation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every Student Absence report generated through the direct Export action MUST include separate `ClassCode` and `Class Description` columns.
- **FR-002**: Student Absence PDFs attached to manual, Head of Year, and tutor emails MUST remain unchanged and MUST NOT include the two class columns.
- **FR-003**: The class columns MUST appear after the existing `Form` column and before the existing `Period` column, ordered as `ClassCode` followed by `Class Description`.
- **FR-004**: Each populated report row MUST show the class code and class description associated with that specific absence event.
- **FR-005**: If a class code, class description, or both are unavailable, the corresponding cells MUST be blank without hiding, duplicating, or misaligning the absence row.
- **FR-006**: Class association MUST be deterministic when multiple attendance or timetable records exist; if the candidates do not resolve to exactly one class, both class cells MUST remain blank and the system MUST NOT select an arbitrary class.
- **FR-007**: Adding class information MUST NOT change the report's active date, year-level, or `luForm` scope, recipient scope, or included absence count.
- **FR-008**: Class enrichment and the expanded report layout MUST apply only to direct exports and MUST NOT alter manual or scheduled email generation.
- **FR-009**: The report's existing student, year level, form, absence date, period, type, reason, and comment information MUST remain present and correctly associated with each row.
- **FR-010**: Multi-page reports MUST keep headers and values aligned, including when student names, class descriptions, reasons, or comments are long.
- **FR-011**: Empty direct exports MUST preserve the existing empty-state behaviour and MUST include the revised export headings without fabricated rows.
- **FR-012**: Existing Student Absence access controls MUST continue to govern direct export; this feature MUST NOT introduce a new route or an alternative way to access absence or class data.
- **FR-013**: The direct-export data contract MUST carry optional class code and optional class description values from the authoritative absence/attendance association into the export report row.
- **FR-014**: No request payload changes are required for existing export or email actions; current filters and recipient inputs remain unchanged.
- **FR-015**: Existing loading, successful download, queued email, validation, empty-report, access-denied, and report-generation failure outcomes MUST remain unchanged except for the additional report columns.
- **FR-016**: The feature MUST NOT introduce new environment variables, browser storage, uploads, embeds, payment handling, or broader exposure of student information beyond authorised report recipients.
- **FR-017**: Email subjects, bodies, attachments, report layout, and report rows MUST remain unchanged.
- **FR-018**: The on-screen Student Absence list MUST display `ClassCode` and `Class Description` after `luForm` and before `Period`, using the same safe class-resolution rules as direct export.
- **FR-019**: The on-screen list MUST sort by date, year level, `luForm`, student, period, then absence event date/time ascending, with Tutor/Home Group followed by Period 1 through Period 7.
- **FR-020**: The screen MUST provide a `Count as Absent` button-group filter with `YES`, `NO`, and `ALL`; `ALL` is the compatibility-preserving default, and the selected scope applies to the on-screen result list.
- **FR-021**: Manual email, scheduled Head of Year email, and scheduled tutor email PDFs MUST include only rows where `AbsenceEventAbsenceTypeCountAsAbsenceFlag` is true. Direct exports MUST follow the user's on-screen `YES`, `NO`, or `ALL` selection.

### Key Entities

- **Absence Event**: A dated student absence with student, year level, form, period, type, reason, comment, and an optional association to class information.
- **Class Association**: The authoritative optional class code and class description belonging to a student absence for its applicable date and period.
- **Student Absence Export Row**: The printable representation of an absence used by the direct Export action, including optional class fields.
- **Student Absence Export**: A filtered, potentially multi-page document delivered by direct download.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of sampled class-associated absences display the correct class code and class description in direct exports.
- **SC-002**: In 100% of tested non-class, partially populated, and empty-report cases, class cells remain blank as appropriate with no fabricated values or row misalignment.
- **SC-003**: Manual, Head of Year, and tutor email PDF regression checks show no changed headers, rows, orientation, or class fields.
- **SC-004**: Reports spanning at least three pages retain correct header-to-value alignment on every page, including representative long class descriptions and comments.
- **SC-005**: Authorised recipients can identify the class associated with a report row in under 5 seconds without returning to the on-screen module.

## Assumptions

- Read-only review of the sibling API confirms that direct export and email attachments currently share report generation, so implementation must explicitly opt direct exports into the expanded row and layout while preserving the existing email path.
- Email subjects, bodies, and PDF attachments remain unchanged.
- The source absence view does not currently expose class fields through the report's normalised row contract. Existing attendance data includes class code and class description, but planning must confirm the authoritative, non-duplicating association for each absence event.
- `ClassCode` and `Class Description` are the required visible report headings.
- Non-class events such as `All Day`, `AM`, and `PM` legitimately may have blank class values.
- The ordering requirements specified for the Student Absence list are expected to be applied consistently to generated reports when available, but changing sort order is not independently introduced by this feature.
- Existing report filters, recipient selection, delivery logs, attachment naming, and SchoolBox URL mappings remain unchanged.
- Verification will include focused direct-export row/rendering coverage plus regression checks and manual inspection proving emailed PDFs are unchanged.
