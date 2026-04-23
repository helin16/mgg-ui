import iSynCommunity from '../iSynCommunity';
import iSynLuAbsenceType from '../Absence/iSynLuAbsenceType';

type iSynVAttendance = {
  AttendanceSeq: number;
  AttendanceMasterSeq: number;
  FileType: string;
  FileYear: number;
  FileSemester: number;
  ClassCampus: string;
  ClassCode: string;
  ID: number;
  AttendanceDate: Date | string;
  AttendancePeriod: number;
  PossibleAbsenceCode: string;
  PossibleDescription: string;
  AttendedFlag: boolean;
  StaffID: number;
  ModifiedDate: Date | string | null;
  ModifiedByID: number;
  ModifiedBy: string | null;
  PossibleReasonCode: string;
  UserFlag1: boolean;
  UserFlag2: boolean;
  UserFlag3: boolean;
  UserFlag4: boolean;
  UserFlag5: boolean;
  LateArrivalFlag: boolean;
  LatearrivalTime: Date | string | null;
  LateArrivalTimeStr: string | null;
  EarlyDepartureFlag: boolean;
  EarlyDepartureTime: Date | string | null;
  EarlyDepartureTimeStr: string | null;
  AbsenceEventsSeq: number;
  NonAttendCreatedAbsenceEventsFlag: boolean;
  AttendanceDateTimeFrom: Date | string | null;
  AttendanceDateTimeTo: Date | string | null;
  AttendanceDayNumber: null | null;
  ClassCancelledFlag: boolean;
  SynCommunity?: iSynCommunity;
  PossibleAbsenceType?: iSynLuAbsenceType;
}

export default iSynVAttendance;
