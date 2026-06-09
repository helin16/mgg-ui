# Quickstart: Future L.O.A. Column

## Goal

Validate that the enrolment numbers dashboard shows the new `Returning L.O.A.` column
under the current-year future section, includes qualifying students in `Total at Year
End`, fixes current-year future status-column counting, and keeps the PDF export aligned
with the visible table.

## Preconditions

- Branch `005-future-loa-column` is checked out.
- The enrolments dashboard can be opened with data that includes:
  - at least one leave student returning in the current dashboard year
  - at least one leave student returning outside the current dashboard year
  - at least one current-year future student in a configured status such as `Place
    Offered` or `Application Finalised`
- The export PDF button is available in the enrolments dashboard.

## Automated Verification

1. Run the enrolments dashboard Jest tests.
2. Run the enrolments PDF export Jest tests.
3. Confirm any added tests cover:
   - the new `Returning L.O.A.` column order
   - qualifying and non-qualifying leave-return counts
   - inclusion of current-year future column members in `Total at Year End`
   - PDF header structure and row values matching the visible table

## Manual Validation

### Scenario 1: Qualifying leave-return student is shown

1. Open the enrolment numbers dashboard.
2. Find a row with a student on leave whose returning date falls in the current dashboard
   year.
3. Verify the `Returning L.O.A.` column under the current-year future section increments
   for that row.

### Scenario 2: Non-qualifying leave-return student is excluded

1. Use a student with no returning date or a returning date outside the current dashboard
   year.
2. Verify that student does not contribute to the `Returning L.O.A.` column.

### Scenario 3: Year-end totals increase correctly

1. Compare a row where qualifying current-year future students are present.
2. Verify `Total at Year End` includes those students, including any newly counted
   `Returning L.O.A.` students.
3. Verify the increase matches the expected additional qualifying students for that row.

### Scenario 4: Existing current-year future statuses still show expected students

1. Use a row that includes current-year future students in configured statuses such as
   `Place Offered` or `Application Finalised`.
2. Verify those students appear in their current-year future status columns as well as in
   `Total at Year End` when appropriate.

### Scenario 5: PDF export matches the visible table

1. Export the dashboard to PDF.
2. Verify the PDF includes `Returning L.O.A.` after `Not Returning Next Year` and before
   `Place Offered`.
3. Verify the PDF row counts and `Total at Year End` values match the visible dashboard
   for the same filters.

## Verification Evidence

- Automated verification completed on 2026-06-09:
  - `npm test -- --runInBand --watch=false src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx`
  - `npm test -- --runInBand --watch=false src/__tests__/components/Enrollments/EnrolmentDashboardExportPdf.test.tsx`
- Manual enrolment dashboard and PDF validation are pending implementation.

## Manual Verification Record

**Date**: __________  
**Environment**: __________  
**Reviewer**: __________

| Scenario | Result | Notes |
|----------|--------|-------|
| Scenario 1: Qualifying leave-return student is shown | Pending | |
| Scenario 2: Non-qualifying leave-return student is excluded | Pending | |
| Scenario 3: Year-end totals increase correctly | Pending | |
| Scenario 4: Existing current-year future statuses still show expected students | Pending | |
| Scenario 5: PDF export matches the visible table | Pending | |

**Follow-up actions**:

- Pending
