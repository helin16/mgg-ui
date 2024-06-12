import moment from "moment-timezone";
import iSynFileSemester from "../iSynFileSemester";

type iStudentReportYear = {
  ID?: number;
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
  HideResults: boolean;
};

export const getDataForClone = (
  oldReportYear: iStudentReportYear,
  currentFileSemester?: iSynFileSemester
) => {
  const newRepYear = {
    ...oldReportYear,
    ReleaseToStaffDate: moment().format('YYYY-MM-DD HH:00:00'),
    ReleaseToAllDate: null,
    FileYear: currentFileSemester
      ? currentFileSemester.FileYear
      : moment().year(),
    FileSemester: currentFileSemester ? currentFileSemester.FileSemester : 1
  };
  delete newRepYear.ID;
  // @ts-ignore
  delete newRepYear.Active;
  // @ts-ignore
  delete newRepYear.CreatedAt;
  // @ts-ignore
  delete newRepYear.UpdatedAt;
  // @ts-ignore
  delete newRepYear.CreatedById;
  // @ts-ignore
  delete newRepYear.UpdatedById;
  // @ts-ignore
  delete newRepYear.createdAt;
  // @ts-ignore
  delete newRepYear.updatedAt;
  // @ts-ignore
  delete newRepYear.createdById;
  // @ts-ignore
  delete newRepYear.updatedById;
  return newRepYear;
};

export default iStudentReportYear;
