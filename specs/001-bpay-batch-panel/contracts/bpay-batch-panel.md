# Contract: BPay Batch Panel

## User-Facing UI Contract

### Entry Surface

- Surface: Finance module
- Existing location: `Finance` page, `BPay Batching` tab
- Access: existing Finance module access rules remain in force

### Inputs

1. **Creditor selection**
   - User can search and select one creditor
   - Input remains editable until add is in progress

2. **BPay record resolution**
   - If one active BPay record exists for the selected creditor, it becomes selected automatically
   - If multiple active BPay records exist, the panel shows a selectable table and exactly one row must be chosen

3. **Amount**
   - User enters one monetary amount
   - Amount must be valid and greater than zero before add is enabled

### Panel States

- **Initial**
  - No creditor selected
  - No BPay record selected
  - Amount empty
  - Add action disabled

- **Loading creditor BPay records**
  - Panel indicates loading
  - Add action disabled

- **Single BPay record resolved**
  - Record selected automatically
  - User can enter amount and add

- **Multiple BPay records resolved**
  - Table is visible
  - User must select one row before add

- **No BPay records available**
  - Empty-state message shown
  - Add action disabled

- **Submitting**
  - Add action disabled
  - Duplicate submission blocked

- **Success**
  - User sees confirmation or refreshed batch state showing the added item

- **Failure**
  - User sees an explicit error message
  - Existing valid selections remain recoverable where possible

### Add Workflow Contract

When the user presses Add with a valid creditor, resolved BPay record, and valid amount:

1. Resolve the current working batch.
2. If no batch exists, create a batch.
3. Check whether a section already exists for the selected creditor in that batch.
4. If no section exists, create one in the batch.
5. Create the section item under the resolved section.
6. Return or refresh the resulting batch state for display.

### Display Contract for Multiple BPay Records

The selectable table should make these fields scannable:

- Creditor identifier
- Biller code
- Reference number
- Notes/comments
- Active status when relevant

Only one record can be selected for the add action.
