# API Capability Analysis: Staff Skill Expiration Feature (013)

**Date**: 2026-08-19  
**Status**: Pre-Planning Investigation  
**Purpose**: Assess whether mggs-api backend supports the feature requirements

## Executive Summary

**Verdict**: ⚠️ **PARTIAL SUPPORT** — Core infrastructure exists, but gaps identified for bulk skill updates and notification scheduler.

The backend has established patterns for:
- ✅ Module settings storage and retrieval
- ✅ Email sending capability  
- ✅ Skill data in system

The backend is **missing or unclear**:
- ❓ Bulk update endpoint for skill expiration dates
- ❓ Scheduled notification system
- ❓ CSV export skill expiration highlighting logic

**Recommendation**: Brief investigation of `../mggs-api` required before finalizing plan. See "Required API Endpoints" section below.

---

## Current Backend Infrastructure (CONFIRMED ✅)

### 1. Module Settings Pattern (PROVEN)

**Service Layer** (Frontend):
- `MggsModuleService.getModule(moduleId)` → calls `/syn/mggsModule/{moduleId}`
- `MggsModuleService.updateModule(moduleId, {settings: {...}})` → calls `PUT /syn/mggsModule/{moduleId}`

**Usage Examples**:
- Finance (bpay batch config, expiry CC notifications)
- HOYChat (email template subject/body, contact reasons)
- OnlineDonation (email templates, recipient config)
- StudentAbsence (email template names, parent form recipients)
- BudgetTracker (notification settings)

**How It Works**:
1. Frontend loads module: `MggsModuleService.getModule(MGGS_MODULE_ID_STAFF_LIST)`
2. Settings object contains flexible JSON (no schema constraint)
3. Admin UI allows editing of settings
4. Submit calls: `MggsModuleService.updateModule(moduleId, {settings: {...}})`
5. Backend persists to `Module.settings` column

**Status for Skill Expiration Feature**: ✅ **READY TO USE**
- Can store: `initialNotificationDays`, `followUpNotificationDays`, `monitoredSkillCodes`, `skillExpirationNotificationEmails`, email templates
- Module ID already defined: `MGGS_MODULE_ID_STAFF_LIST = 15` (in `src/types/modules/iModuleUser.ts`)

### 2. Email Sending Pattern (PROVEN)

**Service Layer** (Frontend):
- `SynDonorReceiptService.sendEmail(params: {to: string, ...})` → calls `POST /syn/donationReceipt/email`

**Response Type**: `iMessage` (likely contains success/error status)

**Usage**: Donation receipt sending (finance module)

**Pattern**:
```typescript
const sendEmail = (params: iPDFParams & {to: string}): Promise<iMessage> => {
  return AppService.post(`${endPoint}/email`, params).then(resp => resp.data);
};
```

**Status for Skill Expiration Feature**: ⚠️ **NEEDS VERIFICATION**
- Endpoint pattern exists but is donation-specific
- Unclear if:
  - Generic `/syn/email` endpoint exists for arbitrary email sending
  - Bulk email sending is supported (send to multiple recipients in one call)
  - Email templating with variable substitution is supported
  - Backend has scheduled task capability for recurring notifications (daily at 11:59 PM)

### 3. Skill Data (CONFIRMED ✅)

**Data Models** (Frontend types):
- `iSynCommunitySkill` — skill instance per staff member
- `iSynLuSkill` — skill lookup (master list)
- Already has expiry date fields

**UI Constants** (Frontend):
- `COLUMN_GROUP_SKILL_EXPIRY_DATE = 'Skill Expiry Date'` — already in `StaffListHelper.tsx`
- Skills already displayed in Staff List table

**Status for Skill Expiration Feature**: ✅ **DATA STRUCTURE EXISTS**
- Skills with expiration dates already retrievable from Synergetic API via `SynStaffService` (or similar)
- Frontend already renders skill expiry dates in table

---

## Implementation Details (✅ VERIFIED)

### Detail 1: Bulk Skill Expiration Updates (✅ VERIFIED)

**Solution**: Use single resource endpoint `PUT /syn/communitySkill/:seq`

**Backend**:
- CRUDHelper.updateModel already supports single resource updates by ID field (SkillSeq)
- No new bulk endpoint needed
- Endpoint: `PUT /syn/communitySkill/{SkillSeq}` with body `{"ExpiryDate": "2027-08-19"}`

**Frontend Pattern**:
- UI loops through selected skills using Promise.all
- Proven pattern in project (reduces backend load, frontend controls concurrency)
- Example:
  ```typescript
  Promise.all(selectedSkillSeqs.map(seq =>
    axios.put(`/syn/communitySkill/${seq}`, {ExpiryDate: newDate})
  ));
  ```

**Status**: ✅ Ready to implement (no new endpoint needed)

### Detail 2: Scheduled Notification System (✅ VERIFIED)

**Infrastructure**: Already exists - CronJobsQueue + Redis + SMTPConnector

**Evidence**:
- `/src/queue/CronJobsQueue.ts` — Bull queue integration
- `/src/workers/ExpiringCreditCards.ts` — Example: Finance module checks for expiring credit cards daily
- `/src/workers/ExpiringPassportsAndVisas.ts` — Example: Enrollments module checks expiry daily
- Both send emails via queue system

**For Skill Expiration**:
1. Create new worker: `/src/workers/ExpiringSkillsWorker.ts` (follows existing pattern)
2. Add message type: `MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION`
3. Register in CronJobsQueue.ts processJob map
4. Uses SMTPConnector.send() for email delivery

**Status**: ✅ Ready - just add new worker following proven pattern

