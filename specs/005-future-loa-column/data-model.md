# Data Model: Future L.O.A. Column

## Dashboard Student Record

**Purpose**: Represents a current or mapped future student record used by the enrolment
dashboard to derive row counts.

**Key fields**:

- `StudentID`
- `FileYear`
- `StudentStatus`
- `StudentYearLevel`
- `StudentEntryYearLevel`
- `StudentEntryDate`
- `StudentLeavingDate`
- `StudentReturningDate`
- `StudentOverrideNextYearLevel`
- `StudentCampus`
- `FullFeeFlag`
- `isFuture`

**Relationships**:

- Belongs to one dashboard row context (year level, campus subtotal, or grand total)
- May originate from current/past student data or mapped future-student data

**Validation / rules**:

- Students are filtered by campus and fee-type selection before row counts are calculated.
- Future students mapped into the dashboard retain the year and status fields needed for
  current-year future and next-year future calculations.
- Blank or invalid date fields must not crash row calculations.

## Current-Year Future Column Group

**Purpose**: Represents the set of current-year future-facing counts shown under the
	current dashboard year, including status columns and `Returning L.O.A.`.

**Key fields**:

- `notReturning`
- `returningLoa`
- configured current-year future status columns such as `Place Offered` and
  `Application Finalised`

**Relationships**:

- Derived from the dashboard student record set for each row
- Feeds `Total at Year End`

**Validation / rules**:

- Column order must place `Returning L.O.A.` after `Not Returning Next Year` and before
  `Place Offered`.
- Counts must reflect the same filter scope as the visible row.
- Current-year future students included in these columns must also be represented in
  `Total at Year End` for the same row.

## Returning L.O.A. Student

**Purpose**: Captures the subset of leave-related students who should appear in the new
current-year future column.

**Key fields**:

- `StudentLeavingDate`
- `StudentReturningDate`
- year-level context
- campus context

**Relationships**:

- Subset of `Dashboard Student Record`
- Member of the `Current-Year Future Column Group`
- Included in `Year-End Total` when qualifying

**Validation / rules**:

- Must have a recorded returning date in the active current dashboard year.
- Must satisfy the dashboard’s leave-related criteria.
- Must be placed in year-level rows according to the student’s current `StudentYearLevel`.
- Must be excluded when the returning date is blank, invalid, or outside the active
  current dashboard year.

## Year-End Total

**Purpose**: Represents the projected end-of-year count for a row in the current dashboard
year.

**Key fields**:

- `studentsToday`
- qualifying current-year future students
- qualifying `Returning L.O.A.` students

**Relationships**:

- Derived from the current-year student set and the current-year future column group
- Displayed in both the visible table and the PDF export

**Validation / rules**:

- Must increase when additional qualifying students appear only in the current-year future
  columns.
- Must use the same inclusion rules in the visible table and the PDF export.

## Export Row

**Purpose**: Represents the flattened row data passed from the dashboard to the PDF export
component.

**Key fields**:

- `label`
- `isSummary`
- `values[columnKey]`

**Relationships**:

- Built from the same computed dashboard rows used for on-screen rendering
- Uses the same ordered column list as the visible table

**Validation / rules**:

- Must include a `Returning L.O.A.` value when the visible table includes that column.
- Must preserve column order so the exported header and row values stay aligned.
