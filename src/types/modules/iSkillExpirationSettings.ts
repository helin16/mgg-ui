// Bodies are authored via EmailTemplateBuilder (Unlayer): `design` is the editable JSON re-loaded into
// the builder, `html` is the exported HTML actually substituted/sent by ExpiringSkillsWorker.
export type iSkillExpirationEmailTemplateBody = {
  design?: any;
  html: string;
};

type iSkillExpirationSettings = {
  initialNotificationEnabled: boolean;
  initialNotificationDays: number | string;
  followUpNotificationEnabled: boolean;
  followUpNotificationDays: number | string;
  monitoredSkillCodes: string[];
  skillExpirationNotificationEmails: string;
  individualNotificationEmailSubject: string;
  individualNotificationEmailBody: iSkillExpirationEmailTemplateBody;
  bulkNotificationEmailSubject: string;
  bulkNotificationEmailBody: iSkillExpirationEmailTemplateBody;
};

export default iSkillExpirationSettings;
