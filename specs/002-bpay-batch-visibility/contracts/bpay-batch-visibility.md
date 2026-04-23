# Contract: BPay Batch Visibility

## User-Facing UI Contract

### Entry Surface

- Surface: Finance module
- Existing location: `Finance` page, `BPay Batching` tab
- Access: existing Finance module access rules remain in force through the current page
  wrapper

### Default Load Contract

When the user opens the `BPay Batching` tab:

1. The system requests all BPay batches through the shared batch service.
2. The screen shows a visible loading state while the request is in progress.
3. On success:
   - if one or more batches exist, the screen shows the batch list
   - if no batches exist, the screen shows an explicit empty-state message
4. On failure, the screen shows an explicit error state with user-visible feedback.

### List View Contract

The default list view must provide:

- a visible title/context for existing BPay batches
- a scan-friendly representation of returned batches
- a visible `+ New Batch` action
- a disabled or guarded `+ New Batch` state while the batch list is still loading or when
  the list is in an unresolved failure state

The default list view must not require the user to open the create form just to see whether
batches already exist.

### Create View Contract

When the user clicks `+ New Batch`:

1. The list view remains the logical parent state.
2. The batch creation panel becomes visible.
3. The creation panel includes:
   - the existing creditor/BPay/amount add workflow
   - a visible `Cancel` action
4. After a successful add, the batch list data is refreshed so the default list state is not stale.

### Cancel Contract

When the user clicks `Cancel` from the creation panel:

1. The creation panel is hidden.
2. The default batch list view is restored without leaving the tab.
3. If unsaved values would be discarded, the behavior must be explicit to the user through visible messaging.

### Async State Contract

- **Batch list loading**: visible spinner or loading panel, no blank state
- **Batch list empty**: explicit empty-state message and `+ New Batch` remains available
- **Batch list failure**: explicit error message with a recovery/retry path if implemented
- **Create mode**: existing async states for creditor BPay loading and submit remain in
  force
- **Cancel during create mode**: restore default list state cleanly

### Data Contract

- Batch list rendering should use the existing typed BPay batch payload from
  `src/services/BPay/CreditorBPayBatchService.ts`
- New contracts or type changes are only required if the existing payload cannot support a
  useful list summary
