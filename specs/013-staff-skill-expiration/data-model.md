# Database Structure Analysis: Staff Skill Expiration Feature (013)

**Date**: 2026-08-19  
**Status**: Read-only Discovery (No DB Changes Made)  
**Scope**: Examination of mggs-api schema to support feature 013  
**DB**: SQL Server (mggservices database, 10.114.37.90:1433)

---

## Executive Summary

✅ **Database Schema: READY (No Changes Needed)**

All required data structures already exist in the mggs-api database:
1. Module settings storage (flexible JSON column)
2. Staff/Community skill data with expiration dates
3. Notification infrastructure (queue + job scheduler)
4. Email sending capability (SMTP + MailGun)

**No database schema migrations required** for feature 013.

---

## 1. Module Settings Storage (READY ✅)

### Table: `uMGGSModules`
**Location**: mggservices (SQL Server)  
**ORM Model**: `/src/models/Modules/SynMggsModule.ts`

```sql
CREATE TABLE uMGGSModules (
  ModuleID          INT PRIMARY KEY AUTO_INCREMENT,
  Name              VARCHAR(MAX) NOT NULL,
  Description       VARCHAR(MAX) NOT NULL,
  Active            BOOLEAN DEFAULT 1,
  CreatedAt         DATETIME DEFAULT NOW(),
  CreatedById       INT NOT NULL,
  UpdatedAt         DATETIME DEFAULT NOW(),
  UpdatedById       INT NOT NULL,
  settings          TEXT NULL            -- JSON storage
);
```

**Current Status**:
- ✅ `settings` column exists (nullable TEXT)
- ✅ Supports JSON storage (via Node.js Sequelize serialization)
- ✅ Endpoint available: `GET/PUT /syn/mggsModule/{moduleId}`
- ✅ Module ID 15 (MGGS_MODULE_ID_STAFF_LIST) already assigned

**For Feature 013**:
- Store all 8 settings fields as nested JSON in `uMGGSModules.settings[skillExpiration]`:
  ```json
  {
    "skillExpiration": {
      "initialNotificationDays": 14,
      "followUpNotificationDays": 7,
      "monitoredSkillCodes": ["CPR", "FirstAid"],
      "skillExpirationNotificationEmails": "email1@school.com;email2@school.com",
      "individualNotificationEmailSubject": "Skill Expiring: {skillCode}",
      "individualNotificationEmailBody": "...",
      "bulkNotificationEmailSubject": "Expiring Staff Skills Summary",
      "bulkNotificationEmailBody": "..."
    }
  }
  ```

**No schema change needed** — existing column accommodates feature.

---

## 2. Staff Skill Data (READY ✅)

### Table: `CommunitySkills` (Synergetic DB)
**Location**: Synergetic_AUVIC_MENTONEGG_PRD (SQL Server, read-only mapped)  
**ORM Model**: `/src/models/Synergetic/Community/SynCommunitySkill.ts`

```sql
CREATE TABLE CommunitySkills (
  SkillSeq          INT PRIMARY KEY AUTO_INCREMENT,
  ID                INT,                  -- Staff/Community ID
  SkillCode         VARCHAR(50),
  SkillLevel        VARCHAR(50) NULL,
  Comment           VARCHAR(MAX) NULL,
  AttainedDate      DATETIME NULL,
  ExpiryDate        DATETIME NULL         -- Already Tracked!
);
```

**Current Status**:
- ✅ ExpiryDate field already exists
- ✅ Data already populated for staff skills
- ✅ Read-only access (SynergeticDB is read-only mapped)
- ✅ Skill codes (CPR, FirstAid, etc.) available via `luSkill` lookup
- ✅ Endpoint available: `GET /syn/communitySkill` (paginated list)

**For Feature 013**:
- Can query: `SELECT * FROM CommunitySkills WHERE ExpiryDate < GETDATE()`
- Can filter by Active staff (via join to staff status)
- **LIMITATION**: Read-only from Synergetic DB — cannot update via mggs-api
  - Updates must go back to Synergetic (external system)
  - Alternative: Store bulk update request in local mggs queue, sync back

### Table: `luSkill` (Synergetic DB)
**Location**: Synergetic_AUVIC_MENTONEGG_PRD  
**ORM Model**: `/src/models/Synergetic/Lookup/SynLuSkill.ts`

```sql
CREATE TABLE luSkill (
  Code              VARCHAR(50) PRIMARY KEY,
  Description       VARCHAR(MAX),
  ModifiedDate      DATETIME NULL,
  ModifiedUser      VARCHAR(100),
  SetCentrallyFlag  BOOLEAN NULL,
  SynergyMeaning    VARCHAR(MAX)
);
```

