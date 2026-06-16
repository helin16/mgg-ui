import iBaseType from '../iBaseType';
import iClipboardActivity from './iClipboardActivity';

type iClipboardTeam = iBaseType & {
  name: string | null;
  classCode?: string | null;
  isHidden?: boolean;
  externalId?: string | null;
  externalObj?: any | null;
  checkSum?: string | null;
  sisId?: string | null;
  hidden?: boolean;
  activity?: iClipboardActivity;
  assignedStaff?: Array<{
    id?: number;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
  }>;
  students?: any[];
  members?: any[];
  teamMembers?: any[];
};

export default iClipboardTeam;
