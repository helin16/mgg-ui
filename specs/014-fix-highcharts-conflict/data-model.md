# Data Model: Reliable Schoolbox Class Results Charts

## Domain Data

This feature introduces no domain entity, persistent record, request payload, response payload, browser storage, or lifecycle state. Schoolbox continues to own Class Results data, and the custom application continues to receive its existing chart data through unchanged services and types.

## Ephemeral Runtime Values

The implementation handles two process-local values during module evaluation. They are documented here for design completeness and are not persisted entities.

### Host Chart Plugin Snapshot

- **Purpose**: Represent the exact state of the host's `jQuery.fn.highcharts` property before the custom Highcharts module initializes.
- **Fields**:
  - `prototype`: the detected host `jQuery.fn` object, when present.
  - `hadOwnProperty`: whether `highcharts` existed directly on that object.
  - `descriptor`: the complete original property descriptor when `hadOwnProperty` is true.
- **Validation rules**:
  - Capture only from the currently active host jQuery function prototype.
  - Restore the exact descriptor when present.
  - Delete a property introduced by custom initialization when it was originally absent.
- **Lifecycle**: Captured immediately before synchronous module load and discarded immediately after restoration.

### Private Highcharts Instance

- **Purpose**: Supply the custom React chart wrapper without exposing or substituting it as Schoolbox's plugin runtime.
- **Source**: The application's installed Highcharts module export.
- **Relationships**: Passed to `highcharts-react-official`; independent of the restored Schoolbox plugin.
- **Lifecycle**: Loaded once by the module system and reused by existing custom chart consumers.

## State Transition

```text
Host state captured
       ↓
Custom Highcharts module initializes
       ↓
Host plugin descriptor restored (always, including failure)
       ↓
Private module export supplied to custom charts
```

## Data and Privacy Impact

None. No school data is read, transformed, logged, stored, or transmitted by the isolation boundary.
