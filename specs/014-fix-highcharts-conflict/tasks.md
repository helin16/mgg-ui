---
description: "Task list for Reliable Schoolbox Class Results Charts"
---

# Tasks: Reliable Schoolbox Class Results Charts

**Input**: Design documents from `/specs/014-fix-highcharts-conflict/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/runtime-coexistence.md, quickstart.md

**Branch**: `019-fix-highcharts-conflict`

**Tests**: Automated Jest tests are REQUIRED here — the change adds shared runtime logic
(`HighchartsRuntime.ts`) consumed by every custom chart. The real Schoolbox/boxplot/cache
workflow cannot be automated (no Schoolbox SSO in Cypress, no Safari/WebKit, Edge not local),
so it is covered by the documented manual browser matrix in `quickstart.md`.

**Organization**: All three user stories are satisfied by the same single isolation boundary
(`HighchartsRuntime.ts` + `Chart.tsx`). Implementation is shared and lands in Phase 3 (US1);
Phases 4–5 (US2, US3) are verification-only against that same code.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1 / US2 / US3 from spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the change surface before writing code.

- [ ] T000 Resolve the feature-dir naming mismatch **before any implementation**: the branch is `019-fix-highcharts-conflict` but the artifacts live in `specs/014-fix-highcharts-conflict/`, which already broke `.specify/scripts/bash/setup-tasks.sh` (`resolve_template_content: command not found` / could not resolve feature dir). Either `git mv specs/014-fix-highcharts-conflict specs/019-fix-highcharts-conflict` and update the `Branch`/path lines in `spec.md`, `plan.md`, `tasks.md`, or rename the branch to `014-fix-highcharts-conflict`. Re-run `check-prerequisites.sh --json --require-tasks` and confirm `FEATURE_DIR` resolves. (blocks T004; supersedes old T016)
- [ ] T001 Confirm the single direct Highcharts import boundary: `src/components/chart/Chart.tsx` (`import * as Highcharts from 'highcharts'`) is the only direct importer, and the four consumers are `src/pages/studentReport/components/StudentParticipation/components/CoCurricularByTypeChartWithTable.tsx`, `src/pages/studentReport/components/StudentParticipation/components/LeadershipAndAwardByTypChartWithTable.tsx`, `src/pages/studentReport/components/WellBeingGraphs/components/WellBeingAbsenceByClassChart.tsx`, `src/pages/studentReport/components/WellBeingGraphs/components/WellBeingAbsenceByReasonChart.tsx`
- [ ] T002 Confirm no service/type contract change is needed: nothing under `src/services/` or `src/types/` imports `highcharts` (per plan.md FR-010)
- [ ] T003 [P] Confirm verification prerequisites from `quickstart.md`: affected Schoolbox grades URL, shared custom script enabled, and access to current Chrome, Edge, Safari, Firefox for the cached/uncached matrix; no new env var, storage, or access-control change (FR-012). **Edge is not installed on the current dev machine (research.md)** — install current Microsoft Edge now, or record a constitution-tracked, time-boxed exception in `plan.md` Complexity Tracking if Edge coverage (FR-013) is being deferred. Do not silently skip Edge in T010.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: None. No shared service wrapper, type, route guard, or new UI state is introduced
(plan.md Constitution Check II/III, FR-010/FR-011). This phase is intentionally empty —
proceed directly to Phase 3.

**Checkpoint**: Foundation ready (nothing to do) — story implementation can begin.

---

## Phase 3: User Story 1 - View Class Results on First Load (Priority: P1) 🎯 MVP

**Goal**: The Schoolbox Class Results boxplot renders on the first normal page load with the
custom bundle present, with no hard-refresh workaround and no Highcharts #17 conflict.

**Independent Test**: On the affected class grades page, open a fresh tab, navigate/reload
normally, select Class Results, and confirm the boxplot is visible and the console has no
Highcharts #17 / missing-boxplot / custom-constructor error — repeated under cached and
uncached conditions.

### Implementation for User Story 1

- [ ] T004 [US1] Create `src/components/chart/HighchartsRuntime.ts`: read `window.jQuery?.fn`; record whether `highcharts` is an own property and capture its full property descriptor via `Object.getOwnPropertyDescriptor`; inside `try`, synchronously `require`/import the app's Highcharts module and keep the private export; inside `finally`, `Object.defineProperty` to restore the captured descriptor, or `delete` the property if it was originally absent; if no jQuery/`fn` exists, load Highcharts with no restoration work. Do NOT assign `window.Highcharts`, do NOT import `highcharts-more`, do NOT load Schoolbox modules. Export the private instance as default. (contracts/runtime-coexistence.md, data-model.md)
- [ ] T005 [US1] Modify `src/components/chart/Chart.tsx`: replace `import * as Highcharts from 'highcharts'` with the isolated instance from `./HighchartsRuntime`, and pass it to `<HighchartsReact highcharts={...} />` unchanged. No other change to props or `Wrapper`.

### Verification for User Story 1 ⚠️

- [ ] T006 [P] [US1] Create `src/__tests__/components/chart/HighchartsRuntime.test.ts` asserting the host-ownership invariants: (a) a pre-existing `jQuery.fn.highcharts` with a non-default descriptor keeps exact descriptor flags and function identity after load; (b) a `jQuery.fn` with no `highcharts` property still has none after load; (c) with no `window.jQuery`, load returns the private Highcharts export and creates no jQuery object; (d) when module init throws, `finally` still restores/removes the host property **and the error is re-thrown, not swallowed** — the adapter must not catch-and-hide init failures, so a real chart-runtime failure stays visible in the browser console (FR-008); (e) the default export is identity-equal to the app's own `highcharts` module export (`require('highcharts')`), i.e. the isolated private instance is what consumers receive (FR-004). (quickstart.md "Automated assertions")
- [ ] T007 [P] [US1] Update `src/__tests__/components/chart/Chart.test.tsx` to assert the wrapper renders and passes the isolated private instance (not a global) to `highcharts-react-official`.
- [ ] T008 [US1] Run `yarn test --watchAll=false --runInBand src/__tests__/components/chart/HighchartsRuntime.test.ts src/__tests__/components/chart/Chart.test.tsx src/__tests__/AppLoader/MggAppLoader.test.ts` — all green (AppLoader unchanged but must stay green per plan.md).
- [ ] T009 [US1] Run the full suite `yarn test --watchAll=false --runInBand` and `yarn build` (production + AppLoader bundles) — both succeed.
- [ ] T010 [US1] Execute the `quickstart.md` authenticated browser matrix for Class Results: 20 cached + 20 uncached normal loads in each of current Chrome, Edge, Safari, Firefox (40/40 pass each); on every run confirm the boxplot is visible/interactive on first load, the console has no Highcharts #17, missing-boxplot, or custom-runtime constructor error, and no new spinner / empty / error UI appears around the chart and its layout is unchanged (FR-011). Also do one negative check per browser: force a chart-init failure (e.g. temporarily break the boxplot data) and confirm the failure still surfaces in the dev console (FR-008). Record browser versions, pass totals, and console results as evidence.

**Checkpoint**: Class Results renders reliably on first load across the required browser/cache matrix — MVP complete.

---

## Phase 4: User Story 2 - Preserve Custom Application Charts (Priority: P2)

**Goal**: The four existing custom student-report charts keep their data, labels, and
interactions after the isolation boundary is in place.

**Independent Test**: Open each custom report chart surface and confirm the expected chart
renders with existing data and stays interactive.

### Verification for User Story 2 ⚠️

- [ ] T011 [P] [US2] In `src/__tests__/components/chart/Chart.test.tsx`, assert `Chart` renders `HighchartsReact` with `highcharts` set to the exact object exported by `./HighchartsRuntime` (reference equality, not just truthy) and with all incoming `props` forwarded unchanged — locking in that the four consumers keep receiving the isolated private instance with identical options (FR-004). (T006(e) covers the runtime identity; this covers the wrapper wiring.)
- [ ] T012 [US2] Manual smoke per `quickstart.md` "Regression Smoke Tests": in each required browser, render each of the four consumers and confirm data/labels/interactions — Co-curricular activities by type, Leadership and awards by type, Wellbeing absences by class, Wellbeing absences by reason.

**Checkpoint**: Custom charts unregressed alongside a working Class Results fix.

---

## Phase 5: User Story 3 - Maintain Other Schoolbox Page Behaviour (Priority: P3)

**Goal**: No visible regression on Schoolbox pages where the shared custom script loads,
including non-chart pages and other Schoolbox chart types.

**Independent Test**: Smoke a class grades page, a non-chart Schoolbox page, and another
Schoolbox chart page; confirm normal content and interactions with no new chart errors.

### Verification for User Story 3 ⚠️

- [ ] T013 [US3] Manual smoke per `quickstart.md`: a representative non-chart Schoolbox page retains its content/interactions (FR-006, covers the no-mount-point case), and another Schoolbox page/chart renders normally with no new console errors (FR-007).

**Checkpoint**: All three stories verified against one shared code change.

---

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T014 [P] Update `specs/014-fix-highcharts-conflict/quickstart.md` "Evidence to Record" section with the actual commit/build id, browser versions, and cached/uncached pass totals from T010/T012/T013.
- [ ] T015 Add a short code comment in `HighchartsRuntime.ts` pointing to `contracts/runtime-coexistence.md` so a future Schoolbox/Highcharts upgrade knows why the snapshot/restore exists.
- [ ] T016 Verify the T000 naming fix stuck: after implementation, `check-prerequisites.sh --json --require-tasks` and `setup-tasks.sh --json` both resolve the feature dir with no error, and `spec.md` / `plan.md` / `tasks.md` path references match the actual folder.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: no dependencies. T000 (naming fix) MUST complete before T004.
- **Foundational (Phase 2)**: empty — skip.
- **User Story 1 (Phase 3)**: after Setup. Delivers all production code.
- **User Story 2 (Phase 4)** and **User Story 3 (Phase 5)**: verification-only, depend on Phase 3 implementation (T004–T005) being merged; can run in parallel with each other.
- **Polish (Phase 6)**: after T010/T012/T013 produce evidence.

### Within User Story 1

- T004 → T005 (Chart.tsx imports the new module).
- T004/T005 → T006/T007 (tests import the finished modules); T006 and T007 are [P] (different files).
- T006/T007 → T008 → T009 (run focused, then full + build).
- T009 → T010 (manual matrix only after the bundle builds).

### Parallel Opportunities

- T003 alongside T001/T002.
- T006 and T007 in parallel after T005.
- Phase 4 and Phase 5 manual smokes in parallel once Phase 3 is merged.
- T014 alongside T015.

---

## Parallel Example: User Story 1

```bash
# After T005, launch both test-authoring tasks together:
Task: "Create src/__tests__/components/chart/HighchartsRuntime.test.ts (host-ownership invariants)"
Task: "Update src/__tests__/components/chart/Chart.test.tsx (isolated instance passed to wrapper)"
```

---

## Implementation Strategy

### MVP (User Story 1 only)

1. Phase 1: Setup (T000 first, then T001–T003).
2. Phase 2: nothing.
3. Phase 3: T004 → T005 → T006/T007 → T008 → T009 → T010.
4. **STOP and VALIDATE**: Class Results boxplot on first load, 40/40 per browser, clean console.
5. Ship — this alone resolves the reported production failure.

### Incremental Delivery

1. Phase 3 merged → MVP (FR-001, FR-002, FR-003, FR-014).
2. Phase 4 → custom-chart regression signed off (FR-004).
3. Phase 5 → broad Schoolbox no-regression signed off (FR-006, FR-007).
4. Phase 6 → evidence recorded, comment/housekeeping.

---

## Notes

- Total production diff: 1 new file (`HighchartsRuntime.ts`), 1 modified file (`Chart.tsx`). Everything else is tests and manual verification.
- Do NOT change AppLoader `async`/`defer` timing and do NOT import `highcharts-more` — both are explicitly rejected in `research.md`.
- No backend, service, type, route, env-var, storage, or access-control change (FR-009 through FR-012).
- Commit after T005 (implementation) and after T009 (green tests + build).
