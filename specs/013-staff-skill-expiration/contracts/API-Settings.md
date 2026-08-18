# API Contract: Skill Expiration Settings

**Endpoint**: `PUT /syn/mggsModule/15`  
**Method**: PUT  
**Status**: Existing (reuse for new feature)  
**Source**: `src/controllers/MggsModule/SynMggsModuleController.ts`

## Request

**Headers**:
```
Authorization: Bearer {token}
X-MGGS-TOKEN: {appToken}
Content-Type: application/json
```

**Body** (Settings Tab configuration):
```json
{
  "settings": {
    "skillExpiration": {
      "initialNotificationDays": 14,
      "followUpNotificationDays": 7,
      "monitoredSkillCodes": ["CPR", "FirstAid", "Leadership"],
      "skillExpirationNotificationEmails": "admin@school.com;hoy@school.com",
      "individualNotificationEmailSubject": "Skill Expiring: {skillCode}",
      "individualNotificationEmailBody": "Hi {staffName},\n\nYour {skillCode} skill is expiring on {expirationDate}. Please renew it before then.\n\nBest regards,\nMentone Girls Grammar",
      "bulkNotificationEmailSubject": "Daily Report: Expiring Staff Skills",
      "bulkNotificationEmailBody": "The following staff have skills expiring soon:\n\n{expiringStaffTable}\n\nPlease follow up with them to ensure renewal."
    }
  }
}
```

## Response

**Status Code**: 200 OK

**Body**:
```json
{
  "ModuleID": 15,
  "Name": "Staff List",
  "Description": "Staff member list and management",
  "settings": {
    "skillExpiration": {
      "initialNotificationDays": 14,
      "followUpNotificationDays": 7,
      "monitoredSkillCodes": ["CPR", "FirstAid", "Leadership"],
      "skillExpirationNotificationEmails": "admin@school.com;hoy@school.com",
      "individualNotificationEmailSubject": "Skill Expiring: {skillCode}",
      "individualNotificationEmailBody": "Hi {staffName},\n\nYour {skillCode} skill is expiring on {expirationDate}. Please renew it before then.\n\nBest regards,\nMentone Girls Grammar",
      "bulkNotificationEmailSubject": "Daily Report: Expiring Staff Skills",
      "bulkNotificationEmailBody": "The following staff have skills expiring soon:\n\n{expiringStaffTable}\n\nPlease follow up with them to ensure renewal."
    }
  }
}
```

## Validation Rules

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| initialNotificationDays | number | Min: 1, Max: 365 | Yes |
| followUpNotificationDays | number | Min: 0, Max: 30 | Yes |
| monitoredSkillCodes | string[] | Non-empty if notifications enabled | Yes |
| skillExpirationNotificationEmails | string | Valid semicolon-separated emails | Yes |
| individualNotificationEmailSubject | string | Min: 5, Max: 200 chars | Yes |
| individualNotificationEmailBody | string | Min: 10, Max: 5000 chars | Yes |
| bulkNotificationEmailSubject | string | Min: 5, Max: 200 chars | Yes |
| bulkNotificationEmailBody | string | Min: 10, Max: 5000 chars | Yes |

## Frontend Usage Pattern

```typescript
// Load current settings
const module = await MggsModuleService.getModule(MGGS_MODULE_ID_STAFF_LIST);
const settings = module.settings?.skillExpiration || {};

// User edits settings in form
const updatedSettings = {
  initialNotificationDays: 14,
  followUpNotificationDays: 7,
  monitoredSkillCodes: ["CPR", "FirstAid"],
  skillExpirationNotificationEmails: "admin@school.com",
  // ... other fields
};

// Save settings
await MggsModuleService.updateModule(MGGS_MODULE_ID_STAFF_LIST, {
  settings: {
    ...module.settings,
    skillExpiration: updatedSettings
  }
});

// Show success toast
showToast("Settings saved successfully");
```

## Notes

- Settings are stored as JSON in the module's settings column
- No separate database table required
- Changes take effect on next scheduled notification check (next cron run)
- Template variables are substituted at email sending time, not at settings save time