### Detail 3: Email Service (✅ VERIFIED)

**SMTPConnector** (`/src/connectors/SMTPConnector.ts`):
- Supports generic email sending (not donation-specific)
- Parameters:
  ```typescript
  {
    from?: string;
    replyTo?: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    assetIds?: string[]; // file attachments
  }
  ```
- Uses nodemailer + SMTP (configured in .env)
- Already used by: Student Absence, HOYChat, Donation Receipts, etc.

**Status**: ✅ Ready - no abstraction needed, reuse directly

### Detail 4: CSV Export Highlighting (✅ VERIFIED)

**Current Setup**:
- Component: `CSVExportFromHtmlTableBtn` (`/src/components/form/CSVExportFromHtmlTableBtn.tsx`)
- Library: `sheetjs-style` (already in project)
- Converts HTML table to Excel with formatting capability

**Current Implementation**:
```typescript
const ws = XLSX.utils.table_to_sheet(tableElement);
// Creates sheet from HTML table, preserves inline styles
```

**For Skill Expiration Highlighting**:
- Enhance CSVExportFromHtmlTableBtn to apply conditional formatting:
  - When generating sheet, check each ExpiryDate cell
  - If date < today: apply background color (red/yellow)
  - Use sheetjs-style's cell styling: `{fill: {fgColor: {rgb: "FFFF0000"}}}`

**Status**: ✅ Ready - sheetjs-style already supports cell formatting

**Examples in Project**:
- `/src/components/reports/StudentNumberForecast/components/StudentNumberForecastExportHelper.ts`
- `/src/pages/reports/StudentAttendanceReport/components/StudentAttendanceRateDownloadHelper.ts`

---

## GAPS & UNKNOWNS (RESOLVED ✅)



### Gap 2: Scheduled Notification System (✅ RESOLVED)
**Status**: Already verified above - CronJobsQueue exists, use new ExpiringSkillsWorker

### Gap 3: CSV Export Skill Expiration Highlighting (✅ RESOLVED)
**Status**: Already verified above - sheetjs-style supports cell formatting

---

## Summary: Implementation Approach (✅ VERIFIED & READY)

| Component | Status | Approach |
|-----------|--------|----------|
| **Skill Expiration Data** | ✅ Ready | Existing CommunitySkills.ExpiryDate field |
| **Bulk Update** | ✅ Ready | Single `PUT /syn/communitySkill/:seq` + Promise.all |
| **Notifications** | ✅ Ready | New ExpiringSkillsWorker + CronJobsQueue |
| **Email** | ✅ Ready | Existing SMTPConnector.send() |
| **Settings** | ✅ Ready | Existing `uMGGSModules.settings` JSON |
| **CSV Export** | ✅ Ready | Enhance CSVExportFromHtmlTableBtn with sheetjs-style |

**Backend Changes Required**: 
- Add `ExpiringSkillsWorker.ts` (~150-200 lines, follows proven pattern)
- Update `CronJobsQueue.ts` to register worker (~10 lines)
- Total: ~200-250 lines of new code (LOW RISK, proven patterns)

4. **Scheduled Jobs**
   - [ ] Notification scheduler already running in mggs-api?
   - [ ] Can add custom jobs for skill expiration monitoring?
   - [ ] Execution time configurable (11:59 PM requirement)?

5. **CSV Export**
   - [ ] Current export format for skills?
   - [ ] Can add metadata field to highlight expired skills?
   - [ ] Or should highlighting happen in frontend after download?

---

## Frontend-Only vs. Backend Dependencies

### Can be Implemented in Frontend (No Backend Changes Required) ✅
- ✅ Checkbox column for staff selection
- ✅ Bulk update modal UI (skill selector + date picker)
- ✅ Settings tab with form inputs (all stored via existing `MggsModuleService`)
- ✅ CSV export highlighting (if skills already in export, just apply condition: date < today)

### Requires Backend Support (mggs-api) ⚠️
- ⚠️ **Bulk skill update endpoint** (no existing pattern found)
- ⚠️ **Scheduled notification system** (unclear if exists)
- ⚠️ **Email sending generalization** (donation-specific pattern may not scale)

---

## Recommendations

### Before Finalizing the Plan:

1. **Check `../mggs-api`** for:
   - Existing bulk update endpoint or pattern
   - Notification scheduler implementation
   - Email service capabilities

2. **If bulk update doesn't exist**:
   - Add to mggs-api scope OR
   - Use individual update loop + transaction (slower, document trade-off in plan)

3. **If notification scheduler doesn't exist**:
   - **BLOCKER** — cannot implement recurring notifications without it
   - Must add to mggs-api OR
   - Pivot to manual "send now" button instead of scheduled notifications (scope reduction)

4. **If email pattern is donation-only**:
   - Discuss abstraction: extract to generic email service or add skill-specific handler

### Timeline Impact:
- **Best case** (all infrastructure exists): Plan straight to implementation (2-3 weeks)
- **Medium case** (need to add bulk update + email abstraction): Add 1-2 week backend setup phase
- **Worst case** (need scheduler from scratch): 2-3 week backend effort, then frontend (blocker until completed)

---

## Verification Checklist

- [ ] Confirm bulk skill update endpoint exists in `../mggs-api`
- [ ] Confirm notification scheduler exists and can be configured
- [ ] Confirm email service can handle generic (non-donation) sending
- [ ] Confirm module settings persist correctly (smoke test with MGGS_MODULE_ID_STAFF_LIST)
- [ ] Review skill data export format in current staff list CSV

Once verified, update this document and proceed to `/speckit.plan`.

