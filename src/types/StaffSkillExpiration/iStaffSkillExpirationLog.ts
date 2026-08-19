type iStaffSkillExpirationLog = {
  id: string;
  status: string;
  notificationType: 'individual' | 'bulk' | null;
  recipient: string | null;
  subject: string | null;
  staffId: number | null;
  staffName: string | null;
  skillCodes: string[];
  staffIds: number[];
  createdAt: string;
  updatedAt: string;
  error?: any;
};

export type iStaffSkillExpirationLogsResult = {
  data: iStaffSkillExpirationLog[];
  total: number;
  page: number;
  pageSize: number;
};

export default iStaffSkillExpirationLog;
