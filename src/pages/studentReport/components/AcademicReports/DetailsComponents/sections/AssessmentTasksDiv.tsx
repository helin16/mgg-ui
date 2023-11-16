import iStudentReportResult, {
  STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ASSESSMENT_TASK
} from '../../../../../../types/Synergetic/Student/iStudentReportResult';
import {useEffect, useState} from 'react';
import GraphTable from './GraphTable';
import OverallGradeDiv from './OverallGradeDiv';

const AssessmentTasksDiv = ({results}: {results: iStudentReportResult[]}) => {
  const [aSResults, setASResults] = useState<iStudentReportResult[]>([]);

  useEffect(() => {
    setASResults(
      results
        .filter(result => result.AssessAreaResultType === STUDENT_REPORT_RESULT_ASSESS_AREA_TYPE_ASSESSMENT_TASK)
        .sort((result1, result2) => result1.AssessAreaSeq > result2.AssessAreaSeq ? 1 : -1)
    )
  }, [results]);

  if (aSResults.length <= 0) {
    return null;
  }

  return (
    <>
      <GraphTable
        results={aSResults}
        title={'Assessment Tasks'}
      />
      <OverallGradeDiv results={results} />
    </>
  );
};

export default AssessmentTasksDiv;
