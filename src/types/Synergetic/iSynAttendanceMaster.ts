type ISynAttendanceMaster = {
  AttendanceMasterSeq: number;
  CreatedDate: Date | string | null;
  CreatedByID: number | null;
  ModifiedDate: Date | string | null;
  ModifiedByID: number | null;
  FileType: string;
  FileYear: number;
  FileSemester: number;
  ClassCampus: string;
  ClassCode: string;
  StaffID: number;
  AttendanceDate: Date | string;
  AttendancePeriod: number;
  AttendanceDateTimeFrom: Date | string | null;
  AttendanceDateTimeTo: Date | string | null;
  AttendanceDayNumber: number | null;
  TimetableGroup: string;
  ClassCancelledFlag: boolean;
  AttendanceOfficerModeFlag: boolean;
  SystemProcessNumber: number;
  SeqLinkedTo: number | null;
  MarkRollAsMultiPeriodFlag: boolean;
}

export default ISynAttendanceMaster;
