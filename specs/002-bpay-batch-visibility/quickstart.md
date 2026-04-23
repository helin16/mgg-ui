# Quickstart: BPay Batch Visibility

## Goal

Validate that finance users see existing BPay batches by default, can opt into the create
workflow with `+ New Batch`, and can return to the list with `Cancel`.

## Preconditions

- User has access to the Finance module.
- Test data includes:
  - one environment with at least one existing BPay batch
  - one environment or state with no existing BPay batches
  - at least one creditor that can be used by the existing create workflow

## Manual Validation

### Scenario 1: Existing batches are shown by default

1. Open Finance.
2. Navigate to `BPay Batching`.
3. Verify the first visible state is the batch list, not the creation panel.
4. Verify one or more existing batches are rendered.
5. Verify a visible `+ New Batch` control is present.
6. Verify the action is disabled while the list is loading.

### Scenario 2: Empty state is shown when no batches exist

1. Open Finance in a state where no BPay batches exist.
2. Navigate to `BPay Batching`.
3. Verify the screen shows an explicit empty-state message.
4. Verify `+ New Batch` is still available.

### Scenario 3: Enter create mode on demand

1. Start from the default batch list view.
2. Click `+ New Batch`.
3. Verify the creation panel appears.
4. Verify the creation panel includes a `Cancel` button.
5. Verify the existing creditor/BPay/amount workflow remains usable.
6. Complete one add flow if test data allows, then confirm the batch list refreshes when you return to list mode.

### Scenario 4: Cancel returns to the list

1. Enter create mode.
2. Optionally type values into the form.
3. Click `Cancel`.
4. Verify the creation panel is hidden.
5. Verify the default batch list view is visible again without leaving the tab.
6. Verify the user sees explicit feedback if unsaved values were discarded.

### Scenario 5: Loading and failure feedback are explicit

1. Open `BPay Batching` with slow or delayed batch retrieval.
2. Verify a visible loading state is shown instead of a blank panel.
3. Simulate or trigger a batch-list API failure.
4. Verify the user sees an explicit failure message.
