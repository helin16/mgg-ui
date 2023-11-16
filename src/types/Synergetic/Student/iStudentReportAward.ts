type iStudentReportAward = {
  ID: number;
  FileYear: number;
  FileSemester: number;
  AwardDescription: string;
  AwardDate: Date;
  Surname: string;
  ClassificationCode: string | null;
  ClassificationDescription: string | null;
};

export default iStudentReportAward
