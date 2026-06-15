# Tasks: Clipboard Music Sync Management UI

**Input**: Design documents from `/specs/007-clipboard-music-sync/`
**Branch**: `007-clipboard-music-sync`
**Prerequisites**: [plan.md](plan.md) ✅, [spec.md](spec.md) ✅, [data-model.md](data-model.md) ✅, [contracts/](contracts/) ✅, [quickstart.md](quickstart.md) ✅

**Organization**: Tasks organized by user story (P1, P1, P1, P2) to enable independent implementation and testing. Each story phase is independently testable.

**MVP Scope**: User Stories 1-3 (P1) deliver the core feature; US4 (P2, tabbed interface) adds organizational structure for future growth.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and verify route/module entry points

- [x] T001 Confirm Clipboard module route entry and `moduleId` (MGGS_MODULE_ID_CLIP_BOARD) usage in `src/types/modules/iModuleUser.ts`
- [x] T002 Confirm service layer file locations: `src/services/Clipboard/` exists for new ClipboardMusicSyncService
- [x] T003 [P] Confirm type definitions location: `src/types/Clipboard/` has iClipboardTeam.ts and iClipboardSession.ts
- [x] T004 Verify App.tsx route structure and SchoolBoxRouter.tsx module routing pattern for Clipboard feature integration
- [x] T005 Confirm Finance page pattern (Page component, Tabs, styled-components, common components) is available for reuse in `src/pages/Finance/FinancePage.tsx`

**Checkpoint**: Route, service, type, and UI patterns confirmed - ready for foundational work

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story work begins

⚠️ **CRITICAL**: All Phase 2 tasks MUST complete before Phase 3+ work can start in parallel

### Services & Types (Shared by all stories)

- [x] T006 Create new type `iClipboardSyncMessage` in `src/types/Clipboard/iClipboardSyncMessage.ts` with fields: id, type, status (NEW|PROCESSING|WIP|SUCCESS|FAILED), createdAt, updatedAt, request, response, error
- [x] T007 Create new service `ClipboardMusicSyncService.ts` in `src/services/Clipboard/` with method `triggerSync(teamId?)` calling POST `/clipboard/syncMusic` and error handling via Toaster

### Page Wrapper & Module Access

- [x] T008 Create main page component `ClipboardMusicSyncPage.tsx` in `src/pages/Clipboard/` wrapping with Page component, moduleId (MGGS_MODULE_ID_CLIP_BOARD), title "Clipboard Management", and passing to ModuleAccessWrapper or module guard
- [x] T009 [P] Add route to `src/App.tsx`: `<Route path={URL_CLIPBOARD_MUSIC_SYNC} element={<ClipboardMusicSyncPage />} />`
- [x] T010 [P] Add route constant `URL_CLIPBOARD_MUSIC_SYNC` to `src/Url.ts` with path `/modules/remote/:code/clipboard/music-sync` (or appropriate Clipboard route)
- [ ] T011 [P] Update `src/layouts/SchoolBoxRouter.tsx` to add Clipboard music sync route handler under module routing (if required; verify with T004)

### Async State Handling

- [x] T012 Implement loading, success, empty, and error states for teams list fetch in ClipboardMusicSyncPage (use PageLoadingSpinner, Toaster, error boundaries per constitution)
- [x] T013 Implement loading and error handling for sync operation responses (show toast notifications via Toaster service)

**Checkpoint**: Foundation complete - all user story work can now proceed in parallel

---

## Phase 3: User Story 1 - View active clipboard teams and their sync status (Priority: P1) 🎯 MVP

**Goal**: Staff members can open the Clipboard Music Sync page and see a list of all teams with their current sync status, enabling operational awareness.

**Independent Test**: Open page → verify teams list appears within 5 seconds with team names and sync status indicators.

### Implementation for User Story 1

- [x] T014 [P] [US1] Create component `ClipboardTeamsListPanel.tsx` in `src/pages/Clipboard/components/` displaying teams in a table with columns: Team Name, Session, Last Sync Time, Sync Button
- [x] T015 [P] [US1] In ClipboardMusicSyncPage.tsx, fetch teams on mount using `ClipboardTeamService.getAll({ perPage: 100 })` and pass to ClipboardTeamsListPanel with isLoading and error props
- [x] T016 [US1] Implement table rendering in ClipboardTeamsListPanel showing team name (from iClipboardTeam.name or fallback to classCode), sync status placeholder, and last sync timestamp placeholder (will be populated by future stories)
- [x] T017 [US1] Add pagination or scrolling support to handle 10+ teams without layout shift; display empty state message "No clipboard teams configured" when data.length === 0
- [x] T018 [US1] Handle missing/null team name gracefully: display fallback text "Unknown Team" or classCode if name is null