**Current Status**:
- ✅ Master list of skill codes
- ✅ Used for dropdown in Settings panel (multi-select)
- ✅ Already accessible via `/syn/luSkill` endpoint

---

## 3. Notification Infrastructure (READY ✅)

### Message Queue System

**Table**: `Messages` (local mggservices DB)  
**Queue Engine**: Redis (127.0.0.1:6379, see .env `QUEUE_DB_HOST/QUEUE_DB_PORT`)  
**ORM Models**:
- `/src/models/Settings/Message.ts`
- `/src/models/localModels.ts`

**Message Types Already Defined**:
```typescript
MESSAGE_TYPE_EXPIRING_PASSPORTS_OR_VISAS
MESSAGE_TYPE_FINANCE_EXPIRING_CREDIT_CARDS
MESSAGE_TYPE_HOY_CHAT_EMAIL
MESSAGE_TYPE_SMTP_EMAIL
MESSAGE_TYPE_STUDENT_ABSENCE_SUMMARY_RUN
// ... others
```

**For Feature 013**:
- Would need NEW message type: `MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION`
- Would need NEW worker: `/src/workers/ExpiringSkills.ts`
- Would register in `CronJobsQueue.ts` processJob map

### Cron Job Scheduler

**File**: `/src/queue/CronJobsQueue.ts`  
**Pattern**: Bull Queue (Redis-backed job queue)

**Existing Examples**:
- ExpiringCreditCards (Finance module) — runs on schedule, sends emails
- ExpiringPassportsAndVisas (Enrollments module) — runs on schedule, sends emails
- StudentAbsenceDailySummaryWorker — runs on schedule, sends summary emails

**For Feature 013**:
- Create new worker: `ExpiringSkillsWorker.ts` (follows ExpiringCreditCards pattern)
- Hook into CronJobsQueue to run at configured times
- Implement retry logic (already handled by queue framework)

### Existing Notification Workers Pattern

**File**: `/src/workers/ExpiringCreditCards.ts` (reference implementation)

**Pattern**:
```typescript
1. Get module settings (templateName, recipients, etc.)
2. Query data (debtors, expiring dates, etc.)
3. Filter by business logic (active status, date ranges, etc.)
4. For each recipient:
   - Load email template
   - Substitute variables
   - Add to mail queue
5. Log results
```

**For Feature 013**:
- Query: CommunitySkills with ExpiryDate approaching/past
- Filter: Active staff only
- Recipients: Individual staff (StaffOccupEmail) + bulk admin list
- Template: From module settings (subject + body)

---

## 4. Email Sending Infrastructure (READY ✅)

### Email Service: MailGun Integration

**Configuration** (from .env):
```
MAIL_GUN_DEFAULT_FROM=Mentone Girls' Grammar <noreply@mentonegirls.vic.edu.au>
MAIL_GUN_API_KEY=REDACTED-MAILGUN-API-KEY
MAIL_GUN_API_DOMAIN=mentonegirls.vic.edu.au
```

**ORM**: `/src/queue/helper/MailGunQueueHelper.ts`

**Current Usage**:
- Donation receipts
- Finance expiry notifications
- HOYChat emails
- Student absence summaries
- General SMTP emails

**For Feature 013**:
- Use existing MailGun infrastructure
- Template variables: `{staffName}`, `{skillCode}`, `{expiryDate}`, etc.
- Bulk recipient support: Yes (loop recipients in helper or batch send)

### SMTP Fallback

**Configuration** (from .env):
```
SMTP_HOST=mggsyndb02.mgg.net
SMTP_DEFAULT_FROM='Mentone Girls Grammar<noreply@mentonegirls.vic.edu.au>'
```

**ORM**: `/src/connectors/SMTPConnector.ts`

**Fallback**: If MailGun fails, SMTP can be used

---

## 5. API Routes & Controllers (READY ✅)

### Existing Route: Module Settings

**Endpoint**: `GET /syn/mggsModule/{moduleId}`
**Controller**: `/src/controllers/MggsModule/SynMggsModuleController.ts`
**Middleware**: App token + user token + module admin validation

```typescript
PUT /syn/mggsModule/15
{
  "settings": {
    "skillExpiration": { /* 8 fields */ }
  }
}
```

**For Feature 013**:
- Use existing endpoint (no new endpoint needed)
- Settings are stored as JSON, no schema validation required

### Existing Route: Community Skills

