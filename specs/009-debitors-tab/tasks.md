# Tasks: Finance Debitors Tab

**Input**: Design documents from `/specs/009-debitors-tab/`
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
- Paths below assume this repository’s single React app structure

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the affected Finance surface, shared contracts, and verification targets before implementation

- [X] T001 Review the existing Finance tab shell in `src/pages/Finance/FinancePage.tsx` and current Finance page coverage in `src/__tests__/pages/Finance/FinancePage.test.tsx`
- [X] T002 Review the existing debtor, student, and student-contact service boundaries in `src/services/Synergetic/Finance/SynVDebtorService.ts`, `src/services/Synergetic/Student/SynVStudentService.ts`, and `src/services/Synergetic/Student/SynVStudentContactAllAddressService.ts`
- [X] T003 [P] Review the existing debtor and student contracts in `src/types/Synergetic/Finance/iSynVDebtor.ts`, `src/types/Synergetic/Student/iVStudent.ts`, and `src/types/Synergetic/Student/iSynVStudentContactAllAddress.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create the shared typed and service-layer foundations required by all user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create Finance-specific debtor search criteria and row contracts in `src/types/Synergetic/Finance/iFinanceDebitorSearchCriteria.ts`, `src/types/Synergetic/Finance/iFinanceDebitorLinkedStudent.ts`, and `src/types/Synergetic/Finance/iFinanceDebitorListRow.ts`
- [X] T005 Extend the debtor service contract for paginated debtor retrieval and debtor-name sorting in `src/services/Synergetic/Finance/SynVDebtorService.ts`
- [X] T006 Implement service-layer enrichment for linked students and spouse email using debtor, student, and student-contact data in `src/services/Synergetic/Finance/SynVDebtorService.ts`
- [X] T007 [P] Add or update service-layer test coverage for the debtor and student-contact wrappers in `src/__tests__/services/Synergetic/Finance/SynVDebtorService.test.ts` and `src/__tests__/services/Synergetic/Student/SynVStudentContactAllAddressService.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Find debtors quickly (Priority: P1) 🎯 MVP

**Goal**: Add the Debitors tab and default debtor list so Finance users can open the tab and review the first 10 debtor records in name order.

**Independent Test**: Open the Finance page, switch to the Debitors tab, and confirm the panel loads the default debtor list with the shared table, 10-row pagination, nested Students column, and default sort by debtor name.

### Verification for User Story 1 ⚠️

- [X] T008 [P] [US1] Add Finance page tab coverage for the new Debitors tab in `src/__tests__/pages/Finance/FinancePage.test.tsx`
- [X] T009 [P] [US1] Add panel coverage for default load, table rendering, and pagination in `src/__tests__/pages/Finance/components/DebitorsListPanel.test.tsx`
- [ ] T010 [US1] Run the default-load manual validation checklist from `specs/009-debitors-tab/quickstart.md`

### Implementation for User Story 1

- [X] T011 [US1] Create the Debitors list panel component shell in `src/pages/Finance/components/DebitorsListPanel.tsx`
- [X] T012 [US1] Add the Debitors tab and wire `DebitorsListPanel` into `src/pages/Finance/FinancePage.tsx`
- [X] T013 [US1] Implement the default debtor fetch, shared `Table` rendering, nested Students table, loading state, empty state, and failure state in `src/pages/Finance/components/DebitorsListPanel.tsx`
- [X] T014 [US1] Wire 10-row pagination with default debtor-name ordering and filter-preserving page changes in `src/pages/Finance/components/DebitorsListPanel.tsx`

**Checkpoint**: User Story 1 should now be fully functional and testable on its own

---

## Phase 4: User Story 2 - Search debtors and spouse details (Priority: P2)

**Goal**: Let Finance users search debtor and spouse details with explicit `Search` and `Reset Filters` actions.

**Independent Test**: Enter debtor or spouse search terms, click `Search`, and confirm matching results return; click `Reset Filters` and confirm the default result set returns with page number reset to 1 while keeping page size unchanged.

### Verification for User Story 2 ⚠️

- [X] T015 [P] [US2] Add panel coverage for debtor/spouse text search, explicit search submission, and reset behaviour in `src/__tests__/pages/Finance/components/DebitorsListPanel.test.tsx`
- [X] T016 [P] [US2] Add service coverage for combined debtor/spouse query composition and spouse-email enrichment in `src/__tests__/services/Synergetic/Finance/SynVDebtorService.test.ts`
- [ ] T017 [US2] Run the debtor/spouse search and reset manual validation checklist from `specs/009-debitors-tab/quickstart.md`

### Implementation for User Story 2

