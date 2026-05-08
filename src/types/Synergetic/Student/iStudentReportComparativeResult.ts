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
