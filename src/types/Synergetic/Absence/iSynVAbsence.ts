import iSynCommunity from '../iSynCommunity';
import iSynLuAbsenceType from './iSynLuAbsenceType';

type iSynVAbsence = {
  ID: number;
  AbsenceDate: Date | string | null;
  AbsencePeriod: number;
  AbsencePeriodSort: number | null;
  AbsenceType: string;
  AdvanceNotifiedFlag: boolean;
  ApprovedFlag: boolean;
  NoteReceivedFlag: boolean;
  LateArrivalFlag: boolean;
  LateArrivalTime: string | null;
  Description: string;
  RelatedAttendanceSeq: number;
  AbsenceSeq: number;
  SystemProcessNumber: number;
  ReasonCode: string;
  NonAttendancePeriodCount: number;
  PhonedFlag: boolean;
  EarlyDepartureTime: string | null;
  CreatedDate: Date | string | null;
  LoginName: string | null;
  AbsencesSeq: number;
  NoteMadeFlag: boolean;
  SynergyMeaning: string | null;
  SynCommunity?: iSynCommunity;
  SynLuAbsenceType?: iSynLuAbsenceType;
}

export default iSynVAbsence;
