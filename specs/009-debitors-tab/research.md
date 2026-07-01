# Research: Finance Debitors Tab

## Decision 1: Keep the feature inside the existing Finance page

**Decision**: Add the debtor listing as a new `Debitors` tab in `src/pages/Finance/FinancePage.tsx` instead of introducing a new route or page shell.

**Rationale**: The Finance page already uses tab-based navigation for adjacent finance workflows and already enforces the correct module access through `Page` with `MGGS_MODULE_ID_FINANCE`. Keeping the new feature there preserves the existing operator flow and avoids access drift.

**Alternatives considered**:
- Add a new route: rejected because the spec is scoped to the existing Finance page and a new route would add avoidable module-surface complexity.
- Add the panel to Finance admin: rejected because the feature is a user-facing operational lookup, not an admin-only settings workflow.

## Decision 2: Reuse the existing service-layer wrappers

**Decision**: Build the debtor list on top of `SynVDebtorService.getAll(...)` and the current-student filter on top of `SynVStudentService.getVPastAndCurrentStudentAll(...)`.

**Rationale**: The constitution requires typed service boundaries, and the repo already exposes the relevant debtor and student endpoints through shared wrappers. Reusing those wrappers keeps request headers, auth handling, query encoding, and tests aligned with the rest of the app.

**Alternatives considered**:
- Direct `axios` calls from the panel: rejected because it violates the repo’s service-layer pattern.
- A brand-new debtor endpoint wrapper with no reuse: rejected because the existing wrapper already exposes the base `/syn/vDebtor` surface and should be extended rather than duplicated.

## Decision 3: Use explicit `Search` and `Reset Filters` actions

**Decision**: Searches run only when the user clicks `Search`, and filters clear only when the user clicks `Reset Filters`.

**Rationale**: The user explicitly requested button-triggered search and reset behaviour. This also keeps API traffic predictable and simplifies async state handling compared with mixed debounce and explicit-submit behaviour.

**Alternatives considered**:
- Search on typing debounce: rejected because it conflicts with the requested workflow.
- Search on student selection change: rejected because it makes the two filters behave inconsistently.

## Decision 4: Filter by the selected student’s `DebtorID`

**Decision**: The current-student selector filters results by matching the selected `iVStudent.DebtorID`.

**Rationale**: The user explicitly resolved the relationship key, and the existing `iVStudent` contract already carries `DebtorID`. This is more stable than guessing through name matching or overloading `DebtorStudentID` semantics from the debtor record alone.

**Alternatives considered**:
- Filter by `DebtorStudentID`: rejected because the user explicitly chose `iVStudent.DebtorID`.
- Filter by student name or ID text search only: rejected because it does not provide a stable relational join.

## Decision 5: Default to debtor-name ascending order with 10 rows per page

**Decision**: The first result set should be sorted alphabetically by debtor name and paged at 10 rows.

**Rationale**: The user set the page size and sort order. The shared `Table` component already supports pagination inputs, so the plan can reuse the standard paginator while locking the feature’s default result order.

**Alternatives considered**:
- Sort by debtor ID: rejected because it is less operator-friendly for manual lookup.
- Load all rows without pagination: rejected because it conflicts with the requested page size and would reduce scanability.

## Decision 6: Treat spouse email as a contract gap to close deliberately

**Decision**: Plan for spouse email as an explicit service/type contract extension or enrichment requirement before implementation.

**Rationale**: The current `iSynVDebtor` and backend `SynVDebtor` model expose spouse names and spouse phone/mobile values, but not spouse email. The spec now requires spouse email display and search, so the plan must track this as a contract change rather than silently dropping the requirement.

**Alternatives considered**:
- Omit spouse email from the UI: rejected because it contradicts the clarified spec.
- Fake spouse email from unrelated student-contact data inside the component: rejected because it would create an implicit, fragile join outside the typed service layer.
