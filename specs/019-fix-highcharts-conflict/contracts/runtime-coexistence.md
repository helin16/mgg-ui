# Runtime Coexistence Contract

## Purpose

Define the internal boundary between the Schoolbox-owned chart runtime and the custom application's private chart runtime when both execute in the same browser page.

## Host Ownership Contract

1. If `jQuery.fn.highcharts` exists before the custom Highcharts module loads, the same property descriptor and function identity MUST exist after loading completes.
2. If `jQuery.fn.highcharts` is absent before loading, it MUST remain absent afterward.
3. If host jQuery or its function prototype is absent, custom Highcharts loading MUST still return the application's private module instance without creating a host jQuery object.
4. Host state restoration MUST run if custom Highcharts initialization throws.
5. The adapter MUST NOT assign the custom instance to `window.Highcharts` or otherwise publish it as a Schoolbox dependency.

## Custom Chart Contract

1. The adapter MUST return the application's Highcharts module instance.
2. `Chart.tsx` MUST pass that instance to `highcharts-react-official`.
3. Existing chart options, data, labels, and interactions MUST remain unchanged.
4. All custom chart consumers MUST continue to use the shared `Chart.tsx` wrapper rather than importing Highcharts directly.

## Load-Order Contract

The host ownership invariants MUST hold when:

- Schoolbox installs its plugin before the custom bundle executes.
- Schoolbox has not installed a plugin when the custom bundle executes.
- Browser cache and network conditions change resource completion order.
- The page contains no custom application mount point but still evaluates the custom bundle.

## Failure and Observability Contract

- Successful Class Results initialization produces no Highcharts error #17 or equivalent chart-runtime conflict.
- Any chart initialization failure remains visible in the browser developer console.
- No new centralized reporting, toast, modal, or user-facing error state is introduced.

## Excluded Contracts

No HTTP endpoint, service method, shared data type, environment variable, storage schema, route, or access-control contract changes.
