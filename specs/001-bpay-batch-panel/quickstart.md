# Quickstart: BPay Batch Panel

## Goal

Validate that finance users can create and extend a BPay batch from the BPay Batching tab.

## Preconditions

- User has access to the Finance module.
- At least one active creditor exists.
- Test data includes:
  - one creditor with exactly one active BPay record
  - one creditor with multiple active BPay records
  - one creditor already represented in an existing working batch section

## Manual Validation

### Scenario 1: Create a new batch from a single BPay record

1. Open Finance.
2. Navigate to `BPay Batching`.
3. Search for a creditor that has exactly one active BPay record.
4. Confirm no extra BPay-selection step is required.
5. Enter a valid positive amount.
6. Click Add.
7. Verify a new batch is created, a section for the creditor is created, and the new item appears in the resulting batch state or success feedback.

### Scenario 2: Select one record from multiple BPay records

1. Search for a creditor that has multiple active BPay records.
2. Confirm a selectable table is displayed.
3. Verify Add stays unavailable until one record is selected.
4. Select one record.
5. Enter a valid amount and click Add.
6. Verify the new item uses the selected BPay record.

### Scenario 3: Reuse an existing creditor section

1. Start from a batch that already contains a section for a creditor.
2. Select that same creditor again.
3. Resolve the BPay record.
4. Enter a valid amount and click Add.
5. Verify the new item is added to the existing section instead of creating a duplicate section.

### Scenario 4: Create a new section in an existing batch

1. Start from a batch that exists but does not yet contain a section for a second creditor.
2. Select the second creditor.
3. Resolve the BPay record and enter a valid amount.
4. Click Add.
5. Verify the batch is reused and a new section is created only for that creditor.

### Scenario 5: Validation and error handling

1. Try to add with no creditor selected.
2. Try to add with no BPay record selected when multiple records exist.
3. Try to add with blank, zero, and negative amounts.
4. Verify validation messages are shown and submission is blocked.
5. Simulate or trigger a backend failure and verify the user sees an explicit error message.
