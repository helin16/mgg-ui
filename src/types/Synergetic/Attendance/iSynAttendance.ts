import iSynCommunity from '../iSynCommunity';
import iSynLuAbsenceType from '../Absence/iSynLuAbsenceType';

type iSynAttendance = {
  AttendanceSeq: number;
  AttendanceMasterSeq: number;
  ID: number;
  PossibleAbsenceCode: string;
  PossibleDescription: string;
  AttendedFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedByID: number;
  PossibleReasonCode: string;
  UserFlag1: boolean;
  UserFlag2: boolean;
  UserFlag3: boolean;
  UserFlag4: boolean;
  UserFlag5: boolean;
  LateArrivalFlag: boolean;
  LatearrivalTime: Date | string | null;
  EarlyDepartureFlag: boolean;
  EarlyDepartureTime: Date | string | null;
  AbsenceEventsSeq: number;
  NonAttendCreatedAbsenceEventsFlag: boolean;
  SynCommunity?: iSynCommunity;
  PossibleAbsenceType?: iSynLuAbsenceType;
}

export default iSynAttendance;
