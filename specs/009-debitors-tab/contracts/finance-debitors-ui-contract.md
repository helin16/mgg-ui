# Contract: Finance Debitors UI Contract

## Surface

`src/pages/Finance/FinancePage.tsx`

## Entry Behaviour

- The Finance page shows a new tab labelled `Debitors`.
- The tab is available wherever the existing Finance page is available.
- No new route or admin-only surface is introduced.

## Filter Controls

- A free-text search input
- An async current-student selector
- A `Search` button
- A `Reset Filters` button placed beside `Search`

## Search Behaviour

- Filters do not trigger debtor reload until `Search` is clicked.
- `Reset Filters` clears the text search and current-student selection, resets paging to page 1, and loads the default result set.
- Paging preserves the active filters until a new search or reset is triggered.

## Result Table

Use the shared table workflow with:
- `hover`
- `striped`
- `responsive`

Required visible columns:
- Debitor ID
- Debitor Name
- Debitor Email
- Debitor Phone
- Debitor Spouse Name
- Debitor Spouse Email
- Debitor Spouse Phone
- Debitor Address
- Students
- Current Balance
- Last Payment Amt

`Students` column requirements:
- render as a compact table
- no table header
- each entry shows Student ID and Student Name

## Result States

- Initial loading state
- Search loading state
- Reset loading state
- Successful results state
- Empty results state
- Failure state

## Pagination

- 10 rows per page
- default page is 1
- default sort is Debitor Name ascending alphabetic order
- filter changes reset paging to page 1 on the next search
