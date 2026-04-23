import iStudentReportResult, {
  STUDENT_REPORT_RESULT_FILE_TYPE_MUSIC
} from '../../../../../../types/Synergetic/Student/iStudentReportResult';

export const getStudentReportClassname = (result: iStudentReportResult) => {
  if (result.AssessAreaResultType === STUDENT_REPORT_RESULT_FILE_TYPE_MUSIC) {
    return `${result.AssessHeading} ${result.ClassDescription}`;
  }
  return result.AssessHeading;
}