**Endpoint**: `GET /syn/communitySkill?page=1&limit=100`
**Controller**: `/src/controllers/Synergetic/Community/SynCommunitySkillController.ts`
**Status**: Read-only (no PUT/POST)

**For Feature 013**:
- **GAP**: Need to add PUT endpoint for skill expiry date update, called once per staff member from the frontend (see Section 7 below)
- **Solution**: Add new controller method: `PUT /syn/communitySkill/:staffID/:skillCode`, `{ "ExpiryDate": "2027-08-19" }`
  **Scope**: Requires backend API changes (new endpoint)

---

## 6. Data Flow Architecture

### Current Pattern (e.g., ExpiringCreditCards)

```
1. Module Settings (uMGGSModules.settings)
   ├─ Template name
   ├─ Recipient emails
   └─ Notification timing

2. Cron Scheduler
   └─> CronJobsQueue.addJob({type: MESSAGE_TYPE_EXPIRING_CREDIT_CARDS})

3. Worker Process (ExpiringCreditCards)
   ├─ Query expired data (SynDebtorPaymentMethod)
   ├─ Load email template
   ├─ For each recipient: generate email
   └─> Add to MailGun queue

4. MailGun Queue
   └─> Send email via MailGun API
```

### For Feature 013 (New Pattern)

```
1. UI: Settings Tab (React)
   └─> PUT /syn/mggsModule/15 {settings: skillExpiration: {...}}

2. Module Settings Stored
   └─> uMGGSModules.settings.skillExpiration

3. UI: Bulk Update Modal (React)
   └─> Promise.allSettled([PUT /syn/communitySkill/:staffID/:skillCode, ...])
       ⚠️ NEW endpoint required — calls spuCommunitySkills/spiCommunitySkills stored procs
       (direct Sequelize update is blocked; see section 7 below)

4. Cron Scheduler (already running, node-cron in src/worker.ts)
   └─> Nightly at 11:59pm: CronJobsQueue.addJobWithoutDuplicate({type: MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION})

5. Worker Process (NEW: ExpiringSkillsWorker)
   ├─ Query ALL Active staff + their skills matching monitoredSkillCodes
   ├─ Apply day-interval math per skill (no persistent log; derived from ExpiryDate + settings)
   ├─ Batch qualifying skills by staff (1 email/staff/day max)
   ├─ Load email templates from module settings
   ├─ For each staff: send individual batched email
   └─> For bulk recipients: send summary table

6. MailGun Queue
   └─> Send emails via MailGun API
```

---

## 7. Required Backend Changes (Before Implementation)

### ✅ No Database Schema Changes Needed

All tables and columns already exist.

### ⚠️ Backend Code Changes Needed

#### 1. **New Message Type** (Minor)
**File**: `/src/models/Settings/Message.ts`
```typescript
export const MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION = 'SKILL_EXPIRATION_NOTIFICATION';
```

#### 2. **New Worker** (Medium)
**File**: `/src/workers/ExpiringSkillsWorker.ts` (NEW)
- Query CommunitySkills by expiry date
- Load module settings from uMGGSModules.settings.skillExpiration
- Send individual + bulk emails
- ~150-200 lines, follows ExpiringCreditCards pattern

#### 3. **Update CronJobsQueue** (Minor)
**File**: `/src/queue/CronJobsQueue.ts`
```typescript
[MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION]: (message: MessageModel) =>
  ExpiringSkillsWorker.run(message.request),
```

#### 4. **Bulk Skill Update Endpoint** (⚠️ NEW — revised after DB verification)
**File**: `/src/controllers/Synergetic/Community/SynCommunitySkillController.ts`

**Critical finding**: Direct Sequelize update is impossible — `SynCommunitySkill.ts` calls `SynergeticDB.blockUpsert(SynCommunitySkill)`, which rejects any save/update at the model level. The only write path is a raw `EXEC` call to Synergetic's own stored procedures (verified live against the DB):

| Procedure | Purpose | Parameters |
|-----------|---------|------------|
| `spiCommunitySkills` | Insert | `@ID, @SkillCode, @SkillLevel, @Comment, @AttainedDate, @ExpiryDate, @SkillSeq (INOUT)` |
| `spuCommunitySkills` | Update | `@SkillSeq, @SkillCode, @SkillLevel, @Comment, @AttainedDate, @ExpiryDate` (all required) |
| `spdCommunitySkills` | Delete | `@Skillseq` |

**New Endpoint**: `PUT /syn/communitySkill/:staffID/:skillCode`
- Look up existing record by `(ID=staffID, SkillCode=skillCode)` to preserve other fields
- Call `spuCommunitySkills` via raw EXEC (same pattern as `StudentAbsenceHelper.syncToSynergetic()`)
- If no existing record: create via `spiCommunitySkills` (upsert semantics, recommended)
- Must be gated as admin-only write action (see section 7a)

