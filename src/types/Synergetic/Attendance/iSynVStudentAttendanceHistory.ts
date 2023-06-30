type iSynVStudentAttendanceHistory = {
  FileType: string;
  ClassCampus: string;
  ClassCode: string;
  AttendanceDate: string;
  ID: number;
  FileSemester: number;
  FileYear: number;
  AttendancePeriod: number;
  AbsenceEventsSeq: number;
  AttendanceMasterSeq: number;
  AttendanceSeq: number;
  AttendedFlag: boolean | null;
  EarlyDepartureFlag: boolean | null;
  EarlyDepartureTime: Date | string | null;
  LateArrivalFlag: boolean | null;
  LatearrivalTime: Date | string | null;
  PossibleAbsenceCode: string | null;
  PossibleDescription: string | null;
  PossibleReasonCode: string | null;
  NonAttendCreatedAbsenceEventsFlag: boolean | null;
}

export default iSynVStudentAttendanceHistory;