- [X] T018 [US2] Implement the text search input plus `Search` and `Reset Filters` controls in `src/pages/Finance/components/DebitorsListPanel.tsx`
- [X] T019 [US2] Implement debtor/spouse free-text query composition and spouse-email enrichment in `src/services/Synergetic/Finance/SynVDebtorService.ts`
- [X] T020 [US2] Wire search submission, reset behaviour, preserved page size, and page-number reset to 1 in `src/pages/Finance/components/DebitorsListPanel.tsx`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Narrow debtors by current student (Priority: P3)

**Goal**: Let Finance users filter debtor results by selecting a current student and matching on the student’s `DebtorID`.

**Independent Test**: Select a current student, click `Search`, and confirm only matching debtor rows remain; clear the student filter and confirm the default or remaining-filter result set returns with page number reset to 1.

### Verification for User Story 3 ⚠️

- [X] T021 [P] [US3] Add panel coverage for current-student selection, combined search, and no-results handling in `src/__tests__/pages/Finance/components/DebitorsListPanel.test.tsx`
- [X] T022 [P] [US3] Add service coverage for student-linked debtor enrichment and `DebtorID` matching in `src/__tests__/services/Synergetic/Finance/SynVDebtorService.test.ts`
- [ ] T023 [US3] Run the current-student filter manual validation checklist from `specs/009-debitors-tab/quickstart.md`

### Implementation for User Story 3

- [X] T024 [US3] Integrate the async current-student selector and selected-student state into `src/pages/Finance/components/DebitorsListPanel.tsx`
- [X] T025 [US3] Implement student-based debtor filtering with `SynVStudentService.getVPastAndCurrentStudentAll(...)` and linked-student row mapping in `src/services/Synergetic/Finance/SynVDebtorService.ts`
- [X] T026 [US3] Wire the student filter into search submission, empty-state messaging, and reset behaviour in `src/pages/Finance/components/DebitorsListPanel.tsx`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, regression coverage, and verification capture across the full Finance Debitors workflow

- [X] T027 [P] Reconcile final debtor row labels, nested Students rendering, and financial display formatting in `src/pages/Finance/components/DebitorsListPanel.tsx`
- [ ] T028 [P] Add any final shared-contract adjustments discovered during integration to `src/types/Synergetic/Finance/iFinanceDebitorListRow.ts` and `src/types/Synergetic/Finance/iSynVDebtor.ts`
- [ ] T029 Execute the full feature verification pass described in `specs/009-debitors-tab/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds on the Debitors panel introduced in US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and builds on the Debitors panel/search flow introduced in US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: First deliverable and MVP
- **User Story 2 (P2)**: Extends the US1 panel with explicit search/reset behaviour
- **User Story 3 (P3)**: Extends the US1/US2 panel with current-student filtering

### Within Each User Story

- Automated coverage tasks should be completed before the story is considered done
- Manual validation tasks should be completed after implementation stabilizes
- Service work should land before the panel logic that depends on it
- Panel integration should complete before final story validation

### Parallel Opportunities

- **Setup**: T003 can run in parallel with T001-T002
- **Foundational**: T004 and T007 can run in parallel once the service boundary decisions are clear
- **US1**: T008 and T009 can run in parallel; T011 can start while tests are being prepared
- **US2**: T015 and T016 can run in parallel; T018 and T019 can proceed in parallel before T020 integration
- **US3**: T021 and T022 can run in parallel; T024 and T025 can proceed in parallel before T026 integration
- **Polish**: T027 and T028 can run in parallel before the final verification task

---

## Parallel Example: User Story 2

```bash
# Prepare verification in parallel:
Task: "Add panel coverage for debtor/spouse text search, explicit search submission, and reset behaviour in src/__tests__/pages/Finance/components/DebitorsListPanel.test.tsx"
Task: "Add service coverage for combined debtor/spouse query composition and spouse-email enrichment in src/__tests__/services/Synergetic/Finance/SynVDebtorService.test.ts"

# Implement service and UI control work in parallel before integration:
Task: "Implement the text search input plus Search and Reset Filters controls in src/pages/Finance/components/DebitorsListPanel.tsx"
Task: "Implement debtor/spouse free-text query composition and spouse-email enrichment in src/services/Synergetic/Finance/SynVDebtorService.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test the Debitors tab default load independently

### Incremental Delivery

1. Finish Setup + Foundational
2. Deliver User Story 1 for a usable debtor listing MVP
3. Add User Story 2 for explicit debtor/spouse search and reset
4. Add User Story 3 for current-student filtering
5. Finish with Phase 6 polish and full verification

### Parallel Team Strategy

With multiple developers:

1. Complete Phase 1 and Phase 2 together
2. After foundation:
   - Developer A: US1 panel/tab integration
   - Developer B: US2 search/reset logic and tests
   - Developer C: US3 student filter logic and tests
3. Merge on the shared `DebitorsListPanel` carefully because US2 and US3 both touch the same component

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] labels map tasks back to user stories
- Each user story remains independently testable even when later stories extend the same panel
- Manual validation is required because the feature depends on authenticated Finance data
- Stop at each checkpoint and validate before moving to the next story
