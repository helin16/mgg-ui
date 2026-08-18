# Contract: Notification Message Format & Deduplication

**System**: ExpiringSkillsWorker (backend notification scheduler)  
**Trigger**: Daily cron job (exact time configured in CronJobsQueue)  
**Queue**: Bull Queue (Redis-backed)  
**Status**: New worker following ExpiringCreditCards pattern

## Message Type

```typescript
MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION = 'SKILL_EXPIRATION_NOTIFICATION'
```

**Message Queue Request** (sent to Bull):
```typescript
interface iSkillExpirationNotificationRequest {
  type: MESSAGE_TYPE_SKILL_EXPIRATION_NOTIFICATION;
  request: {
    moduleId: number;          // 15 (MGGS_MODULE_ID_STAFF_LIST)
    runTimestamp: string;      // ISO datetime of scheduled run
  };
  priority?: number;           // Default: 10
  attempts?: number;           // Default: 1 (no retry)
}
```

## Deduplication Algorithm

**Tracking Strategy**:
- In-memory map: `Map<string, iNotificationRecord>`
- Key format: `{staffId}:{skillCode}:{expirationDateISO}:{notificationDateISO}`
- Purpose: Prevent duplicate emails for same staff/skill/date on same day

**Data Structure**:
```typescript
interface iNotificationRecord {
  staffId: number;
  skillCode: string;
  expirationDate: Date;        // Skill expiration date
  notificationDate: Date;      // When notification was sent
  recipients: string[];        // Email addresses notified
  batchId: string;             // For grouping skills by staff
}
```

**Deduplication Rules**:
1. Query all staff with monitored skill codes where ExpiryDate <= (today + initialNotificationDays)
2. For each (staffId, skillCode, expirationDate) tuple:
   - Check if already sent TODAY (notificationDate = today)
   - If YES: skip this skill, log as "DUPLICATE_SKIPPED"
   - If NO: proceed to batching step
3. Batch all qualifying skills for same staff into single email
4. Record in notification tracking (in-memory for this run only)

**Deduplication Implementation** (Node.js):
```typescript
// In-memory map for this worker run
const notificationCache = new Map<string, iNotificationRecord>();

function markNotificationSent(
  staffId: number,
  skillCode: string,
  expiryDate: Date,
  notificationDate: Date,
  recipients: string[]
): void {
  const key = `${staffId}:${skillCode}:${expiryDate.toISOString()}:${notificationDate.toISOString()}`;
  notificationCache.set(key, {
    staffId,
    skillCode,
    expirationDate: expiryDate,
    notificationDate: notificationDate,
    recipients,
    batchId: `${staffId}:${notificationDate.toISOString()}`
  });
}

function isAlreadyNotified(
  staffId: number,
  skillCode: string,
  expiryDate: Date,
  todayDate: Date
): boolean {
  const todayISO = todayDate.toISOString().split('T')[0];
  const keys = Array.from(notificationCache.keys()).filter(k => {
    const parts = k.split(':');
    const cachedToday = parts[3]?.split('T')[0];
    return parts[0] === String(staffId) &&
           parts[1] === skillCode &&
           parts[2] === expiryDate.toISOString() &&
           cachedToday === todayISO;
  });
  return keys.length > 0;
}
```

## Email Format: Individual Notification

**To**: `{staff.occpEmail}`  
**Subject**: `{settings.individualNotificationEmailSubject}` (HTML-escaped)  
**Body**: `{settings.individualNotificationEmailBody}` (HTML-escaped)

**Variable Substitution**:
```typescript
const substitutions = {
  '{staffName}': staff.StaffNameExternal,
  '{skillCode}': skill.SkillCode,
  '{expirationDate}': skill.ExpiryDate.toISOString().split('T')[0],  // YYYY-MM-DD
  '{occpEmail}': staff.occpEmail
};

// Apply substitutions with HTML escaping for HTML emails
const escapeHtml = (text: string) => text
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

let emailBody = settings.individualNotificationEmailBody;
Object.entries(substitutions).forEach(([placeholder, value]) => {
  emailBody = emailBody.replace(new RegExp(placeholder, 'g'), escapeHtml(String(value)));
});
```

