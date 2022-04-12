import iStudentReportResult, {
  STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC
} from '../../../../../../types/Synergetic/iStudentReportResult';

export const getStudentReportClassname = (result: iStudentReportResult) => {
  if (result.AssessAreaResultType === STUDENT_REPORT_RESULT_FILE_TYPE_ACADEMIC) {
    return result.AssessHeading;
  }
  return `${result.AssessHeading} ${result.ClassDescription}`;
}
