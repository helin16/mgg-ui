# Contract: ExpiringSkillsWorker Implementation

**File**: `src/workers/ExpiringSkillsWorker.ts` (NEW in mggs-api)  
**Pattern**: Follows `src/workers/ExpiringCreditCards.ts`  
**Queue**: CronJobsQueue (Bull Queue, Redis-backed)  
**Trigger**: Scheduled daily cron job (configuration in CronJobsQueue.ts)

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
      
      // Step 2: Query expiring skills
      const today = new Date();
      const initialThresholdDate = new Date(today);
      initialThresholdDate.setDate(today.getDate() + settings.initialNotificationDays);
      
      const expiringSkills = await CommunitySkill.findAll({
        where: {
          SkillCode: { [Op.in]: settings.monitoredSkillCodes },
          ExpiryDate: { [Op.lte]: initialThresholdDate }
        },
        include: [
          { model: VStaff, where: { ActiveFlag: true }, required: true }
        ]
      });
      
      // Step 3: Batch skills by staff
      const staffSkillMap = new Map<number, iSynCommunitySkill[]>();
      for (const skill of expiringSkills) {
        if (!staffSkillMap.has(skill.ID)) {
          staffSkillMap.set(skill.ID, []);
        }
        staffSkillMap.get(skill.ID)!.push(skill);
      }
      
      // Step 4: Send individual notifications
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
      
      // Step 5: Send bulk notification to admins
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
        '{occpEmail}': staff.occpEmail
      };
      
      Object.entries(substitutions).forEach(([placeholder, value]) => {
        const escaped = this.htmlEscape(String(value));
        subject = subject.replace(new RegExp(placeholder, 'g'), escaped);
        body = body.replace(new RegExp(placeholder, 'g'), escaped);
      });
      
      return SMTPConnector.send({
        to: staff.occpEmail,
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
