import iClipboardDepartment from './iClipboardDepartment';

type iClipboardActivity = {
  id: number;
  name: string;
  code?: string;
  emoji?: string;
  archived?: boolean;
  timesheetsEnabled?: boolean;
  hexColor?: string;
  smsCode?: string;
  rollMode?: 'present' | 'absent';
  activityType?: string;
  archivedByUserId?: number | null;
  archivedTimestamp?: string | null;
  department: iClipboardDepartment;
};

export default iClipboardActivity;
