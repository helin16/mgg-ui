# Quickstart: Staff Skill Expiration Management Implementation

**Scope**: 4 feature components (CSV export highlighting, bulk update, settings, notifications)  
**Timeline**: ~2-3 weeks for full implementation + testing  
**Dependencies**: Both frontend (mgg-ui) and backend (mggs-api) changes required

---

## Quick Summary

| Component | Effort | Risk | Dependencies |
|-----------|--------|------|--------------|
| **CSV Export Highlighting** | 2-3 days | LOW | sheetjs-style (already in project) |
| **Bulk Update Modal** | 3-4 days | LOW | Existing PUT /syn/communitySkill/:seq |
| **Settings Tab & Persistence** | 2-3 days | LOW | Existing module settings pattern |
| **Notification Worker** | 4-5 days | MEDIUM | Backend queue infrastructure |
| **Testing & Verification** | 2-3 days | MEDIUM | Cypress + Jest |
| **Total** | ~14-18 days | MEDIUM | Non-blocking (can do frontend and backend in parallel) |

---

## Phase 1: Setup (Day 1)

### 1.1 Branch & Environment

```bash
# Already done: feature branch 013-staff-skill-expiration created
git branch

# Verify you're on feature branch
git status

# Sync latest main
git fetch origin main
git rebase origin/main
```

### 1.2 Verify Dependencies

**Frontend (mgg-ui)**:
```bash
yarn list | grep sheetjs-style    # Should see: sheetjs-style@x.x.x
yarn list | grep axios            # Should see axios
yarn list | grep react-bootstrap   # Should see react-bootstrap
```

**Backend (mggs-api)**:
```bash
npm list | grep bull              # Should see bull
npm list | grep sequelize         # Should see sequelize
npm list | grep nodemailer        # Should see nodemailer
```

### 1.3 Understand Existing Patterns

**Read these files to understand patterns**:
- Frontend: `src/services/Module/MggsModuleService.ts` (settings CRUD pattern)
- Frontend: `src/components/common/ColumnPopupSelector.tsx` (multi-select pattern)
- Frontend: `src/pages/reports/StudentAttendanceReport/components/StudentAttendanceRateDownloadHelper.ts` (Excel export + formatting)
- Backend: `src/workers/ExpiringCreditCards.ts` (notification worker pattern)
- Backend: `src/queue/CronJobsQueue.ts` (queue registration pattern)

---

## Phase 2: Backend Foundation (Days 2-5)

### 2.1 Create Type Definitions

**File**: `src/types/Workers/iSkillExpirationRequest.ts`
```typescript
export interface iSkillExpirationRequest {
  moduleId: number;
  runTimestamp: string;
}
```

**File**: `src/types/Workers/iSkillExpirationSettings.ts`
```typescript
export interface iSkillExpirationSettings {
  initialNotificationDays: number;
  followUpNotificationDays: number;
  monitoredSkillCodes: string[];
  skillExpirationNotificationEmails: string;
  individualNotificationEmailSubject: string;
  individualNotificationEmailBody: string;
  bulkNotificationEmailSubject: string;
  bulkNotificationEmailBody: string;
}
```

### 2.2 Add Message Type

**File**: `src/models/Settings/Message.ts`  
**Action**: Add constant
```typescript
export const MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION = 'SKILL_EXPIRATION_NOTIFICATION';
```

### 2.2b Bulk Skill Update Endpoint (NEW — revised after DB verification)

**⚠️ Important**: Direct Sequelize `.update()` on `CommunitySkills` is blocked (`SynergeticDB.blockUpsert()`). Writes must go through Synergetic stored procedures via raw `EXEC`, same pattern as `StudentAbsenceHelper.syncToSynergetic()`.

**Verified stored procedures** (confirmed via live query): `spuCommunitySkills` (update, requires all fields), `spiCommunitySkills` (insert), `spdCommunitySkills` (delete).

**File**: `src/controllers/Synergetic/Community/SynCommunitySkillController.ts` (MODIFY)