**Endpoint Usage**:
```typescript
PUT /syn/communitySkill/45/CPR
{
  "ExpiryDate": "2027-08-19"
}
Response: Updated SynCommunitySkillModel
```

**UI Implementation** (Promise.allSettled pattern, keyed by staffID/skillCode):
```typescript
const updateMultiple = (selectedStaffIds: number[], skillCode: string, newExpiryDate: string) => {
  return Promise.allSettled(
    selectedStaffIds.map(staffId =>
      axios.put(`/syn/communitySkill/${staffId}/${skillCode}`, {
        ExpiryDate: newExpiryDate
      })
    )
  );
};
```

See `contracts/API-BulkUpdate.md` for full server-side implementation and the raw EXEC query template.

#### 4a. **Access Control for Write Actions** (Confirmed)
Bulk update and Settings save must be gated as admin-only actions, not just general module view access:
- **Frontend**: `AuthService.isModuleRole(MGGS_MODULE_ID_STAFF_LIST, ROLE_ID_ADMIN)` — same pattern as `BTGLDetailsPanel.tsx` / `ParentTeacherInterviewPage.tsx`
- **Backend**: Equivalent admin role check before executing the stored procedure or saving settings

#### 5. **Email Template Helpers** (Minor)
**File**: `/src/queue/helper/ExpiringSkillsMailerHelper.ts` (NEW)
- Similar to `DonationReceiptMailerHelper.ts`
- Substitute variables: `{staffName}`, `{skillCode}`, `{expiryDate}`, etc.
- Use SMTPConnector.send() for email delivery
- ~80-120 lines

---

## 8. Frontend / UI Implementation

### No Backend Data Model Changes (Schema)

Frontend can use:
- Existing `MggsModuleService.getModule(MGGS_MODULE_ID_STAFF_LIST)` for reading settings
- Existing `MggsModuleService.updateModule(15, {settings: ...})` for saving settings
- New `PUT /syn/communitySkill/:staffID/:skillCode` endpoint (to be created, stored-procedure backed) for bulk updates

### Data Flow in UI

```typescript
// Settings Tab
const [module, setModule] = useState<iModule>();

useEffect(() => {
  MggsModuleService.getModule(MGGS_MODULE_ID_STAFF_LIST)
    .then(m => {
      setModule(m);
      // Parse: m.settings?.skillExpiration?.initialNotificationDays, etc.
    });
}, []);

// Save Settings
const handleSave = () => {
  MggsModuleService.updateModule(MGGS_MODULE_ID_STAFF_LIST, {
    settings: {
      ...module?.settings,
      skillExpiration: {
        initialNotificationDays: 14,
        followUpNotificationDays: 7,
        monitoredSkillCodes: ["CPR", "FirstAid"],
        skillExpirationNotificationEmails: "email1@school.com;email2@school.com",
        individualNotificationEmailSubject: "...",
        individualNotificationEmailBody: "...",
        bulkNotificationEmailSubject: "...",
        bulkNotificationEmailBody: "..."
      }
    }
  });
};

// Bulk Update (from Staff List)
const handleBulkUpdate = (selectedStaffIds: number[], skillCode: string, expiryDate: string) => {
  // UI handles looping; backend uses single resource endpoint, keyed by staffID/skillCode
  return Promise.allSettled(
    selectedStaffIds.map(staffId =>
      axios.put(`/syn/communitySkill/${staffId}/${skillCode}`, { ExpiryDate: expiryDate })
    )
  );
};
```

---

## 9. Key Findings Summary

| Area | Status | Details |
|------|--------|---------|
| **Module Settings Storage** | ✅ Ready | `uMGGSModules.settings` (TEXT/JSON) |
| **Skill Data with Expiry** | ✅ Ready | `CommunitySkills.ExpiryDate` exists |
| **Skill Lookup Table** | ✅ Ready | `luSkill` table available |
| **Queue/Job Scheduler** | ✅ Ready | Redis + Bull, CronJobsQueue + `src/worker.ts` node-cron pattern |
| **Email Infrastructure** | ✅ Ready | MailGun + SMTP configured |
| **Module Settings Endpoint** | ✅ Ready | `GET/PUT /syn/mggsModule/{id}` |
| **Skill Retrieval Endpoint** | ✅ Ready | `GET /syn/communitySkill` |
| **Skill Update Mechanism** | ⚠️ Blocked at model level | Sequelize `blockUpsert()` rejects all writes; must use `spuCommunitySkills`/`spiCommunitySkills` stored procs via raw EXEC |
| **Bulk Update Endpoint** | ❌ Missing (NEW) | Need to create `PUT /syn/communitySkill/:staffID/:skillCode` |
| **Skill Expiration Worker** | ❌ Missing | Need to create `ExpiringSkillsWorker.ts` (incl. day-interval math) |
| **Admin Role Gating** | ✅ Pattern exists | `AuthService.isModuleRole(moduleId, ROLE_ID_ADMIN)`, reuse from BudgetTracker/PTI |