### Verification for User Story 1

- [x] T019 [P] [US1] Write unit test `ClipboardTeamsListPanel.test.tsx` in `src/__tests__/pages/Clipboard/components/` testing table renders, teams display correctly, empty state appears
- [x] T020 [P] [US1] Write unit test for ClipboardMusicSyncPage.tsx testing teams fetch on mount, loading spinner shown, error handling
- [ ] T021 [US1] Create Cypress e2e test `cypress/e2e/Clipboard/ClipboardMusicSync.cy.ts` with scenario: navigate to page → verify teams list appears with correct data → verify all 10+ teams visible

**Checkpoint**: User Story 1 complete and testable - teams list displays correctly

---

## Phase 4: User Story 2 - View clipboard session details for each team (Priority: P1)

**Goal**: Staff can select/expand a team row to view session information (title, times, staff, activity), providing context for sync operations.

**Independent Test**: Select a team → verify session details appear showing title, start/end times, assigned staff.

### Implementation for User Story 2

- [ ] T022 [P] [US2] Create component `ClipboardSessionDetailsPanel.tsx` in `src/pages/Clipboard/components/` displaying session info: title, startDateTime, endDateTime, activity name, assignedStaff names, cancelled flag
- [ ] T023 [US2] Update ClipboardTeamsListPanel to add expandable rows or click handler: on team row click, set selectedTeamId state and fetch session details via `ClipboardSessionService.get(teamId)` or `ClipboardSessionService.getAll({ teams: [teamId] })`
- [ ] T024 [US2] In ClipboardTeamsListPanel, render ClipboardSessionDetailsPanel for expanded team row (conditionally render below or in modal)
- [ ] T025 [US2] In ClipboardSessionDetailsPanel, format and display ISO timestamps using moment-timezone to local time; handle missing/null fields with "N/A" or placeholders
- [ ] T026 [US2] Add session loading spinner (use PageLoadingSpinner or small spinner component) while fetching session details; handle error with inline error message

### Verification for User Story 2

- [ ] T027 [P] [US2] Write unit test for ClipboardSessionDetailsPanel.tsx testing correct fields display, timestamp formatting, null/missing data handling
- [ ] T028 [P] [US2] Write unit test for ClipboardTeamsListPanel.tsx (update existing T019) testing expand/collapse behavior, session fetch on expand, error handling on session fetch
- [ ] T029 [US2] Update Cypress e2e test: add scenario navigating to page → clicking team row → verifying session details panel appears with correct data

**Checkpoint**: User Story 2 complete - session details expand and display correctly

---

## Phase 5: User Story 3 - Manually trigger music sync for a specific team via popup (Priority: P1)

**Goal**: Staff can click a "Sync" button on a team row, confirm in a popup, and trigger a manual music sync operation with duplicate prevention and feedback.

**Independent Test**: Click sync button → confirm in popup → verify API call made, button disabled during operation, success/error feedback shown.

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create component `ClipboardSyncConfirmPopup.tsx` in `src/pages/Clipboard/components/` using React Bootstrap Modal displaying team name, confirmation message, Cancel and Confirm buttons
- [ ] T031 [US3] In ClipboardTeamsListPanel, add "Sync" button to each team row; on click, set showPopup state and selectedTeamForSync state; render ClipboardSyncConfirmPopup with props (teamName, onConfirm, onCancel)
- [ ] T032 [US3] Implement ClipboardSyncConfirmPopup onConfirm handler: call `ClipboardMusicSyncService.triggerSync(teamId)`, show loading spinner, disable Confirm button during API call
- [ ] T033 [US3] On triggerSync API response: if SUCCESS/NEW/PROCESSING status, show toast "Sync triggered successfully"; close popup; update sync button to show "Syncing..." with disabled state
- [ ] T034 [US3] On triggerSync API error: show error toast with error message; keep popup open; keep button enabled for retry (error handling via Toaster already implemented in ClipboardMusicSyncService)
- [ ] T035 [US3] Implement duplicate submission prevention: disable Sync button immediately on click (before popup opens) until API response received; show button as disabled/in-progress (via state or Badge/badge styling)
- [ ] T036 [US3] After sync operation completes (success or error), update team row to show updated status or timestamp (placeholder: use createdAt timestamp from response as "Last Sync Time")

### Verification for User Story 3

