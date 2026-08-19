# Tasks: Staff Skill Expiration Management (013)

**Input**: Design documents from `/specs/013-staff-skill-expiration/` (spec.md, plan.md, research.md, data-model.md, quickstart.md, contracts/)
**Prerequisites**: plan.md (required), spec.md (required for user stories) — both present and complete

**Repos involved**: This feature spans **two repositories**. Most tasks are in this repo (`mgg-ui`, frontend). Tasks explicitly marked **(mggs-api repo)** are in the separate backend API repository and must be branched/PR'd there independently; there is no shared build between the two.

**Tests**: Included per the constitution (shared logic, cross-system flows). Automated tests (Jest) cover services/helpers/reducers/workers with changed behavior; Cypress/manual verification covers the module-access, bulk-update, and notification-delivery cross-system flows.

**Organization**: Tasks are grouped by user story (from spec.md, in priority order) to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US7)
- File paths are relative to this repo's root unless marked **(mggs-api repo)**

## Path Conventions

- Frontend (`mgg-ui`, this repo): `src/`, `cypress/e2e/`
- Backend (`mggs-api`, separate repo): `src/` (workers, controllers, queue, models) — paths noted explicitly

---

## Phase 1: Setup

**Purpose**: Confirm what already exists so no new one-off entry mechanism is invented

- [ ] T001 Confirm `/modules/remote/staff-list-admin` route is already registered in `src/layouts/SchoolBox/SchoolBoxRouter.tsx` under `MGGS_MODULE_ID_STAFF_LIST` (15, defined in `src/types/modules/iModuleUser.ts`) and wrapped in `ModuleAccessWrapper` — no new route/module ID needed, this feature only adds to the existing Staff List - Admin surface (`src/pages/Staff/StaffListAdminPage.tsx`)
- [ ] T002 [P] Confirm the `mggs-api` repo is checked out locally alongside `mgg-ui` for the backend tasks in this list (new bulk-update endpoint, `ExpiringSkillsWorker`, mailer helper)
- [ ] T003 [P] Confirm SMTP/MailGun env vars are already configured in `mggs-api`'s `.env` (`SMTP_HOST`, `SMTP_DEFAULT_FROM`, `MAIL_GUN_*`) — no new `REACT_APP_` vars needed in `mgg-ui`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared types and confirmed patterns that the Settings/notification stories (US3–US7) build on

**⚠️ CRITICAL**: Complete before starting US3–US7. US1 and US2 do not depend on this phase and may start immediately after Phase 1.

- [ ] T004 [P] Create `iSkillExpirationSettings` type (8 fields per `data-model.md` §1) in `src/types/modules/iSkillExpirationSettings.ts`
- [ ] T005 [P] (mggs-api repo) Create `iSkillExpirationSettings` and `iSkillExpirationRequest` types in `src/types/Workers/iSkillExpirationSettings.ts` and `src/types/Workers/iSkillExpirationRequest.ts`, per `contracts/ExpiringSkillsWorker.md` Phase 1
- [ ] T006 (mggs-api repo) Add `MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION` constant to `src/models/Settings/Message.ts`
- [ ] T007 Confirm `AuthService.isModuleRole(MGGS_MODULE_ID_STAFF_LIST, ROLE_ID_ADMIN)` (`src/services/AuthService.ts`, `src/types/modules/iRole.ts`) is the gating call to reuse for the Bulk Update button and Settings tab — this is the existing pattern already used by `src/pages/ParentTeacherInterview/components/ParentTeacherInterviewModuleSettingsPanel.tsx`; no new access-control mechanism needed

**Checkpoint**: Shared types exist; access-control pattern confirmed. US1–US7 implementation can now begin.

---

## Phase 3: User Story 1 - Export CSV with Expired Skill Highlighting (Priority: P1) 🎯 MVP candidate

**Goal**: Exported CSV visually marks expired skill-expiry cells so admins don't need extra UI lookups

**Independent Test**: Export the staff list as CSV/XLSX and confirm expired Skill-expiry cells are visually distinct while non-expired cells and unrelated date columns (DOB, leaving date) are unmarked

### Verification for User Story 1