---

## 10. Verification Checklist

- [x] Module settings table has JSON column — ✅ `uMGGSModules.settings`
- [x] Community skills have expiration dates — ✅ `CommunitySkills.ExpiryDate`
- [x] Module ID 15 (Staff List) is defined — ✅ `MGGS_MODULE_ID_STAFF_LIST = 15`
- [x] Queue infrastructure exists — ✅ Redis + CronJobsQueue + node-cron in `src/worker.ts`
- [x] Email service configured — ✅ MailGun + SMTP
- [x] Module settings endpoint works — ✅ `GET/PUT /syn/mggsModule/{id}`
- [x] Skill lookup available — ✅ `luSkill` table
- [x] Skill update stored procedures exist — ✅ Verified live: `spuCommunitySkills`, `spiCommunitySkills`, `spdCommunitySkills`
- [ ] Bulk update endpoint exists — ❌ Need to create (`PUT /syn/communitySkill/:staffID/:skillCode`)
- [ ] Skill expiration worker exists — ❌ Need to create
- [x] Admin role gating pattern confirmed — ✅ `AuthService.isModuleRole` + `ROLE_ID_ADMIN`

---

## 11. Risk Assessment

### Database Risk: **LOW** ✅
- No schema changes needed
- All data structures already exist
- Writes to Synergetic go through verified stored procedures (standard, safe pattern already used by absence sync)

### ⚠️ Backend Risk: **MEDIUM** (revised from LOW)
- Bulk update requires a genuinely new endpoint + raw EXEC stored-procedure integration (~80-120 lines, needs careful transaction/error handling, ~1-2 days)
- Add new worker: `ExpiringSkillsWorker` (follows proven ExpiringCreditCards pattern, plus new day-interval math since no persistent notification log exists)
- Register in CronJobsQueue + `src/worker.ts` nightly cron (minimal change)
- Use existing SMTPConnector for email (no new infrastructure)
- ~350-400 lines of new code total

### Frontend Risk: **LOW** ✅
- Uses existing module settings pattern
- Reuses existing CRUD services
- Reuses existing `isModuleRole` admin-gating pattern
- No database changes required

---

## Recommendations

1. **Confirmed decisions** (per user, 2026-08-19):
   - ✅ Bulk update endpoint: `PUT /syn/communitySkill/:staffID/:skillCode`, backed by `spuCommunitySkills`/`spiCommunitySkills` stored procedures
   - ✅ Notification worker runs nightly at 11:59pm, checking all Active staff + their Active skills
   - ✅ CSV highlighting applies only to Skill expiry cells, not other date columns
   - ✅ Bulk update and Settings save are admin-gated via `AuthService.isModuleRole(moduleId, ROLE_ID_ADMIN)`

2. **Confirmed** (see `contracts/API-BulkUpdate.md` "Decision"):
   - Bulk update on a staff member with no existing skill record: auto-create via `spiCommunitySkills` (upsert semantics)

3. **Implementation Order**:
   1. Add bulk-update controller method in mggs-api (`spuCommunitySkills`/`spiCommunitySkills` via raw EXEC) — see `contracts/API-BulkUpdate.md`
   2. Create `ExpiringSkillsWorker.ts` in mggs-api (follows ExpiringCreditCards pattern, includes day-interval math) — see `contracts/ExpiringSkillsWorker.md`
   3. Register worker in `CronJobsQueue.ts` + nightly trigger in `src/worker.ts` (11:59pm)
   4. Frontend Settings panel (React), admin-gated
   5. Frontend Bulk update modal (React) — use Promise.allSettled + new staffID/skillCode-keyed endpoint, admin-gated
   6. CSV export highlighting (React) — enhance CSVExportFromHtmlTableBtn with sheetjs-style, scoped to Skill columns only

4. **No Database Schema Migrations Required** — but a new backend endpoint (bulk update) and new stored-procedure integration ARE required; this is not a zero-backend-change feature as originally assumed.


