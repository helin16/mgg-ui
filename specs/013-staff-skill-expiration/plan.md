# Implementation Plan: Staff Skill Expiration Management (013)

**Branch**: `013-staff-skill-expiration` | **Date**: 2026-08-19 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/013-staff-skill-expiration/spec.md`

## Summary

Enhance the Staff List Admin interface to provide comprehensive management of staff skill expiration dates through:
1. **CSV Export Enhancement**: Visual highlighting of expired skills in exported files using sheetjs-style formatting
2. **Bulk Update Capability**: Multi-select checkboxes and modal dialog for updating skill expiration dates for multiple staff at once
3. **Settings Configuration**: Dedicated Settings tab with 8 configuration fields for notification timing, skill filtering, and email templates
4. **Notification System**: Backend worker to send daily individual and batched bulk notifications to staff and administrators

**Technical Approach** (verified against codebase, revised 2026-08-19 after live DB check):
- Frontend: React 18 + TypeScript, reuse existing module settings pattern, extend StaffListPanel with checkbox column and Settings tab; gate Bulk Update + Settings via `AuthService.isModuleRole(moduleId, ROLE_ID_ADMIN)`
- Backend: **New** bulk-update endpoint `PUT /syn/communitySkill/:staffID/:skillCode` calling Synergetic stored procedures (`spuCommunitySkills`/`spiCommunitySkills`) via raw EXEC — direct Sequelize writes are blocked at the model level; Add ExpiringSkillsWorker (follows ExpiringCreditCards pattern) triggered nightly at 11:59pm via `node-cron` in `src/worker.ts`, registered in CronJobsQueue; use existing SMTPConnector
- Database: No schema changes; use existing `uMGGSModules.settings` JSON column for configuration, existing `CommunitySkills.ExpiryDate` field; writes go through verified stored procedures, not direct table access
- Testing: Cypress E2E for UI flows, Jest for notification day-interval math and deduplication logic

## Technical Context

**Language/Version**: React 18 + TypeScript, Node.js + Express (mggs-api)
**Primary Dependencies**: Create React App (not ejected), Redux, React Bootstrap, styled-components (frontend); Sequelize, Bull Queue, nodemailer (backend)
**Storage**: SQL Server (mggservices: uMGGSModules, Message queue; Synergetic_AUVIC_MENTONEGG_PRD: CommunitySkills, luSkill — read-only mapped), Redis (127.0.0.1:6379 for queue)
**Testing**: Jest + React Testing Library (frontend), Cypress E2E (UI workflows), Jest (backend unit tests)
**Target Platform**: Web browser (desktop admin interface), SchoolBox embedded module
**Project Type**: Single React 18 SPA with remote module loader (AppLoader) and Express API backend
**Performance Goals**: 
  - CSV export: <5s for download + highlighting
  - Bulk update: <3s for 50+ staff
  - Notifications: Sent within 1 hour of trigger time
  - Settings save: <2s with persistence
**Constraints**:
  - No automatic retry on email failures (lossy delivery); admin validates recipients
  - Notification batching: all expiring skills for same staff in ONE email per day
  - No persistent "last notified" log (FR-030) — follow-up cadence must be derived mathematically from ExpiryDate + settings each nightly run (day-interval modulo check), not tracked state
  - Module access: protected by ModuleAccessWrapper with MGGS_MODULE_ID_STAFF_LIST (15); Bulk Update + Settings save additionally admin-gated via `AuthService.isModuleRole(moduleId, ROLE_ID_ADMIN)`
  - No persistent notification log DB table; use app logs only
  - **Skill data writes must go through Synergetic stored procedures** (`spuCommunitySkills`, `spiCommunitySkills`) via raw EXEC — the Sequelize model has a `blockUpsert()` hook that rejects all direct saves/updates
**Scale/Scope**:
  - ~50-200 staff per school
  - 5-10 monitored skill codes per school
  - ~100-500 skill expiration checks per daily cron run
  - 1-3 admin recipients per bulk notification

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

✅ **I. Module-Gated Delivery**: 
- Route: `/modules/remote/staff-list-admin` (existing)
- Module ID: `MGGS_MODULE_ID_STAFF_LIST = 15` (existing, already defined)
- Access Control: Wrapped in `ModuleAccessWrapper(moduleId=15)` for view access; Bulk Update and Settings write actions additionally gated via `AuthService.isModuleRole(15, ROLE_ID_ADMIN)` (frontend, matching `BTGLDetailsPanel.tsx`/`ParentTeacherInterviewPage.tsx` pattern) plus an equivalent backend admin check before executing writes
- No new one-off entry mechanisms

✅ **II. Typed Service Boundaries**: 
- Settings: Use existing `MggsModuleService.getModule()` / `updateModule()` (proven pattern)
- Skill data: Use existing `SynCommunitySkillService` with typed response `iSynCommunitySkill[]`
- Bulk update: **New** `PUT /syn/communitySkill/:staffID/:skillCode` endpoint (Synergetic stored-procedure backed, not a direct Sequelize update), typed request/response
- No direct axios calls in components; all via service layer
- Notification service: New `src/services/Synergetic/Community/ExpiringSkillsService.ts` wraps bulk update calls

✅ **III. Explicit Async UX States**: 
- **Export CSV**: Loading → Success (file download) + Error (toast)
- **Bulk Update**: Selection → Modal → Submitting (disabled button) → Success (toast + list refresh) → Error (toast with retry option)
- **Settings Save**: Form state → Saving (disabled submit) → Success (toast) → Error (form validation feedback)
- **Notifications**: Worker logs progress; admin monitors via app logs (no UI component required)

✅ **IV. School Data & Config Safety**: 
- Staff emails stored in module settings (`skillExpirationNotificationEmails` field), not in code or localStorage
- Environment variables: Existing `REACT_APP_API_END_POINT`, `REACT_APP_TOKEN`, SMTP config in .env (already in use)
- Email templates stored in module settings (no dangerouslySetInnerHTML; safe substitution + HTML escaping per FR-027)
- CSV export: No sensitive data; reads already-visible table columns
- Skill expiration dates: Read-only from Synergetic; updates via safe API endpoint

✅ **V. Risk-Based Verification**: 
- **Shared logic**: Notification deduplication logic (tracking sent emails by staffId/skillCode/date) → Jest unit tests
- **CSV highlighting**: Existing sheetjs-style library used → tested via StudentNumberForecast/StudentAttendanceReport precedent
- **Bulk update**: End-to-end Cypress test (select staff, update skill, verify list refreshed)
- **Settings persistence**: Cypress test (save settings, reload page, verify values)
- **Notification sending**: Manual verification in dev (check logs for sent emails); production monitoring via app logs

## Project Structure

### Documentation (this feature)

```text
specs/013-staff-skill-expiration/
├── spec.md                 # Feature specification (7 user stories, 30 FRs, clarifications)
├── plan.md                 # This file (implementation architecture)
├── research.md             # Phase 0 output (infrastructure verification, patterns)
├── data-model.md           # Phase 1 output (database schema, API contracts, service flows)
├── quickstart.md           # Phase 1 output (step-by-step implementation guide)
├── contracts/              # Phase 1 output (API endpoint contracts, notification message format)
│   ├── API-BulkUpdate.md
│   ├── API-Settings.md
│   ├── Notification-Message.md
│   └── ExpiringSkillsWorker.md
└── tasks.md                # Phase 2 output (/speckit.tasks command - NOT created here)
```

### Source Code (this repository)

```text
# Frontend UI
src/
├── components/
│   ├── staff/
│   │   ├── StaffListPanel.tsx          # (MODIFY) Add checkbox column + bulk update button
│   │   ├── StaffListTable.tsx          # (MODIFY) Add column for checkboxes
│   │   ├── components/
│   │   │   ├── StaffListHelper.tsx     # (EXISTS) Already has COLUMN_GROUP_SKILL_EXPIRY_DATE
│   │   │   ├── BulkUpdateModal.tsx     # (NEW) Modal for skill selection + date picker
│   │   │   ├── SkillExpirationSettings.tsx  # (NEW) Settings tab for notifications
│   │   │   └── CSVExportHighlighter.ts # (NEW) Helper to format cells with highlighting
│   │   └── form/
│   │       └── CSVExportFromHtmlTableBtn.tsx  # (ENHANCE) Add cell styling for expiry highlighting
│   └── common/
│       └── PageLoadingSpinner.tsx      # (EXISTS) Reuse for async states
├── services/
│   ├── Module/
│   │   └── MggsModuleService.ts        # (EXISTS) For settings persistence
│   └── Synergetic/
│       ├── Community/
│       │   ├── SynCommunitySkillService.ts  # (EXISTS) Fetch skills
│       │   └── ExpiringSkillsService.ts    # (NEW) Bulk update + helper queries
│       └── Lookup/
│           └── SynLuSkillService.ts    # (EXISTS) Fetch skill codes for dropdown
├── types/
│   └── Synergetic/
│       ├── Community/
│       │   └── iSynCommunitySkill.ts   # (EXISTS) Skill model with ExpiryDate
│       └── Lookup/
│           └── iSynLuSkill.ts          # (EXISTS) Skill lookup
├── redux/
│   └── (NO CHANGES) Settings stored in module settings JSON, not Redux
└── __tests__/
    ├── components/staff/BulkUpdateModal.test.tsx  # (NEW)
    ├── services/ExpiringSkillsService.test.ts     # (NEW)
    └── helper/NotificationDeduplication.test.ts   # (NEW)

