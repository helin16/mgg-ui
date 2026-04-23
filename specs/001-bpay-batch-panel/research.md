# Research: BPay Batch Panel

## Decision 1: Reuse the existing creditor autocomplete

**Decision**: Use `src/components/synCreditor/SynCreditorSelector.tsx` as the creditor
selection entry point for the BPay panel.

**Rationale**: The selector already handles async creditor search, preselected values,
active creditor filtering, and shared error handling through `Toaster`. Reusing it keeps
the new flow aligned with the repo's typed service boundary and avoids inventing a second
creditor search pattern.

**Alternatives considered**:

- Build a panel-specific autocomplete from `AutoComplete` directly. Rejected because it
  would duplicate existing creditor query logic.
- Use a simple select list. Rejected because creditor volume makes direct listing
  impractical.

## Decision 2: Use the shared table for multi-record BPay selection

**Decision**: Present multiple creditor BPay records using the shared `Table` component in
`src/components/common/Table.tsx`.

**Rationale**: The shared table already fits the repo's UI patterns, supports custom cells,
and is consistent with the constitution's reuse requirement. A simple selectable table is
enough for the user to choose one BPay record without adding another custom grid pattern.

**Alternatives considered**:

- Render multiple BPay records in cards. Rejected because tabular comparison of biller code,
  reference, and notes is clearer.
- Use radio buttons without a table. Rejected because the important record attributes would
  be harder to scan.

## Decision 3: Keep batching orchestration in shared service files

**Decision**: Drive batch, section, and section-item creation through `src/services/BPay/*`
and load creditor BPay records through `src/services/Synergetic/Finance/*`.

**Rationale**: The constitution requires service-layer boundaries, and the repo already
centralizes API communication in `AppService`-based service files. The UI panel should
compose those calls, not build request logic inline.

**Alternatives considered**:

- Make direct `axios` calls from the panel. Rejected because it violates repo architecture.
- Collapse all batching behaviour into one giant new service. Rejected because batch,
  section, and item concepts already exist as separate domain entities.

## Decision 4: Treat the add operation as a sequential orchestration with explicit UI states

**Decision**: Model the add action as one user-triggered workflow that can create a batch,
conditionally create a section, and then create the section item while keeping the button
disabled and surfacing success/failure through shared UI feedback.

**Rationale**: This matches the spec's business flow and the constitution's explicit async
state requirement. It also makes it clear where validation and rollback messaging belong if
later enhancements add richer transaction behaviour.

**Alternatives considered**:

- Split the workflow into separate "Create Batch", "Create Section", and "Add Item" user
  actions. Rejected because it pushes backend structure decisions onto finance users.
- Hide failures and refresh silently. Rejected because finance operators need clear outcome
  feedback.

## Decision 5: Use manual verification for the end-to-end finance flow and automate pure logic

**Decision**: Document a manual quickstart covering creditor lookup, single-record
auto-selection, multi-record selection, and section reuse, while adding automated tests only
for any new pure selection/grouping helpers introduced during implementation.

**Rationale**: The repo already has limited automated UI coverage and this feature depends on
multiple finance/backend states. A manual flow is the most reliable immediate verification
path, while pure logic remains suitable for Jest coverage.

**Alternatives considered**:

- Require full Cypress automation in the same iteration. Rejected because this flow depends
  on finance data state that is not yet scaffolded in test fixtures.
- Skip verification guidance. Rejected because it violates the constitution.