- [x] T008 [P] [US1] Add Jest coverage for the cell-highlighting logic (expired / current / empty skill-expiry values, plus a control non-skill date column that must NOT be marked) in `src/__tests__/components/form/CSVExportFromHtmlTableBtn.test.tsx`
- [ ] T009 [US1] Cypress E2E: export CSV from the Staff List, verify only Skill-expiry cells for past dates are highlighted, in `cypress/e2e/StaffListSkillExpiration.cy.ts` (new) — not yet performed

### Implementation for User Story 1

- [x] T010 [US1] Extend `src/components/form/CSVExportFromHtmlTableBtn.tsx`: after `XLSX.utils.table_to_sheet(data)`, iterate the live DOM table and apply `cell.s = {fill, font}` styling to worksheet cells whose corresponding `<td>` contains a `.skill-expiry-date.bg-danger` element. `table_to_sheet` doesn't carry over Bootstrap CSS classes into the sheet itself (only inline styles), but the on-screen `bg-danger` class from `StaffListTable.tsx`'s `getSkillExpiryDateColumns` is still readable from the live DOM at export time, so it's reused directly rather than re-deriving expiry from the date text a second time
- [x] T011 [US1] ~~Add a prop~~ — done differently: `CSVExportFromHtmlTableBtn` detects expired Skill-expiry cells directly from the live DOM via the existing `.skill-expiry-date.bg-danger` marker classes already applied on-screen by `StaffListTable.tsx`'s `getSkillExpiryDateColumns`, so no new prop or column-semantics plumbing was needed between `StaffListPanel.tsx`/`StaffListTable.tsx` and the button
- [ ] T012 [US1] Manual verification: export with a mix of expired/current/empty skill-expiry dates and confirm only Skill-expiry cells are marked (FR-001, SC-001) — not yet performed (no running app/browser in this session)

**Checkpoint**: User Story 1 fully functional and testable independently.

---

## Phase 4: User Story 2 - Bulk Selection & Update UI (Priority: P1)

**Goal**: Admin selects 2+ staff and updates one skill's expiration date for all of them in a single operation

**Independent Test**: Select 2+ staff, bulk-update a skill's expiry date, verify all selected staff reflect the new date after the list refreshes

### Verification for User Story 2

- [x] T013 [P] [US2] Jest tests for the new `SynCommunitySkillService` update method(s) (mock axios, verify request URL/body shape) in `src/__tests__/services/Synergetic/Community/SynCommunitySkillService.test.ts`
- [x] T014 [P] [US2] Jest tests for `BulkUpdateModal` (submit disabled until skill + date chosen, loading state, partial-failure messaging) in `src/__tests__/components/staff/BulkUpdateModal.test.tsx`
- [ ] T015 [US2] Cypress E2E: select 3 staff → "Bulk Update" → choose skill + date → Submit → verify modal closes, list refreshes, checkboxes clear, in `cypress/e2e/StaffListSkillExpiration.cy.ts` — not yet performed (no running app/backend in this session)
- [ ] T016 [US2] Cypress E2E: a non-admin module user does not see the checkbox column / "Bulk Update" button (access-control check) — not yet performed
- [x] T019 [P] [US2] (mggs-api repo) Jest tests for the new controller method: mock the DB query layer, assert `spuCommunitySkills` is called with all preserved fields on update, and `spiCommunitySkills` is called on auto-create when no record exists

### Implementation for User Story 2

