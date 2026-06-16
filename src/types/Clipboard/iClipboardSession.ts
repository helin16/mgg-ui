import iBaseType from '../iBaseType';
import iClipboardActivity from './iClipboardActivity';
import iClipboardTeam from './iClipboardTeam';

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
  teams?: Array<Pick<iClipboardTeam, 'id' | 'name'>>;
  assignedStaff?: iClipboardStaff[];
  cancelled?: boolean;
  scored?: boolean;
  feedback?: any[];
  externalObj?: any | null;
};

export default iClipboardSession;