Checklist:
- [ ] Add new route: `PUT /syn/communitySkill/:staffID/:skillCode`
- [ ] Add backend admin-role check before allowing write (mirror `SynMggsModuleController`'s settings PUT validation)
- [ ] Look up existing record by `(ID=staffID, SkillCode=skillCode)`
- [ ] If exists: call `spuCommunitySkills` via raw EXEC with existing field values + new `ExpiryDate`
- [ ] If not exists: call `spiCommunitySkills` via raw EXEC to create new record (upsert semantics — confirm this is desired before implementing)
- [ ] Wrap EXEC in `BEGIN TRANSACTION` / `COMMIT` / `ROLLBACK` (see `contracts/API-BulkUpdate.md` for exact query template, modeled on `StudentAbsenceHelper.syncToSynergetic()`)
- [ ] Re-fetch and return the updated/created record
- [ ] Write Jest tests (mock DB query, verify correct proc + params called for update vs. insert paths)

### 2.3 Create Mailer Helper

**File**: `src/queue/helper/ExpiringSkillsMailerHelper.ts`  
**Reference**: See `contracts/ExpiringSkillsWorker.md` Phase 3 implementation

Checklist:
- [ ] Implement `sendIndividualNotification()` with template substitution
- [ ] Implement `sendBulkNotification()` with table generation
- [ ] Add `htmlEscape()` helper for XSS prevention (FR-027)
- [ ] Add `htmlToPlainText()` for fallback plain-text emails
- [ ] Write Jest tests for template substitution + escaping

### 2.4 Create Notification Worker

**File**: `src/workers/ExpiringSkillsWorker.ts`  
**Reference**: See `contracts/ExpiringSkillsWorker.md` Phase 2 implementation

Checklist:
- [ ] Implement `ExpiringSkillsWorker.run()` following ExpiringCreditCards pattern
- [ ] Load module settings from uMGGSModules
- [ ] Query ALL Active staff + ALL their skills matching `monitoredSkillCodes` (confirmed scope — not pre-filtered by date at the DB level)
- [ ] Apply day-interval math per skill to decide if TODAY is a notify day (see "Day-Interval Math" in `contracts/ExpiringSkillsWorker.md` — no persistent log exists, so this must be derived from `ExpiryDate` + settings each run)
- [ ] Batch qualifying skills by staff (one email per staff/day max)
- [ ] Call ExpiringSkillsMailerHelper for sending
- [ ] Log at INFO level (success) and WARN level (failures)
- [ ] Return stats: notificationsSent, emailsSent, failures array
- [ ] Write Jest tests (mock DB queries, verify day-interval math incl. `followUpNotificationDays = 0` edge case)

### 2.5 Register Worker in Queue + Nightly Cron

**File**: `src/queue/CronJobsQueue.ts`

Checklist:
- [ ] Import ExpiringSkillsWorker
- [ ] Add MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION to processJob map

**File**: `src/worker.ts` (confirmed registration point — same file as existing `Student absence daily summary at 11pm` / `Clipboard StudentClasses sync at 11pm` jobs)

Checklist:
- [ ] Add new `cron.schedule('59 23 * * *', ...)` block inside `loadCronJobs()`, calling `CronJobsQueue.addJobWithoutDuplicate({}, MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION, AuthHelper.getDefaultSystemUserId(), CronJobsQueue)`
- [ ] Test locally: manually trigger via Bull admin UI or test script

### 2.6 Backend Testing

```bash
cd ../mggs-api
yarn test -- ExpiringSkillsWorker  # Jest tests
yarn test -- ExpiringSkillsMailerHelper
```

**Manual Test**:
```bash
# Start dev server with logging
npm run dev

# Trigger worker manually via queue admin or test script
# Verify email sent + logs show success
# Verify no duplicate if triggered again
```

---

## Phase 3: Frontend UI (Days 6-10)

### 3.1 CSV Export Highlighting (scope confirmed: Skill cells only)

**File**: `src/components/form/CSVExportFromHtmlTableBtn.tsx`

Checklist:
- [ ] Identify Skill expiry date columns specifically via `COLUMN_GROUP_SKILL_EXPIRY_DATE` (from `StaffListHelper.tsx`) — do NOT apply formatting to other date-looking columns (DOB, leaving date, etc.)
- [ ] For each expired Skill-expiry cell (date < today):
  - Apply background color styling (red/yellow)
  - Use sheetjs-style API: `cell.fill = {fgColor: {rgb: "FFFF0000"}}`  (red)
- [ ] Keep existing functionality: table_to_sheet() + book_new() + writeFile()
- [ ] Test with sample staff list (mixed expired/current dates, plus unrelated date columns to confirm no false positives)
- [ ] Cypress E2E: Export → open file → verify only Skill cells highlighted

**Example Enhancement**:
```typescript
const doExport = () => {
  const data = document.getElementById(tableHtmlId);
  const ws = XLSX.utils.table_to_sheet(data);
  
  // Add cell styling for expired dates
  const rows = ws['!rows'] || [];
  Object.keys(ws).forEach(cellRef => {
    if (cellRef.startsWith('!')) return;  // Skip metadata
    const cell = ws[cellRef];
    const cellValue = cell.v;
    
    // Detect if this is an expiry date column and is expired
    if (isExpiredDate(cellValue)) {
      cell.fill = { fgColor: { rgb: "FFFFFF00" } };  // Yellow background
      cell.font = { bold: true, color: { rgb: "FFFF0000" } };  // Bold red text
    }
  });
  
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${moment().format('DD_MMM_YYYY_HH_mm_ss')}`);
  XLSX.writeFile(wb, fileName);
};
```

### 3.2 Bulk Update Modal

**File**: `src/components/staff/components/BulkUpdateModal.tsx` (NEW)

Checklist:
- [ ] Create React component with:
  - Dropdown: skill code selection (populated from SynLuSkillService)
  - Date picker: new expiration date
  - Submit/Cancel buttons
  - Loading state during submission
- [ ] Gate rendering behind `AuthService.isModuleRole(MGGS_MODULE_ID_STAFF_LIST, ROLE_ID_ADMIN)` (matching `BTGLDetailsPanel.tsx`/`ParentTeacherInterviewPage.tsx` pattern)
- [ ] On submit:
  - Validate skill code + date not empty
  - Call ExpiringSkillsService.bulkUpdateSkillExpiryDate(selectedStaffIds, skillCode, newExpiryDate) — keyed by staffID/skillCode, not SkillSeq
  - Show loading spinner
  - On success: Show toast + close modal + emit onSuccess callback
  - On partial failure (`Promise.allSettled`): Show toast listing which staff failed
  - On error: Show error toast with retry option
- [ ] Write Jest tests (mock API, verify form validation)
- [ ] Cypress E2E: Select 2+ staff → Open modal → Choose skill → Submit → Verify list refreshed

**Component Contract**:
```typescript
interface IBulkUpdateModalProps {
  selectedStaffIds: number[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

### 3.3 Checkbox Column & Bulk Button

**File**: `src/components/staff/StaffListPanel.tsx` (MODIFY)

Checklist:
- [ ] Add checkbox column state: `const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([])`
- [ ] Add checkbox input to table header + each row
- [ ] Show "Bulk Update" button when `selectedStaffIds.length > 1` AND `isModuleRole(MGGS_MODULE_ID_STAFF_LIST, ROLE_ID_ADMIN)` resolves true
- [ ] Button calls: `setBulkUpdateModalOpen(true)`
- [ ] On bulk update modal success:
  - Clear selections
  - Refresh staff list (re-fetch or update local state)
  - Show success toast
- [ ] Write Jest tests (mock table data, verify selection state)

### 3.4 Settings Tab & Configuration

**File**: `src/components/staff/components/SkillExpirationSettings.tsx` (NEW)

Checklist:
- [ ] Create Settings tab component with form containing 8 fields:
  1. initialNotificationDays (number input, 1-365)
  2. followUpNotificationDays (number input, 0-30)
  3. monitoredSkillCodes (multi-select dropdown from luSkill)
  4. skillExpirationNotificationEmails (text area, semicolon-separated)
  5. individualNotificationEmailSubject (text input)
  6. individualNotificationEmailBody (text area)
  7. bulkNotificationEmailSubject (text input)
  8. bulkNotificationEmailBody (text area)
- [ ] On mount: Load settings via MggsModuleService.getModule()
- [ ] On save:
  - Validate all required fields
  - Validate email addresses (semicolon-separated)
  - Call MggsModuleService.updateModule() with updated settings
  - Show loading state on save button
  - On success: Toast + disable save button until form changes
  - On error: Show validation errors + retry button
- [ ] Write Jest tests (mock service, verify form validation)
- [ ] Cypress E2E: Open settings → Enter values → Save → Reload page → Verify persisted

**Component Contract**:
```typescript
interface iSkillExpirationSettings {
  initialNotificationDays: number;
  followUpNotificationDays: number;
  monitoredSkillCodes: string[];
  skillExpirationNotificationEmails: string;
  individualNotificationEmailSubject: string;
  individualNotificationEmailBody: string;
  bulkNotificationEmailSubject: string;
  bulkNotificationEmailBody: string;
}
```

### 3.5 Service Layer

**File**: `src/services/Synergetic/Community/ExpiringSkillsService.ts` (NEW)

Checklist:
- [ ] Implement `bulkUpdateSkillExpiryDate(staffIds: number[], skillCode: string, newExpiryDate: string)`
  - Loop through staffIds with `Promise.allSettled`
  - Call `PUT /syn/communitySkill/:staffID/:skillCode` for each
  - Return array of settled results (fulfilled/rejected per staff)
- [ ] Implement type: `PromiseSettledResult<iSynCommunitySkill>[]`
- [ ] Write Jest tests (mock axios, verify Promise.allSettled logic incl. partial failure)

### 3.6 Frontend Testing

```bash
cd mgg-ui
yarn test -- BulkUpdateModal.test.tsx
yarn test -- SkillExpirationSettings.test.tsx
yarn test -- ExpiringSkillsService.test.ts

yarn cypress:open
# Run E2E tests in cypress/e2e/StaffListSkillExpiration.cy.ts
```

---

## Phase 4: Integration Testing (Days 11-13)

### 4.1 Cypress E2E Suite

**File**: `cypress/e2e/StaffListSkillExpiration.cy.ts` (NEW)

Test Cases:
```gherkin
Scenario: Export CSV with Expired Skills Highlighting
  Given I am on the Staff List page
  When I click "Export"
  Then the CSV file downloads
  And expired skills are highlighted (red background)
  
Scenario: Bulk Update Multiple Staff Skills
  Given I am on the Staff List page
  When I select 3 staff members
  And I click "Bulk Update"
  And I select "CPR" skill and date "2027-08-19"
  And I click "Submit"
  Then the modal closes
  And the table refreshes
  And all selected staff now show updated expiry date
  
Scenario: Save Settings and Verify Persistence
  Given I am on the Staff List Admin page
  When I click Settings tab
  And I fill in all 8 configuration fields
  And I click "Save"
  Then I see "Settings saved successfully" toast
  When I reload the page
  Then all settings are still present with same values
  
Scenario: Access Control - Non-Admin Cannot Edit
  Given I am logged in as a teacher (not admin)
  When I try to access the Staff List Admin page
  Then I see Access Denied (401) page
```

### 4.2 Manual Integration Testing

**Setup Test Data**:
```sql
-- In mggservices database:
-- Verify staff exist with varied skill expiry dates
SELECT s.StaffID, s.StaffNameInternal, cs.SkillCode, cs.ExpiryDate
FROM CommunitySkills cs
JOIN VStaff s ON cs.ID = s.StaffID
WHERE cs.SkillCode IN ('CPR', 'FirstAid')
ORDER BY cs.ExpiryDate;
```

**Test Scenarios**:
1. **Settings Save**:
   - [ ] Enter notification settings
   - [ ] Save → See success toast
   - [ ] Reload page → Settings persist
   - [ ] Check API logs: PUT /syn/mggsModule/15 successful

2. **Bulk Update**:
   - [ ] Select 2+ staff
   - [ ] Click "Bulk Update"
   - [ ] Choose skill + new date
   - [ ] Submit → Toast shows success
   - [ ] Refresh → List updated
   - [ ] Check API logs: Multiple PUT /syn/communitySkill/:seq calls

3. **CSV Export**:
   - [ ] Select export format with skill expiry dates
   - [ ] Download file
   - [ ] Open in Excel
   - [ ] Verify expired dates have yellow/red background
   - [ ] Verify current dates have no background

4. **Notification Worker** (Manual Trigger):
   - [ ] Ensure settings configured (step 1)
   - [ ] Manually trigger worker: `curl -X POST localhost:3001/api/test/trigger-expiring-skills`
   - [ ] Check app logs for "NOTIFICATION_CYCLE_START"
   - [ ] Check SMTP logs or mailbox for test emails
   - [ ] Verify variables substituted correctly
   - [ ] Trigger again → Verify no duplicate emails (same day)
   - [ ] Wait 24h or advance date → Trigger again → Verify email sent again (next day)

---

## Phase 5: Code Review & Deployment (Days 14-18)

### 5.1 Pre-Commit Checklist

- [ ] All Jest tests passing: `yarn test --coverage`
- [ ] All Cypress tests passing: `yarn cypress:run`
- [ ] No ESLint errors: `yarn lint`
- [ ] No TypeScript errors: `yarn tsc --noEmit`
- [ ] Code follows project conventions (constitution.md):
  - [ ] Module access: ModuleAccessWrapper used
  - [ ] Service layer: No direct axios calls in components
  - [ ] Async states: Loading/success/error all handled
  - [ ] Sensitive data: No leaks in templates or logs

### 5.2 PR Template

```markdown
## Feature: Staff Skill Expiration Management (013)

### Changes
- Frontend:
  - [x] CSV export with skill expiry highlighting (sheetjs-style)
  - [x] Bulk update modal + checkbox selection column
  - [x] Settings tab with 8 configuration fields
  - [x] Services layer (ExpiringSkillsService)
  - [x] E2E tests (Cypress)
  - [x] Unit tests (Jest)

- Backend:
  - [x] ExpiringSkillsWorker notification logic
  - [x] ExpiringSkillsMailerHelper with template substitution + HTML escaping
  - [x] Message type and queue registration
  - [x] Tests (Jest)

### Verification
- [x] CSV export highlights expired dates ✓
- [x] Bulk update works for 50+ staff in <3s ✓
- [x] Settings persist across page reloads ✓
- [x] Notifications sent within 1h of trigger time ✓
- [x] No duplicate emails same day ✓
- [x] Inactive staff don't receive notifications ✓
- [x] All tests passing (Jest + Cypress) ✓

### Constitution Check
- [x] I. Module-gated: ModuleAccessWrapper(15) for access control
- [x] II. Service boundaries: All API via MggsModuleService, ExpiringSkillsService
- [x] III. Async UX: Loading/success/error states on export, bulk update, settings
- [x] IV. Data safety: No sensitive data in logs; settings in module JSON; HTML escaping
- [x] V. Risk-based verification: Jest tests for deduplication; Cypress E2E for workflows
```

### 5.3 Deployment Steps

1. **Frontend (mgg-ui)**:
   ```bash
   git push origin 013-staff-skill-expiration
   # Create PR on GitHub
   # Merge after review
   yarn build  # Verify build succeeds
   # Netlify auto-deploys from main
   ```

2. **Backend (mggs-api)**:
   ```bash
   git push origin 013-staff-skill-expiration
   # Create PR on GitHub
   # Merge after review
   npm run build
   # Deploy to server (per your CI/CD)
   ```

3. **Post-Deployment Verification**:
   - [ ] Staff list admin page loads without errors (browser console)
   - [ ] Check Settings tab loads module settings correctly
   - [ ] Try bulk update on test staff
   - [ ] Export CSV and verify highlighting
   - [ ] Monitor app logs for notification cycle runs
   - [ ] Verify emails received by test recipients

---

## Troubleshooting

### Frontend Issues

**Checkbox column not appearing**:
- Verify StaffListTable.tsx includes new checkbox cell
- Check console for React errors (use React DevTools)

**Bulk Update modal not submitting**:
- Verify API endpoint is accessible: `curl -X PUT http://localhost:3001/syn/communitySkill/123 -d '{"ExpiryDate":"2027-08-19"}'`
- Check network tab for API errors
- Verify skill sequences are numeric

**Settings not saving**:
- Verify module settings endpoint works: `curl http://localhost:3001/syn/mggsModule/15`
- Check MggsModuleService is calling correct endpoint
- Verify auth tokens are present

### Backend Issues

**Worker not triggered**:
- Check CronJobsQueue configuration (timing, enabled flag)
- Verify Redis is running: `redis-cli ping`
- Check app logs for queue errors

**Emails not sending**:
- Verify SMTP configuration in .env (SMTP_HOST, SMTP_PORT, SMTP_DEFAULT_FROM)
- Check SMTPConnector logs for connection errors
- Test SMTP manually: `telnet smtp-host 25`

**Duplicate notifications**:
- Verify deduplication logic in ExpiringSkillsWorker (check staffId/skillCode/date key)
- Check notification logs for "DUPLICATE_SKIPPED" entries
- Verify timestamps are correct timezone

---

## Success Criteria (Final Verification)

- [x] Feature delivered on time (~18 days)
- [x] All acceptance criteria met (spec.md section 10)
- [x] Constitution Check passed (all 5 principles)
- [x] Test coverage: Jest + Cypress E2E
- [x] Performance verified: <5s export, <3s bulk update, <1h notifications
- [x] User feedback: Staff/admins report improved efficiency

**Next Steps After Delivery**:
1. Gather user feedback from first 2 weeks
2. Identify quick wins/improvements for v1.1
3. Plan v1.2: Mobile support, advanced filters, audit log UI