cypress/
├── e2e/
│   ├── StaffListSkillExpiration.cy.ts  # (NEW) E2E tests for bulk update, settings, CSV export
│   └── (existing) StaffListPage.cy.ts   # (ENHANCE) Add tests for new checkbox column
└── fixtures/
    └── skillExpirationData.json        # (NEW) Test data for notifications

# Backend API (mggs-api repository)
src/
├── models/
│   └── Settings/
│       └── Message.ts                  # (MODIFY) Add MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION
├── workers/
│   └── ExpiringSkillsWorker.ts         # (NEW) Query & notify expiring skills nightly, incl. day-interval math
├── worker.ts                            # (MODIFY) Register nightly 11:59pm cron trigger in loadCronJobs()
├── queue/
│   ├── CronJobsQueue.ts                # (MODIFY) Register new worker
│   └── helper/
│       └── ExpiringSkillsMailerHelper.ts  # (NEW) Template substitution + email batching
├── controllers/
│   └── Synergetic/
│       └── Community/
│           └── SynCommunitySkillController.ts  # (MODIFY) Add NEW PUT /:staffID/:skillCode method
└── __tests__/
    ├── workers/ExpiringSkillsWorker.test.ts  # (NEW)
    └── queue/NotificationDeduplication.test.ts  # (NEW)
