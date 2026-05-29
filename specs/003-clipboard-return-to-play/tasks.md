# Tasks: Clipboard Return To Play

**Input**: Design documents from `/specs/003-clipboard-return-to-play/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

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

- UI repo paths are relative to this repository root
- API repo paths use `../mggs-api/` because the feature spans the neighboring proxy service

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the feature surface, verification scope, and cross-repo ownership before contract work starts

- [X] T001 Confirm the impacted UI and API files listed in `specs/003-clipboard-return-to-play/plan.md` and `specs/003-clipboard-return-to-play/contracts/clipboard-return-to-play.md`
- [X] T002 Confirm the manual validation scenarios to capture from `specs/003-clipboard-return-to-play/quickstart.md`
- [X] T003 [P] Confirm the current Clipboard incident contract touchpoints in `src/types/Clipboard/iClipboardIncident.ts`, `src/services/Clipboard/ClipboardIncidentService.ts`, `../mggs-api/src/connectors/Clipboard/types/iClipboardIncident.ts`, and `../mggs-api/src/connectors/Clipboard/ClipboardConnector.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Update the shared Clipboard incident contract that all user stories depend on

**⚠️ CRITICAL**: No user story work can be completed until this phase is complete

- [X] T004 [P] Update the shared UI incident type to represent nested `returnToPlay` data in `src/types/Clipboard/iClipboardIncident.ts`
- [X] T005 [P] Update the API proxy incident type to represent nested `returnToPlay` data in `../mggs-api/src/connectors/Clipboard/types/iClipboardIncident.ts`
- [X] T006 Update the UI incident service field selection for nested `returnToPlay` data in `src/services/Clipboard/ClipboardIncidentService.ts`
- [X] T007 Update the Clipboard connector mapping/normalization for nested `returnToPlay` responses in `../mggs-api/src/connectors/Clipboard/ClipboardConnector.ts`
- [X] T008 [P] Update the UI service contract test expectations in `src/__tests__/services/Clipboard/ClipboardIncidentService.test.ts`
- [X] T009 [P] Update the API proxy connector and controller contract tests in `../mggs-api/tests/connectors/Clipboard/ClipboardConnector.test.ts` and `../mggs-api/tests/controllers/Clipboard/ClipboardIncidentController.test.ts`

**Checkpoint**: Shared incident contract is aligned across `mgg-ui` and `../mggs-api`

---

## Phase 3: User Story 1 - Show active return-to-play restrictions in class attendance (Priority: P1) 🎯 MVP

**Goal**: Show active concussion restrictions in the attendance alert using the nested return-to-play contract and the new sentence wording

**Independent Test**: Open an attendance page for a class with a confirmed incident whose return-to-play date is still active and verify the alert shows `should not return to play until ... due to "...".`

### Verification for User Story 1 ⚠️

- [X] T010 [P] [US1] Add/update automated alert coverage for nested return-to-play access and display wording in `src/__tests__/components/Clipboard/ClipboardConcussionAlert.test.tsx`
- [ ] T011 [US1] Execute the active restriction scenario from `specs/003-clipboard-return-to-play/quickstart.md` against the attendance page

### Implementation for User Story 1

- [X] T012 [US1] Update active incident rendering to read nested `returnToPlay` fields in `src/components/Clipboard/ClipboardConcussionAlert.tsx`
- [X] T013 [US1] Update the alert sentence to use the localised return-to-play date in `src/components/Clipboard/ClipboardConcussionAlert.tsx`
- [X] T014 [US1] Preserve the existing Clipboard incident link and student-name rendering while switching to the new wording in `src/components/Clipboard/ClipboardConcussionAlert.tsx`

**Checkpoint**: User Story 1 is functional and independently testable

---

## Phase 4: User Story 2 - Suppress expired return-to-play restrictions (Priority: P2)

**Goal**: Hide the alert once the local day is after the return-to-play date

**Independent Test**: Open an attendance page for a class whose confirmed incident is past its local return-to-play date and verify no alert is shown

### Verification for User Story 2 ⚠️

- [X] T015 [P] [US2] Add/update automated expiry and UTC-boundary coverage in `src/__tests__/components/Clipboard/ClipboardConcussionAlert.test.tsx`
- [ ] T016 [US2] Execute the expired restriction and UTC boundary scenarios from `specs/003-clipboard-return-to-play/quickstart.md`

