# Quickstart: Clipboard Return To Play

## Goal

Validate that Clipboard incidents return nested return-to-play data, that the UI interprets
the timestamp as UTC, and that the attendance concussion alert only shows active
restrictions.

## Preconditions

- `mgg-ui` branch `003-clipboard-return-to-play` is checked out.
- Matching `../mggs-api` changes for the nested `returnToPlay` contract are available.
- The Clipboard attendance modify page can be opened with a class containing test students.
- Test data includes:
  - one confirmed incident with a future or same-day `returnToPlay.date`
  - one confirmed incident with an already expired `returnToPlay.date`
  - one incident where the UTC timestamp sits near a Melbourne day boundary
  - one incident with a blank or missing `returnToPlay.reason`

## Automated Verification

### `mgg-ui`

1. Run the Clipboard incident service tests.
2. Run any added alert helper or component tests that cover UTC interpretation and nested
   return-to-play access.

### `../mggs-api`

1. Run the Clipboard connector tests for incident list and single-item retrieval.
2. Run the Clipboard incident controller tests.

## Manual Validation

### Scenario 1: Active restriction is shown

1. Open the Clipboard attendance modify page for a class with a qualifying confirmed
   incident.
2. Verify the alert renders for the student.
3. Verify the alert reason matches `returnToPlay.reason` when present.

### Scenario 2: Expired restriction is not shown

1. Open the attendance page for a class whose incident has a return-to-play date before the
   class date.
2. Verify no concussion alert is shown for that expired incident.

### Scenario 3: UTC boundary is interpreted correctly

1. Use an incident whose `returnToPlay.date` falls near midnight once converted to
   Australia/Melbourne time.
2. Verify the alert decision matches the local class date after UTC conversion.
3. Verify any displayed date text matches the local calendar day staff expect.

### Scenario 4: Missing reason degrades safely

1. Open a class with a qualifying incident that has a blank or missing
   `returnToPlay.reason`.
2. Verify the alert still renders.
3. Verify the reason text falls back to the generic concussion label.

### Scenario 5: Failure path remains usable

1. Simulate or trigger a Clipboard incident request failure.
2. Verify the page remains usable.
3. Verify the existing visible error path is triggered and no stale alert remains visible.
