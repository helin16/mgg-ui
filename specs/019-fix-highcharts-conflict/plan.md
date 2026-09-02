# Implementation Plan: Reliable Schoolbox Class Results Charts

**Branch**: `019-fix-highcharts-conflict` | **Date**: 2026-09-02 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/019-fix-highcharts-conflict/spec.md`

## Summary

Prevent the custom application bundle from replacing Schoolbox's existing jQuery Highcharts plugin when both runtimes share a page. Introduce a synchronous Highcharts isolation adapter at the application's single direct Highcharts import boundary. The adapter captures the exact host `jQuery.fn.highcharts` property descriptor (or its absence), loads the application's private Highcharts instance, and restores the host state in a `finally` block. Existing React chart consumers continue receiving the private instance, while Schoolbox retains ownership of the plugin it needs for Class Results boxplots regardless of cache-dependent script order.

## Technical Context

**Language/Version**: TypeScript 4.9, JavaScript ES2022, Node.js 20+, React 18  
**Primary Dependencies**: Highcharts 10.3.3, highcharts-react-official 3.2.3, React Scripts 5, Schoolbox 26.1.9 host runtime  
**Storage**: N/A — no persistent or browser storage changes  
**Testing**: Jest/React Testing Library for deterministic runtime isolation; existing AppLoader tests; production build; authenticated manual browser matrix for Chrome, Edge, Safari, and Firefox  
**Target Platform**: Authenticated Schoolbox desktop pages and the custom web application in current Chrome, Edge, Safari, and Firefox  
**Project Type**: Single React/TypeScript web application with a shared Schoolbox-injected application bundle  
**Performance Goals**: No additional network request; synchronous adapter overhead limited to one property snapshot/restore during initial bundle evaluation; Class Results visible on first normal load  
**Constraints**: Schoolbox code cannot be changed; the custom bundle is injected broadly and loads asynchronously; host globals must remain untouched after custom Highcharts initialization; no new monitoring, service, API, environment, or data contract  
**Scale/Scope**: One direct Highcharts import, four custom chart consumers, all authenticated Schoolbox pages receiving the shared loader, and 40 acceptance reloads per browser (20 cached and 20 uncached)

## Constitution Check

*GATE: Passed before Phase 0 research and re-checked after Phase 1 design.*

- **I. Module-Gated Delivery — PASS / not newly applicable**: The affected entry point is the existing Schoolbox-owned authenticated `/learning/grades/...` surface plus other authenticated Schoolbox pages receiving the shared loader. No new route or module is created, no mgg-ui `moduleId` applies, and Schoolbox's existing access control remains unchanged. Existing custom student-report access rules are preserved.
- **II. Typed Service Boundaries — PASS / not applicable**: The feature performs no backend interaction and changes no `src/services/*` or `src/types/*` contract. The runtime coexistence boundary is documented in `contracts/runtime-coexistence.md`.
- **III. Explicit Async UX States — PASS / not applicable**: No user-triggered async action or new UI state is introduced. Existing Class Results loading, empty, success, and error presentation remains Schoolbox-owned.
- **IV. School Data and Configuration Safety — PASS**: No student/staff data, storage, environment variables, tokens, HTML injection, uploads, payments, or embeds are added. Failures remain visible only in the browser developer console as clarified.
- **V. Risk-Based Verification — PASS**: Automated tests cover exact host-plugin preservation, absent-plugin preservation, restoration on failure, and continued custom chart use. The real cross-system workflow receives documented authenticated validation across all four required browsers and both cache modes.

### Post-Design Re-check

The completed design retains all five passes. It adds only a local chart-runtime adapter and tests, with no exception or constitution violation.

## Project Structure

### Documentation (this feature)

```text
specs/019-fix-highcharts-conflict/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── runtime-coexistence.md
└── tasks.md                     # Created later by /speckit.tasks
```

### Source Code (repository root)

```text
src/
├── components/
│   └── chart/
│       ├── Chart.tsx                         # MODIFY: consume isolated instance
│       └── HighchartsRuntime.ts              # NEW: load/restore boundary
└── __tests__/
    └── components/
        └── chart/
            ├── Chart.test.tsx                # MODIFY: adapter integration
            └── HighchartsRuntime.test.ts     # NEW: host-global invariants

AppLoader/
└── src/
    └── MggAppLoader.ts                       # UNCHANGED: timing is not the fix

cypress/
└── e2e/                                      # UNCHANGED: real SSO/browser matrix is manual
```

**Structure Decision**: Keep the change at the existing shared chart adapter boundary. `Chart.tsx` is the only direct Highcharts importer, so a sibling `HighchartsRuntime.ts` isolates module initialization for every existing consumer without changing routes, pages, the loader, services, types, Redux, or the backend.

## Phase 0: Research Decisions

Research is consolidated in [research.md](research.md). All technical unknowns are resolved:

1. Highcharts 10.3.3 mutates `window.jQuery.fn.highcharts` during module initialization.
2. The Schoolbox error is caused by its boxplot request reaching the custom application's Highcharts core, which does not register boxplot.
3. Exact property-descriptor restoration around synchronous module loading is the narrowest reliable ownership boundary.
4. Loader timing changes and adding `highcharts-more` do not resolve global ownership.
5. Automated tests prove the isolation invariant; real authenticated browser/cache behavior requires manual validation.

## Phase 1: Design

### Runtime Isolation Flow

1. `HighchartsRuntime.ts` reads `window.jQuery?.fn` if present.
2. It records whether `highcharts` is an own property and captures its full property descriptor.
3. Inside `try`, it synchronously loads the application's Highcharts package and retains that private module export.
4. Inside `finally`, it restores the captured descriptor when one existed, or removes the property if the custom module added it to a host that previously had none.
5. If no jQuery/function prototype exists, it loads Highcharts without host-plugin restoration work.
6. `Chart.tsx` passes the isolated private instance to `highcharts-react-official` exactly as before.

The adapter does not assign `window.Highcharts`, load Schoolbox modules, or retain a mutable reference to Schoolbox internals.

### Verification Design

- Unit-test an existing host plugin with a non-default descriptor and assert exact descriptor/function identity after module load.
- Unit-test a host jQuery object without a `highcharts` property and assert the property remains absent.
- Unit-test the no-jQuery case and confirm the private Highcharts export is returned.
- Unit-test restoration through `finally` when module initialization throws.
- Update the Chart wrapper test to confirm it receives the isolated private instance and renders.
- Run the existing AppLoader tests to protect broad script injection behavior even though the loader is unchanged.
- Run the full Jest suite and production build.
- Complete the authenticated acceptance matrix in [quickstart.md](quickstart.md), including 20 cached and 20 uncached normal loads in each required browser, console inspection, all four custom chart consumers, another Schoolbox chart, and a non-chart page.

## Interfaces and Data

- No domain entities or persisted state are introduced; see [data-model.md](data-model.md).
- No HTTP, service, or backend API changes are introduced.
- The internal host/runtime ownership rules are specified in [runtime-coexistence.md](contracts/runtime-coexistence.md).

## Complexity Tracking

No constitution violations or justified complexity exceptions are required.
