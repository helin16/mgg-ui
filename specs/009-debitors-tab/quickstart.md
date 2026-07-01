# Quickstart: Finance Debitors Tab

## Goal

Implement a new `Debitors` tab on the Finance page that lists debtor records with explicit search/reset actions, 10-row pagination, current-student filtering, and debtor/spouse search coverage.

## Preconditions

- Work on branch `009-debitors-tab`.
- Use the existing Finance module page at `src/pages/Finance/FinancePage.tsx`.
- Keep all backend interactions in `src/services/*` and all contracts in `src/types/*`.
- Confirm how spouse email will be supplied before final UI wiring is considered complete.

## Implementation Outline

1. Extend `FinancePage` with a new `Debitors` tab and render `DebitorsListPanel`.
2. Create typed search-criteria and row contracts for the panel.
3. Implement the panel with:
   - text search input
   - async current-student selector
   - `Search` button
   - `Reset Filters` button
   - shared `Table` with `hover`, `striped`, and `responsive`
   - pagination wired to 10 rows per page
4. Reuse or extend `SynVDebtorService` for sorted, paginated debtor retrieval.
5. Ensure the service-layer response can supply:
   - spouse email
   - linked students for the nested `Students` table
6. Add focused automated tests and run manual Finance workflow verification.

## Verification Targets

- `FinancePage` shows the `Debitors` tab.
- Default load fetches page 1 sorted by debtor name ascending.
- `Search` applies text and student filters together.
- `Reset Filters` clears both filters and returns to page 1.
- Table columns and nested `Students` rendering match the spec.
- Loading, empty, and failure states are visible and explicit.
- Service tests cover any new or extended debtor query wrapper.

## Known Design Risk

- The current debtor contract does not expose spouse email. Do not hide this gap inside the component; resolve it at the service/type contract boundary.