- [ ] T037 [P] [US3] Write unit test for ClipboardSyncConfirmPopup.tsx testing popup render, Confirm button calls onConfirm, Cancel closes popup, loading state during API call
- [ ] T038 [P] [US3] Write unit test for ClipboardMusicSyncService.ts testing triggerSync() calls correct endpoint, handles success/error responses, error notifications via Toaster
- [ ] T039 [P] [US3] Write unit test for ClipboardTeamsListPanel.tsx (update existing tests) testing Sync button click opens popup, duplicate prevention (button disabled during flight)
- [ ] T040 [US3] Create comprehensive Cypress e2e test: navigate to page → click Sync button on team → verify popup appears → click Confirm → verify success toast → verify button disabled during sync → verify status updated after completion

**Checkpoint**: User Story 3 complete - full sync flow works with duplicate prevention and feedback

---

## Phase 6: User Story 4 - Tabbed interface similar to Finance page (Priority: P2)

**Goal**: Implement tabbed page structure following Finance pattern, allowing future expansion with additional Clipboard management features.

**Independent Test**: Page renders with tab bar at top, "Music Sync" tab active, content panel below tabs.

### Implementation for User Story 4

- [ ] T041 [US4] Update ClipboardMusicSyncPage.tsx to import and use React Bootstrap `Tabs` and `Tab` components (follow Finance pattern from `src/pages/Finance/FinancePage.tsx`)
- [ ] T042 [US4] Define tab key constants: `TAB_MUSIC_SYNC = "MUSIC_SYNC"` and `TAB_MUSIC_SYNC` as default active tab
- [ ] T043 [US4] Wrap ClipboardTeamsListPanel inside `<Tab eventKey={TAB_MUSIC_SYNC} title="Music Sync">` component; add placeholder/empty `<Tab>` components for future tabs (e.g., "Logs", "Settings")
- [ ] T044 [US4] Verify page title, layout, spacing, and styling matches Finance page pattern (use styled-components, common layout components, FlexContainer, etc.)

### Verification for User Story 4

- [ ] T045 [P] [US4] Write unit test for ClipboardMusicSyncPage.tsx (update existing test from T020) testing Tabs component render, correct tab active, Music Sync content displayed
- [ ] T046 [US4] Create Cypress e2e test scenario: navigate to page → verify tab bar visible → verify "Music Sync" tab active → verify teams list content displayed

**Checkpoint**: All user stories complete and testable - feature ready for polish phase

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error edge cases, accessibility, performance validation, documentation

### Error Handling & Edge Cases

- [ ] T047 [P] Handle Clipboard API unavailable after page load: show error banner with retry button, keep previous data (if cached) marked as stale
- [ ] T048 [P] Handle empty teams list gracefully: show empty state message centered on page, no table rendered
- [ ] T049 [P] Handle sync operation timeout (>30s): show timeout error toast, allow manual retry, do NOT auto-retry
- [ ] T050 [P] Handle user lacking module permission: show access denied message via ModuleAccessWrapper, do NOT render page content

### Loading & State Indicators

- [ ] T051 [P] Verify PageLoadingSpinner displays on initial teams fetch; spinner matches project design
- [ ] T052 [P] Verify Sync button shows loading state (spinner or badge) during operation; button text changes to "Syncing..." or similar
- [ ] T053 [P] Verify session details panel shows loading spinner while fetching; graceful handling if fetch fails

### Accessibility & Usability

- [ ] T054 [P] Verify page title, buttons, and table headers have proper aria-labels and semantic HTML structure
- [ ] T055 [P] Verify confirmation popup is focusable modal with keyboard navigation (Tab, Enter to confirm, Esc to cancel)
- [ ] T056 [P] Verify all interactive elements are keyboard accessible; test with Tab key navigation

### Performance Validation

- [ ] T057 Verify page load completes within 5 seconds for 10+ teams (SC-001); use Cypress performance measurement
- [ ] T058 Verify all teams visible without pagination or scroll jank; responsive design on mobile (SC-002)
- [ ] T059 Verify sync operation feedback received within 30 seconds (SC-003); validate via Cypress e2e with network throttling simulation

### Final Integration & Documentation

