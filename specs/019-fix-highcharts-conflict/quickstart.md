# Quickstart: Reliable Schoolbox Class Results Charts

## Implementation Sequence

1. Add `src/components/chart/HighchartsRuntime.ts`.
2. Capture the host `jQuery.fn.highcharts` own-property descriptor or absence.
3. Synchronously load the application's Highcharts module within `try/finally`.
4. Restore the exact descriptor or delete the newly introduced property in `finally`.
5. Update `src/components/chart/Chart.tsx` to consume the isolated instance.
6. Add focused runtime isolation tests and update the Chart wrapper test.
7. Do not change AppLoader timing or import `highcharts-more` for Schoolbox.

## Automated Verification

Run focused tests during development:

```bash
yarn test --watchAll=false --runInBand \
  src/__tests__/components/chart/HighchartsRuntime.test.ts \
  src/__tests__/components/chart/Chart.test.tsx \
  src/__tests__/AppLoader/MggAppLoader.test.ts
```

Run the full suite:

```bash
yarn test --watchAll=false --runInBand
```

Build the production and AppLoader bundles:

```bash
yarn build
```

Automated assertions must cover:

- Existing host plugin descriptor and identity are unchanged.
- An initially absent plugin remains absent.
- Loading works when jQuery is absent.
- Host state is restored when module initialization throws.
- The private Highcharts instance is returned to the React wrapper.
- Existing Chart and AppLoader tests remain green.

## Authenticated Browser Acceptance Matrix

Use the affected Schoolbox grades URL with the shared custom script enabled. Record the exact browser version, cache mode, pass count, visible chart result, and console result.

| Browser | Cached normal loads | Uncached normal loads | Required result |
|---------|---------------------|-----------------------|-----------------|
| Chrome | 20 | 20 | 40/40 pass |
| Edge | 20 | 20 | 40/40 pass |
| Safari | 20 | 20 | 40/40 pass |
| Firefox | 20 | 20 | 40/40 pass |

For every run:

1. Open or normally reload the grades page; do not use Shift-refresh as a workaround.
2. Select **Class Results**.
3. Confirm the boxplot is visible and interactive on the first load.
4. Confirm the developer console contains no Highcharts error #17, missing boxplot module error, or custom-runtime constructor error.

For cached runs, leave browser cache enabled and use a normal reload. For uncached runs, use the browser's developer tools to disable cache while tools are open, then use a normal reload; alternatively clear only the site's cache before each normal load.

## Regression Smoke Tests

In each required browser, also verify:

- A representative non-chart Schoolbox page still behaves normally.
- Another Schoolbox page/chart still renders normally.
- Each of the four custom chart consumers renders its expected data and interactions:
  - Co-curricular activities by type.
  - Leadership and awards by type.
  - Wellbeing absences by class.
  - Wellbeing absences by reason.

## Evidence to Record

- Commit/build identifier.
- Browser names and exact versions.
- Cached and uncached pass totals.
- Console result for Class Results initialization.
- Custom chart smoke-test results.
- Any skipped check and its reason.