### Implementation for User Story 2

- [X] T017 [US2] Update return-to-play date parsing to treat the Clipboard timestamp as UTC before local comparison in `src/components/Clipboard/ClipboardConcussionAlert.tsx`
- [X] T018 [US2] Update active restriction filtering so incidents are hidden after the local return-to-play day has passed in `src/components/Clipboard/ClipboardConcussionAlert.tsx`

**Checkpoint**: User Stories 1 and 2 both work independently

---

## Phase 5: User Story 3 - Tolerate incomplete return-to-play details without breaking the page (Priority: P3)

**Goal**: Keep the attendance page usable and render safe fallback wording when return-to-play data is incomplete

**Independent Test**: Load a qualifying incident with a missing reason or missing return-to-play date and verify the page stays usable and the alert degrades safely

### Verification for User Story 3 ⚠️

- [X] T019 [P] [US3] Add/update automated fallback coverage for missing `returnToPlay` fields in `src/__tests__/components/Clipboard/ClipboardConcussionAlert.test.tsx`
- [ ] T020 [US3] Execute the missing reason and failure-path scenarios from `specs/003-clipboard-return-to-play/quickstart.md`

### Implementation for User Story 3

- [X] T021 [US3] Add safe nested return-to-play access and fallback reasoning in `src/components/Clipboard/ClipboardConcussionAlert.tsx`
- [X] T022 [US3] Preserve the existing request failure handling and no-alert fallback when incomplete incident data is returned in `src/components/Clipboard/ClipboardConcussionAlert.tsx`

**Checkpoint**: All user stories are independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation across both repos

- [X] T023 [P] Run the UI Clipboard incident tests in `src/__tests__/services/Clipboard/ClipboardIncidentService.test.ts` and `src/__tests__/components/Clipboard/ClipboardConcussionAlert.test.tsx`
- [ ] T024 [P] Run the API proxy Clipboard incident tests in `../mggs-api/tests/connectors/Clipboard/ClipboardConnector.test.ts` and `../mggs-api/tests/controllers/Clipboard/ClipboardIncidentController.test.ts`
- [X] T025 Update implementation notes and verification evidence in `specs/003-clipboard-return-to-play/quickstart.md` and related task checkboxes in `specs/003-clipboard-return-to-play/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational and delivers the MVP
- **User Story 2 (P2)**: Starts after Foundational and builds on the same alert logic as US1
- **User Story 3 (P3)**: Starts after Foundational and hardens the same alert flow against incomplete data

### Within Each User Story

- Automated coverage updates should be written before or alongside the implementation they validate
- Alert logic changes should land before final manual validation
- Story completion requires both automated and manual verification tasks to be checked off

### Parallel Opportunities

- T004 and T005 can run in parallel
- T008 and T009 can run in parallel
- T010 and T011 can run in parallel
- T015 and T016 can run in parallel
- T019 and T020 can run in parallel
- T023 and T024 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch User Story 1 verification in parallel:
Task: "Add/update automated alert coverage for nested return-to-play access and display wording in src/__tests__/components/Clipboard/ClipboardConcussionAlert.test.tsx"
Task: "Execute the active restriction scenario from specs/003-clipboard-return-to-play/quickstart.md against the attendance page"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run T010, T011, and T023 for the MVP path

### Incremental Delivery

1. Finish Setup + Foundational contract work across both repos
2. Deliver User Story 1 for active alert rendering and wording
3. Deliver User Story 2 for local-time expiry behaviour
4. Deliver User Story 3 for incomplete-data hardening
5. Finish cross-cutting test runs and verification evidence

### Parallel Team Strategy

With multiple developers:

1. One developer updates `mgg-ui` shared types/service while another updates `../mggs-api` connector types and tests in Phase 2
2. After Phase 2, one developer can focus on alert wording and active rendering while another prepares expiry and fallback test coverage
3. Rejoin for final manual validation and cross-repo test execution

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to the corresponding user story
- `../mggs-api` tasks are required because the shared contract change is cross-repo
- Each user story remains independently testable on the attendance page
- Mark tasks complete in this file as implementation progresses