```

**Structure Decision**: Single React app (mgg-ui) + single backend API (mggs-api). Staff skill expiration is a SchoolBox-embedded module route, fitting the existing `/modules/remote/:code` pattern. No new projects or structural changes required.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | All constraints met; no Constitution Check violations | — |

---

## Phase 0: Research & Infrastructure Verification

**Status**: ✅ **COMPLETE** — All infrastructure verified against codebase

### Research Summary

All 4 implementation clarifications from the user have been verified against the actual codebase. **One assumption was found to be incorrect and has been corrected** after live database verification on 2026-08-19:

1. **Bulk Skill Updates**: ⚠️ REVISED
   - Original assumption (direct Sequelize update via `CRUDHelper.updateModel`) is **incorrect** — `SynCommunitySkill.ts` calls `SynergeticDB.blockUpsert()`, which rejects all direct saves/updates
   - Verified live against `Synergetic_AUVIC_MENTONEGG_PRD`: stored procedures `spuCommunitySkills` (update), `spiCommunitySkills` (insert), `spdCommunitySkills` (delete) exist and are the only valid write path, matching the same raw-EXEC pattern already used by `StudentAbsenceHelper.syncToSynergetic()`
   - **Confirmed direction**: New endpoint `PUT /syn/communitySkill/:staffID/:skillCode`, backend resolves existing record and calls `spuCommunitySkills` (or `spiCommunitySkills` if no record exists)

2. **Notification Scheduler**: ✅ Verified
   - CronJobsQueue exists with Redis backing; `src/worker.ts` already registers nightly `node-cron` jobs (e.g. `cron.schedule('0 23 * * *', ...)`)
   - **Confirmed**: New worker runs nightly at 11:59pm (`59 23 * * *`), checking all Active staff and their Active skills

3. **Email Service**: ✅ Verified
   - SMTPConnector.send() is generic (supports to/cc/bcc/subject/html/text)
   - Used across multiple modules already
   - No abstraction layer needed

4. **CSV Export Highlighting**: ✅ Verified, scope confirmed
   - CSVExportFromHtmlTableBtn already uses sheetjs-style library
   - Supports cell formatting (background color, etc.)
   - **Confirmed**: Highlighting applies only to Skill expiry date cells, not other date-looking columns (DOB, leaving date, etc.)

**Key Finding**: Bulk update requires a genuinely **new** backend endpoint with stored-procedure integration (moderate effort). Notification worker, email, and CSV highlighting remain low-risk and follow proven patterns.

### Verified Assumptions

- ✅ Module settings JSON column exists and is accessible
- ✅ Staff skill data with ExpiryDate field already tracked
- ✅ Module ID 15 (Staff List) already defined
- ✅ Excel export library available with formatting support
- ✅ Email queue infrastructure ready
- ✅ Notification scheduler infrastructure ready (node-cron in `src/worker.ts`)
- ✅ No database schema changes required
- ✅ Synergetic stored procedures exist for skill writes (`spuCommunitySkills`, `spiCommunitySkills`, `spdCommunitySkills`)
- ⚠️ Direct Sequelize writes to `CommunitySkills` are blocked — must use stored procedures instead

### Clarifications Addressed (Session 2026-08-19)

| Question | Answer | Impact |
|----------|--------|--------|
| Email send failure handling | Log + skip (lossy); no retry | Simplified backend; admin monitors logs |
| XSS prevention in templates | HTML-escape variables in HTML emails | Prevents injection attacks |
| Duplicate notification handling | Skip duplicates (staffId/skillCode/expiryDate tuple); batch same-staff skills | Reduces spam; 1 email/staff/day max |
| Notification cycle reset trigger | ExpiryDate changes only (not metadata) | Clear scope; metadata changes don't disrupt |
| Notification log retention | App logs only, standard rotation | Reduces DB overhead |

---

## Phase 1: Design & Service Contracts

**Status**: ✅ **COMPLETE** — Contracts & data model defined below

### 1. Data Model & Schema (No DB Changes)

**Frontend Settings Entity** (module settings JSON):
```typescript
interface iSkillExpirationSettings {
  // Notification timing
  initialNotificationDays: number;        // Days before expiry to send 1st notification
  followUpNotificationDays: number;       // Days between follow-up notifications
  
