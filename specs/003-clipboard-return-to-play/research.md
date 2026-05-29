# Research: Clipboard Return To Play

## Decision 1: Normalize the contract to a nested `returnToPlay` object in both repos

**Decision**: Replace the flat `returnToPlayDate` and `returnToPlayReason` incident fields
with a nested `returnToPlay` object containing `date` and `reason`, and use that shape
consistently for Clipboard incident list and single-item responses.

**Rationale**: The upstream Clipboard payload now provides return-to-play details as a
single nested object. Mirroring that shape in `../mggs-api` and `mgg-ui` removes the
current mismatch between the real payload and the shared contracts that the alert consumes.

**Alternatives considered**:

- Keep flattening the nested Clipboard payload into legacy top-level fields. Rejected
  because it preserves a contract that is already diverging from the source payload and
  makes future fields under `returnToPlay` harder to add cleanly.
- Support both flat and nested shapes indefinitely. Rejected because the spec assumes a
  coordinated release across both repos and there is no stated need for long-term dual
  compatibility.

## Decision 2: Treat `returnToPlay.date` as UTC and convert only at the UI boundary

**Decision**: Preserve the raw return-to-play timestamp as a UTC datetime in the API
contract, and have the UI parse it as UTC before local date comparison or user-facing
formatting.

**Rationale**: The supplied sample (`2026-06-01T14:00:00`) crosses a day boundary in
Australia/Melbourne, so treating it as local time would produce incorrect active/inactive
restriction decisions around midnight. The API proxy should avoid guessing user locale,
while the UI already owns local formatting concerns.

**Alternatives considered**:

- Convert the timestamp to local time in `../mggs-api`. Rejected because the API layer does
  not know the consuming user timezone and would leak presentation concerns into the proxy.
- Compare the raw timestamp without UTC normalization in the UI. Rejected because it risks
  incorrect day-boundary behaviour for Melbourne staff.

## Decision 3: Keep the existing alert async pattern and change only the data interpretation

**Decision**: Reuse the current alert flow that hides the panel while loading, shows API
errors through `Toaster`, and only renders when active incidents remain after filtering.

**Rationale**: The feature is a contract correction, not a new surface. The current async
behaviour already satisfies the repo constitution for explicit failure handling, so the
change should stay focused on contract shape and restriction filtering.

**Alternatives considered**:

- Add new loading or empty UI for the alert in this change. Rejected because the existing
  behaviour is already established and outside the contract-shape request.
- Move filtering into a new shared store or route-level loader. Rejected because the logic
  remains local to one embedded alert component.

## Decision 4: Update the service field selection and tests alongside the type change

**Decision**: Change the selected Clipboard incident fields, shared TypeScript incident
types, and the current Jest tests in both repos as one unit of work.

**Rationale**: The incident service currently requests and tests the legacy flat fields
explicitly. Leaving the selection headers or tests behind would make the plan incomplete and
allow the stale contract to persist in adjacent code even if the main component compiles.

**Alternatives considered**:

- Change only the runtime component logic. Rejected because the service layer and tests are
  part of the typed boundary that the constitution requires.
- Defer test updates until after the UI works manually. Rejected because the affected logic
  is shared contract code with clear existing automated coverage points.

## Decision 5: Verify end-to-end behaviour with automated contract tests plus manual attendance checks

**Decision**: Add automated coverage for the changed incident contracts in both repos and
document manual validation for the actual attendance-page alert behaviour, including a UTC
boundary case.

**Rationale**: The contract shape can be tested reliably in isolation, while the final
alert behaviour depends on the embedded attendance context and real Clipboard-like data.
That matches the repo's risk-based verification rule.

**Alternatives considered**:

- Rely on manual validation only. Rejected because the service and connector contracts are
  already unit-tested and should remain covered.
- Require Cypress or browser automation in the same iteration. Rejected because this flow is
  embedded into an existing attendance surface and documented manual validation is the
  practical path for the cross-system behaviour.
