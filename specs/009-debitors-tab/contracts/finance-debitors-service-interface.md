# Contract: Finance Debitors Service Interface

## Purpose

Define the service-layer contract required by the Finance `Debitors` tab.

## Existing Services Reused

- `SynVDebtorService.getAll(params)`
- `SynVStudentService.getVPastAndCurrentStudentAll(params)`

## Debtor List Query

**Consumer**: `DebitorsListPanel`

**Service boundary**: `src/services/Synergetic/Finance/SynVDebtorService.ts`

**Required query inputs**:
- `currentPage`
- `perPage = 10`
- debtor-name ascending sort
- optional combined free-text match across:
  - debtor surname
  - debtor given name
  - debtor preferred name
  - debtor email
  - debtor phone
  - debtor mobile phone
  - spouse surname
  - spouse given name
  - spouse preferred name
  - spouse email
  - spouse phone/mobile
- optional selected student `DebtorID`

**Required response shape**:
- paginated result metadata (`currentPage`, `perPage`, `total`, `pages`)
- debtor row data needed for:
  - Debitor ID
  - Debitor Name
  - Debitor Email
  - Debitor Phone
  - Debitor Spouse Name
  - Debitor Spouse Email
  - Debitor Spouse Phone
  - Debitor Address
  - Current Balance
  - Last Payment Amount
  - linked students list

## Student Selector Query

**Consumer**: current student async selector used by `DebitorsListPanel`

**Service boundary**: `src/services/Synergetic/Student/SynVStudentService.ts`

**Required query behaviour**:
- find current or past-and-current student records using the repo’s existing selector pattern
- return enough data for option label rendering and extraction of `StudentID`, `StudentGiven1`, `StudentSurname`, and `DebtorID`

## Contract Gap

The current `vDebtor` type/model does not expose spouse email. One of these must be planned before implementation is considered complete:

1. extend the debtor contract to include spouse email directly, or
2. provide an enriched debtor list service response that composes spouse email from an approved related source inside the service layer

The UI contract assumes this gap is resolved by the service boundary, not by ad hoc component logic.
