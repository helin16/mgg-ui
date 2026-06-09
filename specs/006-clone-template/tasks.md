# Tasks: Clone Email Template

**Input**: Design documents from `/specs/006-clone-template/`
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
- Paths below follow the current React application structure from `plan.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the exact implementation and verification surface before code changes begin

- [X] T001 Review clone touchpoints in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx` and `src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx`
- [X] T002 [P] Confirm existing create/read service usage in `src/services/Synergetic/SynCommunicationTemplateService.ts` and `src/services/Email/EmailTemplateService.ts`
- [X] T003 [P] Confirm module access and manual verification entry points in `src/pages/SynergeticEmailTemplate/SynergeticEmailTemplateManagerPage.tsx` and `specs/006-clone-template/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared clone workflow scaffolding that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Add clone modal state, selected source template state, and shared clone submit helper scaffolding in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`
- [X] T005 [P] Prepare service mocks and base render helpers for clone workflow coverage in `src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx`
- [X] T006 Document clone workflow assumptions and manual verification checkpoints in `specs/006-clone-template/quickstart.md`

**Checkpoint**: Foundation ready - user story implementation can now begin in dependency order

---

## Phase 3: User Story 1 - Clone a template from the list (Priority: P1) 🎯 MVP

**Goal**: Add the `Clone` row action and create a separate cloned template with a user-provided name while leaving the source template unchanged

**Independent Test**: Open the template list, click `Clone`, enter a valid new name, confirm, and verify a separate cloned template is created while the source template remains unchanged

### Verification for User Story 1 ⚠️

- [X] T007 [US1] Add clone list workflow tests for row action ordering, modal open, successful submit, and list refresh in `src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx`
- [ ] T008 [US1] Execute manual clone verification for action order and successful standard clone using `specs/006-clone-template/quickstart.md`

### Implementation for User Story 1

- [X] T009 [US1] Insert the `Clone` row action between `Send` and `Archive` in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`
- [X] T010 [US1] Build the clone confirmation modal with required new-name input and cancel/confirm controls in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`
- [X] T011 [US1] Implement standard template clone submission, success toast, and count-based list refresh in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`

**Checkpoint**: User Story 1 should support cloning an existing template with a new name from the list

---

## Phase 4: User Story 2 - Choose whether the clone uses new style (Priority: P2)

**Goal**: Let the user control whether the cloned template is created as `New Style`, and preserve existing builder design when the source already has it

**Independent Test**: Clone one template with `New Style` selected and another with it unselected, then verify each clone reflects the chosen style state in the list; when the source already has builder data, verify the clone preserves it

### Verification for User Story 2 ⚠️

- [X] T012 [US2] Add tests for `New Style` checked and unchecked clone outcomes, including copied `templateObj` behavior when the source already has builder data, in `src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx`
- [ ] T013 [US2] Execute manual verification for `New Style` checked and unchecked clone results, including preserved builder design for an existing new-style source, using `specs/006-clone-template/quickstart.md`

### Implementation for User Story 2

- [X] T014 [US2] Add the `New Style` checkbox and related modal state handling in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`
- [X] T015 [US2] Implement conditional `EmailTemplateService.create` cloning logic so the cloned template reflects the selected `New Style` state and copies source `templateObj` only when the source already has builder data in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`

**Checkpoint**: User Stories 1 and 2 should now support both standard and `New Style` clone flows

---

## Phase 5: User Story 3 - Prevent accidental or invalid cloning (Priority: P3)

**Goal**: Block invalid submissions, prevent duplicate confirmation while saving, and keep failure handling recoverable

**Independent Test**: Attempt to confirm with an empty or whitespace-only name, then attempt repeated confirms during an in-progress clone request and verify the UI blocks invalid or duplicate submission

### Verification for User Story 3 ⚠️

- [X] T016 [US3] Add tests for blank-name validation, whitespace-only validation, duplicate-submit protection, and failure recovery in `src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx`
- [ ] T017 [US3] Execute manual validation for invalid-name, duplicate-submit, and API-failure handling using `specs/006-clone-template/quickstart.md`

### Implementation for User Story 3

- [X] T018 [US3] Enforce trimmed-name validation and confirm-button blocking for invalid input in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`
- [X] T019 [US3] Add in-progress submission locking, retry-safe error handling, and modal persistence on failure in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`

**Checkpoint**: All user stories should now be independently verifiable within the clone modal flow

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final alignment across stories and verification evidence

- [X] T020 [P] Refresh feature documentation to reflect final verification coverage in `specs/006-clone-template/quickstart.md` and `specs/006-clone-template/tasks.md`
- [X] T021 Run focused automated verification with `CI=true yarn test --runTestsByPath src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx` from `/Users/helin/git/MentoneGirls/mgg-ui`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion - establishes the base clone flow
- **User Story 2 (Phase 4)**: Depends on User Story 1 because `New Style` is an extension of the clone modal and clone submission flow
- **User Story 3 (Phase 5)**: Depends on User Story 1 because validation and duplicate-submit protection apply to the clone modal introduced there
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - no dependencies on other stories
- **User Story 2 (P2)**: Depends on User Story 1 clone modal and submit flow
- **User Story 3 (P3)**: Depends on User Story 1 clone modal and submit flow

### Within Each User Story

- Automated and manual verification tasks must be completed before the story is done
- UI action wiring before modal refinement
- Modal structure before submission behavior
- Base clone submission before `New Style` branching or duplicate-submit protections

### Parallel Opportunities

- `T002` and `T003` can run in parallel during Setup
- `T005` and `T006` can run in parallel once `T004` defines the shared flow
- `T020` can run in parallel with final verification once implementation is complete

---

## Parallel Example: User Story 1

```bash
# After foundational scaffolding is complete, verification and implementation prep can overlap:
Task: "Add clone list workflow tests for row action ordering, modal open, successful submit, and list refresh in src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx"
Task: "Insert the Clone row action between Send and Archive in src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx"
```

## Parallel Example: User Story 2

```bash
# Once the base clone flow exists, implementation and manual verification prep can overlap:
Task: "Add the New Style checkbox and related modal state handling in src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx"
Task: "Execute manual verification for New Style checked and unchecked clone results using specs/006-clone-template/quickstart.md"
```

## Parallel Example: User Story 3

```bash
# Validation and failure-path verification can be prepared alongside UI hardening:
Task: "Add tests for blank-name validation, whitespace-only validation, duplicate-submit protection, and failure recovery in src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx"
Task: "Add in-progress submission locking, retry-safe error handling, and modal persistence on failure in src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test the standard clone workflow independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational
2. Deliver User Story 1 and validate standard cloning
3. Deliver User Story 2 and validate `New Style` clone branching
4. Deliver User Story 3 and validate invalid-submit and failure handling
5. Run final focused Jest verification and complete manual checks

### Parallel Team Strategy

With multiple developers:

1. Complete Setup + Foundational together
2. Developer A implements User Story 1 in `src/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.tsx`
3. Developer B expands `src/__tests__/pages/SynergeticEmailTemplate/components/SynergeticEmailTemplateList.test.tsx` as each story lands
4. User Stories 2 and 3 can proceed after User Story 1 establishes the base clone modal flow

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] labels map tasks to specific user stories for traceability
- Every task includes an exact file path or command target
- User Story 1 is the suggested MVP scope
- Avoid broad refactors outside `SynergeticEmailTemplateList` unless implementation proves a shared helper is required