- [ ] T060 [P] Update AGENTS.md speckit reference to point to this tasks.md (already done in plan phase)
- [ ] T061 [P] Create or update navigation link in Clipboard module to Clipboard Music Sync page (if module navigation exists)
- [ ] T062 Verify all imports, types, and file paths are correct; run `npm run tsc -- --noEmit` to check TypeScript compilation
- [ ] T063 Verify all tests pass: `npm run test -- src/__tests__/pages/Clipboard/ src/__tests__/services/Clipboard/`
- [ ] T064 Run full Cypress e2e test suite: `npm run cypress:open` and verify all ClipboardMusicSync tests pass
- [ ] T065 Perform manual smoke test: navigate to page as Clipboard admin user → verify all stories work end-to-end → verify no console errors or warnings

**Checkpoint**: Feature complete, tested, documented, and ready for deployment

---

## Task Summary

**Total Tasks**: 65 (T001-T065)

**By Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 8 tasks
- Phase 3 (US1): 8 tasks
- Phase 4 (US2): 8 tasks
- Phase 5 (US3): 10 tasks
- Phase 6 (US4): 5 tasks
- Phase 7 (Polish): 19 tasks

**By Category**:
- Infrastructure/Setup: 13 tasks
- Component Implementation: 20 tasks
- Service Layer: 6 tasks
- Tests (unit + e2e): 16 tasks
- Verification & Polish: 10 tasks

---

## Implementation Strategy & Dependencies

### User Story Dependencies

```
Phase 2: Foundational (T006-T013)
   ↓
Phase 3: US1 (T014-T021) ← Parallel opportunity
Phase 4: US2 (T022-T029) ← Parallel with US1 (separate component)
Phase 5: US3 (T030-T040) ← Parallel with US1/US2 (builds on US1 team list)
Phase 6: US4 (T041-T046) ← Depends on US1/US2/US3 (wraps all in tabs)
   ↓
Phase 7: Polish (T047-T065)
```

### Parallelization Opportunities (after Phase 2 complete)

**Can run simultaneously**:
- T014-T018 (US1 component) + T022-T026 (US2 component): Different files, no dependencies
- T030-T036 (US3 component) builds on US1, can start after T014 ready
- T019-T020 (US1 tests) + T027-T028 (US2 tests): Independent test files

**Suggested parallel execution**:
1. Complete Phase 2 (T006-T013) — blocking
2. Run in parallel:
   - Dev track: Start US1 implementation (T014-T018) → then US3 (T030-T036)
   - Test track: Start US1 tests (T019-T021) while implementation proceeds
   - Parallel: US2 implementation (T022-T026) in separate dev branch
3. Merge all user story branches, run full test suite
4. Complete US4 (T041-T046) wrapping all in tabs
5. Run Polish phase (T047-T065)

### MVP Scope (Minimum Viable Product)

**Suggested Phase Release**: Complete Phases 1-5 for MVP

- Phase 1-2: Setup & Foundation (required)
- Phase 3-5: User Stories 1-3 (core feature: view teams, view sessions, trigger sync)
- US4 (Phase 6): Tabbed interface (added value, enables future features)
- Phase 7: Polish (desirable but can be deferred for v1.0; prioritize T040-T065 for production readiness)

**MVP Acceptance**: User Stories 1-3 fully implemented and passing all tests (Cypress e2e + unit tests)

---

## File Checklist

**New Files to Create**:
- [ ] `src/types/Clipboard/iClipboardSyncMessage.ts`
- [ ] `src/services/Clipboard/ClipboardMusicSyncService.ts`
- [ ] `src/pages/Clipboard/ClipboardMusicSyncPage.tsx`
- [ ] `src/pages/Clipboard/components/ClipboardTeamsListPanel.tsx`
- [ ] `src/pages/Clipboard/components/ClipboardSessionDetailsPanel.tsx`
- [ ] `src/pages/Clipboard/components/ClipboardSyncConfirmPopup.tsx`
- [ ] `src/__tests__/pages/Clipboard/ClipboardMusicSyncPage.test.tsx`
- [ ] `src/__tests__/pages/Clipboard/components/ClipboardTeamsListPanel.test.tsx`
- [ ] `src/__tests__/pages/Clipboard/components/ClipboardSessionDetailsPanel.test.tsx`
- [ ] `src/__tests__/pages/Clipboard/components/ClipboardSyncConfirmPopup.test.tsx`
- [ ] `src/__tests__/services/Clipboard/ClipboardMusicSyncService.test.ts`
- [ ] `cypress/e2e/Clipboard/ClipboardMusicSync.cy.ts`

**Existing Files to Modify**:
- [ ] `src/App.tsx` (add route)
- [ ] `src/Url.ts` (add URL constant)
- [ ] `src/layouts/SchoolBoxRouter.tsx` (add route handler if needed)
- [ ] `AGENTS.md` (already updated in plan phase)
