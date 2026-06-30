# Tasks: Parent Teacher Interview Event Links

**Input**: Design documents from `/specs/008-pti-event-links/`  
**Branch**: `008-pti-event-links`  
**Prerequisites**: [plan.md](plan.md) ✅, [spec.md](spec.md) ✅, [research.md](research.md) ✅, [data-model.md](data-model.md) ✅, [contracts/](contracts/) ✅, [quickstart.md](quickstart.md) ✅

**Tests**: Include automated coverage for new shared service/type/router logic and UI state handling. Include Cypress and manual verification for the restricted SchoolBox workflow.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature file layout and test targets before blocking implementation begins.

- [X] T001 Create feature folders for `src/pages/ParentTeacherInterview/`, `src/pages/ParentTeacherInterview/components/`, `src/services/ParentTeacherInterview/`, `src/types/ParentTeacherInterview/`, and matching `src/__tests__/pages/ParentTeacherInterview/` + `src/__tests__/services/ParentTeacherInterview/`
- [X] T002 Create Cypress spec placeholder `cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts`
- [X] T003 [P] Capture the impacted routing, module, service, and verification files in `specs/008-pti-event-links/tasks.md` and align them with [plan.md](plan.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core route, module, type, and service infrastructure required before any story can be implemented.

**⚠️ CRITICAL**: No user story work should begin until this phase is complete.

- [X] T004 Add `MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW = 24` to `src/types/modules/iModuleUser.ts`
- [X] T005 Add `SchoolBoxUrls.ParentTeacherInterview = '/parentTeacherInterview'` to `src/layouts/SchoolBox/SchoolBoxUrls.ts`
- [X] T006 Update `src/layouts/SchoolBox/SchoolBoxRouter.tsx` to route `SchoolBoxUrls.ParentTeacherInterview` through `ModuleAccessWrapper` to `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`
- [X] T007 Create `src/types/Synergetic/Lookup/SynLuDepartmentCodes.ts` with `TS = 'TS'`
- [X] T008 [P] Create `src/types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventSummary.ts`
- [X] T009 [P] Create `src/types/ParentTeacherInterview/iParentTeacherInterviewCalendarEventsResponse.ts`
- [X] T010 [P] Create `src/types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventRequest.ts`
- [X] T011 [P] Create `src/types/ParentTeacherInterview/iParentTeacherInterviewCreateCalendarEventResponse.ts`
- [X] T012 [P] Create `src/types/ParentTeacherInterview/iParentTeacherInterviewModuleSettings.ts`
- [X] T013 [P] Create `src/types/ParentTeacherInterview/iParentTeacherInterviewScheduleRow.ts`
- [X] T014 Create `src/services/ParentTeacherInterview/ParentTeacherInterviewCalendarService.ts` using `AppService.get`/`AppService.post` for `/parentTeacherInterview/calendarEvents`
- [X] T015 Create the page shell `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx` using `Page` with `moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}`
- [X] T016 Create the admin shell `src/pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage.tsx` using `AdminPage` with `moduleId={MGGS_MODULE_ID_PARENT_TEACHER_INTERVIEW}`
- [X] T017 [P] Add router coverage for the new SchoolBox URL and module wrapper in `src/__tests__/layouts/SchoolBox/SchoolBoxRouter.test.tsx`
- [X] T018 [P] Add constant coverage for the new SchoolBox URL in `src/__tests__/layouts/SchoolBox/SchoolBoxUrls.test.ts`
- [X] T019 [P] Add service coverage for `ParentTeacherInterviewCalendarService` in `src/__tests__/services/ParentTeacherInterview/ParentTeacherInterviewCalendarService.test.ts`

**Checkpoint**: Route, module, typed contracts, and calendar service are ready. User stories can now be implemented.

---

## Phase 3: User Story 1 - Select eligible teaching staff (Priority: P1) 🎯 MVP

**Goal**: Let an authorized module user open the page, load active teaching staff, search/filter the list, and select rows with row and header checkboxes.

**Independent Test**: Open the page as an authorized module user, search by staff ID/name, filter by category, use the header checkbox to select/unselect visible rows, and verify only active `TS` staff are shown.

### Verification for User Story 1

- [X] T020 [P] [US1] Add page and component tests for staff list load, search, filters, and selection behavior in `src/__tests__/pages/ParentTeacherInterview/ParentTeacherInterviewPage.test.tsx` and `src/__tests__/pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel.test.tsx`
- [ ] T021 [US1] Add Cypress coverage for authorized page access, search, category filtering, and header checkbox behavior in `cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts`

### Implementation for User Story 1

- [X] T022 [US1] Create `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel.tsx` with the shared `Table` component using hover, responsive, and striped rows
- [X] T023 [US1] Implement staff loading and search/category filtering in `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx` using `SynVStaffService.getStaffList(...)`, `SynLuStaffCategoryService.getAll(...)`, and `SynLuDepartmentCodes.TS`
- [X] T024 [US1] Implement row selection, header checkbox selection, and visible-row selection semantics in `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel.tsx`
- [X] T025 [US1] Add first-step loading, empty, and failure states with `Toaster` and inline UI handling in `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`
- [X] T026 [US1] Wire the `Next` action and selected-staff projection from `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx` into schedule-row state defined by `src/types/ParentTeacherInterview/iParentTeacherInterviewScheduleRow.ts`

**Checkpoint**: User Story 1 should now be fully functional and independently testable.

---

## Phase 4: User Story 2 - Enter schedule details and review existing events (Priority: P1)

**Goal**: Let a module user move selected staff into the schedule step, enter valid local-time start/end datetimes per row, and automatically retrieve existing events inline.

**Independent Test**: Select staff, move to step 2, enter valid datetimes, confirm invalid values block progress, and verify existing events load inline per row without a separate retrieval button.

### Verification for User Story 2

- [X] T027 [P] [US2] Add component tests for datetime validation, retrieval-state transitions, and inline event rendering in `src/__tests__/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.test.tsx`
- [ ] T028 [US2] Extend Cypress coverage for the step transition, local-time validation, automatic retrieval, empty retrieval, and retrieval retry behavior in `cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts`

### Implementation for User Story 2

- [X] T029 [US2] Create `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.tsx` to render the selected-staff schedule table with start/end datetime inputs
- [X] T030 [US2] Implement browser-local datetime parsing/validation and row-level create eligibility rules in `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.tsx`
- [X] T031 [US2] Implement automatic retrieval-on-valid-datetime-change in `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.tsx` using `ParentTeacherInterviewCalendarService.getCalendarEvents(...)`
- [X] T032 [US2] Render inline retrieval states and compact existing-event rows beneath each selected staff row in `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.tsx`
- [X] T033 [US2] Update `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx` to hold schedule-step state, stale-retrieval refresh behavior, and retry callbacks for failed retrieval rows

**Checkpoint**: User Story 2 should now be fully functional and independently testable.

---

## Phase 5: User Story 3 - Create event links and review per-staff outcomes (Priority: P2)

**Goal**: Let a module admin create event links for selected staff, block duplicate submits, honor module settings, and display mixed per-staff outcomes.

**Independent Test**: As a module admin, submit a valid batch after retrieval finishes and confirm `CREATED`, `EXISTS`, and `FAILED` results display per row while duplicate submissions are blocked.

### Verification for User Story 3

- [X] T034 [P] [US3] Add tests for create gating, missing-settings handling, non-admin explanation, duplicate-submit prevention, and mixed outcomes in `src/__tests__/pages/ParentTeacherInterview/ParentTeacherInterviewPage.test.tsx`
- [ ] T035 [US3] Extend Cypress coverage for admin create submission, mixed API outcomes, duplicate-submit prevention, and missing-settings blocking in `cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts`

### Implementation for User Story 3

- [X] T036 [US3] Load `module.settings.parentTeacherInterviewCalendar.subject/bodyText` via `MggsModuleService.getModule(...)` in `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`
- [X] T037 [US3] Implement create-action gating and non-admin explanation state in `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`
- [X] T038 [US3] Implement bulk per-row create submission in `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx` using `ParentTeacherInterviewCalendarService.createCalendarEvent(...)`
- [X] T039 [US3] Implement duplicate-submit prevention, submit loading state, and selected-count button label in `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx`
- [X] T040 [US3] Render `CREATED`, `EXISTS`, and `FAILED` per-staff outcomes, meeting links, and failure categories/messages in `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.tsx`

**Checkpoint**: User Story 3 should now be fully functional and independently testable.

---

## Phase 6: User Story 4 - Reach the module through restricted SchoolBox and admin surfaces (Priority: P3)

**Goal**: Let authorized users access the SchoolBox page through the restricted route and let module admins manage subject/body settings through the admin page.

**Independent Test**: Open the SchoolBox route as a module user and as a denied user, then open the admin entry as a module admin and confirm subject/body settings can be edited and saved.

### Verification for User Story 4

- [X] T041 [P] [US4] Add admin-page/settings tests for role restriction and required subject/body fields in `src/__tests__/pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage.test.tsx` and `src/__tests__/pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel.test.tsx`
- [ ] T042 [US4] Add Cypress or documented manual verification for denied-access and admin-settings save flow in `cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts`

### Implementation for User Story 4

- [X] T043 [US4] Create `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel.tsx` using `ModuleEditPanel` to edit `parentTeacherInterviewCalendar.subject` and `.bodyText`
- [X] T044 [US4] Complete `src/pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage.tsx` by wiring in `ParentTeacherInterviewModuleSettingsPanel` and any admin tabs/sections required by the page shell
- [X] T045 [US4] Update `src/pages/ParentTeacherInterview/ParentTeacherInterviewPage.tsx` so the main page/admin page split mirrors the Enrolments/Staff List pattern and denied access follows existing wrappers

**Checkpoint**: User Story 4 should now be fully functional and independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, cleanup, and cross-story quality work.

- [ ] T046 [P] Run targeted Jest suites for router, service, page, and component coverage in `src/__tests__/layouts/SchoolBox/SchoolBoxRouter.test.tsx`, `src/__tests__/layouts/SchoolBox/SchoolBoxUrls.test.ts`, `src/__tests__/services/ParentTeacherInterview/ParentTeacherInterviewCalendarService.test.ts`, and `src/__tests__/pages/ParentTeacherInterview/`
- [ ] T047 [P] Run the Parent Teacher Interview Cypress workflow in `cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts`
- [ ] T048 Run a manual SchoolBox validation pass for access-denied, non-admin retrieval-only, admin create, and admin settings flows using `specs/008-pti-event-links/quickstart.md`
- [ ] T049 [P] Verify TypeScript/build health after all changes with `npm test -- --watchAll=false` and `npm run build`
- [ ] T050 [P] Review and clean up any shared-state, toast, or rendering regressions across `src/pages/ParentTeacherInterview/` before implementation handoff

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all user stories
- **Phase 3: US1**: Depends on Phase 2
- **Phase 4: US2**: Depends on US1 because the schedule step uses selected staff from step 1
- **Phase 5: US3**: Depends on US2 because create requires validated schedule rows and retrieval results
- **Phase 6: US4**: Depends on Phase 2; can run alongside later stories, but completes the admin/settings surface used by US3
- **Phase 7: Polish**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: First MVP slice after foundation
- **US2 (P1)**: Builds on US1 selected-staff flow
- **US3 (P2)**: Builds on US2 retrieval and schedule state
- **US4 (P3)**: Independent of US1/US2 page behavior after foundation, but operationally complements US3 by providing settings management

### Parallel Opportunities

- T008-T013 can run in parallel after route/module constants are in place
- T017-T019 can run in parallel with late foundational implementation
- T020 and T021 can run in parallel within US1
- T027 and T028 can run in parallel within US2
- T034 and T035 can run in parallel within US3
- T041 and T042 can run in parallel within US4
- T046-T050 can be split across team members during final verification

## Parallel Example: User Story 1

```bash
# Verification work for US1
Task: "Add page and component tests for staff list load, search, filters, and selection behavior in src/__tests__/pages/ParentTeacherInterview/ParentTeacherInterviewPage.test.tsx and src/__tests__/pages/ParentTeacherInterview/components/ParentTeacherInterviewStaffSelectionPanel.test.tsx"
Task: "Add Cypress coverage for authorized page access, search, category filtering, and header checkbox behavior in cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts"
```

## Parallel Example: User Story 2

```bash
# Verification work for US2
Task: "Add component tests for datetime validation, retrieval-state transitions, and inline event rendering in src/__tests__/pages/ParentTeacherInterview/components/ParentTeacherInterviewSchedulePanel.test.tsx"
Task: "Extend Cypress coverage for the step transition, local-time validation, automatic retrieval, empty retrieval, and retrieval retry behavior in cypress/e2e/ParentTeacherInterview/ParentTeacherInterviewEventLinks.cy.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2
2. Complete US1
3. Validate staff selection/search/filter flow independently
4. Add US2
5. Validate schedule-entry and retrieval flow independently

### Incremental Delivery

1. **MVP slice**: US1
2. **Operator planning slice**: US2
3. **Create workflow slice**: US3
4. **Admin/settings surface slice**: US4

### Suggested MVP Scope

The smallest useful MVP is **US1 only**.  
The first end-to-end operational slice is **US1 + US2 + US3**.

---

## Notes

- All tasks follow the required checklist format with IDs, optional `[P]` markers, required `[US#]` story labels for story phases, and exact file paths.
- Total tasks: **50**
- Task count by story:
  - **US1**: 7
  - **US2**: 7
  - **US3**: 7
  - **US4**: 5
- Shared/setup/foundation/polish tasks: **24**
