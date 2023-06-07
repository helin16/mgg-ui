import iVStudent from '../Synergetic/iVStudent';
import iSynCommunity from '../Synergetic/iSynCommunity';
import iSynLuAbsenceReason from './iSynLuAbsenceReason';

export const STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT = 'sign-out';
export const STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN = 'sign-in';

type iRecord = {
  id: number;
  hasNote: boolean;
  StudentID: number;
  EventDate: Date;
  AbsenceCode: string;
  Comments: string | null;
  active: boolean;
  created_at: Date | string | null;
  created_by_id: number | null;
  updated_at: Date | string | null;
  updated_by_id: number | null;
  approved_at: Date | string | null;
  approved_by_id: number | null;
  syncd_at: Date | string | null;
  syncd_by_id: number | null;
  syncd_AbsenceEventSeq: string | number | null;
  Student?: iVStudent | null;
  AbsenceReason?: iSynLuAbsenceReason | null;
  CreatedBy?: iSynCommunity | null;
  SyncdBy?: iSynCommunity | null;
  UpdatedBy?: iSynCommunity | null;
  ApprovedBy?: iSynCommunity | null;
  isExpectedEvent: boolean;
  Expected?: iRecord;
}

export type iStudentAbsenceEarlySignOut = iRecord;

export type iStudentAbsenceLateSignIn = iRecord;

export type iStudentAbsence = iStudentAbsenceEarlySignOut | iStudentAbsenceLateSignIn;

export type iRecordType = typeof STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT | typeof STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN;

export const iRecordTypeMap = {
  [STUDENT_ABSENCE_RECORD_TYPE_EARLY_SIGN_OUT]: '112',
  [STUDENT_ABSENCE_RECORD_TYPE_LATE_SIGN_IN]: '111',
}
export const STUDENT_ABSENCE_REASON_CODE_OTHER = '500';

export default iRecord;
