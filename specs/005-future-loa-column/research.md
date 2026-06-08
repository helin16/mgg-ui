# Research: Future L.O.A. Column

## Decision 1: Extend the existing current-year future grouping instead of adding a new data source

**Decision**: Build the new `Returning L.O.A.` column from the student data already loaded
for `EnrolmentDashboardPanel`, using existing current and future student records rather
than introducing a new service request or contract.

**Rationale**: The current dashboard already loads the fields needed to determine leave
status, returning date, current-year future students, and next-year future students. The
feature is a calculation and presentation change, not a data-source expansion.

**Alternatives considered**:

- Add a dedicated service call for leave-return counts. Rejected because it would widen the
  service surface for logic that can already be derived locally.
- Introduce a new backend aggregate. Rejected because the spec explicitly stays within the
  existing service/type boundaries.

## Decision 2: Treat current-year future columns as one calculation set for both status columns and year-end total

**Decision**: Align the current-year future status columns and the new `Returning L.O.A.`
column with the same current-year future student inclusion model that feeds `Total at Year
End`.

**Rationale**: The current bug is that some current-year future students influence `Total
at Year End` but do not appear in the per-status current-year future columns. The new
column would be inconsistent for the same reason if it were computed from a different base
set.

**Alternatives considered**:

- Add only the new `Returning L.O.A.` column and leave the existing status-column mismatch
  in place. Rejected because it would preserve a known inconsistency inside the same column
  group.
- Keep separate logic paths for year-end totals and current-year future columns. Rejected
  because it increases drift risk and makes manual validation harder.

## Decision 3: Keep row-level counting derived inside the dashboard component

**Decision**: Reuse the existing per-row calculation structure in
`EnrolmentDashboardPanel.tsx` and extend its derived cell map rather than moving logic into
new shared stores or remote helpers.

**Rationale**: The calculation is local to one dashboard and already structured around
derived row cell maps. Keeping the change there stays consistent with the current code
shape and limits blast radius.

**Alternatives considered**:

- Extract a large new shared enrolment-math layer first. Rejected because the feature is
  focused and the current code already centralizes the relevant calculations in one place.
- Duplicate the counting logic separately for the visible table and the PDF export.
  Rejected because the export already consumes the visible table’s computed rows and should
  stay downstream of the same source data.

## Decision 4: Make the PDF export follow the visible table structure exactly

**Decision**: Update the PDF export by extending the same column list and exported row
values generated from the dashboard, keeping order and counts identical to the visible
table.

**Rationale**: The PDF component already relies on `columns` and `rows` produced by the
dashboard component. Preserving that single source of truth minimizes mismatch risk.

**Alternatives considered**:

- Hard-code a separate PDF-only column order. Rejected because it creates an avoidable
  drift path between the table and export.
- Defer PDF updates to a later change. Rejected because the spec requires the export to
  match the table in this iteration.

## Decision 5: Verify with targeted Jest tests plus manual enrolment checks

**Decision**: Add or update Jest coverage for dashboard loading/export structure and
document manual validation for qualifying leave-return counts, year-end totals, and PDF
alignment.

**Rationale**: The changed behavior is calculation-heavy and deterministic enough for unit
or component-level tests, while final confidence still depends on live enrolment data and
the generated PDF output.

**Alternatives considered**:

- Manual validation only. Rejected because the changed logic affects shared row totals and
  export structure, which are suited to automated regression checks.
- Introduce Cypress coverage in this change. Rejected because the repo already has focused
  Jest coverage for this surface and the feature does not need a broader browser workflow.