- [x] T017 [US2] (mggs-api repo) Add route + `updateSkillExpiryByStaffAndCode` controller method for `PUT /syn/communitySkill/:staffID/:skillCode` in `src/controllers/Synergetic/Community/SynCommunitySkillController.ts`, per `contracts/API-BulkUpdate.md`: look up the existing record by `(ID=staffID, SkillCode=skillCode)`; if found, call `spuCommunitySkills` via raw EXEC with the existing field values plus the new `ExpiryDate`; if not found, auto-create via `spiCommunitySkills` (confirmed decision — see contract). Implemented via a new `src/helper/StaffSkill/StaffSkillHelper.ts` helper module.
- [x] T018 [US2] (mggs-api repo) Add a backend admin-role check before executing the write, mirroring `SynMggsModuleController`'s settings-PUT validation — done via `ModuleHelper.validateModuleAdmin(MGGS_MODULE_ID_STAFF_LIST)`
- [x] T020 [US2] Add `updateSkillExpiryDate(staffId, skillCode, expiryDate)` to `src/services/Synergetic/Community/SynCommunitySkillService.ts`, calling `PUT /syn/communitySkill/:staffId/:skillCode` — extends the existing service (which currently only has `getAll`) rather than introducing a new parallel service file
- [x] T021 [US2] Add `bulkUpdateSkillExpiryDate(staffIds, skillCode, expiryDate)` to the same service using `Promise.allSettled` over `updateSkillExpiryDate`, returning settled results so the UI can report partial failures
- [x] T022 [US2] Create `src/components/staff/components/BulkUpdateModal.tsx`: skill dropdown populated via the existing `SynLuSkillSelector` component (reused as-is rather than calling `SynLuSkillService.getAll()` directly), date picker, Submit/Cancel buttons, loading state; gating is done by the caller (`StaffListPanel.tsx` only opens the modal when `AuthService.isModuleRole(MGGS_MODULE_ID_STAFF_LIST, ROLE_ID_ADMIN)` resolves true)
- [x] T023 [US2] Modify `src/components/staff/components/StaffListTable.tsx` to add a checkbox column immediately before the `StaffID` column (sticky-left like the existing `StaffID` column), with header select-all and per-row checkboxes
- [x] T024 [US2] Modify `src/components/staff/StaffListPanel.tsx`: add `selectedStaffIds` state; show a "Bulk Update" button before the Export button when `selectedStaffIds.length > 0` and the admin-role check passes (FR-003); open `BulkUpdateModal`; on success clear selection, refresh the staff list, and show a success toast; on partial failure, show which staff failed
- [x] T025 [US2] Wire loading/success/error toast states for the whole bulk-update flow via the shared `Toaster` service (constitution III — explicit async UX states)

**Checkpoint**: User Stories 1 AND 2 both work independently.

---

## Phase 5: User Story 3 - Settings Tab for Notification Configuration (Priority: P1)

**Goal**: A "Settings" tab on Staff List - Admin holds the notification configuration and persists it

**Independent Test**: Open the Settings tab, fill in all fields, save, reload the page, verify all values persisted

### Verification for User Story 3

- [ ] T026 [P] [US3] Jest tests for the new settings panel (renders all fields, validates required fields, save submits a merged settings object without clobbering other module settings keys) in `src/__tests__/components/staff/SkillExpirationSettingsPanel.test.tsx`
- [ ] T027 [US3] Cypress E2E: open Settings tab → fill fields → Save → reload → verify persisted, in `cypress/e2e/StaffListSkillExpiration.cy.ts`
- [ ] T028 [US3] Cypress E2E: a non-admin cannot see/edit Settings tab content

### Implementation for User Story 3

- [ ] T029 [US3] Modify `src/pages/Staff/StaffListAdminPage.tsx`: pass `extraTabs={[{key: 'settings', title: 'Settings', component: <SkillExpirationSettingsPanel />}]}` to `AdminPageTabs`, following the exact pattern in `src/pages/ParentTeacherInterview/ParentTeacherInterviewAdminPage.tsx`
- [ ] T030 [US3] Create `src/components/staff/components/SkillExpirationSettingsPanel.tsx` built on the shared `src/components/module/ModuleEditPanel.tsx` (handles load/save/loading/error/toast and admin gating) — reuse this rather than hand-rolling fetch/save logic, matching `ParentTeacherInterviewModuleSettingsPanel.tsx`
- [ ] T031 [US3] Implement the 4 recipient/template fields in that panel: `skillExpirationNotificationEmails` (semicolon-separated textarea), `individualNotificationEmailSubject`/`individualNotificationEmailBody`, `bulkNotificationEmailSubject`/`bulkNotificationEmailBody` (FR-024); the timing fields (US4/US5) and skill-filter field (US6) are added in their own phases below, into this same panel
- [ ] T032 [US3] Add client-side validation: each semicolon-separated email individually validated; required-field checks per `contracts/API-Settings.md` validation table
- [ ] T033 [US3] Manual verification: settings save calls `PUT /syn/mggsModule/15` and a reload restores the saved values (FR-010, SC-003)

