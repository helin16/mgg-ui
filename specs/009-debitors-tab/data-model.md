# Data Model: Finance Debitors Tab

## DebitorSearchCriteria

**Purpose**: Captures the user-selected filter and pagination inputs used to request a debtor result set.

**Fields**:
- `searchText: string`
- `selectedStudentId: number | null`
- `selectedStudentDebtorId: number | null`
- `currentPage: number`
- `perPage: number`
- `sortBy: 'DebitorName'`
- `sortDirection: 'ASC'`

**Validation rules**:
- `searchText` is trimmed before request submission.
- `currentPage` must be at least `1`.
- `perPage` is fixed at `10` for this feature.
- `selectedStudentDebtorId` may be null when no student is selected.
- A search request may use text only, student only, both, or neither.

**State transitions**:
- Initial state: empty search text, no student selected, page `1`.
- Search submitted: current criteria become the active request criteria.
- Filters changed before submit: local draft criteria diverge from active request criteria.
- Reset: restore initial state and active criteria.

## DebitorListRow

**Purpose**: Represents one debtor row rendered in `DebitorsListPanel`.

**Fields**:
- `debitorId: number`
- `debitorName: string`
- `debitorEmail: string`
- `debitorPhone: string`
- `debitorSpouseName: string`
- `debitorSpouseEmail: string`
- `debitorSpousePhone: string`
- `debitorAddress: string`
- `students: LinkedStudentSummary[]`
- `currentBalance: number`
- `lastPaymentAmount: number`

**Derived sources**:
- Debtor identity/contact/finance values come from the debtor service response.
- `students` is derived from the debtor-to-student relationship expected for the feature and may require enrichment beyond the base debtor row.
- `debitorName` is the value used for the default sort order.

**Validation rules**:
- `debitorId` is required.
- `debitorName` is required for sorting and display.
- `students` may be empty when no linked students are available.
- `debitorSpouseEmail` may be blank only if the service contract cannot provide a value for a given debtor; implementation must still support the field.

## LinkedStudentSummary

**Purpose**: Represents one student entry shown inside the debtor row’s `Students` column.

**Fields**:
- `studentId: number`
- `studentName: string`

**Validation rules**:
- Both values are required for rendering inside the compact nested table.
- Entries should be unique per debtor row by `studentId`.

## DebitorsListViewState

**Purpose**: Tracks the UI status for the panel across initial load, explicit searches, reset, and paging.

**Fields**:
- `draftCriteria: DebitorSearchCriteria`
- `activeCriteria: DebitorSearchCriteria`
- `rows: DebitorListRow[]`
- `totalRows: number`
- `totalPages: number`
- `isInitialLoading: boolean`
- `isSearching: boolean`
- `isResetting: boolean`
- `isStudentOptionsLoading: boolean`
- `errorMessage: string | null`
- `hasLoadedOnce: boolean`

**State transitions**:
- `idle -> initial loading` when the panel first fetches the default result set.
- `loaded -> searching` when `Search` is clicked.
- `loaded -> resetting` when `Reset Filters` is clicked.
- `loading/searching/resetting -> loaded` on success.
- `loading/searching/resetting -> error` on request failure.
- `loaded -> empty` when a successful request returns zero rows.

## Relationship Notes

- A selected current student filters debtor rows by the student’s `DebtorID`.
- A debtor row may represent multiple linked students in the nested `Students` column even though the base debtor contract already carries `DebtorStudentID`; the implementation may need an enriched service response or supplementary join logic at the service boundary.
- Spouse email is part of the required row contract even though it is not present in the current base `vDebtor` type and must therefore be added or enriched through the service layer.
