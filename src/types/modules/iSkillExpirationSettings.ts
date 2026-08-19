type iSkillExpirationSettings = {
  initialNotificationDays: number | string;
  followUpNotificationDays: number | string;
  monitoredSkillCodes: string[];
  skillExpirationNotificationEmails: string;
  individualNotificationEmailSubject: string;
  individualNotificationEmailBody: string;
  bulkNotificationEmailSubject: string;
  bulkNotificationEmailBody: string;
};

export default iSkillExpirationSettings;
