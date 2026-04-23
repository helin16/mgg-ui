type iSynStudentClassesHistory =  {
  Seq: number;
  FileType: string;
  FileYear: number;
  FileSemester: number;
  ID: number;
  ClassColumn: number;
  ClassCampus: string;
  ClassCode: string;
  AssessableFlag: boolean;
  ModifiedDate: Date | string | null;
  ModifiedBy: string | null;
  UnitsAdjustment: number;
  UnitsTotal: number;
  Status: string;
  InterviewRequested: string;
  AuthorApprovedFlag: boolean;
  EditorApprovedFlag: boolean;
  PrintApprovedFlag: boolean;
  Comment: string;
  FocusArea: string;
  StartDate: Date | string | null;
  StopDate: Date | string | null;
  ResultsCopiedFlag: boolean;
  SystemProcessNumber: number | null;
};

export default iSynStudentClassesHistory;