**Checkpoint**: US1–US3 independently functional; Settings tab exists with its 4 recipient/template fields (8 fields total complete once US4–US6 land).

---

## Phase 6: User Story 4 - Initial Notification Timing Configuration (Priority: P1)

**Goal**: Admin sets how many days before expiry the first notification goes out; the worker can determine who's due

**Independent Test**: Set the value, save, verify it persists; verify a skill whose (expiry date − initialNotificationDays) is today is flagged as due

### Verification for User Story 4

- [ ] T034 [P] [US4] (mggs-api repo) Jest tests for the initial-notification branch of `isNotifyDay()` (before window opens → false; on the exact day → true) in `src/__tests__/workers/ExpiringSkillsWorker.test.ts`, per `contracts/ExpiringSkillsWorker.md` "Day-Interval Math"
- [ ] T035 [US4] Extend the US3 Cypress settings test to cover `initialNotificationDays` persistence

### Implementation for User Story 4

- [ ] T036 [US4] Add `initialNotificationDays` numeric field (1–365) to `SkillExpirationSettingsPanel.tsx`
- [ ] T037 [US4] (mggs-api repo) Create `src/workers/ExpiringSkillsWorker.ts` skeleton: `run()` loads module settings (`uMGGSModules.settings.skillExpiration`), queries all Active staff + their skills (unfiltered by skill code for now — US6 wires the filter), computes the initial-notification branch of `isNotifyDay()` (`contracts/ExpiringSkillsWorker.md` Phase 2b), and logs (INFO) which staff/skills would be notified today. Actual email sending is deferred to US7 — this story only needs to prove the worker can correctly identify who's due
- [ ] T038 [US4] (mggs-api repo) Register `ExpiringSkillsWorker` in `src/queue/CronJobsQueue.ts`'s processJob map, keyed by `MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION`
- [ ] T039 [US4] (mggs-api repo) Add a nightly `cron.schedule('59 23 * * *', ...)` trigger inside `loadCronJobs()` in `src/worker.ts`, calling `CronJobsQueue.addJobWithoutDuplicate({}, MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION, AuthHelper.getDefaultSystemUserId(), CronJobsQueue)`, matching the existing 11pm job pattern

**Checkpoint**: Worker exists and correctly determines "who's due for their first notification today"; no email sent yet.

---

## Phase 7: User Story 5 - Ongoing Notification Frequency Configuration (Priority: P1)

**Goal**: Admin sets the follow-up cadence; the worker keeps flagging staff daily at that interval indefinitely (even past expiry) until `ExpiryDate` changes

**Independent Test**: Set the value, save, verify it persists; verify the day-interval math continues to flag past expiry and resets when `ExpiryDate` changes

### Verification for User Story 5

- [ ] T040 [P] [US5] (mggs-api repo) Jest tests for the follow-up branch of `isNotifyDay()`: flags on `daysSinceInitial % followUpNotificationDays === 0`, continues indefinitely past expiry, and resets when `ExpiryDate` changes (FR-014); include the `followUpNotificationDays <= 0` → "initial notification only" edge case

### Implementation for User Story 5

- [ ] T041 [US5] Add `followUpNotificationDays` numeric field (0–30) to `SkillExpirationSettingsPanel.tsx`
- [ ] T042 [US5] (mggs-api repo) Complete `isNotifyDay()` in `ExpiringSkillsWorker.ts` with the full follow-up branch from `contracts/ExpiringSkillsWorker.md` Phase 2b

**Checkpoint**: Worker's day-interval math (initial + follow-up) is complete.

---

## Phase 8: User Story 6 - Skill Filter Configuration for Notifications (Priority: P1)

**Goal**: Only the admin-selected skill codes trigger notifications

**Independent Test**: Configure a subset of skill codes, verify only staff with those specific expiring skills are flagged by the worker

### Verification for User Story 6

- [ ] T043 [P] [US6] (mggs-api repo) Jest test: worker's query/filter only considers skills in `monitoredSkillCodes`; empty list disables notifications for that run (document/confirm chosen behavior per spec Edge Cases)

### Implementation for User Story 6

