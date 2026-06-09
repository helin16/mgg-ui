# Tasks: Future L.O.A. Column

**Input**: Design documents from `/specs/005-future-loa-column/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Include automated test tasks whenever shared helpers, reducers, hooks, data
transforms, or other stable logic changes. For route-level or cross-system workflows where
automation is impractical, include explicit manual verification tasks instead of omitting
verification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the implementation surface and verification paths before story work

- [ ] T001 Confirm the affected dashboard and export files in `src/components/Enrollments/EnrolmentDashboardPanel.tsx` and `src/components/Enrollments/EnrolmentDashboardExportPdf.tsx`
- [ ] T002 Confirm verification targets in `src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx`, `src/__tests__/components/Enrollments/EnrolmentDashboardExportPdf.test.tsx`, and `specs/005-future-loa-column/quickstart.md`
- [ ] T003 [P] Confirm that no new service-layer or type-contract files are required beyond the existing wrappers under `src/services/` and `src/types/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared counting and export prerequisites that block all user stories

**⚠️ CRITICAL**: No user story work should be considered complete until this phase is in place

- [ ] T004 Update shared dashboard student dedupe to use `StudentID` consistently in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T005 [P] Add or update export grouping support for current-year future extra columns in `src/components/Enrollments/EnrolmentDashboardExportPdf.tsx`
- [ ] T006 [P] Add foundational regression coverage for dedupe and export grouping behavior in `src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx` and `src/__tests__/components/Enrollments/EnrolmentDashboardExportPdf.test.tsx`
- [ ] T007 Capture manual verification scenarios for dashboard counts and PDF alignment in `specs/005-future-loa-column/quickstart.md`

**Checkpoint**: Foundation ready - user story implementation can now proceed confidently

---

## Phase 3: User Story 1 - See returning L.O.A. students in the current-year future section (Priority: P1) 🎯 MVP

**Goal**: Show same-year returning leave students in the current-year future section and include them in `Total at Year End`

**Independent Test**: Open the dashboard with a qualifying leave-return student in the active current year and confirm the student appears in `Returning L.O.A.` and rolls into `Total at Year End`

### Verification for User Story 1 ⚠️

- [ ] T008 [P] [US1] Add automated coverage for same-year returning L.O.A. counts and year-end totals in `src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx`
- [ ] T009 [US1] Execute documented manual validation for same-year returning leave counts and `Total at Year End` using `specs/005-future-loa-column/quickstart.md`

### Implementation for User Story 1

- [ ] T010 [US1] Implement same-year `Returning L.O.A.` student selection in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T011 [US1] Place same-year `Returning L.O.A.` students into row cells by current `StudentYearLevel` in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T012 [US1] Include qualifying same-year `Returning L.O.A.` students in `current-total-year-end` aggregation in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Keep the future section readable and ordered (Priority: P2)

**Goal**: Keep the visible table and PDF export aligned with the new current-year future column order

**Independent Test**: Render the dashboard and export PDF and confirm `Returning L.O.A.` appears after `Not Returning Next Year` and before the configured current-year future statuses

### Verification for User Story 2 ⚠️

- [ ] T013 [P] [US2] Add automated coverage for visible table column order and PDF group/header alignment in `src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx` and `src/__tests__/components/Enrollments/EnrolmentDashboardExportPdf.test.tsx`
- [ ] T014 [US2] Execute documented manual validation for visible table and PDF column placement using `specs/005-future-loa-column/quickstart.md`

### Implementation for User Story 2

- [ ] T015 [US2] Insert the `current-returning-loa` column into the current-year future section order in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T016 [US2] Update current-year future group header spans for the visible table in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T017 [US2] Update PDF export grouping and header spans to include `Returning L.O.A.` in `src/components/Enrollments/EnrolmentDashboardExportPdf.tsx`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Exclude students who do not qualify for the current-year return view (Priority: P3)

**Goal**: Ensure only valid same-year returning leave students are counted, and fix current-year future status counting consistency

**Independent Test**: Compare valid and invalid return-date cases and confirm only qualifying same-year leave-return students are counted, while current-year future status columns count current-year future students consistently

### Verification for User Story 3 ⚠️

- [ ] T018 [P] [US3] Add automated coverage for blank/out-of-year return dates and current-year future status-column inclusion in `src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx`
- [ ] T019 [US3] Execute documented manual validation for excluded return-date cases and current-year future status counts using `specs/005-future-loa-column/quickstart.md`

### Implementation for User Story 3

- [ ] T020 [US3] Exclude blank, invalid, or out-of-year `StudentReturningDate` values from `Returning L.O.A.` in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T021 [US3] Preserve existing next-year `Returning L.O.A.` year-level inference while adding same-year logic in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
- [ ] T022 [US3] Include current-year future students in configured current-year future status columns in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency and documentation updates across implemented stories

- [ ] T023 [P] Update feature documents to match final year-level and dedupe behavior in `specs/005-future-loa-column/spec.md`, `specs/005-future-loa-column/plan.md`, `specs/005-future-loa-column/research.md`, `specs/005-future-loa-column/data-model.md`, and `specs/005-future-loa-column/contracts/enrolment-dashboard-current-future-columns.md`
- [ ] T024 Run quickstart-guided validation and record outcomes in `specs/005-future-loa-column/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational - no dependency on other stories
- **User Story 2 (P2)**: Starts after Foundational - integrates with US1 output but remains independently testable
- **User Story 3 (P3)**: Starts after Foundational - validates exclusion and consistency behavior on top of the shared dashboard logic

### Within Each User Story

- Automated and manual verification tasks must be completed before the story is done
- Core row-count logic before layout/export integration checks
- Visible table structure before final PDF export alignment

### Parallel Opportunities

- T003 can run in parallel with T001-T002
- T005 and T006 can run in parallel after setup
- T008 and T010-T012 can proceed together once the story shape is known
- T013 and T017 can proceed in parallel with visible-table work in T015-T016
- T018 can proceed in parallel with T020-T022
- T023 can run in parallel with final manual validation preparation

---

## Parallel Example: User Story 2

```bash
# Launch verification and export work for User Story 2 together:
Task: "Add automated coverage for visible table column order and PDF group/header alignment in src/__tests__/components/Enrollments/EnrolmentDashboardPanel.test.tsx and src/__tests__/components/Enrollments/EnrolmentDashboardExportPdf.test.tsx"
Task: "Update PDF export grouping and header spans to include Returning L.O.A. in src/components/Enrollments/EnrolmentDashboardExportPdf.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate same-year returning leave counts independently

### Incremental Delivery

1. Complete Setup + Foundational
2. Add User Story 1 and validate counts
3. Add User Story 2 and validate visible/PDF layout
4. Add User Story 3 and validate exclusions and current-year future status consistency
5. Finish documentation and manual validation

### Parallel Team Strategy

With multiple developers:

1. One developer updates dashboard calculation logic in `src/components/Enrollments/EnrolmentDashboardPanel.tsx`
2. One developer updates export rendering in `src/components/Enrollments/EnrolmentDashboardExportPdf.tsx`
3. One developer expands Jest coverage in `src/__tests__/components/Enrollments/`
4. Reconcile with final quickstart-guided manual validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] labels map each task to a specific user story
- Each user story remains independently testable
- Manual validation is still required even when automated tests pass
- Because implementation has already begun, use this file as a completeness checklist against the existing branch state
