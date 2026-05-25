import iBaseType from '../iBaseType';

type iClipboardDepartment = {
  id: number;
  name: string;
};

type iClipboardActivity = {
  id: number;
  name: string;
  department: iClipboardDepartment;
};

type iClipboardTeam = {
  id: number;
  name: string;
};

type iClipboardStaff = {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
};

type iClipboardSession = iBaseType & {
  title: string;
  startDateTime: string; // ISO string
  endDateTime: string; // ISO string
  activity: iClipboardActivity;
  sisIds?: string[];
  teams?: iClipboardTeam[];
  assignedStaff?: iClipboardStaff[];
  cancelled?: boolean;
  scored?: boolean;
  feedback?: any[];
  externalObj?: any | null;
};

export default iClipboardSession;
