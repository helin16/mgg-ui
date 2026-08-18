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
- Recipients: Individual staff (occpEmail) + bulk admin list
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
- **GAP**: Need to add PUT endpoint for bulk skill expiry date update
- **Solution**: Add new controller method:
  ```typescript
  PUT /syn/communitySkill/bulk
  {
    "staffIds": [123, 456, 789],
    "skillCode": "CPR",
    "expiryDate": "2027-08-19"
  }
  ```
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
   └─> Promise.all([PUT /syn/communitySkill/:seq, ...])
       ✅ Uses existing single resource endpoint, UI loops

4. Cron Scheduler (already running)
   └─> Check module settings, if enabled for skill expiration:
       └─> CronJobsQueue.addJob({type: MESSAGE_TYPE_SKILL_EXPIRATION})

5. Worker Process (NEW: ExpiringSkillsWorker)
   ├─ Query CommunitySkills with expiryDate < today or < (today + initialNotificationDays)
   ├─ Filter by: monitoredSkillCodes, Active staff
   ├─ Load email templates from module settings
   ├─ For each staff: send individual email
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

#### 4. **Single Skill Update Endpoint** (Already Exists ✅)
**File**: `/src/controllers/Synergetic/Community/SynCommunitySkillController.ts`
- Use existing `PUT /syn/communitySkill/:seq` endpoint (via CRUDHelper.updateModel)
- No new endpoint needed
- UI loops through selected staff with Promise.all for bulk updates

**Endpoint Usage**:
```typescript
PUT /syn/communitySkill/:seq
{
  "ExpiryDate": "2027-08-19"
}
Response: Updated SynCommunitySkillModel
```

**UI Implementation** (Promise.all pattern):
```typescript
const updateMultiple = (selectedSkillSeqs: number[], newExpiryDate: string) => {
  return Promise.all(
    selectedSkillSeqs.map(seq =>
      axios.put(`/syn/communitySkill/${seq}`, {
        ExpiryDate: newExpiryDate
      })
    )
  );
};
```

#### 5. **Email Template Helpers** (Minor)
**File**: `/src/queue/helper/ExpiringSkillsMailerHelper.ts` (NEW)
- Similar to `DonationReceiptMailerHelper.ts`
- Substitute variables: `{staffName}`, `{skillCode}`, `{expiryDate}`, etc.
- Use SMTPConnector.send() for email delivery
- ~80-120 lines

---

## 8. Frontend / UI Implementation

### No Backend Data Model Changes

Frontend can use:
- Existing `MggsModuleService.getModule(MGGS_MODULE_ID_STAFF_LIST)` for reading settings
- Existing `MggsModuleService.updateModule(15, {settings: ...})` for saving settings
- New `PUT /syn/communitySkill/bulk` endpoint (to be created) for bulk updates

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
const handleBulkUpdate = (selectedSkillSeqs: number[], expiryDate: string) => {
  // UI handles looping; backend uses single resource endpoint
  return Promise.all(
    selectedSkillSeqs.map(seq =>
      axios.put(`/syn/communitySkill/${seq}`, { ExpiryDate: expiryDate })
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
| **Queue/Job Scheduler** | ✅ Ready | Redis + Bull, CronJobsQueue pattern |
| **Email Infrastructure** | ✅ Ready | MailGun + SMTP configured |
| **Module Settings Endpoint** | ✅ Ready | `GET/PUT /syn/mggsModule/{id}` |
| **Skill Retrieval Endpoint** | ✅ Ready | `GET /syn/communitySkill` |
| **Single Skill Update Endpoint** | ✅ Ready | Use existing `PUT /syn/communitySkill/:seq` (CRUDHelper.updateModel) |
| **Skill Expiration Worker** | ❌ Missing | Need to create `ExpiringSkillsWorker.ts` |

---

## 10. Verification Checklist

- [x] Module settings table has JSON column — ✅ `uMGGSModules.settings`
- [x] Community skills have expiration dates — ✅ `CommunitySkills.ExpiryDate`
- [x] Module ID 15 (Staff List) is defined — ✅ `MGGS_MODULE_ID_STAFF_LIST = 15`
- [x] Queue infrastructure exists — ✅ Redis + CronJobsQueue
- [x] Email service configured — ✅ MailGun + SMTP
- [x] Module settings endpoint works — ✅ `GET/PUT /syn/mggsModule/{id}`
- [x] Skill lookup available — ✅ `luSkill` table
- [x] Single skill update endpoint exists — ✅ Via CRUDHelper.updateModel
- [ ] Skill expiration worker exists — ❌ Need to create

---

## 11. Risk Assessment

### Database Risk: **LOW** ✅
- No schema changes needed
- All data structures already exist
- Read-only access to Synergetic DB (safe)

### ✅ Backend Risk: **LOW** ✅
- Add new worker: `ExpiringSkillsWorker` (follows proven ExpiringCreditCards pattern)
- Register in CronJobsQueue (minimal change)
- Use existing SMTPConnector for email (no new infrastructure)
- ~200-250 lines of new code total

### Frontend Risk: **LOW** ✅
- Uses existing module settings pattern
- Reuses existing CRUD services
- No database changes required

---

## Recommendations

1. **Before Planning**: Confirm with mggs-api team:
   - ✅ Existing patterns are acceptable for bulk updates
   - ✅ New worker can follow ExpiringCreditCards pattern
   - ✅ MailGun email service can handle skill expiration templates

2. **Implementation Order**:
   1. Create `ExpiringSkillsWorker.ts` in mggs-api (follows ExpiringCreditCards pattern)
   2. Register worker in `CronJobsQueue.ts` (add MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION)
   3. Frontend Settings panel (React)
   4. Frontend Bulk update modal (React) — use Promise.all + single PUT endpoint
   5. CSV export highlighting (React) — enhance CSVExportFromHtmlTableBtn with sheetjs-style

3. **No Database Migrations Required** — No new backend endpoint needed (use existing single resource endpoint). Proceed directly to worker + frontend implementation.

