# Contract: Enrolment Dashboard Current-Year Future Columns

## Affected Surfaces

- UI surface: `EnrolmentDashboardPanel` within the enrolments module
- Export surface: `EnrolmentDashboardExportPdf`
- Route/module surface: enrolments page under `MGGS_MODULE_ID_ENROLLMENTS`

## Visible Table Contract

### Current-Year Future Group

The current dashboard year section includes a current-year future subgroup. After this
change, that subgroup must contain:

1. `Approved Future L.O.A.`
2. `Not Returning Next Year`
3. `Returning L.O.A.`
4. configured current-year future status columns such as `Place Offered` and
   `Application Finalised`
5. `Total at Year End`

### Column Order Rule

- `Returning L.O.A.` must appear immediately after `Not Returning Next Year`.
- `Returning L.O.A.` must appear immediately before the first configured current-year
  future status column.
- If no qualifying students exist, the column still renders in that position with empty
  cells.

## Counting Contract

### Returning L.O.A.

For each visible row:

- Count students who meet the dashboard’s leave criteria and whose returning date falls in
  the active current dashboard year.
- Apply the existing row scope, including campus filtering, year-level grouping, and
  fee-type filtering.
- Exclude students whose returning date is blank, invalid, or outside the active current
  dashboard year.

### Current-Year Future Status Columns

For each visible row:

- Count current-year future students in configured statuses such as `Place Offered` and
  `Application Finalised`.
- Use the same underlying current-year future student inclusion model as the other
  current-year future columns.

### Total at Year End

For each visible row:

- Include students counted in the current-year future columns, including `Returning
  L.O.A.` and configured current-year future statuses, when those students are not already
  represented elsewhere in the same year-end total.
- Use the same inclusion rules in the visible table and the exported PDF.

## Export Contract

- The PDF export must use the same ordered column list as the visible table.
- The PDF export must include `Returning L.O.A.` in the same position as the visible table.
- The PDF export must show the same per-row counts and `Total at Year End` values as the
  visible table for the active filters.
