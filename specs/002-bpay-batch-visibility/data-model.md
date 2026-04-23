# Data Model: BPay Batch Visibility

## BPay Batch

**Purpose**: Represents an existing batch record displayed in the default BPay batch list.

**Key fields**:

- `id` / `Id`
- `totalAmount` / `totalAmt`
- `generatedAt`
- `generatedById`
- `createdAt`
- `updatedAt`
- `comments`
- `Sections[]` when detail is already available

**Relationships**:

- Has many `BPay Batch Section`

**Validation / rules**:

- All returned batches are eligible for display in the default list.
- A working or ungenerated batch may be highlighted or reused by the create workflow, but
  the list itself must still show the broader available batch set returned by the service.

## BPay Batch List View

**Purpose**: The default screen state shown when the Finance user enters the `BPay Batching`
tab.

**Key fields**:

- `isLoading`
- `loadError`
- `batches[]`
- `isCreateMode`

**Relationships**:

- Renders zero or more `BPay Batch` records
- Transitions to `BPay Batch Creation Panel`

**Validation / rules**:

- This view is the initial state on tab load.
- It must render an explicit loading state while fetching batches.
- It must render an explicit empty state when no batches are returned.
- It must render an explicit failure state if retrieval fails.

## BPay Batch Creation Panel

**Purpose**: The on-demand entry form for creating or extending a BPay batch after the user
chooses `+ New Batch`.

**Key fields**:

- `selectedCreditor`
- `selectedBPayInfo`
- `amount`
- `errors`
- `isSubmitting`
- `isLoadingInfos`

**Relationships**:

- Is shown from `BPay Batch List View`
- Creates or updates a `BPay Batch`

**Validation / rules**:

- Hidden by default.
- Becomes visible only after `+ New Batch`.
- Must include a `Cancel` action.
- `Cancel` hides the panel and restores the list view.
- Unsaved form state handling must be explicit and user-visible if data would be discarded.

## BPay Batch Visibility State

**Purpose**: Encapsulates the local UI mode and transitions between the default list and the
creation workflow.

**Key fields**:

- `mode` (`list` or `create`)
- `hasUnsavedChanges`
- `pendingRefresh`

**Relationships**:

- Controls both `BPay Batch List View` and `BPay Batch Creation Panel`

**Validation / rules**:

- Initial mode is `list`.
- `+ New Batch` moves from `list` to `create`.
- `Cancel` moves from `create` back to `list`.
- After a successful add, the visible list should be refreshable so the default state is not
  stale the next time the user returns to it.