- [ ] T044 [US6] Add `monitoredSkillCodes` multi-select field to `SkillExpirationSettingsPanel.tsx`, populated from `SynLuSkillService.getAll()` (already used in `StaffListPanel.tsx`), supporting multi-select and clear-all
- [ ] T045 [US6] (mggs-api repo) Wire the `monitoredSkillCodes` filter into `ExpiringSkillsWorker.ts`'s `CommunitySkill.findAll()` query (`SkillCode: { [Op.in]: settings.monitoredSkillCodes }`), short-circuiting with an INFO log when the list is empty

**Checkpoint**: US1–US6 all independently functional; all 8 Settings fields exist; worker correctly determines who's due for notification today, filtered to monitored skills.

---

## Phase 9: User Story 7 - Notification Recipients & Email Distribution (Priority: P2)

**Goal**: Staff and admins actually receive correctly formatted, deduplicated emails

**Independent Test**: Trigger the worker manually; verify individual emails arrive at each staff member's `StaffOccupEmail` and a bulk summary arrives at the nominated addresses, with no duplicates on repeated same-day triggers

### Verification for User Story 7

- [ ] T046 [P] [US7] (mggs-api repo) Jest tests for `ExpiringSkillsMailerHelper`: template variable substitution, HTML escaping of all substituted variables (FR-027), batching multiple expiring skills for the same staff into one email/day (FR-029)
- [ ] T047 [P] [US7] (mggs-api repo) Jest tests for notification deduplication by `(staffId, skillCode, expirationDate, notificationDate)` tuple, per `contracts/Notification-Message.md`
- [ ] T048 [US7] Manual verification in dev: trigger the worker, confirm individual + bulk emails are received, check app logs for INFO/WARN entries, trigger a second time same day to confirm no duplicate emails (`quickstart.md` §4.2)

### Implementation for User Story 7

- [ ] T049 [US7] (mggs-api repo) Create `src/queue/helper/ExpiringSkillsMailerHelper.ts` with `sendIndividualNotification()` and `sendBulkNotification()`, per `contracts/ExpiringSkillsWorker.md` Phase 3, including `htmlEscape()` (XSS prevention) and `htmlToPlainText()` fallback
- [ ] T050 [US7] (mggs-api repo) Wire `ExpiringSkillsWorker.run()` to call the mailer helper for each staff member due today (batched) and for the bulk admin summary when `skillExpirationNotificationEmails` is configured, via `SMTPConnector.send()`
- [ ] T051 [US7] (mggs-api repo) Implement the in-memory deduplication cache for a single worker run (per `contracts/Notification-Message.md`), preventing duplicate emails for the same (staffId, skillCode, expirationDate) on the same day
- [ ] T052 [US7] (mggs-api repo) Add WARN-level logging + continue-on-failure for individual and bulk send failures (FR-026); no automatic retry
- [ ] T053 [US7] Confirm the 4 email-template fields added in T031 are wired end-to-end into the mailer helper's substitution logic (subject/body for both individual and bulk emails)
- [ ] T054 [US7] (mggs-api repo) Filter the worker's staff query to Active staff only (`ActiveFlag: true`) and confirm on the next run that a staff member whose status flips to Inactive stops being notified (FR-013)

**Checkpoint**: All 7 user stories independently functional end-to-end.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final verification sweep across all stories

