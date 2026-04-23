# Tasks: BPay Batch Visibility

**Input**: Design documents from `/specs/002-bpay-batch-visibility/`
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
- **Web app**: `backend/src/`, `frontend/src/`
- **Mobile**: `api/src/`, `ios/src/` or `android/src/`
- Paths shown below assume single project - adjust based on plan.md structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing BPay batching surface, reusable files, and verification scope

- [X] T001 Review the feature docs in `specs/002-bpay-batch-visibility/spec.md`, `specs/002-bpay-batch-visibility/plan.md`, `specs/002-bpay-batch-visibility/research.md`, and `specs/002-bpay-batch-visibility/quickstart.md`
- [X] T002 Review the current Finance BPay entry surface in `src/pages/Finance/FinancePage.tsx`, `src/components/BPay/CreditorBPayPanel.tsx`, and `src/components/BPay/BPayBatchResultPanel.tsx`
- [X] T003 [P] Confirm the existing batch list service and typed contract in `src/services/BPay/CreditorBPayBatchService.ts` and `src/types/BPay/iCreditorBPayBatch.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare shared list-mode and visibility-mode infrastructure required by all stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Extend shared visibility and reset helpers in `src/components/BPay/CreditorBPayPanelHelper.ts` for list mode, create mode, and dirty-state handling
- [X] T005 [P] Add automated tests for visibility, reset, and batch-list helper logic in `src/__tests__/components/BPay/CreditorBPayPanelHelper.test.ts`
- [X] T006 [P] Refactor `src/components/BPay/BPayBatchResultPanel.tsx` so it can render default batch-list summaries as well as the post-add result state
- [X] T007 Implement batch-list loading, refresh, and failure orchestration in `src/components/BPay/CreditorBPayPanel.tsx` using `src/services/BPay/CreditorBPayBatchService.ts`
- [X] T008 Capture any implementation-driven adjustments in `specs/002-bpay-batch-visibility/contracts/bpay-batch-visibility.md` and `specs/002-bpay-batch-visibility/quickstart.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View existing BPay batches by default (Priority: P1) 🎯 MVP

**Goal**: Show existing BPay batches as the default state of the Finance tab before the create workflow is opened

**Independent Test**: Open Finance > BPay Batching and confirm the tab shows a batch list or explicit empty state before any create action is taken

### Verification for User Story 1 ⚠️

- [ ] T009 [US1] Execute the existing-batches and no-batches scenarios from `specs/002-bpay-batch-visibility/quickstart.md`

### Implementation for User Story 1

- [X] T010 [US1] Render the default list-mode shell, heading, and list container in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T011 [US1] Map batch list data into scan-friendly summaries in `src/components/BPay/BPayBatchResultPanel.tsx` and wire them from `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T012 [US1] Add explicit loading, empty, and failure states for batch retrieval in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T013 [US1] Preserve the Finance module tab integration and default `BPay Batching` entry behavior in `src/pages/Finance/FinancePage.tsx` and `src/components/BPay/CreditorBPayPanel.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Start creating a new batch on demand (Priority: P2)

**Goal**: Let the user move from the default batch list into the existing creation workflow with one `+ New Batch` action

**Independent Test**: Open the default batch list view, click `+ New Batch`, and confirm the creation panel appears with the existing creditor/BPay/amount workflow and a visible `Cancel` action

### Verification for User Story 2 ⚠️

- [ ] T014 [US2] Execute the `+ New Batch` scenario from `specs/002-bpay-batch-visibility/quickstart.md`

### Implementation for User Story 2

- [X] T015 [US2] Add local list/create mode state and the `+ New Batch` action in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T016 [P] [US2] Reorganize the existing creditor/BPay/amount form into a create-mode section in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T017 [US2] Add the create-mode action row with `Cancel` and `Add` controls in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T018 [US2] Guard `+ New Batch` and create-mode entry against list-loading and failure states in `src/components/BPay/CreditorBPayPanel.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Cancel out of batch creation (Priority: P3)

**Goal**: Allow the user to leave the new-batch workflow safely and return to the default list state

**Independent Test**: Open the creation panel, enter unsaved values, click `Cancel`, and confirm the panel hides and the default batch list view is restored

### Verification for User Story 3 ⚠️

- [ ] T019 [US3] Execute the cancel-return scenario from `specs/002-bpay-batch-visibility/quickstart.md`

### Implementation for User Story 3

- [X] T020 [P] [US3] Implement unsaved-state tracking and cancel-reset helpers in `src/components/BPay/CreditorBPayPanelHelper.ts`
- [X] T021 [US3] Wire `Cancel` to hide the creation panel, reset or discard form state, and restore list mode in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T022 [US3] Refresh batch-list data after cancel or successful add in `src/components/BPay/CreditorBPayPanel.tsx` and `src/services/BPay/CreditorBPayBatchService.ts`
- [X] T023 [US3] Add user-visible messaging for unsaved-state discard and restored-list behavior in `src/components/BPay/CreditorBPayPanel.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Refine the shared Finance batching experience across all stories

- [X] T024 [P] Refine loading, empty, and action messaging across `src/components/BPay/CreditorBPayPanel.tsx` and `src/components/BPay/BPayBatchResultPanel.tsx`
- [X] T025 Review finance-data exposure and ensure the default list only shows required summary fields in `src/components/BPay/CreditorBPayPanel.tsx` and `src/components/BPay/BPayBatchResultPanel.tsx`
- [X] T026 [P] Update implementation-aligned documentation in `specs/002-bpay-batch-visibility/plan.md`, `specs/002-bpay-batch-visibility/contracts/bpay-batch-visibility.md`, and `specs/002-bpay-batch-visibility/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - establishes the default batch list and async states
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - builds on the same panel shell but should remain independently testable once the list exists
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - depends on create-mode visibility and reset behavior from US2

### Within Each User Story

- Required automated and manual verification tasks MUST be completed before the story is done
- Shared helpers and list orchestration before panel-state wiring
- Default list rendering before create-mode transitions
- Create-mode transitions before cancel/reset behavior
- Story complete before moving to next priority

### Parallel Opportunities

- Setup task `T003`
- Foundational tasks `T005` and `T006` after `T004`
- US2 task `T016` alongside `T015`
- US3 task `T020` alongside verification task `T019`
- Polish tasks `T024` and `T026`

---

## Parallel Example: User Story 2

```bash
# Launch create-mode wiring that can proceed in parallel:
Task: "Add local list/create mode state and the + New Batch action in src/components/BPay/CreditorBPayPanel.tsx"
Task: "Reorganize the existing creditor/BPay/amount form into a create-mode section in src/components/BPay/CreditorBPayPanel.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 default list rendering
   - Developer B: User Story 2 create-mode entry
   - Developer C: User Story 3 cancel/reset behavior
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify required automated and manual checks are explicitly captured
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
