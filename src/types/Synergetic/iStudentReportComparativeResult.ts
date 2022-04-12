type iStudentReportComparativeResult ={
  FileYear: number;
  FileSemester: number;
  AssessHeading: string;
  AssessResultsResult: string;
  Count: number;
  AssessmentCode: string;
  StudentYearLevel: string;
  DateUpdated: Date;
}

export type iStudentReportComparativeResultMapRow = {
  [key: string]: {
    name: string;
    count: number;
    total: number;
    percentage: number;
  }
}

type iStudentReportComparativeResultMap = {
  [key: string]: iStudentReportComparativeResultMapRow
};

export default iStudentReportComparativeResultMap
