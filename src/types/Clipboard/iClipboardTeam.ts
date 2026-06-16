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
  category?: {
    id?: number;
    name?: string;
  };
  subcategory?: {
    id?: number;
    name?: string;
  };
  assignedStaff?: Array<{
    id?: number;
    firstName?: string | null;
    lastName?: string | null;
    name?: string | null;
  }>;
  students?: Array<{
    smsId?: string;
    studentId?: number;
    firstName?: string;
    lastName?: string;
    yearGroup?: {
      id?: number;
      name?: string;
    };
    captain?: boolean;
    boarder?: boolean;
    positionId?: number | null;
    jerseyNumber?: number | null;
  }>;
  members?: any[];
  teamMembers?: any[];
};

export default iClipboardTeam;