  // Skill filtering
  monitoredSkillCodes: string[];          // e.g., ["CPR", "FirstAid"]
  
  // Recipient configuration
  skillExpirationNotificationEmails: string;  // Semicolon-separated emails for bulk summary
  
  // Email templates (with variable substitution)
  individualNotificationEmailSubject: string;  // Supports {staffName}, {skillCode}, {expirationDate}
  individualNotificationEmailBody: string;
  bulkNotificationEmailSubject: string;       // Supports {expiringStaffTable}
  bulkNotificationEmailBody: string;
}
```

**Backend Notification Deduplication** (in-memory cache or ephemeral DB):
```typescript
interface iNotificationSent {
  staffId: number;
  skillCode: string;
  expirationDate: Date;
  notificationDate: Date;  // When notification was sent
  // Not persisted beyond app logs; prevents duplicates on same day
}
```

**Existing Entities (No Changes)**:
- `CommunitySkills`: Already has ExpiryDate field
- `uMGGSModules`: Already has JSON settings column
- `luSkill`: Already has skill master list

### 2. Service Layer Contracts

**Frontend Services**:
```typescript
// src/services/Module/MggsModuleService.ts (EXISTS)
getModule(moduleId: number): Promise<{settings: Record<string, any>}>
updateModule(moduleId: number, data: {settings: Record<string, any>}): Promise<{id, settings}>

// src/services/Synergetic/Community/ExpiringSkillsService.ts (NEW)
bulkUpdateSkillExpiryDate(staffIds: number[], skillCode: string, newExpiryDate: string): Promise<PromiseSettledResult<any>[]>
  // Uses Promise.allSettled to loop: PUT /syn/communitySkill/:staffID/:skillCode

getSkillsForStaff(staffId: number): Promise<iSynCommunitySkill[]>
  // Uses existing SynCommunitySkillService.getSkills()
```

**Backend Services** (mggs-api):
```typescript
// src/controllers/Synergetic/Community/SynCommunitySkillController.ts (MODIFY - new method)
updateSkillExpiryByStaffAndCode(req, res): Promise<void>
  // Resolves existing record by (ID=staffID, SkillCode=skillCode)
  // Calls spuCommunitySkills (update) or spiCommunitySkills (insert) via raw EXEC