**Example Output**:
```
To: john.smith@school.com
Subject: Skill Expiring: CPR

Hi John Smith,

Your CPR skill is expiring on 2026-09-15. Please renew it before then.

Best regards,
Mentone Girls Grammar
```

## Email Format: Bulk Notification

**To**: `{settings.skillExpirationNotificationEmails}` (semicolon-separated)  
**Subject**: `{settings.bulkNotificationEmailSubject}` (HTML-escaped)  
**Body**: `{settings.bulkNotificationEmailBody}` with `{expiringStaffTable}` replaced

**Batching Rules**:
```typescript
// Group all notified skills by staffId
const staffSkillMap = new Map<number, iSynCommunitySkill[]>();

notificationCache.forEach(record => {
  if (!staffSkillMap.has(record.staffId)) {
    staffSkillMap.set(record.staffId, []);
  }
  staffSkillMap.get(record.staffId)!.push(skill);  // Add skill to this staff's list
});

// Generate HTML table
const generateTable = (staffSkillMap: Map<number, iSynCommunitySkill[]>): string => {
  let html = '<table border="1" cellpadding="5">\n<tr><th>Staff ID</th><th>Name</th><th>Expiring Skills</th></tr>\n';
  staffSkillMap.forEach((skills, staffId) => {
    const staff = staffMap[staffId];
    const skillsList = skills.map(s => `${s.SkillCode} (${s.ExpiryDate})`).join(', ');
    html += `<tr><td>${staffId}</td><td>${escapeHtml(staff.StaffNameExternal)}</td><td>${skillsList}</td></tr>\n`;
  });
  html += '</table>';
  return html;
};

const expiringStaffTable = generateTable(staffSkillMap);
let emailBody = settings.bulkNotificationEmailBody.replace('{expiringStaffTable}', expiringStaffTable);
```

**Example Output**:
```
To: admin@school.com;hoy@school.com
Subject: Daily Report: Expiring Staff Skills

The following staff have skills expiring soon:

| Staff ID | Name | Expiring Skills |
|----------|------|-----------------|
| 45 | John Smith | CPR (2026-09-15) |
| 67 | Jane Doe | FirstAid (2026-09-20), Leadership (2026-08-25) |

Please follow up with them to ensure renewal.
```

## Error Handling

**Send Failure** (FR-026):
```typescript
try {
  await SMTPConnector.send({
    to: recipient,
    subject: subject,
    html: emailBody,
    // ... other params
  });
  logger.info(`NOTIFICATION_SENT`, { staffId, skillCode, recipient });
} catch (error) {
  logger.warn(`NOTIFICATION_FAILED`, {
    staffId,
    skillCode,
    recipient,
    error: error.message,
    errorCode: error.code
  });
  // Continue with next recipient; do NOT retry
}
```

**Partial Failures**:
- If 1 of 3 admin recipients fails: Log warning but continue sending to other recipients
- If individual staff notification fails: Log warning but continue with next staff
- No automatic retry; admin reviews logs and manually resends if needed

## Logging

**INFO Level** (Success):
```
timestamp=2026-08-20T11:59:00Z level=INFO event=NOTIFICATION_CYCLE_START module=15 runId=abc123
timestamp=2026-08-20T11:59:15Z level=INFO event=NOTIFICATION_SENT staffId=45 skillCode=CPR recipient=john.smith@school.com type=individual
timestamp=2026-08-20T11:59:16Z level=INFO event=NOTIFICATION_SENT recipient=admin@school.com type=bulk staffCount=2 skillCount=3
timestamp=2026-08-20T11:59:16Z level=INFO event=NOTIFICATION_CYCLE_COMPLETE totalSent=4 totalFailures=0 duration=16s
```

**WARN Level** (Failures):
```
timestamp=2026-08-20T11:59:10Z level=WARN event=DUPLICATE_SKIPPED staffId=45 skillCode=CPR expiryDate=2026-09-15 reason=already_sent_today
timestamp=2026-08-20T11:59:15Z level=WARN event=NOTIFICATION_FAILED staffId=45 skillCode=CPR recipient=john.smith@school.com error=smtp_timeout code=ETIMEDOUT
```

## Notes

- No persistent database table for notification history
- Deduplication is in-memory for each worker run (ephemeral)
- If worker crashes mid-run, some notifications may be re-sent next run (acceptable, rare)
- All timestamps in server timezone (UTC or configured timezone)
