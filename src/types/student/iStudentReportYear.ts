export const STUDENT_REPORT_YEAR_STYLE_JNR_GRAPH = 'JUNIOR_GRH';

type iStudentReportYear = {
  ID: number;
  FileYear: number;
  FileSemester: number;
  Name: string;
  CampusCode: string;
  YearLevelCode: string;
  styleCode: string;
  IncludeHomeGroup: boolean;
  IncludeLetterOfExplanation: boolean;
  LetterOfExplanation: string;
  Comments: string;
  ReleaseToAllDate: string;
  ReleaseToStaffDate: string;
  Active: boolean;
  CreatedById: number;
  CreatedAt: string;
  UpdatedById: number;
  UpdatedAt: string;
  ComparativeExcludeCode: string | null;
  IncludeComparative: boolean;
  isReleasedToAll: boolean;
  isReleasedToStaff: boolean;
};

export default iStudentReportYear;
