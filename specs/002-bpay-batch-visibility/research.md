# Research: BPay Batch Visibility

## Decision 1: Refactor the existing BPay panel instead of adding a new Finance tab

**Decision**: Keep the feature inside `src/components/BPay/CreditorBPayPanel.tsx` and add
an internal view state that switches between batch listing and batch creation.

**Rationale**: The user request changes the default behavior of the existing `BPay Batching`
tab, not the route or module structure. Reusing the current panel preserves the Finance
entry surface and avoids introducing redundant tabs or routes for closely related actions.

**Alternatives considered**:

- Add a second tab just for listing. Rejected because it splits one workflow across two tab
  surfaces without a user need.
- Replace the existing panel with a new standalone page. Rejected because it changes the
  established Finance module structure unnecessarily.

## Decision 2: Use the existing batch service as the source of truth for the default list

**Decision**: Load the default list through `CreditorBPayBatchService.getAll(...)` and use
the existing typed BPay batch contract for rendering.

**Rationale**: The service already exposes list retrieval and stays within the repo's typed
service-boundary requirement. This is enough for an initial list view if the UI limits
itself to batch-level summary fields and only requests section detail when needed.

**Alternatives considered**:

- Call the batch endpoint directly with `axios` from the component. Rejected because it
  violates the constitution and repo conventions.
- Add a new specialized list service immediately. Rejected unless the current payload proves
  insufficient during implementation.

## Decision 3: Treat list visibility and create visibility as explicit local UI state

**Decision**: Represent the default list view and the create-panel view as local component
state inside the BPay panel, with `+ New Batch` entering create mode and `Cancel` restoring
list mode.

**Rationale**: This behavior is screen-local and does not need Redux persistence. Local
state keeps the implementation narrow and matches the repo guidance to prefer local state
for route-local interaction.

**Alternatives considered**:

- Persist the mode in Redux. Rejected because no other screen needs the state.
- Encode the mode in routing/query params. Rejected because the feature does not require a
  shareable URL state.

## Decision 4: Show explicit list loading, empty, and failure states before creation

**Decision**: The BPay tab should default to a list panel with visible loading, empty, and
failure states, and should not expose the create form until the user requests it.

**Rationale**: This directly implements the spec and aligns with the constitution's
requirement for explicit async UX states. Finance users need to know whether batches exist
before deciding to create a new one.

**Alternatives considered**:

- Leave the tab blank during load. Rejected because it hides system state.
- Keep the create form visible alongside the list by default. Rejected because the user
  explicitly requested an on-demand create panel.

## Decision 5: Use manual Finance-tab verification and targeted helper tests

**Decision**: Document manual verification for list visibility, `+ New Batch`, and
`Cancel`, and add Jest coverage only if batch-list mapping or panel-state transitions are
extracted into pure helpers.

**Rationale**: The change is UI-heavy and depends on live Finance data. Manual validation is
the reliable short path, while pure helper logic can still be covered automatically if it is
extracted during implementation.

**Alternatives considered**:

- Require Cypress in the same change. Rejected because this iteration is primarily a UI
  state refactor and may not yet have stable Finance fixtures.
- Skip automated coverage entirely. Rejected because any new shared state logic should still
  be tested when practical.
