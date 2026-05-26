import iBaseType from '../iBaseType';

type iClipboardStudent = {
  id: number;
  firstName: string;
  legalFirstName: string | null;
  lastName: string;
  smsId: string | null;
  yearGroup: {
    id: number;
    name: string;
  };
};

type iClipboardAttendanceSession = {
  id: number;
  title: string | null;
  activity: {
    id: number;
    name: string;
  };
  startDateTime: string;
  endDateTime: string | null;
};

type iClipboardAttendanceTeam = {
  id: number;
  name: string;
  category: {
    id: number;
    name: string;
  } | null;
};

type iClipboardUser = {
  id: number;
  firstName: string;
  lastName: string;
  sisId: string | null;
};

type iClipboardAttendance = iBaseType & {
  absent: boolean;
  explained: boolean;
  comment: string | null;
  addedToRoll: boolean;
  attendanceFlags: {
    id: string;
    name: string;
  }[];
  student: iClipboardStudent;
  session: iClipboardAttendanceSession;
  team: iClipboardAttendanceTeam | null;
  roll: {
    id: number;
    timeMarked: string | null;
    timeEdited: string | null;
  };
  markedByUser: iClipboardUser | null;
  editedByUser: iClipboardUser | null;
  updatedTimestamp: string | null;
  updatedByUser: iClipboardUser | null;
};

export default iClipboardAttendance;
