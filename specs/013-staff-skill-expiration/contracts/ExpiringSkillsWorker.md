# Contract: ExpiringSkillsWorker Implementation

**File**: `src/workers/ExpiringSkillsWorker.ts` (NEW in mggs-api)  
**Pattern**: Follows `src/workers/ExpiringCreditCards.ts`  
**Queue**: CronJobsQueue (Bull Queue, Redis-backed)  
**Trigger**: Nightly cron job at 11:59 PM, registered in `src/worker.ts` (confirmed pattern below)

## Implementation Note (as built)

This feature is now implemented; the sections below are the original Phase-2 design and are kept for
historical context, but a few details turned out to be wrong once actually built against the codebase's
real conventions (verified by reading `ExpiringCreditCards.ts`/`ExpiringPassportsAndVisas.ts` directly,
which this planning pass hadn't done):

- **Worker shape**: a plain `{run, isNotifyDay}` object, not the `class ExpiringSkillsWorker { static ... }`
  sketched below — every sibling worker in this codebase (`ExpiringCreditCards`, `ExpiringPassportsAndVisas`,
  `StudentAbsenceWorker`) uses a plain exported object, and `run()` doesn't return a
  `{notificationsSent, emailsSent, failures}` struct; it resolves `void` and logs as it goes, matching those
  siblings.
- **Logging**: via `Logger.log(msg, prefix)` from `src/workers/Loger.ts` (a thin `console.log` wrapper with
  no level distinction), not `LoggerService.getLogger(...).info/warn/error(...)` — no such `LoggerService`
  exists in this codebase.
- **Mailer**: no separate `ExpiringSkillsMailerHelper.ts` file — `sendIndividualNotification`/
  `sendBulkNotification`/`substitute`/`escapeHtml` are local functions inside `ExpiringSkillsWorker.ts`
  itself, again matching how the sibling workers keep their mailer logic inline rather than in a helper
  module.
- **Actual send path**: `EmailHelper.addAMailJob({to, subject, html, userId})` (in `src/helper/EmailHelper.ts`)
  rather than a direct `SMTPConnector.send(...)` call. `addAMailJob` queues a `MESSAGE_TYPE_SMTP_EMAIL`
  message; `CronJobsQueue`'s own processor later calls `SMTPConnector.send(message.request)` on it. This
  also means there's no `text` (plain-text) fallback — `addAMailJob`'s type doesn't support one.
- **Deduplication**: no in-memory `Map`-based tracking cache was built. `isNotifyDay()` is a pure function
  of `(ExpiryDate, today, settings)`, so within a single run the SQL query plus a `Map` keyed by staff ID
  structurally cannot produce two entries for the same (staff, skill) pair — there was nothing left for a
  same-run cache to deduplicate. See `tasks.md` T047/T051 for the one genuinely-open edge case this doesn't
  cover (a second manual trigger the same day after the first run already reached SUCCESS).

The query scope, cron registration, and day-interval math below are accurate as designed and as built.

## Confirmed Cron Registration

`src/worker.ts` already registers several nightly jobs via `node-cron` with a shared `defaultCronSettings` (uses `AppHelper.getDefaultTimeZone()`, so server-timezone DST is handled consistently with existing jobs):

```typescript
// Existing patterns for reference:
cron.schedule('0 23 * * *', async () => { /* Student absence daily summary at 11pm */ });
cron.schedule('0 23 * * *', async () => { /* Clipboard StudentClasses sync at 11pm */ });

// NEW: add to loadCronJobs() in src/worker.ts
console.log(`Checking Expiring Staff Skills every night at 11:59pm`);
cron.schedule('59 23 * * *', async () => {
  await CronJobsQueue.addJobWithoutDuplicate({},
    MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION,
    AuthHelper.getDefaultSystemUserId(),
    CronJobsQueue
  );
}, defaultCronSettings);
```

**Query Scope (confirmed)**: Each nightly run checks **all Active staff** and **all of their skill records** (not just those matching monitored codes at the DB query level — filter by `monitoredSkillCodes` from settings, and `ActiveFlag = true` staff only), then applies the day-interval math (below) to decide who actually gets notified tonight.

## Worker Signature

```typescript
import { MessageModel } from '../models/Settings/Message';
import { iSkillExpirationRequest } from '../types/Workers/iSkillExpirationRequest';

class ExpiringSkillsWorker {
  static async run(request: iSkillExpirationRequest): Promise<{
    notificationsSent: number;
    emailsSent: number;
    failures: Array<{staffId: number; skillCode: string; error: string}>;
  }>;
}

export default ExpiringSkillsWorker;
```

## Implementation Checklist

### Phase 1: Setup & Configuration

- [ ] Create `src/types/Workers/iSkillExpirationRequest.ts`:
  ```typescript
  export interface iSkillExpirationRequest {
    moduleId: number;      // 15
    runTimestamp: string;  // ISO datetime
  }
  ```

- [ ] Create `src/types/Workers/iSkillExpirationSettings.ts`:
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

- [ ] Add constant to `src/models/Settings/Message.ts`:
  ```typescript
  export const MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION = 'SKILL_EXPIRATION_NOTIFICATION';
  ```

- [ ] Update `src/queue/CronJobsQueue.ts`:
  ```typescript
  import ExpiringSkillsWorker from '../workers/ExpiringSkillsWorker';
  // ... in processJob handler:
  [MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION]: (message: MessageModel) =>
    ExpiringSkillsWorker.run(message.request),
  ```

- [ ] Update `src/worker.ts` — add nightly 11:59pm trigger inside `loadCronJobs()` (see "Confirmed Cron Registration" above for exact snippet), following the same pattern as the existing `Student absence daily summary at 11pm` and `Clipboard StudentClasses sync at 11pm` jobs

### Phase 2: Worker Core Logic

- [ ] Implement `ExpiringSkillsWorker.run()`:

  ```typescript
  static async run(request: iSkillExpirationRequest) {
    const logger = LoggerService.getLogger('ExpiringSkillsWorker');
    logger.info('NOTIFICATION_CYCLE_START', { moduleId: request.moduleId });
    
    const notificationsSent = 0;
    const emailsSent = 0;
    const failures: Array<{staffId, skillCode, error}> = [];
    
    try {
      // Step 1: Load module settings
      const module = await SynMggsModuleHelper.getModule(request.moduleId);
      const settings = module.settings?.skillExpiration as iSkillExpirationSettings;
      
      if (!settings || !settings.monitoredSkillCodes?.length) {
        logger.info('NOTIFICATION_DISABLED', {moduleId: request.moduleId});
        return { notificationsSent: 0, emailsSent: 0, failures: [] };
      }
      
      // Step 2: Query ALL active staff + their skills matching monitored codes
      // (confirmed scope: all Active staff, all their Active skills — not pre-filtered by date at DB level)
      const allExpiringSkills = await CommunitySkill.findAll({
        where: {
          SkillCode: { [Op.in]: settings.monitoredSkillCodes },
          ExpiryDate: { [Op.ne]: null }
        },
        include: [
          { model: VStaff, where: { ActiveFlag: true }, required: true }
        ]
      });
      
      // Step 3: For each skill, compute whether TODAY is a legitimate notify day
      // No persistent "last notified" log exists (FR-030), so this must be derived
      // purely from ExpiryDate + settings — see "Day-Interval Math" section below.
      const today = new Date();
      const skillsToNotifyToday = allExpiringSkills.filter(skill =>
        isNotifyDay(skill.ExpiryDate, today, settings.initialNotificationDays, settings.followUpNotificationDays)
      );
      
      // Step 4: Batch qualifying skills by staff
      const staffSkillMap = new Map<number, iSynCommunitySkill[]>();
      for (const skill of skillsToNotifyToday) {
        if (!staffSkillMap.has(skill.ID)) {
          staffSkillMap.set(skill.ID, []);
        }
        staffSkillMap.get(skill.ID)!.push(skill);
      }
      
      // Step 5: Send individual notifications (one batched email per staff)
      for (const [staffId, skills] of staffSkillMap.entries()) {
        try {
          const staff = await VStaff.findOne({ where: { StaffID: staffId } });
          await ExpiringSkillsMailerHelper.sendIndividualNotification(
            staff,
            skills,
            settings
          );
          notificationsSent += skills.length;
          emailsSent += 1;  // One email per staff
        } catch (error) {
          logger.warn('NOTIFICATION_FAILED', { staffId, error: error.message });
          skills.forEach(skill => {
            failures.push({ staffId, skillCode: skill.SkillCode, error: error.message });
          });
        }
      }
      
      // Step 6: Send bulk notification to admins
      if (staffSkillMap.size > 0 && settings.skillExpirationNotificationEmails) {
        try {
          await ExpiringSkillsMailerHelper.sendBulkNotification(
            staffSkillMap,
            settings
          );
          emailsSent += 1;
        } catch (error) {
          logger.warn('BULK_NOTIFICATION_FAILED', { error: error.message });
          // Don't add to failures; bulk notification is secondary
        }
      }
      
      logger.info('NOTIFICATION_CYCLE_COMPLETE', {
        notificationsSent,
        emailsSent,
        failureCount: failures.length
      });
      
      return { notificationsSent, emailsSent, failures };
    } catch (error) {
      logger.error('NOTIFICATION_CYCLE_ERROR', { error: error.message });
      throw error;
    }
  }
  ```

### Phase 2b: Day-Interval Math (Follow-Up Notification Logic)

**Problem**: With no persistent notification log (FR-030), the worker must derive "is today a legitimate notify day for this skill?" purely from `ExpiryDate` + settings, each night, independently.

**Algorithm**:
```typescript
function isNotifyDay(
  expiryDate: Date,
  today: Date,
  initialNotificationDays: number,
  followUpNotificationDays: number
): boolean {
  const initialNotifyDate = new Date(expiryDate);
  initialNotifyDate.setDate(expiryDate.getDate() - initialNotificationDays);

  // Before the initial notification window even opens
  if (today < initialNotifyDate) {
    return false;
  }

  // followUpNotificationDays = 0 means "initial notification only, no follow-ups"
  if (followUpNotificationDays <= 0) {
    return isSameDay(today, initialNotifyDate);
  }

  // Days elapsed since the initial notification date (can be negative-safe due to guard above)
  const daysSinceInitial = diffInDays(today, initialNotifyDate);

  // Notify on day 0 (initial) and every followUpNotificationDays after that, indefinitely
  // (continues past expiry per Q3 clarification, until ExpiryDate itself changes)
  return daysSinceInitial % followUpNotificationDays === 0;
}
```

**Why this works without persistent storage**: `initialNotifyDate` is fully derived from `ExpiryDate` (fixed until changed) and `initialNotificationDays` (a fixed setting). Changing `ExpiryDate` automatically shifts `initialNotifyDate`, which naturally satisfies FR-014 (cycle reset on ExpiryDate change) with zero extra bookkeeping.

### Phase 3: Mailer Helper

- [ ] Create `src/queue/helper/ExpiringSkillsMailerHelper.ts`:

  ```typescript
  import SMTPConnector from '../../connectors/SMTPConnector';
  
  export class ExpiringSkillsMailerHelper {
    static async sendIndividualNotification(
      staff: any,
      skills: any[],
      settings: iSkillExpirationSettings
    ): Promise<void> {
      // Batch all skills for this staff into one email
      const skillsList = skills
        .map(s => `${s.SkillCode} (expires ${s.ExpiryDate})`)
        .join(', ');
      
      let subject = settings.individualNotificationEmailSubject;
      let body = settings.individualNotificationEmailBody;
      
      // Substitute variables (with HTML escaping for HTML emails)
      const substitutions = {
        '{staffName}': staff.StaffNameExternal,
        '{skillCode}': skills[0].SkillCode,  // First skill for subject
        '{expirationDate}': skills[0].ExpiryDate,
        '{staffOccupEmail}': staff.StaffOccupEmail
      };
      
      Object.entries(substitutions).forEach(([placeholder, value]) => {
        const escaped = this.htmlEscape(String(value));
        subject = subject.replace(new RegExp(placeholder, 'g'), escaped);
        body = body.replace(new RegExp(placeholder, 'g'), escaped);
      });
      
      return SMTPConnector.send({
        to: staff.StaffOccupEmail,
        subject,
        html: body,
        text: this.htmlToPlainText(body)
      });
    }
    
    static async sendBulkNotification(
      staffSkillMap: Map<number, any[]>,
      settings: iSkillExpirationSettings
    ): Promise<void> {
      const recipients = settings.skillExpirationNotificationEmails
        .split(';')
        .map(e => e.trim())
        .filter(e => e.length > 0);
      
      if (recipients.length === 0) return;
      
      // Generate HTML table
      const tableRows = Array.from(staffSkillMap.entries())
        .map(([staffId, skills]) => {
          const staffName = /* fetch from cache or DB */ '';
          const skillsList = skills.map(s => `${s.SkillCode} (${s.ExpiryDate})`).join(', ');
          return `<tr><td>${staffId}</td><td>${this.htmlEscape(staffName)}</td><td>${skillsList}</td></tr>`;
        })
        .join('\n');
      
      const expiringStaffTable = `<table border="1"><tr><th>Staff ID</th><th>Name</th><th>Skills</th></tr>${tableRows}</table>`;
      
      let subject = settings.bulkNotificationEmailSubject;
      let body = settings.bulkNotificationEmailBody.replace('{expiringStaffTable}', expiringStaffTable);
      
      return SMTPConnector.send({
        to: recipients,
        subject,
        html: body,
        text: this.htmlToPlainText(body)
      });
    }
    
    private static htmlEscape(text: string): string {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
    
    private static htmlToPlainText(html: string): string {
      return html
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
    }
  }
  ```

### Phase 4: Testing

- [ ] Unit test: `src/__tests__/workers/ExpiringSkillsWorker.test.ts`
  - Mock CommunitySkill.findAll() with test data
  - Verify worker returns correct count
  - Verify deduplication logic

- [ ] Unit test: `src/__tests__/queue/ExpiringSkillsMailerHelper.test.ts`
  - Verify template variable substitution
  - Verify HTML escaping
  - Verify table generation for bulk email

- [ ] Integration test: Verify CronJobsQueue.ts correctly registers and dispatches worker

### Phase 5: Deployment & Verification

- [ ] Add .env configuration (if needed):
  - Verify SMTP_HOST, SMTP_PORT, SMTP_DEFAULT_FROM are set

- [ ] Manual verification in staging:
  - Manually trigger worker via test message to queue
  - Verify email sent to test recipient
  - Check app logs for success/warn/error messages
  - Verify no duplicate emails on second run

- [ ] Production verification:
  - Monitor logs for "NOTIFICATION_CYCLE_START" and "NOTIFICATION_CYCLE_COMPLETE" messages
  - Spot-check emails for correct variable substitution and formatting
  - Verify no emails sent to Inactive staff

## Notes

- No database migration required (uses existing Message queue)
- Deduplication is in-memory per run (prevents duplicates same day)
- No automatic retry on send failure (lossy delivery per FR-026)
- All timestamps in server timezone
- Worker follows existing pattern from ExpiringCreditCards
