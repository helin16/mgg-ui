# Tasks: BPay Batch Panel

**Input**: Design documents from `/specs/001-bpay-batch-panel/`
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

**Purpose**: Project initialization and basic structure

- [X] T001 Review the feature docs in `specs/001-bpay-batch-panel/spec.md`, `specs/001-bpay-batch-panel/plan.md`, `specs/001-bpay-batch-panel/research.md`, and `specs/001-bpay-batch-panel/quickstart.md`
- [X] T002 Confirm existing BPay entry points and reusable UI files in `src/pages/Finance/FinancePage.tsx`, `src/components/BPay/CreditorBPayPanel.tsx`, `src/components/synCreditor/SynCreditorSelector.tsx`, and `src/components/common/Table.tsx`
- [X] T003 [P] Confirm required service/type files for the feature in `src/services/BPay/`, `src/services/Synergetic/Finance/`, `src/types/BPay/`, and `src/types/Synergetic/Finance/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Extend and normalize BPay batch domain types in `src/types/BPay/iCreditorBPayBatch.ts`, `src/types/BPay/iCreditorBPayBatchSection.ts`, `src/types/BPay/iCreditorBPayBatchSectionItem.ts`, and `src/types/Synergetic/Finance/iSynCreditorBPayInfo.ts`
- [X] T005 [P] Complete BPay domain services in `src/services/BPay/CreditorBPayBatchService.ts`, `src/services/BPay/CreditorBPayBatchSectionService.ts`, `src/services/BPay/CreditorBPayBatchSectionItemService.ts`, and `src/services/Synergetic/Finance/SynCreditorBPayInfoService.ts`
- [X] T006 [P] Create shared panel state and orchestration helpers in `src/components/BPay/CreditorBPayPanelHelper.ts` for batch resolution, section reuse, and add-request payload shaping
- [X] T007 Define the panel component structure in `src/components/BPay/CreditorBPayPanel.tsx`, `src/components/BPay/BPayInfoSelectionTable.tsx`, and `src/components/BPay/BPayBatchResultPanel.tsx`
- [X] T008 Capture manual verification expectations for the finance flow in `specs/001-bpay-batch-panel/quickstart.md` if implementation details require updates during coding

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add a creditor payment entry (Priority: P1) 🎯 MVP

**Goal**: Allow a finance user to select a creditor, enter an amount, and add a payment entry that creates a batch when needed

**Independent Test**: In Finance > BPay Batching, select a creditor with one valid BPay record, enter an amount, click Add, and verify a batch, section, and section item are created or refreshed in the UI

### Verification for User Story 1 ⚠️

- [X] T009 [P] [US1] Add automated tests for pure batch orchestration helpers in `src/__tests__/components/BPay/CreditorBPayPanelHelper.test.ts`
- [ ] T010 [US1] Execute the single-record batch creation flow from `specs/001-bpay-batch-panel/quickstart.md` and record the result in implementation notes or PR notes

### Implementation for User Story 1

- [X] T011 [P] [US1] Build the creditor and amount input layout in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T012 [P] [US1] Add amount validation and submission state handling in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T013 [US1] Implement single-record BPay lookup and auto-selection logic in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T014 [US1] Implement add-flow orchestration for create-batch and create-section-item behavior in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T015 [US1] Render success and refreshed batch feedback in `src/components/BPay/BPayBatchResultPanel.tsx` and connect it from `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T016 [US1] Preserve the Finance tab integration in `src/pages/Finance/FinancePage.tsx` while replacing the placeholder panel behavior in `src/components/BPay/CreditorBPayPanel.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Resolve multiple BPay records for a creditor (Priority: P2)

**Goal**: Allow the finance user to review and select the correct BPay record when a creditor has multiple active records

**Independent Test**: Select a creditor with multiple BPay records and verify a selectable table appears, exactly one record can be chosen, and Add remains blocked until selection

### Verification for User Story 2 ⚠️

- [X] T017 [P] [US2] Add automated tests for BPay record selection helper logic in `src/__tests__/components/BPay/CreditorBPayPanelHelper.test.ts`
- [ ] T018 [US2] Execute the multiple-record selection flow from `specs/001-bpay-batch-panel/quickstart.md` and record the result in implementation notes or PR notes

### Implementation for User Story 2

- [X] T019 [P] [US2] Implement the selectable BPay record table in `src/components/BPay/BPayInfoSelectionTable.tsx`
- [X] T020 [US2] Load and map multiple BPay records for display and selection in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T021 [US2] Block Add until exactly one BPay record is selected and show empty-state/error feedback in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T022 [US2] Display the contract-required BPay record fields in `src/components/BPay/BPayInfoSelectionTable.tsx`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Preserve batch grouping rules (Priority: P3)

**Goal**: Ensure repeated additions reuse an existing creditor section and create a new section only when the creditor is not yet represented in the current batch

**Independent Test**: Add entries for two creditors in sequence and verify one creditor reuses its section while the second creditor creates a new section in the existing batch

### Verification for User Story 3 ⚠️

- [X] T023 [P] [US3] Add automated tests for section reuse and section creation helper logic in `src/__tests__/components/BPay/CreditorBPayPanelHelper.test.ts`
- [ ] T024 [US3] Execute the section reuse and new-section flows from `specs/001-bpay-batch-panel/quickstart.md` and record the result in implementation notes or PR notes

### Implementation for User Story 3

- [X] T025 [P] [US3] Implement existing-section detection and creditor grouping rules in `src/components/BPay/CreditorBPayPanelHelper.ts`
- [X] T026 [US3] Integrate section reuse and create-section branching into the add workflow in `src/components/BPay/CreditorBPayPanel.tsx`
- [X] T027 [US3] Update the result display to make section grouping visible in `src/components/BPay/BPayBatchResultPanel.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T028 [P] Refine loading, empty, and error messaging across `src/components/BPay/CreditorBPayPanel.tsx`, `src/components/BPay/BPayInfoSelectionTable.tsx`, and `src/components/BPay/BPayBatchResultPanel.tsx`
- [X] T029 Review finance-data exposure and ensure no unnecessary creditor payment details are persisted or logged in `src/components/BPay/CreditorBPayPanel.tsx` and `src/components/BPay/CreditorBPayPanelHelper.ts`
- [X] T030 [P] Update feature documentation if implementation diverges from design in `specs/001-bpay-batch-panel/plan.md`, `specs/001-bpay-batch-panel/contracts/bpay-batch-panel.md`, and `specs/001-bpay-batch-panel/quickstart.md`

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

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - establishes the core add workflow
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - depends on the same panel foundation but should remain independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - depends on the same orchestration helpers and extends grouping behavior

### Within Each User Story

- Required automated and manual verification tasks MUST be completed before the story is done
- Shared types and services before panel orchestration
- Panel orchestration before result display refinements
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- Foundational tasks `T005`, `T006`, and `T007` can run in parallel after `T004`
- In US1, `T011` and `T012` can run in parallel before `T013` and `T014`
- In US2, `T019` can run in parallel with selection-helper test work in `T017`
- In US3, `T025` can run in parallel with verification prep in `T023`

---

## Parallel Example: User Story 1

```bash
# Launch verification and UI prep for User Story 1 together where practical:
Task: "Add automated tests for pure batch orchestration helpers in src/__tests__/components/BPay/CreditorBPayPanelHelper.test.ts"
Task: "Build the creditor and amount input layout in src/components/BPay/CreditorBPayPanel.tsx"
Task: "Add amount validation and submission state handling in src/components/BPay/CreditorBPayPanel.tsx"
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
   - Developer A: User Story 1 panel and add orchestration
   - Developer B: User Story 2 multi-record selection UI
   - Developer C: User Story 3 grouping and result display
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
