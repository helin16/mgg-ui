# Research: Reliable Schoolbox Class Results Charts

## Decision 1: Isolate the application's Highcharts initialization

**Decision**: Load the application's Highcharts package through a synchronous adapter that captures and restores the host page's exact `jQuery.fn.highcharts` property descriptor.

**Rationale**: Highcharts 10.3.3 registers itself as a jQuery plugin whenever a global jQuery exists. That plugin closes over the application's private Highcharts instance. On Schoolbox pages, the registration replaces Schoolbox's plugin, causing Schoolbox's Class Results boxplot request to reach an instance that lacks the boxplot series. Capturing the full descriptor preserves identity and property semantics, and synchronous loading prevents another page script from interleaving between capture and restoration.

**Alternatives considered**:

- Restore only the function value: rejected because it does not preserve descriptor flags or distinguish an inherited/absent property.
- Temporarily remove global jQuery while the whole application script loads: rejected because the broader asynchronous load window could disrupt Schoolbox.
- Put the custom application in a new iframe: rejected as disproportionate and incompatible with existing embedded components.

## Decision 2: Keep the loader timing unchanged

**Decision**: Do not modify the AppLoader's `async`/`defer` behavior as part of this fix.

**Rationale**: Cache and network timing currently determine which chart plugin wins. Changing script attributes merely selects a different likely order and leaves global ownership unresolved. Runtime isolation remains correct whether the custom bundle loads before or after Schoolbox chart resources.

**Alternatives considered**:

- Remove `async`: rejected because a deterministic order can still overwrite the wrong owner and may delay page loading.
- Remove `defer`: rejected for the same reason and because dynamic scripts already have their own execution semantics.
- Delay the custom bundle until Schoolbox initialization completes: rejected because there is no stable host completion contract and later pages/releases may change timing.

## Decision 3: Do not add Schoolbox chart modules to the custom runtime

**Decision**: Do not load `highcharts-more` merely to provide boxplot support to Schoolbox.

**Rationale**: Registering boxplot in the custom instance could hide the immediate error but would still replace a Schoolbox-owned integration. Other Schoolbox modules, options, or future version differences could fail next, and the two applications would remain coupled to one accidental global winner.

**Alternatives considered**:

- Import `highcharts-more`: rejected as symptom treatment and version coupling.
- Use Schoolbox's Highcharts instance for custom charts: rejected because it is not a documented host contract and may differ across Schoolbox releases.

## Decision 4: Use the single chart adapter boundary

**Decision**: Add `src/components/chart/HighchartsRuntime.ts` and make `Chart.tsx` import the isolated instance from it.

**Rationale**: `Chart.tsx` is the only direct Highcharts import in `src/`. Four student-report components already use this wrapper, so one boundary fixes broad bundle evaluation without consumer migrations.

**Alternatives considered**:

- Patch every chart consumer: rejected as duplication and unnecessary migration risk.
- Move the logic into AppLoader: rejected because the loader should not know library internals and cannot bracket Highcharts module evaluation directly.

## Decision 5: Combine deterministic automation with real-browser validation

**Decision**: Use Jest for the host-global invariant and custom chart regression, then perform authenticated manual validation in actual current Chrome, Edge, Safari, and Firefox under cached and uncached conditions.

**Rationale**: The repository's Cypress setup has no Schoolbox SSO/session support; Edge is not installed locally; Cypress does not support Safari/WebKit. Jest can reliably prove that module initialization restores the host plugin, while manual testing is required to validate the actual Schoolbox bundle, boxplot, authentication, caching, and requested browser matrix.

**Alternatives considered**:

- Cypress-only: rejected because it cannot cover Safari, currently cannot cover Edge locally, and lacks authenticated Schoolbox setup.
- Playwright: rejected for this focused change because it is not installed, WebKit is not actual Safari, Chromium is not actual Edge validation, and authentication/secrets remain unresolved.
- Manual-only: rejected because it would not provide repeatable regression protection for the ownership invariant.

## Verified Technical Facts

- Installed versions: `highcharts@10.3.3`, `highcharts-react-official@3.2.3`.
- Highcharts assigns `win.jQuery.fn.highcharts` during core initialization when jQuery exists.
- Boxplot is registered by Highcharts More, not the imported core package.
- `AppLoader/src/MggAppLoader.ts` dynamically appends the main bundle with `async` and `defer` and does so even when no custom application mount point is created.
- `src/index.tsx` evaluates the application dependency graph even when it does not render `<App>`.
- There is exactly one direct Highcharts import in `src/` and four existing wrapper consumers.
- No backend, service, type, API, environment, storage, or access-control change is required.