- [ ] T055 [P] Run full Jest suite (`yarn test`) and confirm all new/changed frontend tests pass
- [ ] T056 [P] (mggs-api repo) Run backend Jest suite and confirm all new/changed backend tests pass
- [ ] T057 Run the full Cypress suite (`yarn cypress:run`) including the new `StaffListSkillExpiration.cy.ts` spec
- [ ] T058 Verify no sensitive data (staff emails, filled-in templates) is logged beyond what FR-030's INFO/WARN policy allows
- [ ] T059 Run the `quickstart.md` §4.2 manual integration checklist end-to-end (Settings save, Bulk Update, CSV Export, Notification Worker)
- [ ] T060 Run `yarn lint` and `yarn tsc --noEmit`; fix any issues before opening PRs in both repos

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS US3–US7 (does not block US1/US2)
- **US1 (Phase 3)** and **US2 (Phase 4)**: Can start right after Setup, in parallel with Phase 2 and with each other
- **US3 (Phase 5)**: Depends on Foundational (Phase 2) for the shared settings type + access-control confirmation
- **US4 (Phase 6)**: Depends on US3 (adds a field to the same settings panel) and on Foundational (backend message type)
- **US5 (Phase 7)**: Depends on US4 (extends the same `isNotifyDay()` function and settings panel)
- **US6 (Phase 8)**: Depends on US4 (extends the same worker query and settings panel); independent of US5
- **US7 (Phase 9)**: Depends on US4 (needs the worker skeleton to exist) and benefits from US6 being done first (so it's sending for the right skill set), but its mailer/dedup logic is otherwise self-contained
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — no dependency on any other story
- **US2 (P1)**: Independent — no dependency on any other story
- **US3 (P1)**: Independent of US1/US2; foundational for US4–US6 (same settings panel)
- **US4 (P1)**: Builds on US3 (same panel) and stands up the worker skeleton that US5–US7 extend
- **US5 (P1)**: Builds on US4's worker
- **US6 (P1)**: Builds on US4's worker; independent of US5
- **US7 (P2)**: Builds on US4's worker; lower priority than US3–US6 because it's the last mile (actual delivery) on top of settings/timing that must exist first

### Within Each User Story

- Verification tasks before/alongside implementation tasks, per constitution V (risk-based verification)
- Service/type changes before the UI or worker logic that consumes them
- Story complete before moving to the next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- T004–T007 (Foundational) marked [P] can run in parallel except where one blocks another (T004 and T005 are independent repos, safe in parallel)
- US1 (Phase 3) and US2 (Phase 4) can be built in parallel by different developers once Setup is done
- Within US2: T013/T014/T019 (tests) can run in parallel; T017/T018 (backend) can run in parallel with T020–T025 (frontend) once the endpoint contract (already written in `contracts/API-BulkUpdate.md`) is agreed
- Within US7: T046/T047 (mailer + dedup tests) can run in parallel

---

## Parallel Example: User Story 2

```bash
# Launch US2 verification tasks together:
Task: "Jest tests for SynCommunitySkillService update method(s)"
Task: "Jest tests for BulkUpdateModal"
Task: "(mggs-api repo) Jest tests for the new controller method"

# Backend and frontend implementation can proceed in parallel once contracts/API-BulkUpdate.md is agreed:
Task: "(mggs-api repo) Add PUT /syn/communitySkill/:staffID/:skillCode controller method"
Task: "Add updateSkillExpiryDate/bulkUpdateSkillExpiryDate to SynCommunitySkillService.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup
2. Complete Phase 3: User Story 1 (CSV highlighting) — **STOP and VALIDATE** independently
3. Complete Phase 4: User Story 2 (Bulk Update) — **STOP and VALIDATE** independently
4. These two P1 stories alone deliver the two most-requested efficiency wins (highlighting + bulk update) without touching the notification system at all

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (CSV highlighting) → Test independently → Deploy/Demo
3. US2 (Bulk Update) → Test independently → Deploy/Demo
4. US3 (Settings tab shell + recipient/template fields) → Test independently → Deploy/Demo
5. US4 (Initial timing) → US5 (Follow-up cadence) → US6 (Skill filter) → each extends the same worker; test independently, but the worker isn't "live" (no emails sent) until US7
6. US7 (Email distribution) → completes the notification loop → Deploy/Demo
7. Each story adds value without breaking previous stories

### Cross-Repo Coordination

Because US2, US4–US7 touch both `mgg-ui` and `mggs-api`, land the backend endpoint/worker piece first in each story (it's additive and has no frontend dependency), then build the frontend piece against it. This avoids frontend work blocking on an unmerged backend PR for long.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Tasks marked **(mggs-api repo)** live in the separate backend repository, not this one
- Verify required automated and manual checks are explicitly captured per constitution V
- Commit after each task or logical group
- Stop at any checkpoint to validate a story independently
- The bulk-update auto-create decision, and the `occpEmail` → `StaffOccupEmail` field-name correction (verified against `src/types/Synergetic/iVStaff.ts`), were both resolved during planning — see `contracts/API-BulkUpdate.md` and the corrected spec/contract docs