// src/workers/ExpiringSkillsWorker.ts (NEW)
run(request: iNotificationRequest): Promise<{
  notificationsSent: number;
  emailsSent: number;
  failures: {staffId, skillCode, error}[]
}>

// src/queue/helper/ExpiringSkillsMailerHelper.ts (NEW)
sendIndividualNotification(staff, skills, templates, settings): Promise<void>
sendBulkNotification(expiredStaffSummary, recipients, templates, settings): Promise<void>
```

### 3. API Endpoint Contracts

**Existing Endpoints (Reused)**:
- `GET /syn/mggsModule/15` — Fetch settings
- `PUT /syn/mggsModule/15` — Update settings
- `GET /syn/communitySkill` — Fetch skills (paginated)

**New Endpoint (Required)**:
- `PUT /syn/communitySkill/:staffID/:skillCode` — Update (or create) a staff member's skill expiry date via `spuCommunitySkills`/`spiCommunitySkills` stored procedures (raw EXEC, not Sequelize `.update()`). See `contracts/API-BulkUpdate.md` for full implementation.

### 4. UI Component Contracts

**StaffListPanel Enhancements**:
- Add checkbox column (new feature)
- Add "Bulk Update" button when selections > 0
- Add "Settings" tab alongside existing tabs

**BulkUpdateModal (New)**:
- Dropdown: Skill selection (populated from luSkill)
- Date picker: New expiration date
- Submit/Cancel buttons
- Only rendered/enabled when `AuthService.isModuleRole(15, ROLE_ID_ADMIN)` resolves true

**SkillExpirationSettings (New)**:
- 8 configuration fields (numeric inputs, multi-select, text areas for templates)
- Save button with loading state
- Success/error toast messaging
- Only rendered/enabled when `AuthService.isModuleRole(15, ROLE_ID_ADMIN)` resolves true

### 5. Notification Message Format

**Individual Notification Email**:
```
To: {staff.occpEmail}
Subject: {individualNotificationEmailSubject} (HTML-escaped variables)
Body: {individualNotificationEmailBody} (HTML-escaped variables)

Variables: {staffName}, {skillCode}, {expirationDate}, {occpEmail}
```

**Bulk Notification Email**:
```
To: skillExpirationNotificationEmails (semicolon-separated)
Subject: {bulkNotificationEmailSubject} (HTML-escaped variables)
Body: {bulkNotificationEmailBody} (HTML-escaped variables)

Variables: {expiringStaffTable}
```

**Deduplication Rule** (no persistent log — derived mathematically):
```
notifyDay = true if today == expiryDate - initialNotificationDays
            OR (followUpNotificationDays > 0 AND daysSince(initialNotifyDate) % followUpNotificationDays == 0)
```
Batch same-staff skills into 1 email/day. See `contracts/ExpiringSkillsWorker.md` "Day-Interval Math" for full algorithm.

### 6. Testing Strategy

**Unit Tests** (Jest): Deduplication, template substitution, batch logic
**Integration Tests** (Jest): Settings persistence, bulk update logic
**E2E Tests** (Cypress): Export CSV, bulk update, settings save/reload, access control
**Manual Verification**: App logs for notification timing and formatting

---

## Summary & Next Steps

✅ **All Infrastructure Verified (including live DB check)**  
- Research phase complete (verified against mggs-api codebase + live query against Synergetic DB)
- Constitution Check passed (all 5 principles satisfied)
- No database schema changes needed
- **One new backend endpoint required**: bulk skill update via Synergetic stored procedures (`spuCommunitySkills`/`spiCommunitySkills`) — direct Sequelize writes are blocked
- Notification worker, email, and CSV highlighting remain low-risk, proven patterns
- Admin-only write actions (Bulk Update, Settings save) confirmed to use existing `isModuleRole`/`ROLE_ID_ADMIN` gating pattern

📋 **Phase 1 Design Complete**  
- Service layer contracts defined (existing + new services), including corrected bulk-update contract
- Data models specified (no DB schema changes; write path via stored procedures)
- UI component structure planned, with admin role gating
- Day-interval notification math designed (no persistent log required)
- Testing strategy mapped

🚀 **Ready for Task Generation**  
Run `/speckit.tasks` to generate dependency-ordered implementation tasks. All design decisions are resolved, including bulk-update auto-create behavior for staff without an existing skill record (see `contracts/API-BulkUpdate.md`).
